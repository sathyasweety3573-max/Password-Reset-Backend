# 🔐 Password Reset Backend API

A complete backend authentication system with password reset functionality using Node.js, Express, MongoDB, and JWT.

---

## 🚀 Features

* User Registration
* User Login (JWT Authentication)
* Forgot Password (Generate Reset Token)
* Reset Password using Token
* Password Hashing (bcrypt)

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (jsonwebtoken)
* bcryptjs
* dotenv
* cors

---

## 📁 Project Structure

```
project/
│── config/
│     └── db.js
│── models/
│     └── User.js
│── controllers/
│     └── authController.js
│── routes/
│     └── authRoutes.js
│── server.js
│── .env
│── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## ▶️ Installation & Run

```
npm install
npm run dev
```

---

## 🌐 Base URL

```
http://localhost:5000
```

---

## 📮 API Endpoints

### 🔹 Register

**POST** `/api/auth/register`

```
{
  "name": "Sathya",
  "email": "sathya@gmail.com",
  "password": "123456"
}
```

---

### 🔹 Login

**POST** `/api/auth/login`

```
{
  "email": "sathya@gmail.com",
  "password": "123456"
}
```

**Response:**

```
{
  "token": "JWT_TOKEN"
}
```

---

### 🔹 Forgot Password

**POST** `/api/auth/forgot-password`

```
{
  "email": "sathya@gmail.com"
}
```

**Response:**

```
{
  "msg": "Reset token generated",
  "token": "RESET_TOKEN"
}
```

---

### 🔹 Reset Password

**POST** `/api/auth/reset-password/:token`

Example:

```
http://localhost:5000/api/auth/reset-password/your_token
```

```
{
  "password": "newpassword123"
}
```

---

### 🔹 Test Route

**GET** `/api/auth/users`

---

## 🧪 Postman Tips

* Use Body → raw → JSON
* Add header:

```
Content-Type: application/json
```

---


## 👨‍💻 Author

Sathya

---

