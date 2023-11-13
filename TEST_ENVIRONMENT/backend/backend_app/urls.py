from django.urls import path
from . import views
from .views import updateUserAge, updateUserName

urlpatterns = [
    path('', views.goToFrontend),  # happens when user enters backend port

    path('user/data/<str:username>/<str:provided_password>/', views.getUserData, name='userData'),
    # path('user/update-avatar/<int:id>/', views.updateAvatar, name='userAvatar')
    path('user/update-age/<int:user_id>/', updateUserAge, name='updateUserAge'),
    path('user/updateUserName/<int:user_id>/', updateUserName, name='updateUserName'),
    path('user/updateUserPassword/<int:user_id>/', updateUserName, name='updateUserName'),
    path('user/createAccount/<str:username>/<str:password>/<int:age>/', views.createAccount, name='create-account'),
    path('user/createChat/<int:user_id>/<str:chatname>/', views.createChat, name='create-chat'),
    path('user/getUserChats/<int:user_id>/', views.getUserChats, name='getUserChats'),
]
