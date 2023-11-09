from django.db import models
from datetime import datetime


# Create your models here.

# class Room(models.Model):
#     # roomname:
#     name = models.CharField(max_length=1000)
#
#
# class Message(models.Model):
#     value = models.CharField(max_length=100000)
#     date = models.DateTimeField(default=datetime.now, blank=True)
#     user = models.CharField(max_length=2000)
#     room = models.CharField(max_length=20000)  # specifies the room id the messages belong to


class User(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    age = models.IntegerField()
