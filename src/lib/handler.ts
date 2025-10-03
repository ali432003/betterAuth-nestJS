
import { applyDecorators, SetMetadata, UseInterceptors } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";

export const SuccessHandler = (
    req: Request,
    res: Response,
    code: number,
    message: string,
    data?: any
) => {
    const payload: any = { message, status: true };

    if (data !== undefined) payload.data = data;
  
    return res.status(code).json(payload);
};

export const Errorhandler = (
    req: Request,
    res: Response,
    code: number,
    message: string,
    data?: any
) => {
    const payload: any = { message, status: false };

    if (data !== undefined) payload.data = data;
  
    return res.status(code).json(payload);
};

export const cloudinaryUploader = async (file: string | Express.Multer.File) => {
  try {
    if (!file) return;
    
    let uploadOptions: any = {
      resource_type: "auto",
    };

    if (typeof file !== 'string') {
      // Add original filename for buffer uploads
      uploadOptions.public_id = file.originalname.split('.')[0]; // Remove extension
    }

    let uploadResult;
    
    if (typeof file === 'string') {
      uploadResult = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });
    }
    
    return uploadResult;
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    throw error;
  }
};

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
