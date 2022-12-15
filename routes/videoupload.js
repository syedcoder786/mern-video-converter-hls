const express = require('express');
const router = express.Router();
const multer = require('multer');
const path=require('path');
// const Image = require('../models/Image');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('./ffmpeg/ffmpeg.exe'); // path from server.js
// ffmpeg.setFfprobePath('C:/ffmpeg/bin') 

// // open input stream
// var infs = new ffmpeg


//firebase
const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// change the path of json file
const serviceAccount = require('../videoondemand-mern-firebase-adminsdk-yved5-2841ca01f7.json');
// const { extname } = require('path');

const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

const storageRef = admin.storage().bucket(`gs://videoondemand-mern.appspot.com`);

async function uploadFile(path, filename) {

    // Upload the File
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `/videos/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });


    return storage[0].metadata.mediaLink;
}

// set storage engine
const storage=multer.diskStorage({
    destination:'',
    filename:(req,file,cb)=>{
        let fn = file.originalname.replace(/\s/g, '').split(path.extname(file.originalname))[0] + '-' + Date.now() + '-uuid-' + uuidv4() +path.extname(file.originalname);
        cb(null, fn);
    }
});


//init upload
const upload=multer({
    storage:storage,
    limits:{fileSize:1000000000000},
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    }
}).single('myVideo');

//Check file type
function checkFileType(file,cb){
    //allowed ext
    const filetypes=/mp4/;
    //check extname
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype=filetypes.test(file.mimetype);
    if(extname && mimetype){
        return cb(null,true);
    }
    else{
        cb('Mp4 only');
    }
}

//post image
router.post('/',(req,res)=>{
    // console.log(req.body)
    let filename=""
    upload(req,res,(err)=>{
        if(err) {
            console.log(err)
            return res.status(400).json({ msg:err })
        }
        else if(!req.file) {
            console.log('No file was there')
        }else{
            filename=req.file.filename
            filename = path.parse(filename).name;   
            //do compression work here
            // open input stream
            var infs = new ffmpeg
            infs.addInput(req.file.filename).outputOptions([
                '-map 0:0',
                '-map 0:1',
                '-map 0:0',
                '-map 0:1',
                '-s:v:0 1280x720', //720p
                '-c:v:0 libx264',
                '-b:v:0 3M', //check bandwidth
                '-s:v:1 640x360',  //360p
                '-c:v:1 libx264',
                '-b:v:1 1M',
                `-master_pl_name ${filename}.m3u8`,
                '-f hls',
                // '-max_muxing_queue_size 1024',
                '-hls_time 2',
                '-hls_playlist_type vod',
                // '-hls_flags independent_segments',
                '-hls_segment_type mpegts',
                // '-hls_list_size 0',
                // '-use_localtime_mkdir 1',
                // '-hls_base_url', `gs://videoondemand-mern.appspot.com//videos/`,
                // '-hls_segment_filename', `${filename}_stream_%v/data%02d.ts`, 
            ])
            .outputOption('-var_stream_map', 'v:0,a:0 v:1,a:1')
            .output(`./videos/${filename}_stream_%v.m3u8`)
                .on('start', function (commandLine) {
                    // console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('error', function (err, stdout, stderr) {
                    console.log('An error occurred: ' + err.message, err, stderr);
                })
                .on('progress', function (progress) {
                    // console.log('Processing: ' + progress.persent + '% done')
                })
                .on('end', function (err, stdout, stderr) {
                    // console.log('Finished processing!' /*, err, stdout, stderr*/)

                    let data=""
                    var files = fs.readdirSync(`./videos`);
                    // console.log(files);
                    let output = []
                    // output.push()
                    // let length = files.length
                    var x=0,y=0;
                    files.forEach(function (file, index) {
                        if(file.includes(filename)){
                            x+=1
                        }
                    })
                    files.forEach(function (file, index) {
                        if(file.includes(filename)){
                        var extname = path.extname(file);  
                        // console.log(extname);
                        if(extname === ".m3u8"){   // writting only .m3u8 files
                            output.push(`https://storage.googleapis.com/storage/v1/b/videoondemand-mern.appspot.com/o/%2Fvideos%2F${file}?alt=media`)
                            fs.readFileSync(`./videos/${file}`, {encoding:'utf8', flag:'r'})
                            .split(/\r?\n/)
                            .forEach(function(line){
                                var lineextname = path.extname(line)
                                // console.log("lineext:"+lineextname);
                                if(lineextname === ".m3u8" || lineextname === ".ts"){
                                    data += `https://storage.googleapis.com/storage/v1/b/videoondemand-mern.appspot.com/o/%2Fvideos%2F${line}?alt=media`+"\n"
                                }
                                else{
                                    data += line + "\n";
                                }
                            })
                                fs.writeFile(`./videos/${file}`, data, (err) => {
                                    if (err)
                                    console.log(err);
                                    else {
                                    // console.log("File written successfully\n");
                                    }
                                })
                            data=""
                        }
                        // console.log(file);
                        (async() => {
                            const url = await uploadFile(`./videos/${file}`, `${file}`);
                            // console.log(url);
                        })().then(()=>{
                            y += 1;
                            if(y===x){
                                // console.log(output)
                                res.json(output)
                            }
                        });
                        }
                    })
                    fs.readdir("./videos", (err, files) => {
                        if (err) throw err;
                      
                        for (const file of files) {
                            if(file.includes(filename)){
                                // console.log("deleted:"+file)
                                fs.unlink(path.join("./videos", file), err => {
                                    if (err) throw err;
                                });
                            }
                        }
                      });
                    fs.unlink(`${filename}.mp4`,function(err){
                        if(err) return console.log(err);
                        // console.log('file deleted successfully');
                    });  
                    // console.log(output)
                    // res.json(output)
                })
                .run()
        }
    })

})

module.exports = router;