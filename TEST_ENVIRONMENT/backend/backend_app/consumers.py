
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

        # Add the consumer to a group
        await self.channel_layer.group_add(
            'some_group_name',
            self.channel_name,
        )

    async def disconnect(self, close_code):
        # Remove the consumer from the group when the WebSocket disconnects
        await self.channel_layer.group_discard(
            'some_group_name',
            self.channel_name,
        )

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




    async def chat_message(self, event):
        # This method is called when the group receives a message
        message_data = event['message_data']

        # Send the message back to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat.message',
            'message_data': message_data,
        }))







    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print('DATA: ', text_data_json)
        what_type = text_data_json["type"]

        if what_type == 'chat.message':

            chat_id = text_data_json["chat_id"]
            user_id = text_data_json["user_id"]
            message = text_data_json["message"]
            text = text_data_json.get("text", message)

            # Use await to call the async method in the synchronous context
            await self.create_message(user_id, chat_id, text)
            message_data = await self.get_chat_messages(chat_id)

            await self.channel_layer.group_send(
                'some_group_name',
                {
                    'type': 'chat.message',
                    # 'message': text_data,
                    "message_data": message_data,
                }
            )

        #     # await self.send(text_data=json.dumps({"message_data": message_data}))
        else:
            print('IS SOMETHING ELSE')



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
        message = 'bullshit lol, Consumer2'
        await self.send(text_data=json.dumps({"message": message}))