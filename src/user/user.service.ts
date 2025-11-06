import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    const program = await this.programRepo.findOne({
      where: { id: data.programId },
    });
    if (!program) throw new NotFoundError('El programa no existe.');

    const hashedPassword = await BcryptUtil.hash(data.password);

    const user = this.userRepo.create({
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      program,
    });

    return this.userRepo.save(user);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
