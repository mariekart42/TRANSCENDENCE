import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from .models import MyUser, Chat, Message, Game
from django.db.models import Q
from . import utils
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from django.utils import timezone
from django.db.models import Max
from django.core.exceptions import ObjectDoesNotExist

class test(AsyncWebsocketConsumer):
    connections = [
        {
            'user_id': '',
            'is_online': ''
        }
    ]

    channels = [
        {
            'user_id': '',
            'channel_name': ''
        }
    ]

    game_states = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None
        self.channel_of_user = None
        self.my_group_id = None
        self.isOnline = 0
        self.key_code = 0
        self.prev_pos = 0
        self.is_host = 0
        self.game_id = 0
        self.game_group_id = None

    async def connect(self):
        user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user = {'user_id': user_id, 'is_online': 'true'}
        self.connections.append(self.user)

        await self.channel_layer.group_add('channel_zer0', self.channel_name)
        self.channel_of_user = {'user_id': user_id, 'channel_name': self.channel_name}
        print('channel_name')
        print(self.channel_name)
        print('end of channel name')

        self.channels.append(self.channel_of_user)
        await self.handle_send_online_stats()# ??
        await self.accept()

    async def disconnect(self, close_code):
        self.connections.remove(self.user)
        await self.handle_send_online_stats_on_disconnect()
        if self.game_group_id is not None:
            self.game_states[self.game_id]['game_active'] = False
            await self.channel_layer.group_send(
                self.game_group_id,
                {
                    'type': 'send.opponent.disconnected',
                    'data': {

                    },
                }
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        what_type = text_data_json["type"]

        # IF what_type is equal to a game request -> change later to something better
        if what_type in ['send_game_scene', 'send_init_game', 'send_ball_update', 'send_new_invite']:
            await self.controlGameRequests(text_data_json, what_type)
        else:
            chat_id = text_data_json["data"]["chat_id"]
            # user_id = text_data_json["data"]["user_id"]
            self.my_group_id = 'group_%s' % chat_id
            print('ADDED user ', self.user["user_id"], '  to group: ', self.my_group_id, ' || channel_name: ', self.channel_name, ' || type: ', text_data_json["type"])
            await self.channel_layer.group_add(self.my_group_id, self.channel_name)

            if what_type == 'save_message_in_db':
                await self.handle_save_message_in_db(text_data_json)
            elif what_type == 'send_chat_messages':
                await self.handle_send_chat_messages(text_data_json)
            elif what_type == 'send_online_stats':
                await self.handle_send_online_stats()
            elif what_type == 'send_user_in_current_chat':
                await self.handle_send_user_in_current_chat(chat_id)
            elif what_type == 'send_current_users_chats':
                await self.handle_send_current_users_chats(text_data_json)
            elif what_type == 'send_all_user':
                await self.handle_send_all_user()
            elif what_type == 'send_user_left_chat':
                await self.handle_current_user_left_chat(text_data_json)
            elif what_type == 'send_created_new_chat':
                await self.handle_create_new_chat(text_data_json)
            elif what_type == 'send_created_new_private_chat':
                await self.handle_create_new_private_chat(text_data_json)
            elif what_type == 'set_invited_user_to_chat':
                await self.handle_invite_user_to_chat(text_data_json)
            else:
                print('IS SOMETHING ELSE')


    async def controlGameRequests(self, text_data_json, what_type):
        game_id = text_data_json["data"]["game_id"]
        self.game_group_id = 'group_%s' % game_id

        print(self.game_group_id)
        print(self.user)
        print('______________\n')

        await self.init_game_struct()

        await self.channel_layer.group_add(
            self.game_group_id,
            self.channel_name
        )
        if what_type == 'send_game_scene':
            self.key_code = text_data_json["data"]["key_code"]
            self.prev_pos = text_data_json["data"]["prev_pos"]
            await self.handle_send_game_scene()
        elif what_type == 'send_init_game':
            self.game_id = game_id
            await self.handle_send_init_game()
        elif what_type == 'send_ball_update':
            self.game_id = game_id
            await self.handle_send_ball_update()
        else:
            print('IS SOMETHING ELSE')

# ---------------------------- UFF FUNCTIONS ----------------------------
    async def send_chat_messages(self, event):
        await self.send(text_data=json.dumps({
            'type': 'all_chat_messages',
            'chat_id': event['data']['chat_id'],
            'message_data': event['data']['message_data'],
        }))

    async def send_message_save_success(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message_save_success',
            'message': event['data']['message'],
        }))

    async def send_user(self, user_id, message):
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

    async def send_current_users_chats(self, event):
        await self.send(text_data=json.dumps({
            'type': 'current_users_chats',
            'user_id': event['data']['user_id'],
            # 'message': event['data']['message'],
            # 'last_message': event['data']['last_message'],
            'users_chats': event['data']['users_chats']
        }))

    async def send_all_user(self, event):
        await self.send(text_data=json.dumps({
            'type': 'all_user',
            'all_user': event['data']['all_user']
        }))

    async def send_user_left_chat(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_left_chat_info',
            'message': event['data']['message'],
        }))

    async def send_new_chat_info(self, event):
        await self.send(text_data=json.dumps({
            'type': 'created_chat',
            'message': event['data']['message'],
        }))

    async def send_new_private_chat_info(self, event):
        await self.send(text_data=json.dumps({
            'type': 'created_private_chat',
            'message': event['data']['message'],
        }))

    async def send_invited_user_to_chat_info(self, event):
        await self.send(text_data=json.dumps({
            'type': 'invited_user_to_chat',
            'message': event['data']['message'],
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
            # self.my_group_id,
            'channel_zer0',
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
            'channel_zer0',
            # self.my_group_id,
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
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.message.save.success',
                'data': {
                    'message': 'ok',
                },
            }
        )

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

    async def handle_send_current_users_chats(self, text_data_json):
        chat_id = text_data_json["data"]["chat_id"]
        user_id = text_data_json["data"]["user_id"]
        users_chats = await self.get_users_chats(user_id)
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.current.users.chats',
                'data': {
                    'user_id': user_id,
                    'chat_id': chat_id,
                    'users_chats': users_chats,
                },
            }
        )

    async def handle_send_all_user(self):
        all_user = await self.get_all_user()
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.all.user',
                'data': {
                    # 'chat_id': chat_id,
                    'all_user': all_user,
                },
            }
        )

    async def handle_current_user_left_chat(self, text_data_json):
        chat_id = text_data_json["data"]["chat_id"]
        user_id = text_data_json["data"]["user_id"]
        info = await self.leaveChat(user_id, chat_id)
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.user.left.chat',
                'data': {
                    'message': info
                },
            }
        )

    async def handle_create_new_chat(self, text_data_json):
        chat_name = text_data_json["data"]["chat_name"]
        user_id = text_data_json["data"]["user_id"]
        is_private = text_data_json["data"]["isPrivate"]
        info = await self.createChat(user_id, chat_name, is_private)
        await self.send(text_data=json.dumps({
            'type': 'created_chat',
            'chat_id': info["chat_id"],
            'message': info["message"]
        }))

    async def handle_create_new_private_chat(self, text_data_json):
        # chat_name IS the others users name!!
        chat_name = text_data_json["data"]["chat_name"]
        user_id = text_data_json["data"]["user_id"]
        info = await self.createPrivateChat(user_id, chat_name)

        others_user_id = await self.get_id_with_name(chat_name)
        others_user_channel_name = await self.get_channel_name_with_id(others_user_id)
        if others_user_channel_name is not None:
            await self.channel_layer.group_add(self.my_group_id, others_user_channel_name)
            other_users_chats = await self.get_users_chats(others_user_id)
            await self.channel_layer.group_send(
                self.my_group_id,
                {
                    'type': 'send.current.users.chats',
                    'data': {
                        'user_id': others_user_id,
                        'users_chats': other_users_chats,
                    },
                }
            )

        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.new.private.chat.info',
                'data': {
                    'message': info
                },
            }
        )

    async def handle_invite_user_to_chat(self, text_data_json):
        chat_id = text_data_json["data"]["chat_id"]
        user_id = text_data_json["data"]["user_id"]
        invited_user_name = text_data_json["data"]["invited_user_name"]
        info = await self.inviteUserToChat(user_id, chat_id, invited_user_name)
        others_user_id = await self.get_id_with_name(invited_user_name)
        others_user_channel_name = await self.get_channel_name_with_id(others_user_id)
        if others_user_channel_name is not None:
            await self.channel_layer.group_add(self.my_group_id, others_user_channel_name)
            other_users_chats = await self.get_users_chats(others_user_id)

            await self.channel_layer.group_send(
                self.my_group_id,
                {
                    'type': 'send.current.users.chats',
                    'data': {
                        'user_id': others_user_id,
                        'users_chats': other_users_chats,
                    },
                }
            )

        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.invited.user.to.chat.info',
                'data': {
                    'message': info
                },
            }
        )

    async def get_channel_name_with_id(self, user_id):
        for channel in self.channels:
            if channel['user_id'] == str(user_id):
                return channel['channel_name']
        return None





