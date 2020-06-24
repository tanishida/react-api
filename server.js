const app = require('express')();
const PORT = process.env.PORT || 8000;
const multer = require('multer'); // multerモジュールを読み込む
const uuidv4 = require('uuid/v4'); // uuidモジュールを読み込む
const fs = require('fs');

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
const PASSWORD_FILE_PATH = `./gotanda/password.json`;
const BOARD_GAME_FILE_PATH = `./boardGame/boardGameList.json`;

let messageList = require(FILE_PATH);
let gotandaList = require(GOTANDA_FILE_PATH);
let passwordLidt = require(PASSWORD_FILE_PATH);
let boardGameList = require(BOARD_GAME_FILE_PATH);


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
    fs.writeFile(FILE_PATH, JSON.stringify(messageList), err => {
        if (err) {
            console.log('メッセージ投稿エラー');
            throw err;
        }
    });
    console.log('Add: ' + require(FILE_PATH));
    res.json(require(FILE_PATH));
});

app.get('/api/v1/list', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    console.log('list: ' + JSON.stringify(require(FILE_PATH)));
    res.json(require(FILE_PATH));
});

app.post('/api/v1/addGotanda', (req, res) => {
    const id = uuidv4();
    const gotandaRegistItem = {
        handleName: req.body.handleName,
        shopName: req.body.shopName,
        date: req.body.date,
        radio: req.body.radio,
        comment: req.body.comment,
        id
    };
    const passwordRegistItem = {
        id,
        password: req.body.password
    }
    gotandaList.unshift(gotandaRegistItem);
    passwordLidt.unshift(passwordRegistItem);
    fs.writeFile(GOTANDA_FILE_PATH, JSON.stringify(gotandaList), err => {
        if (err) {
            console.log('入力情報登録エラー');
            throw err;
        }
    });
    fs.writeFile(PASSWORD_FILE_PATH, JSON.stringify(passwordLidt), err => {
        if (err) {
            console.log('パスワード登録エラー');
            throw err;
        }
    });
    res.json(require(GOTANDA_FILE_PATH));
});

app.get('/api/v1/listGotanda', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.json(require(GOTANDA_FILE_PATH));
});

app.get('/status', (req, res) => {
    res.json({
      status: 'ok',
      statusCode: 200,
    })
  });

app.post('/api/v1/add-board-game', (req, res) => {
    const id = uuidv4();
    const boadGameRegistItem = {
        time: req.body.time,
        name: req.body.name,
        kibo: req.body.kibo,
        playTime: req.body.playTime,
        price: req.body.price,
        count: req.body.count,
        detail: req.body.detail,
        id
    };
    boardGameList.unshift(boadGameRegistItem);
    fs.writeFile(BOARD_GAME_FILE_PATH, JSON.stringify(boardGameList), err => {
        if (err) {
            console.log('ボードゲーム登録エラー');
            throw err;
        }
    });
    res.json(require(BOARD_GAME_FILE_PATH));
});

app.get('/api/v1/board-game-list', (req, res) => {
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.json(require(BOARD_GAME_FILE_PATH));
});

app.put('/api/v1/board-game-list/:id', (req, res) => {
    // URLの:idと同じIDを持つ項目を検索
    const index = boardGameList.findIndex((item) => item.id === req.params.id);

    // カウント更新の場合
    if(index >= 0 && req.body.type === 'count') {
        const item = boardGameList[index];
        if (req.body.counterType === 'plus') {
            item.count = Number(++item.count).toString();
            console.log('Edit:count lus ' + JSON.stringify(item));
        } else {
            item.count = Number(--item.count).toString();
            console.log('Edit:count minus ' + JSON.stringify(item));
        }
    }
    // 詳細更新の場合
    if(index >= 0 && req.body.type === 'detail') {
        const item = boardGameList[index];
        console.log(req.body.editDetail);
        item.detail = req.body.editDetail;
        console.log(item.detail);
        console.log('Edit:detail ' + JSON.stringify(item));
    }
    res.sendStatus(200);
});

app.get('*', (req, res) => {
    res.json({
        message: 'Express on Unubo Cloud',
    })
});
  
app.listen(PORT, () => console.log(`> Ready on http://localhost:${PORT}`));
