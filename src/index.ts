import express from 'express';
import {IPFSUtils} from './IPFSUtils';
import {CORS} from './cors';
import multer from 'multer';

const app = express();
const port = 8000;

const upload = multer();

app.use(CORS);
// app.use(express.json())
// app.use(upload.array('files')); 
app.use(express.static('public'));

app.post("/uploadFile",
  upload.single('file'),
  (req, res) => {
    console.log("REQ", req.files)

    if (!req.file) return;
    IPFSUtils.uploadArrayBufferToIPFS({
      buffer: req.file.buffer,
      onSuccess: (url: string) => {
        res.send({"hash": url})
      },
      onError: (e: any) => {
        console.error(e);
        res.send(e);
      }
    })
  })

// app.get("/", (req, res) => {
//   console.log("calling");
//
//   IPFSUtils.uploadToIPFS({
//     onSuccess: (url: string)=>{
//       console.log("TEST url ", url);
//       
//       IPFSUtils.getDataByCID(url).then((res)=>{
//         console.log("GET DATA RESULT ", res);
//       });
//     }, 
//     onError: (err: any) => {
//       console.error(err);
//       
//     }
//   });
//   
//   res.send("hello")
// })

app.listen(port, () => {
  console.log("Start listening to port ", port);
})
