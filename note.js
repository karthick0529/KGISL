/* === Folder Structure ===
project-root/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Register.js
│       │   ├── Login.js
│       │   └── Cart.js
│       ├── App.js
│       ├── index.js
│       └── api.js
├── server/               # Node.js backend
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
└── package.json

*/

npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install axios


// ==== client/src/api.js ====
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;

// ==== client/src/components/Register.js ====
import React, { useState } from 'react';
import API from '../api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', gender: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/auth/register', form);
    alert('User Registered');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

// ==== client/src/components/Login.js ====
import React, { useState } from 'react';
import API from '../api';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await API.post('/auth/login', form);
    localStorage.setItem('token', data.token);
    onLogin();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

// ==== client/src/components/Cart.js ====
import React, { useState } from 'react';

const Cart = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Cart Items: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Add Item</button>
    </div>
  );
};

export default Cart;

// ==== client/src/App.js ====
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Cart from './components/Cart';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {!loggedIn ? (
        <>
          <Register />
          <Login onLogin={() => setLoggedIn(true)} />
        </>
      ) : (
        <Cart />
      )}
    </div>
  );
};

export default App;

// ==== client/src/index.js ====
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// ==== server/models/User.js ====
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: String,
});

module.exports = mongoose.model('User', userSchema);

// ==== server/routes/auth.js ====
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, gender });
  await user.save();
  res.send('User Registered');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;

// ==== server/middleware/authMiddleware.js ====
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('No token');

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).send('Invalid token');
  }
};

module.exports = authMiddleware;

// ==== server/server.js ====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'));

app.use('/auth', require('./routes/auth'));

app.listen(5000, () => console.log('Server running on port 5000'));

// ==== server/.env ====
MONGO_URI=mongodb://localhost:27017/authcart
JWT_SECRET=supersecretkey
