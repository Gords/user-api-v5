import { AppDataSource } from "../../src/data-source";
import { User } from "../../src/entity/User";
import * as request from "supertest";
import app from "../../src/app";
import 'dotenv/config'

let connection, server, authToken, userId;


const initialUser = {
    name: 'Jim Doe',
    email: 'jim.doe@example.com',
    password: 'password123'
}

const testUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123'
}

beforeAll(async () => {
    connection = await AppDataSource.initialize()
    await connection.synchronize(true)

    // Create a new user
    const createUserResponse = await request(app).post('/users').send(initialUser);
    userId = createUserResponse.body.id;
    expect(createUserResponse.statusCode).toBe(200);

    // Log in to obtain a token
    const loginResponse = await request(app).post('/users/login').send({
        email: initialUser.email,
        password: initialUser.password
    });
    authToken = loginResponse.body.accessToken;
    expect(loginResponse.statusCode).toBe(200);

    server = app.listen(process.env.PORT || 3000)
})

afterAll(async() => {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();

    // Close the database connection
    await connection.close();

    // Close the server
    server.close();
})


it('should create a new user', async () => {
    const response = await request(app).post('/users').send(testUser)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual(testUser.name)
    expect(response.body.email).toEqual(testUser.email)
    // Do not test for password as it should not be returned in the response
})

it('Should not create a user if email is invalid', async () => {
    const response = await request(app)
    .post('/users')
    .send({...testUser, email: 'invalid'})
    expect(response.statusCode).toBe(400)
    // Add assertions for specific error messages as per your API's error handling
})

it('Should not create a user if password is too short', async () => {
    const response = await request(app).post('/users')
    .send({...testUser, email: "ftr@gg.com", password: '123'})
    expect(response.statusCode).toBe(400)
    // Add assertions for specific error messages as per your API's error handling
})

it('should get all users', async () => {
    const response = await request(app).get('/users')
    .set('Authorization', `Bearer ${authToken}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toEqual(2)
    expect(response.body[0].name).toEqual(initialUser.name)
    expect(response.body[0].email).toEqual(initialUser.email)
})

it('should get a user by id', async () => {
    const response = await request(app).get(`/users/${userId}`)
    .set('Authorization', `Bearer ${authToken}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual(initialUser.name)
    expect(response.body.email).toEqual(initialUser.email)
})

it('should update a user', async () => {
    const response = await request(app).put(`/users/${userId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({...testUser, name: 'Jane Doe'})
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual('Jane Doe')
    expect(response.body.email).toEqual(initialUser.email)
})

it('should delete a user', async () => {
    const response = await request(app).delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${authToken}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual("user has been removed")
})
