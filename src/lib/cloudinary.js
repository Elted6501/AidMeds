import { Router } from 'express';

import { v2 as cloud } from 'cloudinary';

const cl = Router();

cloud.config({
  secure: true,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

export default cl;