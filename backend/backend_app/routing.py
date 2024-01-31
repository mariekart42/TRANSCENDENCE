from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path

from . import consumers

websocket_paths = ProtocolTypeRouter(
    {
        "websocket": URLRouter(
            [
                re_path(r'ws/test/(?P<user_id>\w+)/$', consumers.test.as_asgi()),
            ]
        ),
    }
)