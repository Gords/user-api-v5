import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

interface RequestWithUser extends Request {
    user?: User;
    token?: string;
}

const authenticateToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Token not found');
        }

        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: {
                id: decoded.userId,
                token: token
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

export default authenticateToken;

