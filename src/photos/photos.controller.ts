import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { multerOptions } from 'src/libs/multer';
import { v4 } from 'uuid';

@Controller('photos')
export class PhotosController {
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
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const storage = getStorage();
    const storageRef = ref(storage, 'photos/' + v4());

    const buffer = new Uint8Array(file.buffer);

    await uploadBytes(storageRef, buffer, {
      contentType: file.mimetype,
    });
    const url = await getDownloadURL(storageRef);

    return url;
  }
}
