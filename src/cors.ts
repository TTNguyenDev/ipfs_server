import cors from 'cors';

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000"]
}

export const CORS = cors(options);
