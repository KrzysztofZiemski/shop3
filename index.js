const express = require('express');
const appStatic = express();
const App = require('./backend/index.js');


const app = new App;
appStatic.listen(8080, () => {
    console.log('server listening on 8080')
})

appStatic.use(express.static('src'))

