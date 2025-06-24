# 💬 AI Chat Application

A real-time full-stack chat application with integrated AI assistant capabilities, built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered by OpenAI's GPT-4o model. Includes image messaging (via Cloudinary), socket-based messaging, and persistent chat history.

## 📌 Features

- 🔐 User authentication (JWT)
- 💬 Real-time one-to-one chat using Socket.IO
- 🧠 AI Assistant (via OpenAI API)
- 📷 Image message upload (Cloudinary)
- 🗂️ Chat history stored in MongoDB
- 🧾 Backend: Node.js + Express.js + MongoDB + Mongoose
- 💻 Frontend: React.js + Tailwind CSS
- ☁️ Hosting-ready setup

---

## 📁 Project Structure

```
server/
├── controllers/
│   └── messageController.js
├── models/
│   ├── user.model.js
│   ├── message.model.js
│   └── aiMessage.model.js
├── lib/
│   ├── cloudinary.js
│   └── socket.js
├── routes/
│   └── messageRoutes.js
├── config/
│   └── db.js
├── .env
└── server.js

client/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.js
├── .env
└── package.json
```

---

## 🚀 Getting Started

### 🛠️ Prerequisites

- Node.js
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account
- OpenAI API Key

---

### 📦 Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm start
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

---

## 🔄 API Routes Overview

- `GET /users` - Get all users (for sidebar)
- `GET /messages/:id` - Get chat history between users
- `POST /messages/:id` - Send text/image message
- `POST /chat/ai` - Send message to AI assistant

---

## 🌐 Technologies Used

- **Frontend:** React.js, Tailwind CSS, Axios, Socket.IO-client
- **Backend:** Express.js, Node.js, Mongoose, OpenAI SDK, Cloudinary
- **Database:** MongoDB (Atlas/local)
- **Deployment:** Render / Vercel / Netlify

---

## 📷 Screenshot

![Chat UI](https://your-image-url.com/chat-ui-screenshot.png)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developed By

Kunal Shinde  
📧 [kunal.email@example.com]  
🌐 [LinkedIn](https://www.linkedin.com/in/your-link) | [GitHub](https://github.com/your-username)
