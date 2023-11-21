# # chat/consumers.py
# import json
#
# from channels.generic.websocket import WebsocketConsumer
#
#
# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         self.accept()
#
#     def disconnect(self, close_code):
#         pass
#
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json["message"]
#
#         self.send(text_data=json.dumps({"message": message}))


import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message = text_data_json["message"]

        await self.send(text_data=json.dumps({"message": message}))