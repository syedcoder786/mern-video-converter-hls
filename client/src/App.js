import React, { useState } from 'react'
import VideoApp2 from './components/VideoApp2';
import VideoUpload from './components/VideoUpload';

function App() {
  const [sources, setSources] = useState(null)
  const onSources = (sources) => {
    // console.log("setting sources:")
    setSources([...sources])
  }
  return (
    <div className="App">
      <div>
      <center>
        <h3 id="test">VideoOnDemand In MERN</h3>
        <VideoUpload changeSources={onSources}/>
        <VideoApp2 sources={sources}/>
      </center>
      </div>
    </div>
  );
}

export default App;
