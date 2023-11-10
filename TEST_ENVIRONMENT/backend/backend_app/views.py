from django.shortcuts import render, redirect
from .models import User
from django.http import JsonResponse
import json  # build in python module

# Create your views here.


def goToFrontend(request):
    return render(request, 'goToFrontend.html')



def getUserList(request):
    users = User.objects.all()
    user_list = [{'id': user.id, 'name': user.name} for user in users]
    return JsonResponse(user_list, safe=False)


def getUserData(request, user_id):
    user_data = User.objects.filter(id=user_id)
    user_data_list = [{
        'id': data.id,
        'name': data.name,
        'password': data.password,
        'age': data.age
        } for data in user_data]
    return JsonResponse(user_data_list, safe=False)









def signup(request):
    users = User.objects.all()
    user_list = []
    for user in users:
        user_data = {
            'id': user.id,
            'name': user.name,
            'password': user.password,
            'age': user.age
        }
        user_list.append(user_data)
    return JsonResponse(user_list, safe=False)
    # print('USER_DATA: ')
    # print(user_data)
    #
    # data = []
    # for user in user_data:
    #     # Check for null values before adding fields to the response
    #     cleaned_user = {
    #         'id': user['id'],
    #         'name': user['name'] if user['name'] is not None else "",
    #         'password': user['password'] if user['password'] is not None else "",
    #         'age': user['age'] if user['age'] is not None else 0,
    #         # Handle other fields similarly
    #     }
    #     data.append(cleaned_user)
    #
    # return JsonResponse(data, safe=False)


# def signin(request):
#     data
#     return render(request, 'SIGNIN')
