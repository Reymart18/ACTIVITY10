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

  // ---------------------------
  // Register user (attendee or organizer)
  // ---------------------------
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
    const user = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true, // default active
    });
    return this.usersRepo.save(user);
  }

  // ---------------------------
  // Login
  // ---------------------------
  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // Check if account is active (only organizers/admin)
    if ((user.role === 'organizer' || user.role === 'admin') && !user.isActive) {
      return { error: 'Account is deactivated. Please contact admin.' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'SECRET_KEY', // move to env variable in production
      { expiresIn: '1d' },
    );

    return { user, token };
  }

  // ---------------------------
  // Admin: Fetch all organizers
  // ---------------------------
  async getOrganizers() {
    return this.usersRepo.find({ where: { role: 'organizer' } });
  }

  // ---------------------------
  // Admin: Activate/Deactivate organizer
  // ---------------------------
  async setOrganizerStatus(id: number, isActive: boolean) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new Error('Organizer not found');
    if (user.role !== 'organizer') throw new Error('User is not an organizer');

    user.isActive = isActive;
    return this.usersRepo.save(user);
  }
}
