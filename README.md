# User API v5

## Overview
User API v5 is a Node.js RESTful API designed to manage user data. It allows clients to perform  CRUD operations and authentication.

## How It Works
1. **User Registration**: Create a new user account.
2. **User Authentication**: Authenticate users and receive a JWT token.
3. **User Retrieval**: Fetch individual or all user details.
4. **User Update**: Update existing user information.
5. **User Deletion**: Remove user accounts from the system.

## Installation

To get the API up and running:

1. Clone the repository:
   ```
   git clone https://github.com/Gords/user-api-v5
   cd user-api-v5
   ```

2. Install dependencies:
   ```
   npm i
   ```

3. Start the dockerized Postgres Database
    ```
    docker compose up -d
    ```

4. Start the application:
   ```
   npm start
   ```

The API will now be accessible at `http://localhost:3000`.

## API Endpoints

### POST `/users`
Register a new user.

### POST `/users/login`
Authenticate a user and receive a JWT.

### GET `/users`
Retrieve a list of all users (needs the JWT token to be send as a Bearer Token).

### GET `/users/:uuid`
Fetch details of a specific user (needs the JWT token to be send as a Bearer Token).

### PUT `/users/:uuid`
Update a user's information (needs the JWT token to be send as a Bearer Token).

### DELETE `/users/:uuid`
Remove a user from the system (needs the JWT token to be send as a Bearer Token).

## Technical Stack
- **TypeScript**: For type-safe JavaScript development.
- **Node.js & Express**: For backend development.
- **TypeORM**: As an ORM tool for database interaction.
- **PostgreSQL**: As the database.
- **JWT**: For user authentication.
- **Jest**: For testing.
- **Morgan**: For HTTP request logging.
- **Nodemon**: For automatic server restarts during development.
- **Docker**: For containerization and deployment of the database.
- **Bcrypt**: For secure password hashing and storage.

## Testing

Run automated tests with:

```
npm test
```

## License

Licensed under the MIT License.
