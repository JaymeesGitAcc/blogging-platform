# 📝 Full Stack Blogging Platform

A full-stack blogging platform where users can create, explore, and interact with posts. This application includes authentication, post engagement features, search & filtering, and a complete admin dashboard.

🔗 **View Live:** (https://column-blogging-platform.vercel.app/)

---

## 🚀 Features

### 👤 Authentication & Users
- User registration & login (JWT authentication)
- Email verification system
- Forgot & Reset password via email
- User profile page with

---

### 📝 Posts
- Create, edit, and delete posts
- Upload cover images using Cloudinary
- SEO-friendly slug-based routing
- Post sorting options:
  - 🆕 Recent
  - 🔥 Popular (most liked)
  - 📈 Trending (based on likes, comments, and views)
  - 🕰 Oldest
- Pagination with **Load More** functionality
- Related posts section

---

### 💬 Comments
- Add, edit, and delete comments

---

### ❤️ Likes & 👁 Views
- Like / Unlike posts
- Views count on posts

---

### 🔍 Search & Filtering
- Search posts by title and content
- Filter posts by tags

---

### 🛠 Admin Dashboard

#### 📊 Analytics & Insights
- Total users
- Total posts
- Total comments
- Total likes
- Most liked post
- Most commented post
- Most viewed post
- Top author
- Recently joined users

#### 📝 Post Management
- View all posts in a table
- Delete posts

#### 👥 User Management
- View all users
- Block / Unblock users

---

## 🖼 Screenshots/Images

![Home](https://res.cloudinary.com/dolxzljww/image/upload/v1770743563/Home_frwytn.jpg)
![Post Details](https://res.cloudinary.com/dolxzljww/image/upload/v1770743545/Post_r3wszy.jpg)
![Posts](https://res.cloudinary.com/dolxzljww/image/upload/v1770743531/All-Posts_e9xvjt.jpg)
![Admin Dashboard](https://res.cloudinary.com/dolxzljww/image/upload/v1770743449/Admin_hf2emi.jpg) 
![Profile](https://res.cloudinary.com/dolxzljww/image/upload/v1770743481/Profile_iqz9uo.jpg)

---

## 🏗 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- TanStack Table
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Brevo (email services)
- Mailgen (email templates)
- Axios

---

## ⚙️ Environment Variables

### Backend (`.env`)
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_FROM=your_brevo_email_address
BREVO_API_KEY=your_brevo_api_key
EMAIL_FRONTEND_URL=your_frontend_url
FRONTEND_URL=your_frontend_url
CLIENT_URL=your_localhost_url
CLIENT_URL_PROD=your_deployed_frontend_url


### Frontend (`.env`)
VITE_API_URL=your_backend_url


### Deployments 
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas