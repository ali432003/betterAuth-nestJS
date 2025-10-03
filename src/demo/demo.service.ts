import { Injectable } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import prisma from '../lib/prisma'
import { cloudinaryUploader, SuccessHandler, Errorhandler } from 'src/lib/handler';
import type { Request, Response } from 'express';

@Injectable()
export class DemoService {
  async create(req:Request, res:Response, createDemoDto: CreateDemoDto, file: Express.Multer.File) {
    try {
      const { title, description } = createDemoDto;
      const cloudinaryResponse = await cloudinaryUploader(file) as any;
      const { secure_url } = cloudinaryResponse;
      const demo = await prisma.demo_Resource.create({
        data: { title, description, image: secure_url },
      });
      return SuccessHandler(req,res,201,'Demo created successfully',demo);
        
    } catch (error) {
      return Errorhandler(req,res,500,'Internal server error',error);
    }
  }

  async findAll(req:Request, res:Response) {
    try {
      const demos = await prisma.demo_Resource.findMany();
      return SuccessHandler(req,res,200,'Demos fetched successfully',demos);
    } catch (error) {
      return Errorhandler(req,res,500,'Internal server error',error);
    }
  }

  async findOne(req:Request, res:Response, id: string) {
    try {
    const demo = await prisma.demo_Resource.findUnique({
      where: { id },
    });
    return SuccessHandler(req,res,200,'Demo fetched successfully',demo);
    } catch (error) {
      throw Errorhandler(req,res,500,'Internal server error',error);
    }
  }

  async update(req: Request, res: Response, id: string, updateDemoDto: UpdateDemoDto, file?: Express.Multer.File) {
    try {
      const { title, description } = updateDemoDto;
      const updateData: any = { title, description };
      
      if (file) {
        const cloudinaryResponse = await cloudinaryUploader(file) as any;
        updateData.image = cloudinaryResponse.secure_url;
      }
      
      const demo = await prisma.demo_Resource.update({
        where: { id },
        data: updateData,
      });
      
      return SuccessHandler(req, res, 200, 'Demo updated successfully', demo);
    } catch (error) {
      return Errorhandler(req, res, 500, 'Internal server error', error);
    }
  }

  async remove(req:Request, res:Response, id: string) {
    try {
    const demo = await prisma.demo_Resource.delete({
      where: { id },
    });
    return SuccessHandler(req,res,200,'Demo deleted successfully');
    } catch (error) {
      throw Errorhandler(req,res,500,'Internal server error',error);
    }
  }
}
