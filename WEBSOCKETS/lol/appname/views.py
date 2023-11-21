from django.shortcuts import render
import json
# Create your views here.
from django.http import JsonResponse

def test(request):
    print('LOL IN VIEW TEST')
    return JsonResponse({'message': 'Age updated successfully'})