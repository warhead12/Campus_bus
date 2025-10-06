import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
   try {
      if(!localFilePath){
         console.log("local file path did not match")
         return null
      }

      // upload file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto"})
      // file uploaded succesfully

      // console.log("file is uploaded on cloudinary",response.url);

      fs.unlinkSync(localFilePath)
      return response;
   } catch (error) {
      fs.unlink(localFilePath)
      // remove the locally saved temp files as the upload operation got failed
      return null;
   }
}


const deleteFromCloudinary = async (url) => {
   // Extract public_id from the URL
   const publicId = url.split('/').pop().split('.')[0]; // This assumes the URL ends with the public ID and file extension
 
   // Call Cloudinary's API to delete the file
   await cloudinary.uploader.destroy(publicId, (error, result) => {
     if (error) {
       throw new ApiError(500, "Error deleting previous avatar from Cloudinary");
     }
   });
 };
 

export {
   uploadOnCloudinary,
   deleteFromCloudinary
}