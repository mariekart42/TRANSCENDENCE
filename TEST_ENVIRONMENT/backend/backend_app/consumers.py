
import json
from channels.generic.websocket import AsyncWebsocketConsumer





class test(AsyncWebsocketConsumer):
    async def connect(self):
        print('CONNECT TO TEST CONSUMER')
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # print('TEXT_DATA_JSON: ', text_data_json)
        # message = text_data_json["message"]
        # print('I AM BACKEND AND I GOT UR MESSAGE: ', message)

        switch = text_data_json["switch"]
        if switch:
            await self.send(text_data=json.dumps({"switch": True}))
        else:
            await self.send(text_data=json.dumps({"switch": False}))



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('TEST IN CONNECT CHATCONSUMER')
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message = text_data_json["message"]

        await self.send(text_data=json.dumps({"message": message}))


class ChatConsumer2(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # text_data_json = json.loads(text_data)
        # message = text_data_json["message"]
        message = 'bullshit lol, Consumer2'
        await self.send(text_data=json.dumps({"message": message}))