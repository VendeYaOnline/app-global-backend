import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class AppController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'OK ✅ Conectado a la base de datos' };
    } catch (err) {
      return { status: 'ERROR ❌', message: err.message };
    }
  }
}
