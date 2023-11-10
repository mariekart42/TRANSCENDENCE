from django.shortcuts import render, redirect
from .models import User
from django.http import JsonResponse
import json  # build in python module
from django.views.decorators.http import require_GET
from django.shortcuts import get_object_or_404

# Create your views here.


def goToFrontend(request):
    return render(request, 'goToFrontend.html')



def getUserList(request):
    users = User.objects.all()
    user_list = [{'id': user.id, 'name': user.name} for user in users]
    return JsonResponse(user_list, safe=False)

@require_GET
def getUserData(request, username):
    print('BACKEND USERNAME: ')
    print(username)
    try:
        user = get_object_or_404(User, name=username)
        user_data = {
            'id': user.id,
            'name': user.name,
            'password': user.password,
            'age': user.age,
        }
        return JsonResponse({'user_data': user_data}, status=200)
    except Exception as e:
        return JsonResponse({'error': 'User not found'}, status=404)



    # return JsonResponse(user_data_list, safe=False)









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
