import express from "express";
import { IPFSUtils } from "./IPFSUtils";
import { CORS } from "./cors";
import multer from "multer";

const app = express();
const port = 8000;

const FILE_SIZE_LIMIT = 4 * 1024 * 1024;

const upload = multer({limits: {fileSize: FILE_SIZE_LIMIT}});

app.use(CORS);
// app.use(express.json())
// app.use(upload.array('files'));
app.use(express.static("public"));

app.post("/uploadFile", upload.single("file"), (req, res) => {
  console.log("REQ", req.files);

  if (!req.file) {
    res.status(400).send("Empty upload data");
    return;
  }
  IPFSUtils.uploadArrayBufferToIPFS({
    buffer: req.file.buffer,
    onSuccess: (url: string) => {
      res.send({ hash: url });
    },
    onError: (e: any) => {
      console.error(e);
      res.send(e);
    },
  });
});

app.post("/upload", express.json({ limit: "50mb" }), (req, res) => {
  if (!req.body) {
    res.status(400).send("Empty upload data");
    return;
  }

  IPFSUtils.uploadArrayBufferToIPFS({
    buffer: req.body.data,
    onSuccess: (url: string) => {
      res.send({ hash: url });
    },
    onError: (e: any) => {
      console.error(e);
      res.send(e);
    },
  });
});

app.get("/", (req, res) => res.send("IPFS Server"));

app.listen(port, () => {
  console.log("Start listening to port ", port);
});

module.exports = app;
