# Vendora — Multi-Vendor E-Commerce Marketplace

A production-ready multi-vendor e-commerce marketplace built with Django REST Framework and React.

🌐 **Live Demo:** [https://vendora.vercel.app](https://vendora.vercel.app)
🔗 **Backend API:** [https://vendora-backend-4g8o.onrender.com](https://vendora-backend-4g8o.onrender.com)

---

## Tech Stack

**Backend**

- Django 6 + Django REST Framework
- SimpleJWT — JWT Authentication
- PostgreSQL — Production Database
- Razorpay — Payment Integration
- Cloudflare R2 — Media Storage
- Gunicorn + Render — Deployment

**Frontend**

- React + Vite
- Tailwind CSS
- Axios — API Communication
- React Router v6
- Context API — State Management
- Vercel — Deployment

---

## Features

### Authentication

- JWT Authentication with auto token refresh
- Role-based access control (Customer / Vendor / Admin)
- Multi-tab logout synchronization

### Customer

- Browse and search products
- Filter by category
- Add to cart with quantity control
- Place orders with shipping address
- Razorpay payment integration
- View order history

### Vendor

- Vendor dashboard with stats
- Create and manage products
- Upload multiple product images
- View orders for their products only

### Admin

- Admin dashboard with platform stats
- Approve / reject vendors
- Manage all users

---

## Project Structure

```
vendora-backend/
  backend/          ← Django project settings
  users/            ← Auth, RBAC, Admin APIs
  products/         ← Product, Category, Images
  orders/           ← Cart, Orders
  payments/         ← Razorpay Integration

vendora-frontend/
  src/
    api/            ← Axios configuration
    components/     ← Reusable UI components
    context/        ← AuthContext, CartContext
    pages/          ← Page components
    utils/          ← Helper functions
```

---

## Local Setup

### Backend

```bash
git clone https://github.com/yourusername/vendora-backend.git
cd vendora-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:

```
SECRET_KEY=your-secret-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
git clone https://github.com/yourusername/vendora-frontend.git
cd vendora-frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```

---

## API Endpoints

### Auth

| Method | Endpoint                   | Description       |
| ------ | -------------------------- | ----------------- |
| POST   | `/api/auth/register/`      | Register new user |
| POST   | `/api/auth/login/`         | Login             |
| POST   | `/api/auth/token/refresh/` | Refresh token     |
| GET    | `/api/auth/me/`            | Get current user  |

### Products

| Method | Endpoint                               | Description             |
| ------ | -------------------------------------- | ----------------------- |
| GET    | `/api/products/`                       | List all products       |
| GET    | `/api/products/:slug/`                 | Product detail          |
| GET    | `/api/products/categories/`            | List categories         |
| POST   | `/api/products/vendor/products/`       | Create product (vendor) |
| PUT    | `/api/products/vendor/products/:slug/` | Update product (vendor) |
| DELETE | `/api/products/vendor/products/:slug/` | Delete product (vendor) |

### Orders

| Method | Endpoint              | Description      |
| ------ | --------------------- | ---------------- |
| GET    | `/api/cart/`          | View cart        |
| POST   | `/api/cart/`          | Add to cart      |
| DELETE | `/api/cart/:id/`      | Remove cart item |
| GET    | `/api/orders/`        | View orders      |
| POST   | `/api/orders/`        | Place order      |
| GET    | `/api/vendor/orders/` | Vendor orders    |

### Payments

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/payments/create/:id/` | Create Razorpay order |
| POST   | `/api/payments/verify/:id/` | Verify payment        |

---

## Deployment

- Backend deployed on **Render** with PostgreSQL
- Frontend deployed on **Vercel**
- Auto deployment on every push to `main` branch
- Environment variables managed separately per environment

---

## Author

Built by Nandhan (Abhinand KP) as a portfolio project to demonstrate full-stack development skills with Django and React.
