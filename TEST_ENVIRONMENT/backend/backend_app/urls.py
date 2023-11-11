from django.urls import path
from . import views  # to access all functions in views.py file
from .views import updateUserAge

urlpatterns = [
    # will search function 'home' in views.py file
    path('', views.goToFrontend),  # happens when user enters backend port
    path('user/data/<str:username>/<str:provided_password>/', views.getUserData, name='userData'),
    # path('user/update-avatar/<int:id>/', views.updateAvatar, name='userAvatar')
    path('user/update-age/<int:user_id>/', updateUserAge, name='updateUserAge'),
    path('user/createAccount/<str:username>/<str:password>/<int:age>/', views.createAccount, name='create-account')
]
