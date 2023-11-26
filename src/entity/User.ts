import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm"
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

@Entity()
export class User {

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({default:''})
    token: string;


    // Validate password
    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await compare(candidatePassword, hashedPassword);
    }
}
