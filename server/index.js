require('dotenv').config();
const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const path = require('node:path');
const {configureSecurity, requireAuth} = require('./security.js');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.APP_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

const db = require('./db/init.js');
db.pragma('foreign_keys = ON');
configureSecurity(app);
const asyncRoute = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);

// Health check
app.get('/api/health', (req, res) => {
    return res.json({ status: 'ok'});
});

app.get('/api/me',requireAuth,(req,res)=> {
  // S4: Return only the session user's {id,email}.
  try {
    const user = db.prepare('SELECT id, email, firstName FROM users WHERE id = ?').get(req.session.userId);

    if (!user)
      return res.status(404).json({error:'User not found'});

    return res.json({id: user.id, email: user.email, firstName: user.firstName});
  } catch (error) {
    throw error;
  }
});

app.post('/api/register', asyncRoute(async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const companyName = req.body.companyName;
    const email = req.body.email.trim();
    const password = req.body.password;

    const emailNormalized = email.toLowerCase();
    const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (firstName.length < 1 || firstName.length > 50)
        return res.status(400).json({error:'Invalid firstName value'});

    if (lastName.length < 1 || lastName.length > 50)
        return res.status(400).json({error:'Invalid lastName value'});

    if (companyName.length < 1 || companyName.length > 100)
        return res.status(400).json({error:'Invalid companyName value'});

    if (emailNormalized.length < 3 || emailNormalized.length > 254 || !emailRegexPattern.test(emailNormalized)
            || typeof password !== 'string' 
            || password.length < 8 
            || password.length > 128) 
        return res.status(400).json({error:'Invalid email or password value'});

    if (password.length < 12 || password.length > 128)
        return res.status(400).json({error:'Invalid password value'});

    try {
        const emailSelectResult = db.prepare('SELECT * FROM users WHERE email = ?').get(emailNormalized);
        if (emailSelectResult)
            return res.status(400).json({error:'Email already registered.'});
    } catch (error) {
        throw error;
    }

    const hashedPassword = await argon2.hash(password, {type: argon2.argon2id});
    try {
        const insertResult = db.prepare('INSERT INTO users (firstName, lastName, companyName, email, password) VALUES (?, ?, ?, ?, ?)').run(firstName, lastName, companyName, emailNormalized, hashedPassword);
        return res.status(201).json({id: insertResult.lastInsertRowid, firstName: firstName, lastName: lastName, companyName: companyName, email: emailNormalized});
    } catch (error) {
        throw error;
    }
}));

app.post('/api/signin', asyncRoute(async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;
    const emailNormalized = email.toLowerCase();

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(emailNormalized);
        if (!user || !await argon2.verify(user.password, password))
            return res.status(401).json({error:'Invalid email or password.'});

        await new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
        req.session.userId = user.id;

        await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
        return res.json({id: user.id, email: user.email});
    } catch (error) {
        throw error;
    }
}));

app.get('/api/invoices', requireAuth, (req, res) => {
    return res.json([]);
});

app.get('/api/invoices/:id', requireAuth, (req, res) => {
    return res.json({});
});

app.post('/api/invoices', requireAuth, (req, res) => {
    return res.status(201).json({ message: 'Invoice created successfully'});
});

app.put('/api/invoices/:id', requireAuth, (req, res) => {
    return res.json({});
});

app.delete('/api/invoices/:id', requireAuth, (req, res) => {
    return res.json({ok: true});
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});