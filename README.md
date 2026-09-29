# Snitch Backend

Backend API for the Snitch project, built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and ImageKit for product image storage.

## Project Structure

```text
Server/
├── src
│   ├── app
│   │   └── app.js
│   ├── config
│   │   ├── config.js
│   │   └── db.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   └── product.controller.js
│   ├── middlewares
│   │   └── auth.middleware.js
│   ├── models
│   │   ├── cart.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── routes
│   │   ├── auth.route.js
│   │   ├── cart.route.js
│   │   └── product.route.js
│   ├── services
│   │   └── storage.service.js
│   ├── utils
│   │   └── auth.util.js
│   ├── validator
│   │   ├── auth.validator.js
│   │   ├── cart.validator.js
│   │   └── product.validator.js
│   └── server.js
├── package-lock.json
└── package.json
```

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token
* bcryptjs
* Express Validator
* Multer
* ImageKit
* Cookie Parser
* dotenv
* Nodemon

## Installation

Clone the project and move into the server directory.

```bash
cd Server
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the `Server` directory.

The project reads the following environment variables:

```env
MONGO_URI=
PORT=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_PUBLIC_KEY=
```

## Run the Server

Start the development server using:

```bash
npm run dev
```

The server connects to MongoDB before starting the Express server.

## Authentication

The project provides user registration, login, refresh-token handling, and authenticated user information.

### Register

```http
POST /api/auth/register
```

Request body:

```json
{
  "email": "user@example.com",
  "name": "User",
  "password": "password"
}
```

The password is hashed using `bcryptjs`.

A refresh token is stored in an HTTP-only cookie and an access token is returned in the response.

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Refresh Token

```http
POST /api/auth/refresh
```

The refresh token is read from the cookie and used to create a new access token and refresh token.

### Get Current User

```http
GET /api/auth/me
```

Requires authentication using the access token.

## Products

Products contain:

* Title
* Description
* Price
* Currency
* Images
* Sizes
* Stock
* Seller
* Published status

### Create Product

```http
POST /api/products
```

This route is protected and requires seller authorization.

Product images are uploaded using Multer and then stored using ImageKit.

The upload is limited to:

* Maximum 5 files
* Maximum 1 MB per file

The supported product sizes are:

```text
XS
S
M
L
XL
XXL
```

Supported currencies are:

```text
USD
INR
```

### Get Published Products

```http
GET /api/products
```

Returns products where `published` is `true`.

### Get All Products for Seller

```http
GET /api/products/seller
```

Requires seller authorization.

### Unlist Product

```http
PATCH /api/products/unlist/:id
```

Requires seller authorization.

Sets the product's `published` value to `false`.

### List Product

```http
PATCH /api/products/list/:id
```

Requires seller authorization.

Sets the product's `published` value to `true`.

## Cart

The project includes cart functionality for authenticated users.

### Add Product to Cart

```http
POST /api/cart
```

Requires authentication.

Request body:

```json
{
  "productId": "product_id",
  "quantity": 1,
  "size": "M"
}
```

The cart logic checks:

* Whether the product exists
* Whether the selected size exists
* Whether sufficient stock is available
* Whether the product already exists in the cart

If the product already exists in the cart, its quantity is updated.

### Get Cart

```http
GET /api/cart
```

Requires authentication.

## Authentication Middleware

Protected routes use the access token from the `Authorization` header.

Expected format:

```http
Authorization: Bearer <access_token>
```

The authentication middleware verifies the token and attaches the decoded user information to `req.user`.

Seller-only routes additionally check that:

```text
role === "seller"
```

## Validation

The project uses `express-validator` for request validation.

### Authentication Validation

Registration validates:

* Email
* Name
* Password

Login validates:

* Email
* Password

### Cart Validation

Cart requests validate:

* Product ID
* Quantity
* Size

### Product Validation

Product creation validates:

* Title
* Description
* Price amount
* Currency
* Sizes
* Stock

Product ID parameters are also validated for product listing and unlisting routes.

## Image Storage

Product images are uploaded through ImageKit.

Images are uploaded to the:

```text
snitch
```

folder.

The uploaded image URLs are saved in the product document.

## Database Models

### User

The user model contains:

* `email`
* `name`
* `passwordHash`
* `role`
* `refreshToken`

User roles are:

```text
user
seller
```

### Product

The product model contains:

* `title`
* `price`
* `description`
* `images`
* `sizes`
* `seller`
* `published`

### Cart

The cart model contains:

* `user`
* `product`
* `quantity`
* `size`

## API Routes

### Auth Routes

| Method | Endpoint             | Authentication |
| ------ | -------------------- | -------------- |
| POST   | `/api/auth/register` | Public         |
| POST   | `/api/auth/login`    | Public         |
| POST   | `/api/auth/refresh`  | Refresh Token  |
| GET    | `/api/auth/me`       | Required       |

### Product Routes

| Method | Endpoint                   | Authentication |
| ------ | -------------------------- | -------------- |
| POST   | `/api/products`            | Seller         |
| GET    | `/api/products`            | User           |
| GET    | `/api/products/seller`     | Seller         |
| PATCH  | `/api/products/unlist/:id` | Seller         |
| PATCH  | `/api/products/list/:id`   | Seller         |

### Cart Routes

| Method | Endpoint    | Authentication |
| ------ | ----------- | -------------- |
| POST   | `/api/cart` | Required       |
| GET    | `/api/cart` | Required       |

## Scripts

The project currently provides the following npm script:

```bash
npm run dev
```

This starts the server using Nodemon.

## Dependencies

The project uses the following main dependencies:

```text
@imagekit/nodejs
bcryptjs
cookie-parser
dotenv
express
express-validator
jsonwebtoken
mongoose
multer
```

Development dependency:

```text
nodemon
```
