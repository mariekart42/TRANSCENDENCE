from django.shortcuts import render
from .models import MyUser, Chat, Message, Game
from django.http import JsonResponse
import json  # build in python module
from django.views.decorators.http import require_GET, require_POST
from django.db import models
from django.utils import timezone
from django.core.serializers import serialize



def goToFrontend(request):
    return render(request, 'goToFrontend.html')



# @require_GET
def checkUserCredentials(request, username, password):
    try:
        print('IN BACKEND loginUser')
        user_exist_check = MyUser.objects.filter(name=username).exists()
        if not user_exist_check:
            return JsonResponse({'error': 'User not found'}, status=404)

        user_object = MyUser.objects.get(name=username)

        if password == user_object.password:
            return JsonResponse({'message': 'ALL RIGHT', 'user_id': user_object.id}, status=200)
        else:
            return JsonResponse({'error': 'Password is wrong'}, status=401)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'something big in getUserData'}, status=500)



@require_GET
def getUserData(request, username, provided_password):
    try:
        print('IN BACKEND GET USER DATA')
        user = MyUser.objects.filter(name=username).exists()
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)

        user = MyUser.objects.get(name=username)

        if provided_password == user.password:
            user_data = {
                'id': user.id,
                'name': user.name,
                'password': user.password,
                'age': user.age,
            }
            return JsonResponse({'user_data': user_data}, status=200)
        else:
            return JsonResponse({'error': 'Password is wrong'}, status=401)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({'error': 'something big in getUserData'}, status=500)


