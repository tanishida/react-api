const express = require('express'); // expressモジュールを読み込む
const multer = require('multer'); // multerモジュールを読み込む
const uuidv4 = require('uuid/v4'); // uuidモジュールを読み込む

const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する

const messageList = [];

app.get('/api/v1/list', (req, res) => {
    console.log('list: ' + JSON.stringify(messageList));
    res.json(messageList);
});

app.post('/api/v1/add', (req, res) => {
    // クライアントからの送信データを取得する
    const name = req.body.name;
    const message = req.body.value;

    // ユニークIDを生成する
    const id = uuidv4();
    const messageItem = {
        id,
        name: name,
        value: message
    };
    messageList.push(messageItem);
    console.log('Add: ' + JSON.stringify(messageList));
    // 追加した項目をクライアントに返す
    res.json(messageList);
});

app.delete('/api/v1/item/:id', (req, res) => {
    // URLの:idと同じIDを持つ項目を検索
    const index = messageList.findIndex(item => item.id === req.params.id);
    // 項目が見つかった場合
    if(index >= 0) {
        const deleted = messageList.splice(index, 1); // indexの位置にある項目を削除
        console.log('Delete: ' + JSON.stringify(deleted[0]));
    }
    res.sendStatus(200);
});

app.put('/api/v1/item/:id', (req, res) => {
    // URLの:idと同じIDを持つ項目を検索
    const index = messageList.findIndex(item => item.id === req.params.id);
    if(index >= 0) {
        const item = messageList[index];
        if(req.body.done) {
            item.done = req.body.done === 'true';
        }
        console.log('Edit: ' + JSON.stringify(item));
    }
    res.sendStatus(200);
});

// ポート8000でサーバを立てる
app.listen(8000, () => {
    console.log('Listening on port 8000');
});