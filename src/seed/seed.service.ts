import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from '../program/entities/program.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/user/entities/user-role.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async seed() {
    console.log('🌱 Ejecutando Seed...');

    await this.userRepo.createQueryBuilder().delete().execute();
    await this.programRepo.createQueryBuilder().delete().execute();

    const programs = await this.programRepo.save([
      {
        name: 'Desarrollo Web',
        description:
          'Aprende a crear aplicaciones web modernas con React, Node.js y MongoDB',
        startDate: new Date(),
        status: 'easy',
      },
      {
        name: 'Data Science con Python',
        description:
          'Domina el análisis de datos y machine learning con Python',
        startDate: new Date(),
        status: 'mid',
      },
      {
        name: 'Diseño UX/UI',
        description: 'Crea experiencias digitales excepcionales',
        startDate: new Date(),
        status: 'easy',
      },
      {
        name: 'Marketing Digital',
        description: 'Estrategias de marketing en la era digital',
        startDate: new Date(),
        status: 'mid',
      },
      {
        name: 'DevOps y Cloud Computing',
        description: 'Infraestructura moderna y despliegue continuo',
        startDate: new Date(),
        status: 'high',
      },
      {
        name: 'Inteligencia Artificial',
        description: 'Fundamentos y aplicaciones de IA moderna',
        startDate: new Date(),
        status: 'high',
      },
    ]);
    const password = await bcrypt.hash('12345678', 10);

    await this.userRepo.save([
      {
        fullName: 'Yosip Parrado',
        email: 'yosip@example.com',
        password,
        role: UserRole.ADMIN,
        programs: [programs[0]],
      },
      {
        fullName: 'Andres Prueba',
        email: 'estudiante@lms.com',
        password,
        role: UserRole.STUDENT,
        programs: [programs[1]],
      },
    ]);

    return '✅ Seed terminado con éxito';
  }
}