@require_POST
def updateUserAge(request, user_id):
    try:
        # should technically never happen but just in case lol:
        user_exists = MyUser.objects.filter(id=user_id).exists()
        if not user_exists:
            return JsonResponse({'error': 'User not found'}, status=404)
        user = MyUser.objects.get(id=user_id)

        # Extract the new age from the request body
        data = json.loads(request.body.decode('utf-8'))
        new_age = data.get('newAge')
        user.age = new_age
        user.save()

        return JsonResponse({'message': 'Age updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'something big in updateUserAge'}, status=500)




@require_POST
def updateUserName(request, user_id):
    try:
        # should technically never happen but just in case lol:
        user_exists = MyUser.objects.filter(id=user_id).exists()
        if not user_exists:
            return JsonResponse({'error': 'User not found'}, status=404)

        user = MyUser.objects.get(id=user_id)

        # Extract the new username from the request body
        data = json.loads(request.body.decode('utf-8'))
        new_name = data.get('newName')

        chek_name_duplicate = MyUser.objects.filter(name=new_name).exists()
        if chek_name_duplicate:
            return JsonResponse({'error': 'Username already exists!'}, status=409)

        user.name = new_name
        user.save()
        return JsonResponse({'message': 'Username updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'something big in updateUserName'}, status=500)


@require_POST
def updateUserPassword(request, user_id):
    try:
        # should technically never happen but just in case lol:
        user_exists = MyUser.objects.filter(id=user_id).exists()
        if not user_exists:
            return JsonResponse({'error': 'User not found'}, status=404)

        user = MyUser.objects.get(id=user_id)
        # Extract the new username from the request body
        data = json.loads(request.body.decode('utf-8'))
        new_password = data.get('newPassword')
        user.password = new_password
        user.save()
        return JsonResponse({'message': 'password updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'something big in updateUserPassword'}, status=500)


def createAccount(request, username, password, age):
    try:
        user = MyUser.objects.filter(name=username).exists()
        if user:
            return JsonResponse({'error': 'Username already exist'}, status=409)
        if age is not None and (age < 0 or age > 200):
            return JsonResponse({"error": "Dude, there is no way you're " + str(age)}, status=409)
        user_data = {
            "name": username,
            "password": password,
            "age": age,
        }
        new_user = MyUser(**user_data)
        new_user.save()
        user_instance = MyUser.objects.get(name=username)
        return JsonResponse({"message": "User created successfully", 'user_id': user_instance.id})
    except Exception as e:
        return JsonResponse({'error': 'something big in createAccount'}, status=500)


# @require_POST
def createChat(request, user_id, chat_name):
    try:
        chat_exists = Chat.objects.filter(chatName=chat_name).exists()
        if chat_exists:
            return JsonResponse({'error': 'Chatname already exist'}, status=409)

        new_chat = Chat.objects.create(chatName=chat_name)

        user_instance = MyUser.objects.get(id=user_id)

        user_instance.chats.add(new_chat.id)
        new_chat.save()
        user_instance.save()
        return JsonResponse({"message": "Chat created successfully"})
    except ValueError:
        return JsonResponse({"error": "Invalid user ID"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_GET
def getUserChats(request, user_id):
    try:
        user_instance = MyUser.objects.get(id=user_id)
        user_chats = user_instance.chats.all()

        # Convert user_chats to a list of dictionaries for JSON response
        chat_data = [{'chat_id': chat.id, 'chat_name': chat.chatName} for chat in user_chats]

        return JsonResponse({'chat_data': chat_data})
    except MyUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_GET
def getChatData(request, user_id, chat_id):
    try:
        user_exists = MyUser.objects.filter(id=user_id).exists()
        if not user_exists:
            return JsonResponse({'error': 'User in getChatData not found'}, status=404)
        user = MyUser.objects.get(id=user_id)
        chat_exists = user.chats.filter(id=chat_id).exists()
        if not chat_exists:
            return JsonResponse({'error': 'chat in getChatData not found'}, status=404)

        chat_instance = Chat.objects.get(id=chat_id)
        users_in_chat = chat_instance.myuser_set.all()
        user_names = [user.name for user in users_in_chat]

        chat_data = {
            'id': chat_instance.id,
            'name': chat_instance.chatName,
            'user': user_names,
        }

        return JsonResponse({'chat_data': chat_data}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'something big in getChatData'}, status=500)




def leaveChat(request, user_id, chat_id):
    try:
        user_exists = MyUser.objects.filter(id=user_id).exists()
        if not user_exists:
            return JsonResponse({'error': 'User in leaveChat not found'}, status=404)
        chat_exists = Chat.objects.filter(id=chat_id).exists()
        if not chat_exists:
            return JsonResponse({'error': 'Chat in leaveChat not found'}, status=404)

        chat_instance = Chat.objects.get(id=chat_id)
        user_instance = MyUser.objects.get(id=user_id)

        user_instance.chats.remove(chat_instance)
        user_instance.save()

        return JsonResponse({'message': 'everything toggo'}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'something big in leaveChat'}, status=500)


# moved to utils file
# @require_POST
# def createMessage(request, user_id, chat_id):
#     try:
#         user_instance = MyUser.objects.get(id=user_id)
#         specific_timestamp = timezone.now()
#
#         data = json.loads(request.body.decode('utf-8'))
#         text = data.get('text')
#
#         new_message = Message.objects.create(sender=user_instance.name, text=text, timestamp=specific_timestamp)
#
#         # add new_message to chat:
#         chat_instance = Chat.objects.get(id=chat_id)
#         chat_instance.messages.add(new_message.id)
#         new_message.save()
#
#         return JsonResponse({'message': "Message created successfully"})
#     except Exception as e:
#         return JsonResponse({'error': 'something big in createMessage'}, status=500)
#
#
# def getChatMessages(request, chat_id):
#     try:
#         chat_instance = Chat.objects.get(id=chat_id)
#         messages_in_chat = chat_instance.messages.all()
#
#         message_data = [
#             {
#                 'id': message.id,
#                 'sender': message.sender,
#                 'text': message.text,
#                 'timestamp': message.formatted_timestamp(),
#             }
#             for message in messages_in_chat
#         ]
#
#         return JsonResponse({'message_data': message_data}, status=200)
#     except Exception as e:
#             return JsonResponse({'error': 'something big in createMessage'}, status=500)
#
#

def inviteUserToChat(request, user_id, chat_id, invited_user):
    try:
        invited_user_exists = MyUser.objects.filter(name=invited_user).exists()
        if not invited_user_exists:
            return JsonResponse({'error': 'User you want to invite doesnt exists'}, status=404)

        # get instance of both users
        inviting_user = MyUser.objects.get(id=user_id)
        invited_user = MyUser.objects.get(name=invited_user)

        # get instance of chat that the user is inviting the other user to
        chat = inviting_user.chats.get(id=chat_id)

        # add chat to invited user instance
        invited_user.chats.add(chat)
        return JsonResponse({"message": "Invite was send successfully"})
    except inviting_user.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except invited_user.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


######### GAMEEEEEEEEEEEEEEEEEEEE #########


def createGame(request, username):
    try:
        print(f"Entering createGameroom function with username: {username}")
        # user = "lol_name"
        new_gameroom = Game.objects.create(hostId=username, guestId="")
        print(f"11111")

        new_gameroom.save()
        # user_instance = MyUser.objects.get(Name=username)

        # Add new chat to user
        # user_instance.games.add(new_gameroom.id)
        # user_instance.save()
        return JsonResponse({"message": "Gameroom was created successfully", "id": new_gameroom.id})
    except ValueError:
        return JsonResponse({"error": "Invalid username"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def inviteUserToGame(request, username, game_id, guest_user_name):

    try:
        print(f"backend invite user")
        guest_user_exists = MyUser.objects.filter(name=guest_user_name).exists()
        if not guest_user_exists:
            return JsonResponse({'error': 'User you want to invite doesnt exists'}, status=404)

        # get instance of both users
        host_user = MyUser.objects.get(name=username)
        guest_user = MyUser.objects.get(name=guest_user_name)

        # get instance of chat that the user is inviting the other user to
        # game = host_user.new_matches.get(id=game_id)
        game = Game.objects.get(id=game_id)

        # add chat to invited user instance
        guest_user.new_matches.add(game)
        game.guestId = guest_user.name
        game.save()
        return JsonResponse({"message": "Invite was send successfully"})
    except host_user.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except guest_user_name.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def renderInvites(request, username):
    try:
        print(f"Entering renderInvites function with username: {username}")
        user = MyUser.objects.get(name=username)
        print(f"22222")
        print(f" {user}")

        game_sessions = Game.objects.all()

        serialized_data = serialize('json', game_sessions)
        # You can also use a custom serializer if needed

        print(f"333333")
        print(f" {game_sessions}")

        return JsonResponse({"game_sessions": serialized_data}, safe=False)
    except MyUser.DoesNotExist:
        return JsonResponse({"error": f"User with username '{username}' not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# def renderInvites(request, username):
#     try:
#         print(f"Entering renderInvites function with username: {username}")
#         user = MyUser.objects.get(name=username)
#         print(f"22222")
#         print(f" {user}")

#         # game_sessions = user.new_matches.all()
#         # game_sessions = user.new_matches.get(id=2)
#         game_sessions = Game.objects.all()

#         print(f"333333")
#         print(f" {game_sessions}")

#         return render(request, 'openGameSessions.html', {'game_sessions': game_sessions})    
#     # except ValueError:
#     #     return JsonResponse({"error": "Invalid username"}, status=400)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, status=500)



# not using dis yet/maybe never lol:
@require_POST
def updateAvatar(request, id):
    print('IN UPDATE AVATAR:))')
    # user_id = request.POST.get('user_id')  # Retrieve user ID from the request payload
    try:
        user = MyUser.objects.get(id=id)
    except MyUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    # Assuming 'avatar' is the name of the field in the FormData
    avatar = request.FILES.get('avatar')

    if avatar:
        # Save the uploaded file to the 'avatars/' directory
        user.avatar.save(avatar.name, avatar)

        return JsonResponse({'message': 'Avatar updated successfully'}, status=200)
    else:
        return JsonResponse({'error': 'No avatar file provided'}, status=400)
