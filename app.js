const express = require('express');
const app = express();
const morgan = require('morgan');
const articlesRoutes = require('./api/routes/articles.js');
const categoriesRoutes = require('./api/routes/categories.js');
const usersRoutes = require('./api/routes/users.js');
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.xyn8i.mongodb.net/youtube-articles-api?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected!');
});

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// app.use((req, res, next) => {
//   req.on('data', (chank) => {
//     console.log(chank.toString());
//   })
//   req.on('end', () => {
//     next();
//   })
// })

//routes
app.use('/articles', articlesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/users', usersRoutes)

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;