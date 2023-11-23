from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path

from . import consumers

websocket_paths = ProtocolTypeRouter(
    {
        "websocket": URLRouter(
            [
                re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
                re_path(r"ws/chat2/(?P<room_name>\w+)/$", consumers.ChatConsumer2.as_asgi()),
            ]
        ),
    }
)