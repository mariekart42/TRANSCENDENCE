from django.contrib import admin
from .models import MyUser, Chat, Message



# Register your models here.
admin.site.register(MyUser)
admin.site.register(Chat)
admin.site.register(Message)
