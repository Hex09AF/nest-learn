import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { v4 } from 'uuid';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async createPhoto({ file }: { file: Express.Multer.File }) {
    const storage = getStorage();
    const storageRef = ref(storage, 'photos/' + v4());

    const buffer = new Uint8Array(file.buffer);

    await uploadBytes(storageRef, buffer, {
      contentType: file.mimetype,
    });
    const url = await getDownloadURL(storageRef);

    return url;
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { data, where } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }
}