# ---------------------------- DATABASE FUNCTIONS ----------------------------

    @database_sync_to_async
    def get_id_with_name(self, user_name):
        try:
            user_instance = MyUser.objects.get(name=user_name)
            user_id = user_instance.id
            return user_id
        except Exception as e:
            return -1


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
            return "Message created successfully"
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
        user_in_chat = [
            {
                'user_name': user.name,
                'user_id': user.id
            }
            for user in all_user_in_current_chat
        ]
        return user_in_chat

    @database_sync_to_async
    def get_users_chats(self, user_id):
        user_instance = MyUser.objects.get(id=user_id)
        all_chats = user_instance.chats.all()
        user_chats = [
            {
                'chat_id': chat.id,
                'chat_name': self.getChatName(chat, user_id),
                'private_chat_names': self.getPrivateChatNames(chat, user_id),
                'last_message': self.get_last_message_in_chat(chat.id),
                'isPrivate': chat.isPrivate
            }
            for chat in all_chats
        ]
        return user_chats

    def getChatName(self, chat_instance, user_id):
        if not chat_instance.isPrivate:
            return chat_instance.chatName
        # if chat is private, need to figure out name of chat user that is not current user
        chat_id = chat_instance.id
        users_in_chat = MyUser.objects.filter(chats__id=chat_id)
        current_user_instance = MyUser.objects.get(id=user_id)
        current_user = current_user_instance.name
        # get other users name
        for user in users_in_chat:
            if not current_user == user.name:
                return user.name
        return 'lol private shit backend CONSUMERS.py'

    def getPrivateChatNames(self, chat_instance, user_id):
        if not chat_instance.isPrivate:
            return None
        # if chat is private, need to figure out name of chat user that is not current user
        chat_id = chat_instance.id
        users_in_chat = MyUser.objects.filter(chats__id=chat_id)
        chat_names_list = [user.name for user in users_in_chat]

        return chat_names_list


    @database_sync_to_async
    def get_all_user(self):
        all_users_info = MyUser.objects.values('id', 'name')
        all_user = list(all_users_info)
        return all_user

    @database_sync_to_async
    def leaveChat(self, user_id, chat_id):
        try:
            user_exists = MyUser.objects.filter(id=user_id).exists()
            if not user_exists:
                return 'User in leaveChat not found'
            chat_exists = Chat.objects.filter(id=chat_id).exists()
            if not chat_exists:
                return 'Chat in leaveChat not found'
            chat_instance = Chat.objects.get(id=chat_id)
            user_instance = MyUser.objects.get(id=user_id)
            user_instance.chats.remove(chat_instance)
            user_instance.save()
            return 'ok'
        except Exception as e:
            return 'something big in leaveChat'

    @database_sync_to_async
    def createChat(self, user_id, chat_name, is_private):
        try:
            chat_exists = Chat.objects.filter(chatName=chat_name).exists()
            if chat_exists:
                return {'chat_id': -1, 'message': 'Chat already exists'}
            new_chat = Chat.objects.create(chatName=chat_name, isPrivate=is_private)
            user_instance = MyUser.objects.get(id=user_id)
            user_instance.chats.add(new_chat.id)
            new_chat.save()
            user_instance.save()

            chat_instance = Chat.objects.get(chatName=chat_name)
            return {'chat_id': chat_instance.id, 'message': 'ok'}
        except ValueError:
            return {'chat_id': -1, 'message': "Invalid user ID"}
        except Exception as e:
            return str(e)

    @database_sync_to_async
    def createPrivateChat(self, user_id, chat_name):
        try:
            # chat_name should be the user we create a chat with
            user_exists = MyUser.objects.filter(name=chat_name).exists()
            if not user_exists:
                return 'User does not exist'

            user_instance = MyUser.objects.get(id=user_id)

            # Filter all private chats that the user is part of
            private_chats = Chat.objects.filter(isPrivate=True, myuser__id=user_id)
            chat_already_exists = private_chats.filter(myuser__name=chat_name)
            if chat_already_exists:
                return "You are already in a private chat with this user"

            new_chat = Chat.objects.create(chatName=chat_name, isPrivate=True)

            current_user_instance = MyUser.objects.get(id=user_id)
            other_user_instance = MyUser.objects.get(name=chat_name)

            current_user_instance.chats.add(new_chat.id)
            current_user_instance.save()
            other_user_instance.chats.add(new_chat.id)
            other_user_instance.save()
            new_chat.save()
            return "ok"
        except ValueError:
            return "User does not exist 2"
        except Exception as e:
            return str(e)

    @database_sync_to_async
    def inviteUserToChat(self, user_id, chat_id, invited_user):
        try:
            invited_user_exists = MyUser.objects.filter(name=invited_user).exists()
            if not invited_user_exists:
                return 'User you want to invite doesnt exists'
            inviting_user = MyUser.objects.get(id=user_id)
            invited_user = MyUser.objects.get(name=invited_user)
            chat = inviting_user.chats.get(id=chat_id)
            invited_user.chats.add(chat)
            return 'ok'
        except invited_user.DoesNotExist:
            return "User does not exist"
        except Exception as e:
            return str(e)

    def get_last_message_in_chat(self, chat_id):
        try:
            chat_instance = Chat.objects.get(id=chat_id)
            last_message = chat_instance.messages.order_by('-timestamp').first()
            if last_message:

                return {'text': last_message.text, 'time': last_message.formatted_timestamp(), 'status': 'ok'}
        except ObjectDoesNotExist:
            print("Chat does not exist.")

        print("No messages in the chat.")
        return {'text': '', 'time': '0', 'status': 'Not found'}









