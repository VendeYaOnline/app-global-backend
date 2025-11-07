import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Program } from 'src/program/entities/program.entity';
import { BcryptUtil } from 'src/common/utils/bcrypt.util';
import { ConflictError } from 'src/common/errors/conflict.error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UpdateUserDto } from './dto/update-user.dto';

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

    const [data, total] = await this.userRepo.findAndCount({
      relations: ['programs'],
      take,
      skip,
      order: { id: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['programs'],
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');

    if (data.programIds) {
      const programs = await this.programRepo.findBy({
        id: In(data.programIds),
      });

      user.programs = programs;
    }

    if (data.fullName) user.fullName = data.fullName;
    if (data.email) user.email = data.email;
    if (data.role) user.role = data.role;

    return this.userRepo.save(user);
  }

  async delete(id: string) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundError('Usuario no encontrado');

    return { message: 'Usuario eliminado correctamente' };
  }

  async addProgramToUser(userId: string, programId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['programs'],
    });

    if (!user) throw new NotFoundError('El usuario no existe.');

    const program = await this.programRepo.findOne({
      where: { id: programId },
    });

    if (!program) throw new NotFoundError('El programa no existe.');

    // ? ⛔ Evitar duplicados
    const alreadyAssigned = user.programs.some((p) => p.id === program.id);
    if (alreadyAssigned)
      throw new ConflictError('El usuario ya está inscrito en este programa.');

    // ? ✅ Agregar a la lista de programas del usuario
    user.programs.push(program);

    return this.userRepo.save(user);
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

  async findUser(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['programs'],
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        programs: { id: true, name: true },
      },
    });

    if (!user) throw new NotFoundError('Usuario no encontrado');
    return user;
  }
}
