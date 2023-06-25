import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PostService } from './post.service';
import { PrismaService } from './services/prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { PhotosModule } from './photos/photos.module';
import { ConfigModule } from '@nestjs/config';
import { PhotosService } from './photos/photos.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PhotosModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthController, AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AppService,
    PostService,
    UsersService,
    PrismaService,
  ],
})
export class AppModule {}
