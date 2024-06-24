import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptModule } from './models/encrypt/encrypt.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EncryptModule],
})
export class AppModule {}
