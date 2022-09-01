import { create as ipfsClient, IPFSHTTPClient } from "ipfs-http-client";

export class IPFSUtils {
  private static _client: IPFSHTTPClient;

  static get client(): IPFSHTTPClient {
    if (this._client) return this._client;

    const projectId = process.env.PROJECT_ID ?? "2DM8tNDeWgAUDtf2ofkWyWPmMyr";
    const secretKey =
      process.env.SECRET_KEY ?? "06312b8c53ece054488e089047c04cdb";

    const auth =
      "Basic " + Buffer.from(projectId + ":" + secretKey).toString("base64");

    this._client = ipfsClient({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    return this._client;
  }

  public static uploadArrayBufferToIPFS({
    buffer,
    onSuccess,
    onError,
  }: {
    buffer: Buffer;
    onSuccess?: (url: string) => any;
    onError?: any;
  }) {
    return new Promise((resolve, reject) => {
      IPFSUtils.client
        .add(buffer)
        .then(async (res) => {
          const url = res.path;
          // console.log("IPFS response", JSON.stringify(res, null, 2))
          if (onSuccess) await onSuccess(url);
          resolve(url);
        })
        .catch(async (err) => {
          if (onError) await onError(err);
          reject();
        });
    });
  }

  public static uploadToIPFS({
    onSuccess,
    onError,
  }: {
    onSuccess?: (url: string) => any;
    onError?: any;
  }) {
    return new Promise((resolve, reject) => {
      // const reader = new FileReader();
      // reader.readAsArrayBuffer(file);
      //
      // reader.onloadend = () => {
      // @ts-ignore
      const result = Buffer.from("Tinguyen, IPFS Hello world");
      // @ts-ignore
      IPFSUtils.client
        .add(result)
        .then(async (res) => {
          const url = res.path;
          // console.log("IPFS response", JSON.stringify(res, null, 2))

          if (onSuccess) await onSuccess(res.path);

          resolve(url);
        })
        .catch(async (err) => {
          if (onError) await onError(err);
          reject();
        });
      // };
    });
  }

  public static uploadFileToIPFS({
    file,
    onSuccess,
    onError,
  }: {
    file: File;
    onSuccess?: (url: string) => any;
    onError?: any;
  }) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onloadend = () => {
        // @ts-ignore
        const result = Buffer.from(reader.result);
        // @ts-ignore
        IPFSUtils.client
          .add(result)
          .then(async (res) => {
            const url = res.path;

            if (onSuccess) await onSuccess(url);

            resolve(url);
          })
          .catch(async (err) => {
            if (onError) await onError(err);
            reject();
          });
      };
    });
  }

  public static async getDataByCID(cid: string) {
    const stream = IPFSUtils.client.cat(cid);
    let data = "";
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
      data += new TextDecoder().decode(chunk);
    }

    return data;
  }
}
