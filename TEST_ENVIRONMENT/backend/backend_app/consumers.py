import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from .models import MyUser, Chat, Message
from . import utils
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.utils import timezone


class test(AsyncWebsocketConsumer):
    connections = [
        {
            'user_id': '',
            'is_online': ''
        }
    ]

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.my_group_id = None
        self.isOnline = 0

    async def connect(self):
        user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user = {'user_id': user_id, 'is_online': 'true'}
        self.connections.append(self.user)
        await self.accept()

    async def disconnect(self, close_code):
        self.connections.remove(self.user)
        await self.handle_send_online_stats_on_disconnect()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        what_type = text_data_json["type"]
        chat_id = text_data_json["data"]["chat_id"]
        self.my_group_id = 'group_%s' % chat_id
        await self.channel_layer.group_add(
            self.my_group_id,
            self.channel_name,
        )
        if what_type == 'save_message_in_db':
            await self.handle_save_message_in_db(text_data_json)
        elif what_type == 'send_chat_messages':
            await self.handle_send_chat_messages(text_data_json)
        elif what_type == 'send_online_stats':
            await self.handle_send_online_stats()
        elif what_type == 'send_user_in_current_chat':
            await self.handle_send_user_in_current_chat(chat_id)
        else:
            print('IS SOMETHING ELSE')


# ---------------------------- UFF FUNCTIONS ----------------------------
    async def send_chat_messages(self, event):
        await self.send(text_data=json.dumps({
            'type': 'all_chat_messages',
            'chat_id': event['data']['chat_id'],
            'message_data': event['data']['message_data'],
        }))

    async def send_user(self, user_id, message):
        # Send a message to a specific user
        await self.send(text_data=json.dumps({
            'user_id': user_id,
            **message,
        }))

    async def send_online_stats(self, event):
        await self.send(text_data=json.dumps({
            'type': 'online_stats',
            'online_stats': event['data']['online_stats']
        }))

    async def send_online_stats_on_disconnect(self, event):
        await self.send(text_data=json.dumps({
            'type': 'online_stats_on_disconnect',
            'online_stats': event['data']['online_stats']
        }))


    async def send_user_in_current_chat(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_in_current_chat',
            'user_in_chat': event['data']['user_in_chat']
        }))


# ---------------------------- HANDLE FUNCTIONS ---------------------------

    async def handle_send_online_stats(self):
        online_stats = [
            {
                'user_id': instance['user_id'],
                'stat': instance['is_online']
            }
            for instance in self.connections
        ]
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.online.stats',  # THIS triggers send_chat_online_stats function!! (ik fuggin weird)
                'data': {
                    'online_stats': online_stats
                },
            }
        )

    async def handle_send_online_stats_on_disconnect(self):
        online_stats = [
            {
                'user_id': instance['user_id'],
                'stat': instance['is_online']
            }
            for instance in self.connections
        ]
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.online.stats.on.disconnect',  # THIS triggers send_chat_online_stats function!! (ik fuggin weird)
                'data': {
                    'online_stats': online_stats
                },
            }
        )

    async def handle_save_message_in_db(self, text_data_json):
        chat_id = text_data_json["data"]["chat_id"]
        user_id = text_data_json["data"]["user_id"]
        message = text_data_json["data"]["message"]
        # Use await to call the async method in the synchronous context
        await self.create_message(user_id, chat_id, message)

    async def handle_send_chat_messages(self, text_data_json):
        chat_id = text_data_json["data"]["chat_id"]
        message_data = await self.get_chat_messages(chat_id)

        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.chat.messages',  # THIS triggers send_chat_messages function!! (ik fuggin weird)
                'data': {
                    'chat_id': chat_id,
                    'message_data': message_data,
                },
            }
        )


    async def handle_send_user_in_current_chat(self, chat_id):
        user_in_chat = await self.get_user_in_chat(chat_id)
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.user.in.current.chat',
                'data': {
                    'chat_id': chat_id,
                    'user_in_chat': user_in_chat,
                },
            }
        )

# ---------------------------- DATABASE FUNCTIONS ----------------------------

    @database_sync_to_async
    def create_message(self, user_id, chat_id, text):
        try:
            user_instance = MyUser.objects.get(id=user_id)
            specific_timestamp = timezone.now()
            new_message = Message.objects.create(senderId=user_id, sender=user_instance.name, text=text,
                                                 timestamp=specific_timestamp)
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
                'sender_id': message.senderId,
                'sender': message.sender,
                'text': message.text,
                'timestamp': message.formatted_timestamp(),
            }
            for message in messages_in_chat
        ]
        return message_data

    @database_sync_to_async
    def group_exists(self, group_name):
        channel_layer = get_channel_layer()
        return channel_layer.group_exists(group_name)

    @database_sync_to_async
    def get_user_in_chat(request, chat_id):
        chat_instance = Chat.objects.get(id=chat_id)
        all_user_in_current_chat = MyUser.objects.filter(chats=chat_instance)

        print('USER IN CHAT: ', all_user_in_current_chat)

        user_in_chat = [
            {
                'user_name': user.name,
                'user_id': user.id
            }
            for user in all_user_in_current_chat
        ]
        return user_in_chat
