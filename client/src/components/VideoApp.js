import React, { useEffect, useRef } from 'react';
import { myScript } from '../videojs-script';
import 'video.js/dist/video-js.css';
import 'videojs-resolution-switcher'
import 'videojs-contrib-hls.js'; //auto attacjes hls.js handler
import '../App.css';

function VideoApp(props) {
    const videoRef = useRef();
    useEffect(() => {
        myScript()
      },[])

      useEffect(() => {
        // if (previousUrl.current === url) {
        //   return;
        // }
        console.log("changed")
        // videoRef.current.load()
        // var x = document.getElementById("video")
        // console.log(x)
        // x.src = "video2.m3u8"
        // x.load()
        // setTimeout(()=>x.load(),1000)
        videoRef.current.src = "video2.m3u8"
        videoRef.current.load()
        // videoRef.current.src[props.sources]
        // previousUrl.current = url;
      }, [props.sources]);
    return (
        <div>
            <video 
                id="video" 
                width="700" 
                height="350" 
                class="video-js vjs-big-play-centered" 
                // class="video-js vjs-default-skin"
                // class="video-js vjs-theme-city" //theme
                // key={props.sources[0]}
                ref={videoRef}
            >
            <source src={props.sources[0]?props.sources[0]:"video.m3u8"} type='application/x-mpegURL' label='Auto' res='144' />
            <source src={props.sources[1]?props.sources[1]:"video2.m3u8"} type='application/x-mpegURL' label='360p' res='360'/>
            <source src={props.sources[2]?props.sources[2]:"video.m3u8"} type='application/x-mpegURL' label='720p' res='720'/>
            </video>
        </div>
    );
}

export default VideoApp;