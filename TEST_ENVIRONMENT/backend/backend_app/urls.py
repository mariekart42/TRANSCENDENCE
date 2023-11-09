from django.urls import path
from . import views  # to access all functions in views.py file

urlpatterns = [
    # will search function 'home' in views.py file
    path('', views.goToFrontend),
    # path('<str:room>/', views.room, name='room'),  # dynamic url
    # path('checkview', views.checkview, name='checkview'),
    #
    # path('send', views.send, name='send'),
    # path('getMessages/<str:room>/', views.getMessages, name='getMessages')  # dynamic url

]
