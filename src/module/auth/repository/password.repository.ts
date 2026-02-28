import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordRepository } from '../domain/interface/password.repository.interface';

@Injectable()
export class PasswordRepository implements IPasswordRepository {
  private readonly SALT_ROUNDS = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
