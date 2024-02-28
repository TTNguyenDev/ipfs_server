import axios, { AxiosInstance } from "axios";
import FormData from "form-data";

export class IPFSUtils {
  private static _client: AxiosInstance;
  private static _url: string;

  static get client(): AxiosInstance {
    if (this._client) return this._client;

    const projectId = process.env.PROJECT_ID ?? "2DM8tNDeWgAUDtf2ofkWyWPmMyr";
    const secretKey =
      process.env.SECRET_KEY ?? "06312b8c53ece054488e089047c04cdb";

    const auth =
      "Basic " + Buffer.from(projectId + ":" + secretKey).toString("base64");
    console.log(auth);

    this._client = axios.create({
      headers: {
        Authorization: auth,
      },
    });
    this._url = "https://ipfs.infura.io:5001/api/v0/add";

    return this._client;
  }

  public static uploadArrayBufferToIPFS({
    buffer,
  }: {
    buffer: Buffer;
  }): Promise<string> {
    const formData = new FormData();
    formData.append("file", buffer, "");

    return new Promise((resolve, reject) => {
      IPFSUtils.client
        .post(this._url, formData, {
          headers: { ...formData.getHeaders() },
          maxContentLength: Infinity,
        })
        .then((res) => {
          const url = res.data.Hash;
          console.log("REQ response", res.data);
          resolve(url);
        })
        .catch((err) => {
          console.log("REQ error", err);
          reject(err);
        });
    });
  }
}
