const APP_ID = "8b05e337ec8a40a69d31bea9982ad7a0"
const CHANNEL = sessionStorage.getItem('space')
const TOKEN = sessionStorage.getItem('token')
let UID = Number(sessionStorage.getItem('UID'))
const name = sessionStorage.getItem('name')
const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})


let localTracks = []
let remoteUsers = {}




let joinAndDisplayLocalStream = async () => {
    document.getElementById('space-name').innerText = CHANNEL
    // document.getElementById('name').innerText = CHANNEL

    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    try{
        await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.log(error)
        window.open("/", "_self")
    }

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let member = await createMember()


    let player = `<div id="user-container-${UID}" class=" relative w-full flex-1 max-h-full min-h-[400px] h-[400px] flex-grow justify-center items-center  border rounded-md ">
                    <div class="absolute top-2 left-2 z-40 p-2 rounded-md bg-purple-600 bg-opacity-30 text-2xl border font-bold text-white "> <span class=""> ${NAME} </span></div> 
                    <div id="user-${UID}" class="w-full rounded-md border max-h-full  h-[400px]"> </div>
                </div> `

    document.getElementById('video-streams').insertAdjacentHTML("beforeend", player)

    localTracks[1].play(`user-${UID}`)



    await client.publish([localTracks[0], localTracks[1]])

}



let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
        await client.subscribe(user, mediaType)

        if (mediaType === 'video') {
            let player = document.getElementById(`user-container-${user.uid}`)
            if (player != null) {
                player.remove()
            }
            player = `<div id="user-container-${user.uid}" class="w-full flex-basis-[500px] flex-1 max-h-full min-h-[350px] flex-grow justify-center items-center  border border-red-500 h-full p-2 rounded-md ">
                    <div class=" bg-purple-600 w-full text-white"> <span class="user-name"> ${user.uuid} </span></div> 
                    <div id="user-${user.uid}" class="w-full border min-h-[350px] h-[300px]"> </div>
                </div> `

            document.getElementById('video-streams').insertAdjacentHTML("beforeend", player)


            user.videoTrack.play(`user-${user.uid}`)

        }

        if (mediaType === "audio") {

            user.audioTrack.play()
        }
}

let handleUserLeft = async (user) => {

    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}


let leaveAndremoveLocalStream = async (user) => {

    for (let i= 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/', '_self')
}


let toggleCamera = async(e) => {

    if (localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = '#ccc'
    }

}

let toggleMic = async(e) => {

    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = '#ccc'
    }

}


let createMember = async () => {
    let response = await fetch('/create_member/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({'name': NAME, 'space_name': CHANNEL, 'uid': UID})
    })
    let member = await response.json()
    return member
}


joinAndDisplayLocalStream()


document.getElementById('leave-btn').addEventListener('click', leaveAndremoveLocalStream)
document.getElementById('cam-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)









