from django.shortcuts import render, redirect
from .models import Room, Message
from django.http import HttpResponse, JsonResponse

# Create your views here.


def home(request):
    # printAllRooms = Room.objects.all()
    # print('ALL MY ROOMS:')
    # print(printAllRooms)
    return render(request, 'home.html')


def room(request, room):
    new_username = request.GET.get('username')
    room_name = Room.objects.get(name=room)
    return render(request, 'room.html', {
        'username': new_username,
        'room': room,
        'room_details': room_name
    })


def send(request):
    rec_message = request.POST['message']
    username = request.POST['username']
    room_id = request.POST['room_id']

    new_message = Message.objects.create(value=rec_message, user=username, room=room_id)
    new_message.save()
    return HttpResponse('New message send :)')


def getMessages(request, room):
    current_room = Room.objects.get(name=room)

    all_messages = Message.objects.filter(room=current_room.id)
    # filters gets all data stored in Messages module:
    #  value, date, user and room

    return JsonResponse({"messages": list(all_messages.values())})



def checkview(request):
    # check in here if room exists
    requested_room = request.POST['room_name']
    username = request.POST['username']

    # if requested room doesn't exist yet, we create it and save it to database
    if not Room.objects.filter(name=requested_room).exists():
        new_room = Room.objects.create(name=requested_room)
        new_room.save()

    # then we redirect user to the (now) existing room
    return redirect('/' + requested_room + '/?username=' + username)

    # if Room.objects.filter(name=requested_room).exists():
    #     # if requested room already exists in Database
    #     # redirecting to existing room with its own username:
    #     return redirect('/' + requested_room + '/?username=' + username)
    # else:
    #     # otherwise we create a new room for the user
    #     # and redirect him to there
    #     new_room = Room.objects.create(name=requested_room)
    #     new_room.save()
    #
    #     return redirect('/' + requested_room + '/?username=' + username)
