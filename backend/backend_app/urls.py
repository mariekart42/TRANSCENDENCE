from django.urls import path
from . import views
from . import utils
# from .views import updateUserPassword

urlpatterns = [
    path('', views.goToFrontend),  # happens when user enters backend port

    # LOGIN/REGISTER
    path('user/check_user_credentials/<str:username>/<str:password>/', views.checkUserCredentials),
    path('user/account/create/<str:username>/<str:password>/<int:age>/', views.createAccount),

    # CHAT
    path('user/upload/avatar/<str:username>/', views.uploadAvatar),

    # GAME
    path('user/game/create/<str:username>/<str:invited_username>', views.createGame),
    path('user/game/invite/<str:username>/<int:game_id>/<str:guest_user_name>/', views.inviteUserToGame),
    path('user/game/render/invites/<str:username>/', views.renderInvites),

]
