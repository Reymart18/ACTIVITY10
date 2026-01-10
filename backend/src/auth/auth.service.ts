import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: 'attendee' | 'organizer',
  ) {
    if (!['attendee', 'organizer'].includes(role)) {
      throw new Error('Invalid role. Only attendee or organizer allowed.');
    }

    const existingUser = await this.usersRepo.findOne({ where: { email } });
    if (existingUser) throw new Error('Email already registered.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ name, email, password: hashedPassword, role });
    return this.usersRepo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'SECRET_KEY',
      { expiresIn: '1d' }
    );

    return { user, token };
  }
}
