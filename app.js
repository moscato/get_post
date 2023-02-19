const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');

const db = new Datastore({ filename: 'data.db', autoload: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  db.find({}, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.send(`
        <html>
          <body>
            <h1>Cool Chat</h1>
            <br><hr><br>
            <form method="post" action="/data">
              <input type="text" name="text" />
              <button type="submit">Add</button>
            </form>
            <ul>
              ${data.map(d => `<li>${d.text}</li>`).join('')}
            </ul>
          </body>
        </html>
      `);
    }
  });
});

app.post('/data', (req, res) => {
  const text = req.body.text;
  db.insert({ text }, (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server listening at ${PORT}`));