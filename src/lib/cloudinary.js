import { Router } from 'express';
import cloudinary from 'cloudinary';
const cl = Router();
const cloud = cloudinary.v2

cloud.config({
    secure: true,
    cloud_name: 'dglqsxwon',
    api_key: '499835227724769',
    api_secret: 'qxdInVtC6A7MxSrdOO07ovwpGHo',
  });  
  
console.log(cloud.config());

export default cl;