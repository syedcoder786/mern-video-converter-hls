import React, {useEffect} from "react";
import VideoJS from './VideoJS' // point to where the functional component is stored
import "videojs-resolution-switcher";
import 'videojs-contrib-hls.js'; // auto attaches hlsjs handler
import '../App.css' //for resolution switcher postition

function VideoApp2(props) {
  const playerRef = React.useRef(null);
  const videoJsOptions = { // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    plugins: {
        videoJsResolutionSwitcher: {
          default: 'low', // Default resolution [{Number}, 'low', 'high'], or add resolution
          dynamicLabel: true
        }
    },
    // userActions: {
    //   hotKeys: true
    // },
    
    sources: [
          {
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: 'video/mp4',
            label: 'auto',
            res: 144,
            // withCredentials: true
          },
          {
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            type: 'video/mp4',
            label: '360p',
            res: 360,
            // withCredentials: true
          },
          {
            src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            type: 'video/mp4',
            label: '720p',
            res: 720,
            // withCredentials: true
          }
    ],
  }

  useEffect(() => {
    if(props.sources){
        changePlayerOptions()
    }
  },[props.sources])

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('resolutionchange', function(){
        console.log('Source changed to %s', player.src())
    })

    player.on('dispose', () => {
      console.log('player will dispose');
    });

  };

  const changePlayerOptions = () => {
    // you can update the player through the Video.js player instance
    if (!playerRef.current) {
      return;
    }

    console.log("Changing sources")
    console.log(props.sources)
    // [update player through instance's api]
    playerRef.current.updateSrc([
        {
          src: props.sources[0],
          type: 'application/x-mpegURL',
          label: 'auto',
          res: 144,
          // withCredentials: true
        },
        {
          src: props.sources[2],
          type: 'application/x-mpegURL',
          label: '360p',
          res: 360,
          // withCredentials: true
        },
        {
          src: props.sources[1],
          type: 'application/x-mpegURL',
          label: '720p',
          res: 720,
          // withCredentials: true
        }
    ]);
    playerRef.current.load();
  };

  return (
    <>
      {/* <div>Rest of app here</div> */}
      <div style={{width:"70%"}}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
      {/* <div>Rest of app here</div> */}
    </>
  );
}

export default VideoApp2;