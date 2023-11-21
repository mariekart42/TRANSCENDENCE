# # chat/routing.py
# from django.urls import re_path
#
# from . import consumers
#
# websocket_urlpatterns = [
#     re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
# ]


from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path

from . import consumers

websocket_paths = ProtocolTypeRouter(
    {
        # "http": get_asgi_application(),
        "websocket": URLRouter(
            [
                re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
            ]
        ),
    }
)