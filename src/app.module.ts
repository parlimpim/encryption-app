import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptModule } from './models/encrypt/encrypt.module';

@Module({
  imports: [EncryptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
