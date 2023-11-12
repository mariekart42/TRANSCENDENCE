from django.shortcuts import render
from .models import MyUser
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
        user2 = MyUser.objects.get(id=user_id)

        # Extract the new age from the request body
        data = json.loads(request.body.decode('utf-8'))
        new_age = data.get('newAge')
        user2.age = new_age
        user2.save()

        return JsonResponse({'message': 'Age updated successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': 'something big in updateUserAge'}, status=500)


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
