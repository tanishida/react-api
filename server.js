const express = require('express'); // expressモジュールを読み込む
const multer = require('multer'); // multerモジュールを読み込む
const fs = require('fs');

const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する
const ALLOWED_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS'
];
const FILE_PATH = `./message/message.json`;
const GOTANDA_FILE_PATH = `./gotanda/gotanda.json`;
let messageList = require(FILE_PATH);
let gotandaList = require(GOTANDA_FILE_PATH);


// レスポンスHeaderを組み立てる
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(origin);
    res.cookie('example', Math.random().toString(), {maxAge: 86400, httpOnly: true});
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(','));
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Accept,X-Custom-Header');
    next();
});

app.post('/api/v1/add', (req, res) => {
    const name = req.body.name;
    const message = req.body.value;
    const messageItem = {
        name: name,
        value: message
    };
    messageList.unshift(messageItem);
    fs.writeFile(FILE_PATH, JSON.stringify(messageList));
    console.log('Add: ' + require(FILE_PATH));
    res.json(require(FILE_PATH));
});

app.get('/api/v1/list', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    console.log('list: ' + JSON.stringify(require(FILE_PATH)));
    res.json(require(FILE_PATH));
});

app.post('/api/v1/addGotanda', (req, res) => {
    const gotandaRegistItem = {
        handleName: req.body.handleName,
        shopName: req.body.shopName,
        date: req.body.date,
        radio: req.body.radio,
        comment: req.body.comment
    };
    gotandaList.unshift(gotandaRegistItem);
    fs.writeFile(GOTANDA_FILE_PATH, JSON.stringify(gotandaList));
    res.json(require(GOTANDA_FILE_PATH));
});

app.get('/api/v1/listGotanda', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.json(require(GOTANDA_FILE_PATH));
});

// ポート8000でサーバを立てる
app.listen(8000, () => {
    console.log('Listening on port 8000');
});
