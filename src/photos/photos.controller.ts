import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Post as PostModel } from '@prisma/client';
import { multerOptions } from 'src/libs/multer';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadSingle(@Body() body, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    console.log(body);
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('photos[]', 10, multerOptions))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
  }

  @Post('upload-firebase')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadSingleFirebase(
    @Request() req,
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = await this.photosService.createPhoto({ file });

    this.photosService.createPost({
      title: body.title,
      content: body.content,
      url,
      author: {
        connect: { id: req.user.userId },
      },
    });
    return '';
  }

  @Get()
  async getPosts(): Promise<PostModel[]> {
    return this.photosService.posts({});
  }

  @Get(':id')
  async getDetailPost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostModel> {
    return this.photosService.post({
      id,
    });
  }

  @Patch(':id')
  async updatePost(
    @Body() body,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostModel> {
    return this.photosService.updatePost({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
  }
}
