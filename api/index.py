import os
import sys
from urllib.parse import parse_qs

# Ensure backend directory is discoverable by Python runtime
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Set environment to indicate Vercel runtime
os.environ["VERCEL"] = "1"

# Import the FastAPI application instance
from main import app as fastapi_app

class VercelRoutingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            query_string = scope.get("query_string", b"").decode("utf-8", errors="ignore")

            # 1. Check if rewrite forwarded target in __path query parameter
            if "__path=" in query_string:
                params = parse_qs(query_string)
                if "__path" in params and params["__path"]:
                    target = params["__path"][0].lstrip("/")
                    path = "/api/" + target
            # 2. Check x-matched-path header if Vercel routed to index.py
            elif "index.py" in path or path in ("/api", "/api/"):
                headers = dict(scope.get("headers", []))
                matched = headers.get(b"x-matched-path") or headers.get(b"x-vercel-matched-path")
                if matched:
                    try:
                        m_str = matched.decode("utf-8").split("?")[0]
                        if m_str and "index.py" not in m_str:
                            path = m_str
                    except Exception:
                        pass

            # 3. Ensure path matches FastAPI route prefixes
            api_prefixes = (
                "dashboard", "actors", "personas", "persona",
                "infrastructure", "relationships", "timeline",
                "sources", "search", "collection", "export", "reports", "health"
            )
            stripped = path.lstrip("/")
            if any(stripped.startswith(prefix) for prefix in api_prefixes) and not path.startswith("/api"):
                path = "/api/" + stripped

            scope = dict(scope)
            scope["path"] = path

        await self.app(scope, receive, send)

app = VercelRoutingMiddleware(fastapi_app)
handler = app
application = app

__all__ = ["app", "handler", "application"]
