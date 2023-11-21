# asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
# from lol.appname import routing  # Import your routing configuration
import lol.appname.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lol.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            lol.appname.routing.websocket_urlpatterns
        )
    ),
})