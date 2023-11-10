from django.db import models


class MyUser(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    age = models.IntegerField()
