from supabase import create_client, Client
from .config import settings

_supabase_client: Client | None = None


def get_supabase() -> Client:
    """Return a singleton Supabase client. Raises if credentials are missing."""
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise RuntimeError(
                "Supabase credentials are missing. "
                "Set SUPABASE_URL and SUPABASE_KEY in backend/.env"
            )
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase_client
