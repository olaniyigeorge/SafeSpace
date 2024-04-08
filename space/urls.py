







from django.urls import path
from space.views import *

urlpatterns = [


    path("", Lobby, name="lobby"),
    #path("room/<uuid:id>", Room, name="room"),
    path("room/", Room, name="room"),
]
