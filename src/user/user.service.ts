import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Program } from 'src/program/entities/program.entity';
import { BcryptUtil } from 'src/common/utils/bcrypt.util';
import { ConflictError } from 'src/common/errors/conflict.error';
import { NotFoundError } from 'src/common/errors/not-found.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,

    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
  ) {}

  async create(data: CreateUserDto) {
    const exists = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (exists) throw new ConflictError('Este correo ya está registrado.');

    const programs = await this.findByIds(data.programIds);
    if (!programs) throw new NotFoundError('El programa no existe.');

    const hashedPassword = await BcryptUtil.hash(data.password);

    const user = this.userRepo.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      programs: programs,
    });

    return this.userRepo.save(user);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const take = limit;
    const skip = (page - 1) * take;

    const [items, total] = await this.userRepo.findAndCount({
      relations: ['program'],
      take,
      skip,
      order: { id: 'DESC' },
    });

    return {
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / take),
      items,
    };
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email }, relations: ['programs'] });
  }

  async findByIds(ids: string[]): Promise<Program[]> {
    return await this.programRepo.find({
      where: {
        id: In(ids),
      },
    });
  }
}
