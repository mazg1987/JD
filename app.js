//npm install express mongoose art-template express-art-template blueimp-md5 bootstrap@3.3.5 jquery@2.2.0

const express = require("express");
const news = require("./router/news")
const product = require("./router/product")
const index = require("./router/index")
const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const expressSession = require("express-session")
const app = express();

mongoose.connect("mongodb://localhost/422")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("已经连接数据库");
});

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")))
app.use("/public", express.static(path.join(__dirname, "public")))
app.engine('html', require('express-art-template'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressSession({
    name: "mazg",
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60 * 3,
    },
    resave: false,
    rolling: true,
    saveUninitialized: false,
}));

app.use("/news",news)
app.use("/product",product)
app.use("/",index)

app.all('*', function (req, res) {
    res.render('404.html', {
        title: '您要找的页面不存在'
    })
});

app.use((err, req, res, next) => {
    res.json({
        code: 2002,
        message: err.message
    })
})

app.listen(3000, () => {
    console.log("3000端口已启用")
})
