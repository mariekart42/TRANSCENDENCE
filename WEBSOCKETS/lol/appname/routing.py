# myapp/routing.py
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path, re_path
from . import consumers

# websocket_urlpatterns = [
#     path("ws/some_path/", consumers.MyConsumer.as_asgi()),
# ]

websocket_urlpatterns = [
    re_path(r'ws/some_path/$', consumers.MyConsumer.as_asgi()),
]