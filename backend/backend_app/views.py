from django.shortcuts import render
from .models import MyUser, Game
from django.http import JsonResponse
import json  # build in python module
from django.views.decorators.http import require_GET, require_POST
from django.db import models
from django.utils import timezone


def goToFrontend(request):
    return render(request, 'goToFrontend.html')


def checkUserCredentials(request, username, password):
    try:
        user_exist_check = MyUser.objects.filter(name=username).exists()
        if not user_exist_check:
            return JsonResponse({}, status=404)
        user_object = MyUser.objects.get(name=username)
        if password == user_object.password:
            return JsonResponse({'user_id': user_object.id}, status=200)
        else:
            return JsonResponse({}, status=401)  # wrong credentials
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return JsonResponse({}, status=500)



# TODO: MARIE: DELETE LATER?: should user be able to change password?
@require_POST
def updateUserPassword(request, user_id):
    try:
        # should technically never happen but just in case lol:
        user_exists = MyUser.objects.filter(id=user_id).exists()
        if not user_exists:
            return JsonResponse({}, status=404)
        user = MyUser.objects.get(id=user_id)
        data = json.loads(request.body.decode('utf-8'))
        new_password = data.get('newPassword')
        user.password = new_password
        user.save()
        return JsonResponse({}, status=200)
    except Exception as e:
        return JsonResponse({}, status=500)


def createAccount(request, username, password, age):
    try:
        user_exist = MyUser.objects.filter(name=username).exists()
        if user_exist:
            return JsonResponse({}, status=409)
        # if age is not None and (age < 0 or age > 200):
        #     return JsonResponse({"error": "Dude, there is no way you're " + str(age)}, status=409)
        user_data = {
            "name": username,
            "password": password,
            "age": age,
        }
        new_user = MyUser(**user_data)
        new_user.save()
        user_instance = MyUser.objects.get(name=username)
        return JsonResponse({'user_id': user_instance.id}, status=200)
    except Exception as e:
        return JsonResponse({}, status=500)




######### GAMEEEEEEEEEEEEEEEEEEEE ######### kristinas kingdom:


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
        host_exists = MyUser.objects.filter(name=username)
        if not host_exists:
            return JsonResponse({"error": "User does not exist 1"}, status=404)
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
        return JsonResponse({"error": "User does not exist 2"}, status=404)
    except guest_user_name.DoesNotExist:
        return JsonResponse({"error": "User does not exist 3"}, status=404)
    except Exception as e:
        return JsonResponse({'error': 'Internal Server Èrror'}, status=500)


def renderInvites(request, username):
    try:
        print(f"Entering renderInvites function with username: {username}")
        user = MyUser.objects.get(name=username)
        print(f"22222")
        print(f" {user}")

        # game_sessions = user.new_matches.all()
        # game_sessions = user.new_matches.get(id=2)
        game_sessions = Game.objects.all()

        print(f"333333")
        print(f" {game_sessions}")

        return render(request, 'openGameSessions.html', {'game_sessions': game_sessions})
    # except ValueError:
    #     return JsonResponse({"error": "Invalid username"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