# *************** GAME *************** *************** *************** ***************
    async def assign_left_pedal(cls, val):
        game_state = cls.game_states.get(cls.game_id, {})
        game_state['left_pedal'] = val

    async def assign_right_pedal(cls, val):
        game_state = cls.game_states.get(cls.game_id, {})
        game_state['right_pedal'] = val

    async def increment_joined_players(cls):
        game_state = cls.game_states.get(cls.game_id, {})
        game_state['joined_players'] += 1

    async def reset_joined_players(cls):
        game_state = cls.game_states.get(cls.game_id, {})
        game_state['joined_players'] = 0


    async def calculate_ball_state(self):
        # Adjust the paddle height as needed
        print("left pedal")
        print(self.game_states.get(self.game_id, {}).get('left_pedal'))
        print("right pedal")
        print(self.game_states.get(self.game_id, {}).get('right_pedal'))

        paddle_height = 0.5
        canvas_width = 4
        canvas_height = 2

        self.game_states[self.game_id]['ball_x'] += self.game_states[self.game_id]['ball_dx']
        self.game_states[self.game_id]['ball_y'] += self.game_states[self.game_id]['ball_dy']

        # Handle ball-wall collisions
        if self.game_states[self.game_id]['ball_y'] - self.game_states[self.game_id]['ball_radius'] < 0 or \
                self.game_states[self.game_id]['ball_y'] + self.game_states[self.game_id]['ball_radius'] > canvas_height:
            self.game_states[self.game_id]['ball_dy'] *= -1

        # Handle ball-paddle collisions with left paddle
        if (
                self.game_states[self.game_id]['ball_x'] - self.game_states[self.game_id]['ball_radius'] < 0.1 and
                self.game_states[self.game_id]['left_pedal'] < self.game_states[self.game_id]['ball_y'] <
                self.game_states[self.game_id]['left_pedal'] + paddle_height
        ):
            self.game_states[self.game_id]['ball_dx'] = abs(
                self.game_states[self.game_id]['ball_dx'])  # Ensure the ball moves to the right

        # Handle ball-paddle collisions with right paddle
        if (
                self.game_states[self.game_id]['ball_x'] + self.game_states[self.game_id][
            'ball_radius'] > canvas_width - 0.1 and
                self.game_states[self.game_id]['right_pedal'] < self.game_states[self.game_id]['ball_y'] <
                self.game_states[self.game_id]['right_pedal'] + paddle_height
        ):
            self.game_states[self.game_id]['ball_dx'] = -abs(
                self.game_states[self.game_id]['ball_dx'])  # Ensure the ball moves to the left

        # Handle ball-wall collisions for left and right walls
        if self.game_states[self.game_id]['ball_x'] - self.game_states[self.game_id]['ball_radius'] < 0 + 0.025 or \
                self.game_states[self.game_id]['ball_x'] + self.game_states[self.game_id][
            'ball_radius'] - 0.025 > canvas_width:
            print("BALL HIT LEFT OR RIGHT WALL")
            if self.game_states[self.game_id]['ball_x'] - self.game_states[self.game_id]['ball_radius'] < 0 + 0.025:
                # Ball hit the left side

                self.game_states[self.game_id]['guest_score'] += 1



            elif self.game_states[self.game_id]['ball_x'] + self.game_states[self.game_id][
                'ball_radius'] - 0.025 > canvas_width:
                # Ball hit the right side

                self.game_states[self.game_id]['host_score'] += 1

            print("HOST SCORE")
            print(self.game_states[self.game_id]['host_score'])
            print("GUEST SCORE")
            print(self.game_states[self.game_id]['guest_score'])

            # Reset ball position to the center
            self.game_states[self.game_id]['ball_x'] = canvas_width // 2
            self.game_states[self.game_id]['ball_y'] = canvas_height // 2

            if (self.game_states[self.game_id]['guest_score'] == self.game_states[self.game_id]['score_limit'] or
                    self.game_states[self.game_id]['host_score'] == self.game_states[self.game_id]['score_limit']):
                self.game_states[self.game_id]['game_active'] = False
                print("GAME OVER")

            print("GAME ACTIVE state = ")
            print(self.game_states[self.game_id]['game_active'])
            await self.handle_send_score_update()

    @database_sync_to_async
    def get_game_by_id(self, game_id):
        try:
            game_instance = Game.objects.get(id=game_id)
            return game_instance
        except Game.DoesNotExist:
            return None

    @database_sync_to_async
    def remove_ended_match(self, user_id, game_id):
        print("in remove_ended_match")
        try:
            print("user_id")

            print(user_id)
            user1 = MyUser.objects.get(id=user_id)
            game_instance = Game.objects.get(id=game_id)
            user1.new_matches.remove(game_instance)
            game_instance.delete()
        except MyUser.DoesNotExist:
            return None


    
    # @database_sync_to_async
    # def get_myuser_by_id(self, user_id):
    #     try:
    #         game_instance = MyUser.objects.get(id=user_id)
    #         return game_instance
    #     except Game.DoesNotExist:
    #         return None

    async def game_loop(self):
        # game_status = self.game_states.get(self.game_id, {}).get('game_active')
        while True:
            # print("game_status")
            # print(game_status)
            try:
                print("CALCULATING BALL STATE")
                await self.calculate_ball_state()
                # await self.handle_send_ball_update()

                # Use channel_layer to send a message to the group directly
                await self.channel_layer.group_send(
                    self.game_group_id,
                    {
                        'type': 'send.ball.update',
                        'data': {
                            'ball_x': self.game_states[self.game_id]['ball_x'],
                            'ball_y': self.game_states[self.game_id]['ball_y'],
                        },
                    }
                )
                await asyncio.sleep(1 / 60)

            except Exception as e:
                print(f"Error in game_loop: {e}")
            if self.game_states.get(self.game_id, {}).get('game_active') == False:
                print("in game_active = false")
                self.game_states.pop(self.game_id, None)
                print("111111")

                # await self.channel_layer.group_send(
                #     self.game_group_id,
                #     {
                #         'type': 'send.game.over',
                #         'data': {

                #         },
                #     }
                # )
                try:
                    # # user1 = self.user['user_id']
                    # user1 = await get_myuser_by_id(self.user['user_id'])
                    # if user1 is not None:
                    #     game_instance = await self.get_game_by_id(self.game_id)
                    #     if game_instance is not None:
                    #         user1.new_matches.remove(game_instance)
                    #     else:
                    #         print("Error: Game not found")
                    # else:
                    #     print("Error: User not found")
                    # game_instance = await self.get_game_by_id(self.game_id)

                    await self.remove_ended_match(self.user['user_id'], self.game_id)
                except Exception as e:
                    print(f"Error in game_over: {e}")

                print("after remove")

                break

        print("-----GAME LOOP OVER-----")

    async def send_game_scene(self, event):

        await self.send(text_data=json.dumps({
            'type': event['data']['response_type'],
            'new_pedal_pos': event['data']['new_pedal_pos']
        }))

    async def send_init_game(self, event):

        await self.send(text_data=json.dumps({
            'type': 'init_game',
            'is_host': event['data']['is_host'],

        }))

    async def send_game_start(self, event):

        await self.send(text_data=json.dumps({
            'type': 'game_start',

        }))

    async def send_ball_update(self, event):
        print("IN SEND BALL UPDATE")
        await self.send(text_data=json.dumps({
            'type': 'ball_update',
            'ball_x': event['data']['ball_x'],
            'ball_y': event['data']['ball_y'],

        }))

    async def send_score_update(self, event):
        print("IN SEND SCORE UPDATE")
        await self.send(text_data=json.dumps({
            'type': 'score_update',
            'host_score': event['data']['host_score'],
            'guest_score': event['data']['guest_score'],

        }))

    async def send_game_over(self, event):
        print("IN SEND BALL UPDATE")
        await self.send(text_data=json.dumps({
            'type': 'game_over',

        }))

    async def send_opponent_disconnected(self, event):
        print("in opponent disconnected")
        await self.send(text_data=json.dumps({
            'type': 'opponent_disconnected',

        }))

    async def handle_send_game_scene(self):

        if self.key_code == 38:
            new_pedal_pos = self.prev_pos - 0.05
        elif self.key_code == 40:
            new_pedal_pos = self.prev_pos + 0.05
        else:
            new_pedal_pos = self.prev_pos

        if (self.is_host == True):
            response_type = 'render_left'
            await self.assign_left_pedal(new_pedal_pos)
        else:
            response_type = 'render_right'
            await self.assign_right_pedal(new_pedal_pos)

        print("RESPONSE TYPE")

        print(response_type)
        await self.channel_layer.group_send(
            self.game_group_id,
            {
                'type': 'send.game.scene',
                'data': {
                    # 'chat_id': chat_id,
                    'new_pedal_pos': new_pedal_pos,
                    'response_type': response_type

                },
            }
        )

    async def init_game_struct(self):
        if self.game_id not in self.game_states:
            self.game_states[self.game_id] = {
                'left_pedal': 0.75,
                'right_pedal': 0.75,
                'ball_x': 2,  # Initial ball position
                'ball_y': 1,  # Initial ball position
                'ball_radius': 0.05,
                'ball_speed': 0.015,
                'ball_dx': 0.025,
                'ball_dy': 0.025,
                'joined_players': 0,
                'host_score': 0,
                'guest_score': 0,
                'score_limit': 1,
                'game_active': True,
            }

    async def handle_send_init_game(self):

        await self.init_game_struct()
        return_val = await self.get_host(self.game_id, self.user['user_id'])
        print("is host status:")
        print(return_val)

        await self.increment_joined_players()
        # self.game_states.get(self.game_id, {}).get('joined_players')
        print("self.joined_players")
        print(self.game_states.get(self.game_id, {}).get('joined_players'))

        await self.channel_layer.send(
            self.channel_name,
            {
                'type': 'send.init.game',
                'data': {
                    'is_host': return_val,
                    'joined_players': self.game_states.get(self.game_id, {}).get('joined_players')
                },
            }
        )
        if (self.game_states.get(self.game_id, {}).get('joined_players') == 2):
            print("TWO PLAYERS\n")
            await self.reset_joined_players()
            await self.channel_layer.group_send(
                self.game_group_id,
                {
                    'type': 'send.game.start',
                    'data': {
                        'ball_x': self.game_states.get(self.game_id, {}).get('ball_x'),
                        'ball_y': self.game_states.get(self.game_id, {}).get('ball_y')
                    },
                }
            )
            print("after TWO PLAYERS\n")

            # await self.game_loop()
            asyncio.create_task(self.game_loop())

    async def handle_send_ball_update(self):
        await self.calculate_ball_state()
        print("BALL_UPDATEEEE")
        await self.channel_layer.group_send(
            self.game_group_id,
            {
                'type': 'send.ball.update',
                'data': {
                    'ball_x': self.ball_x,
                    'ball_y': self.ball_y

                },
            }
        )
        print("sent")

    async def handle_send_score_update(self):
        print('IN HANDLE SEND SCORE UPDATE')

        try:
            await self.channel_layer.group_send(
                self.game_group_id,
                {
                    'type': 'send.score.update',
                    'data': {
                        'host_score': self.game_states[self.game_id]['host_score'],
                        'guest_score': self.game_states[self.game_id]['guest_score'],
                    },
                }
            )
        except Exception as e:
            print(f"Error in handle_send_score: {e}")


# ---------------------------- DATABASE FUNCTIONS ----------------------------

    @database_sync_to_async
    def get_host(self, game_id, user_id):
        game_instance = Game.objects.get(id=game_id)
        user_instance = MyUser.objects.get(id=user_id)
        if user_instance.name == game_instance.hostId:
            self.is_host = True
            check_host = 'True'
        else:
            self.is_host = False
            check_host = 'False'
        return check_host
    
    # @database_sync_to_async
    # def remove_ended_match(self):
    #     try:
    #         # print("user_id")

    #         # print(user_id)
    #         user_id = self.user['user_id']
    #         user1 = MyUser.objects.get(id=user_id)
    #         game_instance = Game.objects.get(id=self.game_id)
    #         user1.new_matches.remove(game_instance)

    #     except MyUser.DoesNotExist:
    #         return None
