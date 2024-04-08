const APP_ID = "8b05e337ec8a40a69d31bea9982ad7a0"
const CHANNEL = "main-space"
const TOKEN = "007eJxTYHDu/xp629gvb+0tS215jp5Ls2ZP/7SM8ef+r994VWY/b6lXYLBIMjBNNTY2T022SDQxSDSzTDE2TEpNtLS0MEpMMU80eLRYOK0hkJFBvLuXkZEBAkF8LobcxMw83eKCxORUBgYAihwjAg=="

console.log("Main js connected")

let UUID;

const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})


let localTracks = []
let remoteUsers = {}


let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)


    UUID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div id="user-container-${UUID}" class="w-full flex-basis-[500px] flex-1 max-h-full min-h-[350px] flex-grow justify-center items-center  border h-full p-2 rounded-md ">
                    <div class=" bg-purple-600 w-full text-white"> <span class="user-name"> ${UUID} </span></div> 
                    <div id="user-${UUID}" class="w-full border min-h-[350px] h-[300px]"> </div>
                </div> `

    document.getElementById('video-streams').insertAdjacentHTML("beforeend", player)

    localTracks[1].play(`user-${UUID}`)



    await client.publish([localTracks[0], localTracks[1]])

}



let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uuid] = user
        await client.subscribe(user, mediaType)

        if (mediaType === 'video') {
            let player = document.getElementById(`user-container-${user.uuid}`)
            if (player != null) {
                player.remove()
            }
            player = `<div id="user-container-${user.uuid}" class="w-full flex-basis-[500px] flex-1 max-h-full min-h-[350px] flex-grow justify-center items-center  border h-full p-2 rounded-md ">
                    <div class=" bg-purple-600 w-full text-white"> <span class="user-name"> ${user.uuid} </span></div> 
                    <div id="user-${user.uuid}" class="w-full border min-h-[350px] h-[300px]"> </div>
                </div> `

            document.getElementById('video-streams').insertAdjacentHTML("beforeend", player)


            user.videoTrack.play(`user-${user.uuid}`)

        }

        if (mediaType === "audio") {

            user.audioTrack.play()
        }
}

let handleUserLeft = async (user) => {

    delete remoteUsers[user.uuid]
    document.getElementById(`user-container-${user.uuid}`).remove()
}


joinAndDisplayLocalStream()











