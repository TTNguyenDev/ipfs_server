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
    formData.append("file", buffer, "fuckyoubitch");

    return new Promise((resolve, reject) => {
      IPFSUtils.client
        .post(this._url, formData, {
          headers: { ...formData.getHeaders() },
          timeout: 60000,
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

  // public async ipfsPostFunction(folder, index, public_id) {
  //   try {
  //     let API_KEY = process.env.API_KEY;
  //     let API_SECRET = process.env.API_SECRET;
  //     const projectIdAndSecret = `${API_KEY}:${API_SECRET}`;
  //     const auth = `Basic ${Buffer.from(projectIdAndSecret).toString("base64")}`;
  //     let url = "https://ipfs.infura.io:5001/api/v0/add";
  //     let file = `file=@".${folder}/${index}}"`;
  //     let options = {
  //       headers: { authorization: auth, "Content-Type": "multipart/form-data" },
  //     };
  //     console.log(options);
  //     let response = await axios.post(url, file, options);
  //     response.on("response", function(response: any) {
  //       response = JSON.parse("[" + data.split("}\n{").join("},{") + "]");
  //       return data;
  //     });
  //     // console.log(response);
  //     // console.log(`*** adding file: ${file}... ***`);
  //     // let cid = await client.add(file);
  //     // console.log(`*** successful transaction: ${cid.cid.toString()} ***`);
  //     // figure out how to skip if already contained in list.
  //     // return cid.cid.toString();
  //   } catch (err) {
  //     logs.error("IPFS Failure: " + err);
  //     return "failed";
  //     // cidList.push(err);
  //   }
  //   //console.log(cidList)
  // }
  // public static uploadToIPFS({
  //   onSuccess,
  //   onError,
  // }: {
  //   onSuccess?: (url: string) => any;
  //   onError?: any;
  // }) {
  //   return new Promise((resolve, reject) => {
  //     // const reader = new FileReader();
  //     // reader.readAsArrayBuffer(file);
  //     //
  //     // reader.onloadend = () => {
  //     // @ts-ignore
  //     const result = Buffer.from("Tinguyen, IPFS Hello world");
  //     // @ts-ignore
  //     IPFSUtils.client
  //       .add(result)
  //       .then(async (res) => {
  //         const url = res.path;
  //         // console.log("IPFS response", JSON.stringify(res, null, 2))
  //
  //         if (onSuccess) await onSuccess(res.path);
  //
  //         resolve(url);
  //       })
  //       .catch(async (err) => {
  //         if (onError) await onError(err);
  //         reject();
  //       });
  //     // };
  //   });
  // }
  //
  // public static uploadFileToIPFS({
  //   file,
  //   onSuccess,
  //   onError,
  // }: {
  //   file: File;
  //   onSuccess?: (url: string) => any;
  //   onError?: any;
  // }) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsArrayBuffer(file);
  //
  //     reader.onloadend = () => {
  //       // @ts-ignore
  //       const result = Buffer.from(reader.result);
  //       // @ts-ignore
  //       IPFSUtils.client
  //         .add(result)
  //         .then(async (res) => {
  //           const url = res.path;
  //
  //           if (onSuccess) await onSuccess(url);
  //
  //           resolve(url);
  //         })
  //         .catch(async (err) => {
  //           if (onError) await onError(err);
  //           reject();
  //         });
  //     };
  //   });
  // }
  //
  // public static async getDataByCID(cid: string) {
  //   const stream = IPFSUtils.client.cat(cid);
  //   let data = "";
  //   // eslint-disable-next-line no-restricted-syntax
  //   for await (const chunk of stream) {
  //     data += new TextDecoder().decode(chunk);
  //   }
  //
  //   return data;
  // }
}
