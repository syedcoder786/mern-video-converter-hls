import React, { useState } from 'react';
import axios from 'axios';

function VideoUpload(props) {
    const [file, setFile] = useState({myVideo:null})
    const [fileName, setFileName] = useState("Choose File")
    const [loading, setLoading] = useState("")

    const onChange = (e) => {
        console.log("changed")
        setFile({ myVideo:e.target.files[0] })
        setFileName(`${e.target.files[0].name.substring(0,20)}...`)
        console.log(e.target.files[0])
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(file.myVideo){
            console.log("uploading")
            setLoading("Uploading...")
            setFile({myVideo:null})
            setFileName("Choose File")
            e.target.reset()
            const formData = new FormData();
            formData.append('myVideo', file.myVideo);

            //send image to server
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/upload',
                data: formData,
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            }).then(item => {
                console.log(item.data);
                props.changeSources(item.data)
                setLoading("")
            }
            ).catch(err => {
                console.log(err)
                setLoading("Error")
            })
        }
    }

    return (
        <div>
            <p style={{color:"green"}}><b>{loading}</b></p>
            <form style={{width: "70%"}} onSubmit={onSubmit}>
                <div class="input-group">
                    <div class="custom-file">
                        <input 
                            type="file" 
                            class="custom-file-input" 
                            id="inputGroupFile01"
                            aria-describedby="inputGroupFileAddon01"
                            onChange={onChange}
                            accept=".mp4,|video/*"
                        />
                        <label class="custom-file-label" for="inputGroupFile01" style={{textAlign:"left"}}>{fileName}</label>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style={{margin:"8px"}}>Submit</button>
            </form>
        </div>
    );
}

export default VideoUpload;