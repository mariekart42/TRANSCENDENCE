from django.contrib import admin
from .models import MyUser, Chat, Message, Game



# Register your models here.
admin.site.register(MyUser)
admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Game)

