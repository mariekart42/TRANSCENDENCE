
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from .models import MyUser, Chat, Message
from . import utils
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.utils import timezone


class test(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.my_group_id = None

    async def connect(self):
        print('CONNECT TO TEST CONSUMER')
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the consumer from the group when the WebSocket disconnects
        await self.channel_layer.group_discard(
            self.my_group_id,
            self.channel_name,
        )

    async def chat_message(self, event):
        # This method is called when the group receives a message
        message_data = event['message_data']
        chat_id = event["chat_id"]

        # Send the message back to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat.message',
            'message_data': message_data,
            'chat_id': chat_id
        }))

    @database_sync_to_async
    def group_exists(self, group_name):
        channel_layer = get_channel_layer()
        return channel_layer.group_exists(group_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print('TEXT DTA; ', text_data)
        what_type = text_data_json["type"]
        chat_id = text_data_json["data"]["chat_id"]
        self.my_group_id = 'group_%s' % chat_id
        print('MY_GROUP_ID', self.my_group_id)

        if what_type == 'chat.message':
            # Check if the group exists before adding the channel
            # if not self.group_exists(self.my_group_id):
            await self.channel_layer.group_add(
                self.my_group_id,
                self.channel_name,
            )
            user_id = text_data_json["data"]["user_id"]
            message = text_data_json["data"]["message"]

            # Use await to call the async method in the synchronous context
            await self.create_message(user_id, chat_id, message)
            message_data = await self.get_chat_messages(chat_id)
            print('MESSGAE DATA: ', message_data)
            print('GROUP ID: ', self.my_group_id)
            await self.channel_layer.group_send(
                self.my_group_id,
                {
                    'chat_id': chat_id,
                    'type': 'chat.message',
                    "message_data": message_data,
                }
            )
        else:
            print('IS SOMETHING ELSE')



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
