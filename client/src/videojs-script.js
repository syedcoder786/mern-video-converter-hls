import videojs from "video.js";

export function myScript(){
    // const videoContainerTag = document.getElementById("video")
    // const player = window.videojs(videoContainerTag)
    const player = videojs("video",{
        autoplay: 'muted',
        controls: true,
        loop: true, // will play video after it is over.
        // fluid: true, //will set height and width according to device
        // aspectRatio: '4:3', //will set height and width according to device
        // playbackRates: [0.25, 0.5, 1, 1.5, 2], // playback-rates
        // textTrackSettings: false,
        responsive:true,
        plugins: {
            videoJsResolutionSwitcher: {
            default: 'low',
            dynamicLabel: true,
            // customSourcePicker: "myCustomSrcPicker",
            }
        },
        // sources:[
        //     {
        //     src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        //     type: "video/mp4",
        //     label: 'auto',
        //     res: 144
        // },
        // {
        //     src: "newvideo.m3u8",
        //     type:"application/x-mpegURL",
        //     label: '360p',
        //     res: 360
        // },
        // {
        //     src: 'https://vjs.zencdn.net/v/oceans.mp4',
        //     type: 'video/mp4',
        //     label: '720p',
        //     res: 720
        //   },
        // ],
    })

    player.ready(() => {
        
    })

}