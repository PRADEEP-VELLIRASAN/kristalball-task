import { User } from '../models/userModel';
import { sign } from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { compare } from 'bcrypt';

export class AuthService {
    private userModel: User;

    constructor() {
        this.userModel = new User();
    }

    async validateUserCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.userModel.findByEmail(email);
        if (user && await compare(password, user.password)) {
            return user;
        }
        return null;
    }

    generateToken(user: User): string {
        const payload = { id: user.id, email: user.email };
        return sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
    }
}