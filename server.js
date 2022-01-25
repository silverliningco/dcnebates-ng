const express = require ('express');
const path = require('path');


const app = express();

app.use(express.static('./dist/rebate-calculator-app'));

app.get('/*', (req, res) => 
    res.sendFile('index.html', {root: 'dist/rebate-calculator-app/'}),
);


app.listen(process.env.PORT || 8080);