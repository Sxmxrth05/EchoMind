import os
import logging
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
from collections import Counter

try:
	import google.generativeai as genai
except Exception:
	genai = None

from prompt_builder import build_prompt
from dotenv import load_dotenv
from database import insert_user, fetch_user, login_email, insert_emotion_log, fetch_emotions_by_user

load_dotenv()


# --- logging -------------------------------------------------
logger = logging.getLogger("kodikon")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


# --- app setup -----------------------------------------------
app = FastAPI(title="Kodikon API", version="0.1.0", description="Minimal FastAPI prototype for Backend Lead")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


# Load Gemini / Google key from environment (set in Render as an env var)
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if genai and GEMINI_KEY:
	# try common init/configure names depending on library version
	try:
		# newer versions may provide an init/configure function
		if hasattr(genai, "configure"):
			genai.configure(api_key=GEMINI_KEY)
		elif hasattr(genai, "init"):
			genai.init(api_key=GEMINI_KEY)
	except Exception:
		logger.exception("Failed to init Gemini SDK")


def _call_gemini(prompt: str, model: str | None = None):
    if not genai:
        raise RuntimeError("Gemini SDK not installed")

    model_name = model or os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"

    try:
        m = genai.GenerativeModel(model_name)
        return m.generate_content(prompt)
    except Exception as e:
        raise RuntimeError(f"Gemini call failed: {e}")

def extract_gemini_text(resp):
	if hasattr(resp, "text"):
		return {"echo": resp.text}
	if hasattr(resp, "candidates"):
		try:
			parts = resp.candidates[0].content.parts
			print(parts)
			return {"echo": "".join(p.text for p in parts if hasattr(p, "text"))}
		except Exception:
			pass

	raise HTTPException(status_code=502, detail="Unexpected Gemini response shape")

def get_emotion(text: str):
	json_prompt = f"""
	Analyze the dominant emotion of the following text.

	Respond with ONLY a JSON object in the following format:
	{{"emotion": "primary_emotion", "score": "confidence_score_0.0_to_1.0"}}

	The "emotion" should be one of:
	[Joy, Sadness, Anger, Fear, Surprise, Disgust]

	Text: "{text}"

	JSON Response:
	"""
	try:
		response = _call_gemini(json_prompt)
		return response
		
	except Exception as e:
		print(f"An error occurred (check your API key?): {e}")

class EchoRequest(BaseModel):
	payload: Dict[str, Any]


class User(BaseModel):
	name: str
	email: str
	password: str
	age: int

class Login(BaseModel):
	email: str
	password: str


@app.post("/register", summary="Register page")
async def register(user: User, request: Request):
	try:
		resp = insert_user(
			name=user.name,
			emailid=user.email,
			password=user.password,
			age=user.age
        )
		return resp
	except Exception as e:
		logger.exception("Error while uploading code")
		raise HTTPException(status_code=500, detail="Could not insert user into database")

@app.post("/login", summary="Login page")
async def login(loginDetails: Login, request: Request):
    resp = login_email(loginDetails.email)
    if(resp[0]['Password'] == loginDetails.password):
        return resp
    else:
        raise HTTPException(
                status_code=401,
                detail="Invalid username or password",
        )



@app.post("/echo", summary="Echo endpoint (mock if no OpenAI key)")
async def echo(req: EchoRequest, request: Request):
	#Dummy output without api call
	if not GEMINI_KEY or not genai:
		logger.info("Gemini key/SDK not available — returning mock response")
		return {"echo": {"mock": True, "received": req.payload}}
	try:
		prompt = build_prompt(req.payload)
	except Exception as e:
		logger.exception("Error building prompt")
		raise HTTPException(status_code=500, detail="Prompt build failed")

	logger.info("Calling Gemini with prompt")

	try:
		resp = _call_gemini(prompt)
		logger.info("Gemini raw response: %s", resp)
		response = extract_gemini_text(resp=resp)
		emotion = get_emotion(req.payload['query'])
		em_json = emotion.candidates[0].content.parts[0].text
		c_str = em_json.replace("json", "").strip()
		clean = c_str.strip("` \n")
		data = json.loads(clean)
		insert_emotion_log(req.payload['Clerk_Session_Id'], data)
		return {"echo": response}
	except RuntimeError as e:
		logger.exception("Gemini runtime error")
		raise HTTPException(status_code=502, detail=str(e))
	except Exception as e:
		logger.exception("Unexpected error while calling Gemini")
		raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/emotionmap", summary="Returns emotion map for user-id")
async def emotionmap(Clerk_Session_Id: str):
	emotions = fetch_emotions_by_user(Clerk_Session_Id)

	emotion_list = [row["emotion_key"]["emotion"] for row in emotions]
	emotion_counts = Counter(emotion_list)

	return dict(emotion_counts)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	logger.warning("Validation error: %s", exc)
	return JSONResponse(status_code=400, content={"detail": exc.errors()})


if __name__ == "__main__":
	import uvicorn

	port = int(os.getenv("PORT", "8000"))
	uvicorn.run("main:app", port=port, reload=True)