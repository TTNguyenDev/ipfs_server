import cors from 'cors';

const options: cors.CorsOptions = {
  origin: ["http://localhost:3000", "https://rep-run-ui.vercel.app/"]
}

export const CORS = cors(options);
