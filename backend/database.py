import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TABLE_NAME = os.getenv("SUPABASE_TABLE", "users")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------- DATABASE FUNCTIONS -------- #

def insert_user(name, emailid, password, age):
    data = {
        "Name": name,
        "Email_id": emailid,
        "Password": password,
        "Age": age
    }
    return supabase.table(TABLE_NAME).insert(data).execute().data


def fetch_user(user_id):
    result = (
        supabase.table(TABLE_NAME)
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return result.data

def login_email(email):
    res = (
        supabase.table(TABLE_NAME)
        .select("*")
        .eq("Email_id", email)
        .execute()
    )
    return res.data

if __name__ == "__main__":
   
    user = fetch_user("24856171-1aa9-43bf-b36a-9e43c4e65dca")
    print(user)