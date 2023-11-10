from django.urls import path
from . import views  # to access all functions in views.py file

urlpatterns = [
    # will search function 'home' in views.py file
    path('', views.goToFrontend),  # happens when user enters backend port

    path('user/data/<str:username>/<str:provided_password>/', views.getUserData, name='userData'),

]
