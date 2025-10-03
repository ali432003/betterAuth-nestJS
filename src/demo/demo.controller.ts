import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { DemoService } from './demo.service';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudinaryUploader, Errorhandler, Roles } from 'src/lib/handler';
import { RolesGuard } from 'src/middlewares/roles.middleware';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}
  
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req, @Res() res) {
    return this.demoService.findAll(req, res);
  }
  
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Req() req, @Res() res, @Param('id') id: string) {
    return this.demoService.findOne(req, res, id);
  }
  
  @UseGuards(AuthGuard,RolesGuard)
  @Roles('admin','user')
  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  async create(@Req() req, @Res() res,@Body() createDemoDto: CreateDemoDto, @UploadedFile() file: Express.Multer.File) {
    try {
        return this.demoService.create(req, res, createDemoDto, file);
    } catch (error) {
      return Errorhandler(req, res, 500, 'Internal server error', error);
    }
  }
  
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(@Req() req, @Res() res, @Param('id') id: string, @Body() updateDemoDto: UpdateDemoDto, @UploadedFile() file: Express.Multer.File) {
    return this.demoService.update(req, res, id, updateDemoDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req, @Res() res, @Param('id') id: string) {
    return this.demoService.remove(req, res, id);
  }
}
