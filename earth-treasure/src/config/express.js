const express = require('express');
const cookieParser = require('cookie-parser');

const { session } = require('../middlewares/session');

const secret = 'Super secret';

function configExpress(app) {

    app.use(cookieParser({ secret }));
    app.use(session());
    // TODO session middleware
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));

}

module.exports = { configExpress };