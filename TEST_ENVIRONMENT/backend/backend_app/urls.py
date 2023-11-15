from django.urls import path
from . import views
from .views import updateUserAge, updateUserName, updateUserPassword

urlpatterns = [
    path('', views.goToFrontend),  # happens when user enters backend port

    # USER
    path('user/data/get/<str:username>/<str:provided_password>/', views.getUserData, name='userData'),
    path('user/age/post/<int:user_id>/', updateUserAge, name='updateUserAge'),
    path('user/name/post/<int:user_id>/', updateUserName, name='updateUserName'),
    path('user/password/post/<int:user_id>/', updateUserPassword, name='updateUserPassword'),
    path('user/account/create/<str:username>/<str:password>/<int:age>/', views.createAccount, name='create-account'),


    # CHAT


    # AUTH


    # GAME


    # path('user/update-avatar/<int:id>/', views.updateAvatar, name='userAvatar')
    path('user/createChat/<int:user_id>/<str:chatname>/', views.createChat, name='create-chat'),
    path('user/getUserChats/<int:user_id>/', views.getUserChats, name='getUserChats'),
    path('user/getChatData/<int:user_id>/<int:chat_id>/', views.getChatData, name='getChatData'),
    path('user/inviteUserToChat/<int:user_id>/<int:chat_id>/<str:invited_user>/', views.inviteUserToChat, name='inviteUserToChat'),
    path('user/createMessage/<int:user_id>/<int:chat_id>/', views.createMessage, name='createMessage'),
    path('user/getChatMessages/<int:chat_id>/', views.getChatMessages, name='getChatMessages'),
]
