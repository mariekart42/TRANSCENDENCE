from django.db import models
from datetime import datetime

# Create your models here.

class Room(models.Model):
    # roomname:
    name = models.CharField(max_length=1)


class Message(models.Model):
    value = models.CharField(max_length=100000)
    date = models.DateTimeField(default=datetime.now, blank=True)
    user = models.CharField(max_length=2)
    room = models.CharField(max_length=2)  # specifies the room id the messages belong to

