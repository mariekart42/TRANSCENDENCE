from django.shortcuts import render
from .models import MyUser, Chat, Message
from django.http import JsonResponse
import json  # build in python module
from django.views.decorators.http import require_GET, require_POST


def goToFrontend(request):
    return render(request, 'goToFrontend.html')


@require_GET
def getUserData(request, username, provided_password):
    try:
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
        print(f"An error occurred: { str(e) }")
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

        return JsonResponse({"message": "User created successfully"})
    except Exception as e:
        return JsonResponse({'error': 'something big in createAccount'}, status=500)



@require_POST
def createChat(request, user_id, chatname):
    try:
        new_chat = Chat.objects.create(chatName=chatname)
        chat_id = new_chat.id

        # getting user instance
        user_instance = MyUser.objects.get(id=user_id)

        # Add the user to the chat's participants
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
        # Assuming 'chats' is the related name of the ManyToManyField in MyUser model

        # Convert user_chats to a list of dictionaries for JSON response
        chats_data = [{'id': chat.id, 'chatName': chat.chatName} for chat in user_chats]

        return JsonResponse({'allChats': chats_data})
    except MyUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
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
