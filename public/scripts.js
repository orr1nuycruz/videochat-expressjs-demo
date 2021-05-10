const socket = io("/")
const videoGrid = document.getElementById("gridview-video")
const mainVideo = document.getElementById("main-video")
const allPage = document.getElementById("allpage")
const firstDivVideo = document.createElement("div")
firstDivVideo.className = "firstOuter-video"

const myPeer = new Peer(undefined, {
    host: "/",
    port: 3001
})

const myVideo = document.createElement("video")
myVideo.muted = true;
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    // addVideoStream(myVideo, stream);
    myVideo.srcObject = stream;
    myVideo.addEventListener("loadedmetadata", () => {
        myVideo.play()
    })
    mainVideo.append(firstDivVideo)
    firstDivVideo.append(myVideo)

    myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video")
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream)
            // video.srcObject = stream;
            // video.addEventListener("loadedmetadata", () => {
            //     video.play()
            // })
            // videoGrid.append(firstDivVideo)
            // firstDivVideo.append(video)
            console.log(JSON.stringify(peers))
        });
    });
    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream)
        // console.log(userId)
    });
});

myPeer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id)
})


socket.on("user-disconnected", (userId) => {
    if (peers[userId])
        peers[userId].closer();
})



function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video")
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream)
    })
    call.on("close", () => {
        video.remove();
    })
    peers[userId] = call;
}

function addVideoStream(video, stream) {
    const divVideo = document.createElement("div")
    divVideo.className = "outer-video"
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    // videoGrid.append(divVideo)
    // divVideo.append(video)
    videoGrid.append(video)
}

function addExtraVideoStream(video, stream) {
    const divVideo = document.createElement("div")
    divVideo.className = "outer-video"
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play()
    })
    // videoGrid.append(divVideo)
    // divVideo.append(video)
    videoGrid.append(video)
}
