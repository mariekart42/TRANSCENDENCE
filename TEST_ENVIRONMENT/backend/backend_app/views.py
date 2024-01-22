from django.shortcuts import render
from .models import MyUser, Chat#, Message
from django.http import JsonResponse
import json  # build in python module
from django.views.decorators.http import require_GET, require_POST
from django.db import models
from django.utils import timezone


def goToFrontend(request):
    return render(request, 'goToFrontend.html')




def inviteUser(request, invited_user_name):
    try:
        pass
    except Exception as e:
        return JsonResponse({'error': 'something big in inviteUser'}, status=500)


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


def createPublicChat(request, user_id, chat_name):
    try:
        chat_exists = Chat.objects.filter(chatName=chat_name).exists()
        if chat_exists:
            return JsonResponse({'error': 'lol'}, status=409)

        new_chat = Chat.objects.create(chatName=chat_name, isPrivate=False)
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
        chat_data = [
            {
                'chat_id': chat.id,
                'chat_name': getChatName(chat, user_id),
                'isPrivate': chat.isPrivate,
                'last_message': getLastMessageInChat(chat.id)
            }
            for chat in user_chats
        ]

        return JsonResponse({'chat_data': chat_data})
    except MyUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def getChatName(chat_instance, user_id):
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

    return 'AHHHHHH something wrong'

def getLastMessageInChat(chat_id):
    # chat_exist = Chat.objects.filter(id=chat_id)
    # if not chat_exist:
    #     return {'message': 'Chat does not exist', 'last_message': 'Not found'}

    chat_instance = Chat.objects.get(id=chat_id)
    last_message = chat_instance.messages.order_by('-timestamp').first()

    if last_message:
        print("Last Message:", last_message.text)
        print("Sender:", last_message.sender)
        print("Timestamp:", last_message.formatted_timestamp())
        return last_message
    else:
        print("No messages in the chat.")
        # last_message.text = 'Message not found'
        # last_message.formatted_timestamp = 0
        # last_message.sender = 'Message not found'
        return None


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



# gettin user_id cause dis function should later only
# return users friends and not all user
def getAllUser(request, user_id):
    try:
        all_users_info = MyUser.objects.values('id', 'name')
        all_user = list(all_users_info)
        return JsonResponse({'all_user': all_user}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'something big in getChatData'}, status=500)


def inviteUserToChat(request, user_id, chat_id, invited_user):
    try:
        invited_user_exists = MyUser.objects.filter(name=invited_user).exists()
        if not invited_user_exists:
            return JsonResponse({'error': 'User you want to invite doesnt exists'}, status=404)

        inviting_user = MyUser.objects.get(id=user_id)
        invited_user = MyUser.objects.get(name=invited_user)
        chat = inviting_user.chats.get(id=chat_id)

        invited_user.chats.add(chat)
        return JsonResponse({"message": "Invite was send successfully"})
    except inviting_user.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except invited_user.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)






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
