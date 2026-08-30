import sqlite3
import datetime
from config import Config

# Supabase Client Initialization
supabase_client = None
if Config.SUPABASE_URL and Config.SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase_client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        print("Connected successfully to live Supabase Cloud Database.")
    except Exception as e:
        print(f"Warning: Could not connect to Supabase Cloud: {e}. Falling back to SQLite local database.")

def get_db():
    """Returns database connection with row factory enabled for dict access"""
    conn = sqlite3.connect(Config.DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn