







from django.urls import path
from space.views import *

urlpatterns = [


    path("", Lobby, name="lobby"),
    #path("room/<uid:id>", Room, name="room"),
    path("space/", Space, name="space"),
    path("get_token", get_token, name="get_token"),
    path("create_member/", createUser, name="create_user")
]
