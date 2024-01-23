from django.urls import path
from . import views
from . import utils
from .views import updateUserAge, updateUserName, updateUserPassword

urlpatterns = [
    path('', views.goToFrontend),  # happens when user enters backend port

    path('user/check_user_credentials/<str:username>/<str:password>/', views.checkUserCredentials, name='checkUserCredentials'),

    path('user/data/get/<str:username>/<str:provided_password>/', views.getUserData, name='userData'),
    path('user/age/post/<int:user_id>/', updateUserAge, name='updateUserAge'),
    path('user/name/post/<int:user_id>/', updateUserName, name='updateUserName'),
    path('user/password/post/<int:user_id>/', updateUserPassword, name='updateUserPassword'),
    path('user/account/create/<str:username>/<str:password>/<int:age>/', views.createAccount, name='create-account'),

    path('user/leaveChat/<int:user_id>/<int:chat_id>/', views.leaveChat),

    path('user/getAllUser/<int:user_id>/', views.getAllUser),


    # path('user/inviteUser/<str:invited_user_name>/<int:chat_id>/', views.inviteUser),



    # CHAT


    # AUTH


    # GAME
    path('user/game/create/<str:username>/', views.createGame),
    path('user/game/invite/<str:username>/<int:game_id>/<str:guest_user_name>/', views.inviteUserToGame),
    path('user/game/render/invites/<str:username>/', views.renderInvites),


    # path('user/update-avatar/<int:id>/', views.updateAvatar, name='userAvatar')
    path('user/createPublicChat/<int:user_id>/<str:chat_name>/', views.createPublicChat, name='create-chat'),
    path('user/getUserChats/<int:user_id>/', views.getUserChats, name='getUserChats'),
    path('user/getChatData/<int:user_id>/<int:chat_id>/', views.getChatData, name='getChatData'),
    path('user/inviteUserToChat/<int:user_id>/<int:chat_id>/<str:invited_user>/', views.inviteUserToChat, name='inviteUserToChat'),
    path('user/createMessage/<int:user_id>/<int:chat_id>/', utils.createMessage, name='createMessage'),
    path('user/getChatMessages/<int:chat_id>/', utils.getChatMessages, name='getChatMessages'),
]
