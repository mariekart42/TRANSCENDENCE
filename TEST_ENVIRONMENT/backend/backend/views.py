from django.http import HttpResponse, JsonResponse


def hello_world(request):
    return HttpResponse('lol hey')
