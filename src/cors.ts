import cors from "cors";

const options: cors.CorsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      /^http:\/\/localhost(:\d+)?$/,
      /^https:\/\/(.+\.)?rep\.run$/,
    ];
    // Check if the origin is one of the allowed origins
    if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export const CORS = cors(options);
