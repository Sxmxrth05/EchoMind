import os
import logging
from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel

try:
	import google.generativeai as genai
except Exception:
	genai = None

from prompt_builder import build_prompt
from dotenv import load_dotenv
from database import insert_user, fetch_user, login_email

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
            return {"echo": "".join(p.text for p in parts if hasattr(p, "text"))}
        except Exception:
            pass

    raise HTTPException(status_code=502, detail="Unexpected Gemini response shape")


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

	logger.info("Calling Gemini with prompt: %s", prompt)

	try:
		resp = _call_gemini(prompt)
		logger.info("Gemini raw response: %s", resp)
		response = extract_gemini_text(resp=resp)
		return {"echo": response}
	except RuntimeError as e:
		logger.exception("Gemini runtime error")
		raise HTTPException(status_code=502, detail=str(e))
	except Exception as e:
		logger.exception("Unexpected error while calling Gemini")
		raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/emotionmap", summary="Returns emotion map for user-id")
async def emotionmap()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	logger.warning("Validation error: %s", exc)
	return JSONResponse(status_code=400, content={"detail": exc.errors()})


if __name__ == "__main__":
	import uvicorn

	port = int(os.getenv("PORT", "8000"))
	uvicorn.run("main:app", port=port, reload=True)