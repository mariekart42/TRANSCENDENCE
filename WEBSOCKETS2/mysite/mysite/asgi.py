# mysite/asgi.py
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

# from chat.routing import websocket_urlpatterns
# from mysite.chat import consumers
from django.urls import re_path

# from mysite.chat import .

# import mysite.chat.routing
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
# application = get_asgi_application()


from chat.routing import websocket_paths

#
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # "websocket": URLRouter(
    # #     # Your WebSocket routing here
    # #     # re_path(r"ws/chat/(?P<room_name>\w+)/$", consumers.ChatConsumer.as_asgi()),
    # #     chat.routing.application
    #     websocket_paths
    #
    # ),
    # "websocket": AuthMiddlewareStack(
    #     URLRouter(
    #         websocket_paths
    #     )
    # ),
    "websocket": AuthMiddlewareStack(
        websocket_paths
    ),
})