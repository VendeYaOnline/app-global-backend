import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Program } from './program/entities/program.entity';
import { AppController } from './app.controller';
import { ProgramModule } from './program/program.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Program, User],
      synchronize: true, // desarrollo: ok. producción: NO.
    }),

    ProgramModule,
    UserModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
