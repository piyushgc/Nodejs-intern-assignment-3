Social-Networking-API-with-MongoDB

This project is a RESTful API for a social media platform where users can sign up, log in, create posts, follow other users, and interact with posts by liking them.

## Setup Instructions
- Clone the repository
- Install dependencies with `npm install`
- Set up environment variables in `.env` file
- Run the application with `npm start`

## Environment Variables
- PORT: Port number for the server
- MONGODB_URL: MongoDB connection string
- SECRET_KEY: Secret key for JWT authentication

## API Endpoints
- User routes
  - POST /api/users/signup
  - POST /api/users/login
  - GET /api/users/:id
  - PUT /api/users/:id
  - DELETE /api/users/:id
  - PUT /api/users/:id/follow
  - PUT /api/users/:id/unfollow

- Post routes
  - GET /api/posts
  - GET /api/posts/:id
  - POST /api/posts
  - PUT /api/posts/:id
  - DELETE /api/posts/:id
  - PUT /api/posts/:id/like
