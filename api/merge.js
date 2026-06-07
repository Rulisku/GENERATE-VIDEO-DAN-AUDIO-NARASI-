```js id="j7l2xs"
const multer = require("multer");

const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath =
require("ffmpeg-static");

const fs =
require("fs");

const path =
require("path");

ffmpeg.setFfmpegPath(
  ffmpegPath
);

const upload =
multer({
  dest:"/tmp"
});

module.exports = async (req,res)=>{

  // hanya POST
  if(req.method !== "POST"){

    return res
    .status(405)
    .send("Method not allowed");
  }

  upload.fields([
    { name:"video" },
    { name:"audio" }
  ])(req,res,async(err)=>{

    if(err){

      return res
      .status(500)
      .send(err.message);
    }

    try{

      const video =
      req.files.video[0];

      const audio =
      req.files.audio[0];

      const output =
      path.join(
        "/tmp",
        "output.mp4"
      );

      ffmpeg()

      .input(video.path)

      .input(audio.path)

      .outputOptions([
        "-c:v copy",
        "-c:a aac",
        "-shortest"
      ])

      .save(output)

      .on("end",()=>{

        res.download(
          output,
          "hasil-video.mp4",
          ()=>{

            // cleanup
            fs.unlinkSync(video.path);
            fs.unlinkSync(audio.path);
            fs.unlinkSync(output);
          }
        );
      })

      .on("error",(err)=>{

        console.log(err);

        res
        .status(500)
        .send(err.message);
      });

    }
    catch(e){

      res
      .status(500)
      .send(e.message);
    }
  });
};
```
