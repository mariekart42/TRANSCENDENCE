# mysite/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from django.urls import re_path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

from chat.routing import websocket_paths

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        websocket_paths
    ),
})
