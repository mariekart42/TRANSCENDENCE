from django.db import models

# inherits from "models.Model" which means it's a database model
class MyUser(models.Model):
    name = models.CharField("name", max_length=100)
    password = models.CharField("password", max_length=100)
    age = models.IntegerField("age")
    avatar = models.FileField(upload_to='avatars/', null=True, blank=True)

    chats = models.ManyToManyField('Chat', blank=True)
    # can hold multiple Chat instances


class Chat(models.Model):
    chatName = models.CharField("chatName", max_length=100)
    messages = models.ManyToManyField('Message', blank=True)


class Message(models.Model):
    username = models.CharField(max_length=50)
    text = models.CharField(max_length=10000)


    # Chat = models.ForeignKey(Chat, on_delete=models.CASCADE, default=None)
    # on_delete=models.CASCADE == Child(Message) gets deleted if Parent(Chat) gets deleted
