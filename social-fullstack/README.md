# Social Media Full Stack Application

Aplikasi media sosial modern dengan teknologi full-stack yang menggunakan Node.js, Express, MongoDB, dan frontend vanilla JavaScript.

## 🚀 Fitur Utama

- **Authentication**: Register dan Login dengan JWT
- **User Profile**: Profil pengguna dengan avatar dan bio
- **Follow System**: Follow/Unfollow pengguna lain
- **Posts**: Buat, lihat, dan hapus post
- **Likes**: Berikan like pada post
- **Comments**: Berikan komentar pada post
- **Real-time Feed**: Feed real-time dari pengguna yang diikuti

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Web framework
- **MongoDB**: Database NoSQL
- **JWT**: Authentication
- **Bcrypt**: Password hashing

### Frontend
- **HTML5**: Markup
- **CSS3**: Styling
- **Vanilla JavaScript**: DOM manipulation
- **Fetch API**: HTTP requests

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Setup

1. Clone repository
```bash
git clone https://github.com/ferdi2104/laba-pintar.git
cd social-fullstack
```

2. Install dependencies
```bash
npm install
```

3. Setup environment
```bash
cp .env.example .env
```

4. Update `.env` dengan konfigurasi MongoDB Anda

5. Jalankan server
```bash
npm run dev
```

6. Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register pengguna baru
- `POST /api/auth/login` - Login pengguna

### Users
- `GET /api/users/:userId` - Dapatkan profil pengguna
- `PUT /api/users/:userId` - Update profil pengguna
- `POST /api/users/:userId/follow` - Follow pengguna

### Posts
- `POST /api/posts` - Buat post baru
- `GET /api/posts/feed` - Dapatkan feed
- `POST /api/posts/:postId/like` - Like post

### Comments
- `POST /api/comments/:postId` - Buat komentar

## 🎨 Frontend

Frontend dapat diakses di folder `/public` dengan design modern dan responsif.

## 📝 Project Structure

```
social-fullstack/
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   └── comments.js
├── middleware/
│   └── auth.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
└── .env.example
```

## 🤝 Contributing

Contributions welcome! Feel free to submit issues dan pull requests.

## 📄 License

MIT License

## 👨‍💻 Author

**ferdi2104** - Full Stack Developer

---

*Built with passion in Yogyakarta, ID (2026)*
