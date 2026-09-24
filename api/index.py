import os
import sys

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

class PathNormalizerMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            # Check for Vercel matched path header if route was rewritten
            if "index.py" in path or path in ("/api", "/api/"):
                headers = dict(scope.get("headers", []))
                matched = headers.get(b"x-matched-path") or headers.get(b"x-vercel-matched-path")
                if matched:
                    try:
                        matched_str = matched.decode("utf-8")
                        if matched_str and "index.py" not in matched_str:
                            path = matched_str.split("?")[0]
                    except Exception:
                        pass

            api_prefixes = (
                "dashboard", "actors", "personas", "persona",
                "infrastructure", "relationships", "timeline",
                "sources", "search", "collection", "export", "reports"
            )
            stripped = path.lstrip("/")
            if any(stripped.startswith(prefix) for prefix in api_prefixes) and not path.startswith("/api"):
                path = "/api/" + stripped
            
            scope = dict(scope)
            scope["path"] = path

        await self.app(scope, receive, send)

app = PathNormalizerMiddleware(fastapi_app)

# Expose app for Vercel's ASGI serverless handler
__all__ = ["app"]

