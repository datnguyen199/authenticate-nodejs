const express = require('express');
const axios = require('axios');

const clientID = '<Client ID from github app>';
const clientSecret = '<Client secret from github app>';

const app = express();

app.get('/oauth/redirect', (req, res) => {
  const requestToken = req.query.code;

  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  }).then(response => {
    const accessToken = response.data.access_token;
    res.redirect(`/welcome.html?access_token=${accessToken}`)
  }).catch(err => {
    res.status(500).send({ message: err });
  })
})

app.use(express.static(__dirname + '/public'));

app.listen(3000);
