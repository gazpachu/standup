const express = require('express');
const sockets = require('signal-master/sockets');
const https = require('https');

const port = process.env.PORT || 3000;

const config = {
  isDev: false,
  server: {
    port,
    secure: true,
    key: './ssl/key.pem',
    cert: './ssl/cert.pem',
    password: null
  },
  rooms: {
    maxClients: 0
  },
  xirsys: {
    gateway: 'global.xirsys.net',
    info: {
      ident: 'itcrowd',
      secret: '9376fe18-f785-11e7-bce6-68cc2c72c47c',
      channel: 'Fingertips'
    }
  },
  stunservers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun:e2.xirsys.com'
      ]
    }
  ],
  turnservers: [
    {
      urls: [
        'turn:e2.xirsys.com:80?transport=udp',
        'turn:e2.xirsys.com:3478?transport=udp',
        'turn:e2.xirsys.com:80?transport=tcp',
        'turn:e2.xirsys.com:3478?transport=tcp',
        'turns:e2.xirsys.com:443?transport=tcp',
        'turns:e2.xirsys.com:5349?transport=tcp'
      ],
      secret: '9376fe18-f785-11e7-bce6-68cc2c72c47c',
      expiry: 86400
    }
  ]
};

const app = express();

app.use('/standup', express.static(`${__dirname}/dist`));

app.get('/stats', (req, res) => {
  const l = req.query.l ? `?l=${req.query.l}` : '';
  const gs = req.query.gs ? `&gs=${req.query.gs}` : '';
  const ge = req.query.ge ? `&ge=${req.query.ge}` : '';
  const breakQ = req.query.break ? `&break=${req.query.break}` : '';

  res.setHeader('Content-Type', 'application/json');

  // Xirsys GET Stats
  const options = {
    host: 'ws.xirsys.com',
    path: `/_stats/${config.xirsys.info.channel}${l}${gs}${ge}${breakQ}`,
    method: 'GET',
    headers: {
      Authorization: `Basic ${new Buffer(`${config.xirsys.info.ident}:${config.xirsys.info.secret}`).toString('base64')}`
    }
  };

  console.log(`${options.host}${options.path}`);

  const httpreq = https.request(options, (httpres) => {
    let str = '';
    httpres.on('data', (data) => { str += data; });
    httpres.on('error', (e) => { res.send(e); });
    httpres.on('end', () => {
      console.log('response: ', str);
      res.send(str);
    });
  });

  httpreq.end();
});

app.get('*', (req, res) => {
  const file = `${__dirname}/dist/index.html`;
  res.sendFile(file);
});

const server = app.listen(port, () => {
});

sockets(server, config); // config is the same that server.js uses
