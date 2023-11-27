
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from .models import MyUser, Chat, Message
from . import utils
from channels.db import database_sync_to_async
from django.utils import timezone


class test(AsyncWebsocketConsumer):
    async def connect(self):
        print('CONNECT TO TEST CONSUMER')
        await self.accept()

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def create_message(self, user_id, chat_id, text):
        try:
            user_instance = MyUser.objects.get(id=user_id)
            specific_timestamp = timezone.now()

            new_message = Message.objects.create(sender=user_instance.name, text=text, timestamp=specific_timestamp)

            # add new_message to chat:
            chat_instance = Chat.objects.get(id=chat_id)
            chat_instance.messages.add(new_message.id)
            new_message.save()

            return JsonResponse({'message': "Message created successfully"})
        except Exception as e:
            return JsonResponse({'error': 'something big in createMessage'}, status=500)

    @database_sync_to_async
    def get_chat_messages(self, chat_id):
        chat_instance = Chat.objects.get(id=chat_id)
        messages_in_chat = chat_instance.messages.all()

        message_data = [
            {
                'id': message.id,
                'sender': message.sender,
                'text': message.text,
                'timestamp': message.formatted_timestamp(),
            }
            for message in messages_in_chat
        ]
        return message_data

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json["type"]

        if type == 'chat.message':
            # chat_id = text_data_json["chat_id"]
            chat_id = 44
            # Use await to call the async method in the synchronous context
            # user_id = text_data_json["user_id"]
            user_id = 52
            message = text_data_json["message"]
            text = text_data_json.get("text", message)

            # Use await to call the async method in the synchronous context
            await self.create_message(user_id, chat_id, text)
            message_data = await self.get_chat_messages(chat_id)

            # print('MESSAGE DATA: ', message_data)
            await self.send(text_data=json.dumps({"message_data": message_data}))
        else:
            print('IS SOMETHING ELSE')
        # extract chat data and create message object in database


        # create array of all messages with sender, timestamp data...

        # send array of message data back




        # sender = text_data_json["sender"]
        # message = text_data_json["message"]
        # if message is None:
        #     await self.send(text_data=json.dumps({"error": 'Message could not be read'}))
        # else:
        #     await self.send(text_data=json.dumps({"message": 'lol fine'}))
        #



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