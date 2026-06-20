const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const sanitizeInput = require('./middleware/sanitizeInput');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(hpp());
app.use(sanitizeInput);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many requests from this IP, please try again later.' },
});

app.use('/api', limiter);

const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
