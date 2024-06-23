import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptModule } from './models/encrypt/encrypt.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EncryptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
