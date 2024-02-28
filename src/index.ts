import express from "express";
import { IPFSUtils } from "./IPFSUtils";
import { CORS } from "./cors";
import multer from "multer";

const app = express();
const port = 8001;

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

const upload = multer({ limits: { fileSize: FILE_SIZE_LIMIT } });

app.use(CORS);
// app.use(express.json())
// app.use(upload.array('files'));
app.use(express.static("public"));

app.post("/uploadFile", upload.single("file"), (req, res) => {
  console.log("REQ file:", req.file);

  if (!req.file) {
    res.status(400).send("Empty upload data");
    return;
  }
  IPFSUtils.uploadArrayBufferToIPFS({ buffer: req.file.buffer })
    .then((url) => {
      res.send({ hash: url });
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

app.post("/upload", express.json({ limit: "50mb" }), (req, res) => {
  console.log("REQ data:", req.body.data);
  if (!req.body) {
    res.status(400).send("Empty upload data");
    return;
  }

  IPFSUtils.uploadArrayBufferToIPFS({ buffer: req.body.data })
    .then((url) => {
      res.send({ hash: url });
    })
    .catch((e: any) => {
      console.error(e);
      res.send(e);
    });
});

app.get("/", (req, res) => res.send("IPFS Server"));

app.listen(port, () => {
  console.log("Start listening to port ", port);
});

module.exports = app;
