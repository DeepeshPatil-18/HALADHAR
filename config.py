"""
KrishiMitra backend configuration.

Loads environment variables from a .env file using python-dotenv.
All secrets must be present in the environment — never hard-coded here.
"""

import os
from dotenv import load_dotenv

# Load variables from .env (or .env.local) into os.environ.
load_dotenv()


def get_supabase_url() -> str:
    """Return the Supabase project URL (server-side only)."""
    value = os.getenv("SUPABASE_URL", "")
    if not value:
        raise RuntimeError("SUPABASE_URL environment variable is not set.")
    return value


def get_supabase_service_role_key() -> str:
    """Return the Supabase service-role key (server-side only, never expose to frontend)."""
    value = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not value:
        raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY environment variable is not set.")
    return value
