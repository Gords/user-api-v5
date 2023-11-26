import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import { sign } from 'jsonwebtoken'


export class UserController {
    private userRepository = AppDataSource.getRepository(User)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id

        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }

        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { name, email, password } = request.body;

        const user = Object.assign(new User(), {
            name,
            email,
            password,
        })

        return this.userRepository.save(user)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id;
        const { name, email, password } = request.body;
    
        let userToUpdate = await this.userRepository.findOne({
            where: { id }
        });
    
        if (!userToUpdate) {
            throw Error("user does not exist");
        }
    
        // Only update provided fields
        if (name !== undefined) userToUpdate.name = name;
        if (email !== undefined) userToUpdate.email = email;
        if (password !== undefined) userToUpdate.password = password;
    
        await this.userRepository.save(userToUpdate);
    
        return userToUpdate;
    }

    async login(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body

        const user = await this.userRepository.findOne({
            where: { email }
        })

        if (!user) {
            throw Error("Invalid email or password")
        }

        const isMatch = await User.comparePasswords(password, user.password)

        if (!isMatch) {
            throw Error("Invalid email or password")
        }

        // Generate a JWT token
        const accessToken = sign(
            { userId: user.id, email: user.email }, // Payload
            process.env.ACCESS_TOKEN_SECRET,        // Secret key
            { expiresIn: '1h' }                     // Token expiration
        );

        user.token = accessToken;
        await this.userRepository.save(user);

        return { accessToken, user: { id: user.id, name: user.name, email: user.email } };
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = request.params.id

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            throw Error("user does not exist")
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}