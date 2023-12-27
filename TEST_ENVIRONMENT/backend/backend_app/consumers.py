import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from .models import MyUser, Chat, Message, Game
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
        self.key_code = 0
        self.prev_pos = 0
        self.is_host = 0
        self.game_id = 0

    joined_players = 0 


    left_pedal = 150
    right_pedal = 150

    canvas_width = 800
    canvas_height = 400
    ball_x = canvas_width / 2
    ball_y = canvas_height / 2
    ball_radius = 10
    ball_speed = 5
    ball_dx = 5
    ball_dy = 5





    @classmethod
    def increment_joined_players(cls):
        cls.joined_players += 1

    @classmethod
    def reset_joined_players(cls):
        cls.joined_players = 0


    async def connect(self):
        user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user = {'user_id': user_id, 'is_online': 'true'}
        self.connections.append(self.user)
        # self.channel_name = f"user_{self.user['user_id']}"

        await self.accept()

    async def disconnect(self, close_code):
        self.connections.remove(self.user)
        await self.handle_send_online_stats_on_disconnect()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        what_type = text_data_json["type"]
        # chat_id = text_data_json["data"]["chat_id"]
        chat_id = "" #TEMPORARY
        game_id = text_data_json["data"]["game_id"]
        # self.my_group_id = 'group_%s' % chat_id
        self.my_group_id = 'group_%s' % game_id
        # self.game_id = game_id
        # self.key_code = text_data_json["data"]["key_code"]
        # self.prev_pos = text_data_json["data"]["prev_pos"]
        # print('IN RECIEVE. PREV_POS AND GROUP:')
        # print(self.prev_pos)
        print(self.my_group_id)
        print(self.user)
        print('______________\n')



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
        elif what_type == 'send_current_users_chats':
            await self.handle_send_current_users_chats(text_data_json)
        elif what_type == 'send_all_user':
            await self.handle_send_all_user()
        elif what_type == 'send_game_scene':
            self.key_code = text_data_json["data"]["key_code"]
            self.prev_pos = text_data_json["data"]["prev_pos"]
            # self.is_host = text_data_json["data"]["is_host"]
            await self.handle_send_game_scene()
        elif what_type == 'send_init_game':
            self.game_id = game_id
            await self.handle_send_init_game()
        elif what_type == 'send_ball_update':
            self.game_id = game_id
            await self.handle_send_ball_update()
        else:
            print('IS SOMETHING ELSE')


    # class Ball:
    #     def __init__(self, x, y, radius, dx, dy):
    #         self.x = x
    #         self.y = y
    #         self.radius = radius
    #         self.dx = dx
    #         self.dy = dy


    # def calculate_ball_state(self):

    #     gameState = Ball(self.canvas_width // 2, self.canvas_height // 2, 10, 5, 5)

    #     gameState.x += gameState.dx
    #     gameState.y += gameState.dy

    #     # Handle ball-wall collisions
    #     if gameState.y - gameState.radius < 0 or gameState.y + gameState.radius > self.canvas_height:
    #         gameState.dy *= -1

    #     # Handle ball-paddle collisions
    #     if (
    #         gameState.x - gameState.radius < 20 and
    #         gameState.y > self.left_pedal and
    #         gameState.y < self.left_pedal
    #     ):
    #         gameState.dx *= -1

    #     if (
    #         gameState.x + gameState.radius > self.canvas_width - 20 and
    #         gameState.y > self.right_pedal and
    #         gameState.y < self.right_pedal
    #     ):
    #         gameState.dx *= -1

        # if gameState.x - gameState.radius < 0 or gameState.x + gameState.radius > self.canvas_width:
        #     # Reset ball position to the center
        #     gameState.x = self.canvas_width // 2
        #     gameState.y = self.canvas_height // 2


    def calculate_ball_state(self):

        # gameState = Ball(self.canvas_width // 2, self.canvas_height // 2, 10, 5, 5)

        self.ball_x += self.ball_dx
        self.ball_y += self.ball_dy

        # Handle ball-wall collisions
        if self.ball_y - self.ball_radius < 0 or self.ball_y + self.ball_radius > self.canvas_height:
            self.ball_dy *= -1

        # Handle ball-paddle collisions
        if (
            self.ball_x - self.ball_radius < 20 and
            self.ball_y > self.left_pedal and
            self.ball_y < self.left_pedal + 100
        ):
            self.ball_dx *= -1

        if (
            self.ball_x + self.ball_radius > self.canvas_width - 20 and
            self.ball_y > self.right_pedal and
            self.ball_y < self.right_pedal + 100
        ):
            self.ball_dx *= -1

        if self.ball_x - self.ball_radius < 0 or self.ball_x + self.ball_radius > self.canvas_width:
            # Reset ball position to the center
            self.ball_x = self.canvas_width // 2
            self.ball_y = self.canvas_height // 2
            
    # async def calculate_ball_state(self):
    #     self.ball_x += self.ball_dx
    #     self.ball_y += self.ball_dy

    #     # Handle ball-wall collisions
    #     if self.ball_y - self.ball_radius < 0 or self.ball_y + self.ball_radius > self.canvas_height:
    #         self.ball_dy *= -1

    #     # Handle ball-paddle collisions
    #     if (
    #         self.ball_x - self.ball_radius < 20 and
    #         self.left_pedal < self.ball_y < self.left_pedal + 100  # Adjust the paddle height as needed
    #     ):
    #         self.ball_dx *= -1

    #     if (
    #         self.ball_x + self.ball_radius > self.canvas_width - 20 and
    #         self.right_pedal < self.ball_y < self.right_pedal + 100  # Adjust the paddle height as needed
    #     ):
    #         self.ball_dx *= -1

    #     # Handle ball-wall collisions for left and right walls
    #     if self.ball_x - self.ball_radius < 0 or self.ball_x + self.ball_radius > self.canvas_width:
    #         # Reset ball position to the center
    #         self.ball_x = self.canvas_width // 2
    #         self.ball_y = self.canvas_height // 2



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

    async def send_current_users_chats(self, event):
        await self.send(text_data=json.dumps({
            'type': 'current_users_chats',
            'users_chats': event['data']['users_chats']
        }))

    async def send_all_user(self, event):
        await self.send(text_data=json.dumps({
            'type': 'all_user',
            'all_user': event['data']['all_user']
        }))

    async def send_game_scene(self, event):

        await self.send(text_data=json.dumps({
            'type': event['data']['response_type'],
            'new_pedal_pos': event['data']['new_pedal_pos']
        }))

    async def send_init_game(self, event):

        await self.send(text_data=json.dumps({
            'type': 'init_game',
            'is_host': event['data']['is_host'],
            # 'joined_players': event['data']['joined_players']

        }))

    async def send_game_start(self, event):

        await self.send(text_data=json.dumps({
            'type': 'game_start',
            # 'is_host': event['data']['is_host'],
            # 'joined_players': event['data']['joined_players']

        }))
    async def send_ball_update(self, event):

        await self.send(text_data=json.dumps({
            'type': 'ball_update',
            'ball_x': event['data']['ball_x'],
            'ball_y': event['data']['ball_y'],

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
                    'chat_id': chat_id,
                    'users_chats': users_chats,
                },
            }
        )

    async def handle_send_all_user(self):
        all_user = await self.get_all_user()

        print("in handle_send_all_user\n")

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

    async def handle_send_game_scene(self):
        all_user = await self.get_all_user()

        # new_pedal_pos = 0
        if self.key_code == 38:
            new_pedal_pos = self.prev_pos - 10
        elif self.key_code == 40:
            new_pedal_pos = self.prev_pos + 10
        else:
            new_pedal_pos = self.prev_pos

        if (self.is_host == True):
            response_type = 'render_left'
            self.left_pedal = new_pedal_pos
        else:
            response_type = 'render_right'
            self.right_pedal = new_pedal_pos
            
        print("RESPONSE TYPE")

        print(response_type)    
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.game.scene',
                'data': {
                    # 'chat_id': chat_id,
                    'all_user': all_user,            
                    'new_pedal_pos': new_pedal_pos,
                    'response_type': response_type

                },
            }
        )

    async def handle_send_init_game(self):
        return_val = await self.get_host(self.game_id, self.user['user_id'])
        print("is host status:")
        print(return_val)

        # self.joined_players += 1
        self.increment_joined_players()

        print("self.joined_players")
        print(self.joined_players)

        await self.channel_layer.send(
            self.channel_name,
            {
                'type': 'send.init.game',
                'data': {
                    'is_host': return_val,
                    'joined_players': self.joined_players
                },
            }
        )
        if (self.joined_players == 2):
            self.reset_joined_players()
            await self.channel_layer.group_send(
                self.my_group_id,
                {
                    'type': 'send.game.start',
                    'data': {
                        'ball_x': self.ball_x,
                        'ball_y': self.ball_y
                    },
                }
            )

    async def handle_send_ball_update(self):
        self.calculate_ball_state()
        print("BALL_UPDATEEEE")
        await self.channel_layer.group_send(
            self.my_group_id,
            {
                'type': 'send.ball.update',
                'data': {
                    'ball_x': self.ball_x,   
                    'ball_y': self.ball_y
                    
                },
            }
        )




# ---------------------------- DATABASE FUNCTIONS ----------------------------

    @database_sync_to_async
    def get_host(self, game_id, user_id):
        game_instance = Game.objects.get(id=game_id)
        user_instance = MyUser.objects.get(id=user_id)
        if (user_instance.name == game_instance.hostId):
            self.is_host = True
            check_host = 'True'
        else:
            self.is_host = False
            check_host = 'False'


        return check_host

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
                'chat_name': chat.chatName
            }
            for chat in all_chats
        ]
        return user_chats

    @database_sync_to_async
    def get_all_user(self):
        all_users_info = MyUser.objects.values('id', 'name')
        all_user = list(all_users_info)
        return all_user

