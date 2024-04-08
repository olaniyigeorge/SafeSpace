from django.http import JsonResponse
from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
import random
import time
import json
from .models import SpaceMember
from django.views.decorators.csrf import csrf_exempt


# token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)


def get_token(request):

    appId = "8b05e337ec8a40a69d31bea9982ad7a0"
    appCertificate = "6940e390ffed4a4fa926ee1c07e38bcc"
    channelName = request.GET.get('space_name')
    uid = random.randint(1,2000)
    expirationTime = 3600 * 24
    currentTimeStamp = time.time()
    privilegeExpiredTs =  currentTimeStamp + expirationTime
    role = 1

    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)

    return  JsonResponse({'token': token, 'uid': uid, }, safe=False)



def Lobby(request):

    return render(request, "space/lobby.html")


def Space(request):

    return render(request, "space/space.html")




@csrf_exempt
def createUser(request):
    data = json.loads(request.body)

    member, created = SpaceMember.objects.get_or_create(
        name=data['name'],
        uid=data['uid'],
        space_name=data['space_name']
    )
    return JsonResponse({"name": data['name']}, safe=False)