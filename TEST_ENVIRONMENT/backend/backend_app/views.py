from django.shortcuts import render, redirect
from .models import MyUser
from django.http import JsonResponse
from django.contrib.auth import authenticate
import json  # build in python module
from django.views.decorators.http import require_GET
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404


def goToFrontend(request):
    return render(request, 'goToFrontend.html')



@require_GET
def getUserData(request, username, provided_password):
    try:
        user = MyUser.objects.filter(name=username).exists()
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)

        user = MyUser.objects.get(name=username)

        # Compare the provided password with the stored password
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
        return JsonResponse({'error': 'something big'}, status=500)
