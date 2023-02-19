const { request, response } = require('express');
const express = require('express');
const Datastore = require('nedb');

const app = express();


const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api', (request, response) => {
    console.log('I got a request!');
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});
