import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import 'dotenv/config'

const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT as any,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User],
});

export { AppDataSource }
