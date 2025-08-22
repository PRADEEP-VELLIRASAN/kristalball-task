import { Request, Response } from 'express';
import AuthService from '../services/authService';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const token = await this.authService.validateUser(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const userData = req.body;
            const newUser = await this.authService.createUser(userData);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export default AuthController;