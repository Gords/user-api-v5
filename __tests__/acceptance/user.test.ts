import { AppDataSource } from "../../src/data-source";
import * as request from "supertest";
import app from "../../src/app";
import 'dotenv/config'

let connection, server;

const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    age: 20
}

beforeEach(async () => {
    connection = await AppDataSource.initialize()
    await connection.synchronize(true)
    server = app.listen(process.env.PORT || 3000)
})

afterEach(() => {
    connection.close()
    server.close()
})

it('should be no users initially', async() => {
    const response = await request(app).get('/users')
    console.log(response.body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual([])
})

it('should create a new user', async () => {
    const response = await request(app).post('/users').send(testUser)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({...testUser, id: 1})
})

it('Should not create a user if no firstName is provided', async () => {
    const response = await request(app).post('/users').send({lastName: 'Doe', age: 20})
    expect(response.statusCode).toBe(400)
    expect(response.body.errors).not.toBeNull()
    expect(response.body.errors.length).toBe(1)
    expect(response.body.errors[0]).toEqual({
        location: 'body',
        msg: 'Invalid value',
        path: 'firstName',
        type: 'field',
    })
    console.log(response.body.errors)
})

it('Should not create a user if age is less than 0', async () => {
    const response = await request(app).post('/users').send({firstname: 'Joe', lastName: 'Doe', age: -1})
    expect(response.statusCode).toBe(400)
    expect(response.body.errors).not.toBeNull()
    expect(response.body.errors.length).toBe(2)
    expect(response.body.errors[0]).toEqual({
        location: 'body',
        msg: 'age must be a positive integer',
        param: 'age',
        value: -1,
    })
    console.log(response.body.errors)
})