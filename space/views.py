from django.shortcuts import render

# Create your views here.




def Lobby(request):

    return render(request, "space/lobby.html")


def Room(request):

    return render(request, "space/room.html")