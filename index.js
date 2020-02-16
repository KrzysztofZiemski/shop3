const express = require('express');
const appStatic = express();

appStatic.listen(8080, () => {
    console.log('server listening on 8080')
})

appStatic.use(express.static('disc'))

