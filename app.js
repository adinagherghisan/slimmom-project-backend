const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport')(passport);
const { specs, swaggerUi } = require('./swagger');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(cors());
app.use(express.json());
app.use(morgan(formatsLogger));
app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const authRouter = require('./routes/auth');
const recommendationRouter = require('./routes/recommendations');
const searchProductsRouter = require('./routes/searchProducts');
const diaryRouter = require('./routes/diary');
const summaryRouter = require('./routes/summery');

app.use('/api/auth', authRouter);
app.use('/api/products', recommendationRouter);
app.use('/api/products', searchProductsRouter);
app.use('/api/diary', diaryRouter);
app.use('/api', summaryRouter);

app.get('/', (req, res) => {
  res.send('Hello, Swagger!');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;