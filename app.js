const express = require('express');
const session = require('express-session');
const flash = require('flash');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
const morgan = require('morgan');
const routes = require('./src/routes');
require('./src/config/connection');

class App  {
    constructor() {
        this.app = express();
        this.configDirectory()
        this.middlewares();
        this.routes();
    }

    configDirectory(){
        this.app.use(session({
            secret: '747e5002dc61e23a0d5ea9556fc132a1',
            resave: true,
            saveUninitialized: true,
        }));
        this.app.use(bodyParser.urlencoded({extended: true}));

        this.app.engine('html', require('ejs').renderFile);
        this.app.set('view engine', 'html');
        this.app.use('/public', express.static(path.join(__dirname, 'public')));
        this.app.set('views', path.join(__dirname, 'views'));
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
            res.header("Access-Control-Allow-Headers", "Accsses, Content-Type, Authorization, Acept, Origin, X-Requested-With");

            this.app.use(cors())
            next();
        })
    }

    routes() {
        this.app.use(routes)
    }
}

module.exports = new App().app;