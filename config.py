import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'smartprocure-sih-2026-yuva-codes-key-9921')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 'yes')
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '0.0.0.0')

    # Supabase Configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL', '')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')
    SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

    # Database Fallback Engine
    DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'smartprocure.db')

    # App Branding & SIH Metadata
    APP_NAME = "SMARTPROCURE"
    APP_TAGLINE = "Digital Procurement Queue & Status Platform"
    SIH_PS_ID = "26032"
    SIH_YEAR = "2026"
    TEAM_NAME = "Yuva Codes"
    ORGANIZATION = "Ministry of Consumer Affairs, Food & Public Distribution"
    DEPARTMENT = "Department of Consumer Affairs (DoCA)"
