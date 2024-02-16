import cors from "cors";

const options: cors.CorsOptions = {
  credentials: true,
};

export const CORS = cors(options);
