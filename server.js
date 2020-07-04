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
const DOMINION_FILE_PATH = `./dominion/dominion.json`;

let messageList = require(FILE_PATH);
let gotandaList = require(GOTANDA_FILE_PATH);
let passwordLidt = require(PASSWORD_FILE_PATH);
let boardGameList = require(BOARD_GAME_FILE_PATH);
let dominionList = require(DOMINION_FILE_PATH);


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

app.post('/api/v1/dominion', (req, res) => {
    let supplyList = [];
    let nonSupplyList = [];
    let returnSupply = [];
    let ruinsList = [];
    let selterList = [];
    let adventuresEventList = [];
    let empiresEventList = [];
    let randmarkList = [];
    let randomAdventuresEventList = [];
    let randomEmpiresEventList = [];
    let randomRandmarkList = [];
    let travelerList = [];
    let blessingList = [];
    let curseList = [];
    let heirloomList = [];
    let projectRandomList = [];
    let projectList = [];
    let randomMenagerieEventList = [];
    let menagerieEventList = [];
    let randomWayList = [];
    let wayList = [];

    let alchemyNonSupplySetFlag = false;
    let prosperityNonSupplySetFlag = false;
    let cornucopiaNonSupplySetFlag = false;
    let darkAgesNonSupplySetFlag = false;
    let ruinsSetFlag = false;
    let adventuresEventSetFlag = false;
    let empiresEventSetFlag = false;
    let randmarkEventSetFlag = false;
    let travelerSetFlag = false;
    let blessingSetFlag = false;
    let curseSetFlag = false;
    let willOWispSetFlag = false;
    let wishSetFlag = false;
    let impSetFlag = false;
    let batSetFlag = false;
    let zombieSetFlag = false;
    let ghostSetFlag = false;
    let projectSetFlag = false;
    let menagerieEventSetFlag = false;
    let waySetFlag = false;
    let menagerieNonSupplySetFlag = false;

    const adventuresEvent = Number(req.body.adventuresEvent);
    const empiresEvent = Number(req.body.empiresEvent);
    const randmark = Number(req.body.randmark);
    const project = Number(req.body.project);
    const menagerieEvent = Number(req.body.menagerieEvent);
    const way = Number(req.body.way);
    const traveler = req.body.traveler;

    // スタンダード版が選択されていた場合、
    if (req.body.standard) {
        dominionList.standard.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "基本",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 陰謀が選択されていた場合、
    if (req.body.intrigue) {
        dominionList.intrigue.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "陰謀",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 海辺が選択されていた場合、
    if (req.body.seaside) {
        dominionList.seaside.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "海辺",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 錬金術が選択されていた場合、
    if (req.body.alchemy) {
        dominionList.alchemy.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "錬金術",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 繁栄が選択されていた場合、
    if (req.body.prosperity) {
        dominionList.prosperity.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "繁栄",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 収穫祭が選択されていた場合、
    if (req.body.cornucopia) {
        dominionList.cornucopia.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "収穫祭",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 異郷が選択されていた場合、
    if (req.body.hinterlands) {
        dominionList.hinterlands.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "異郷",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 暗黒時代が選択されていた場合、
    if (req.body.darkAges) {
        dominionList.darkAges.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "暗黒時代",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // ギルドが選択されていた場合、
    if (req.body.guild) {
        dominionList.guild.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "ギルド",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // 冒険が選択されていた場合、
    if (req.body.adventures) {
        dominionList.adventures.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "冒険",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
        // 冒険のイベントが選択されていた場合、
        if (adventuresEvent > 0) {
            dominionList.adventures.event.forEach(a => {
                randomAdventuresEventList.push(
                    {
                        "name": a.name,
                        "series": "冒険",
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort,
                        "random": Math.floor(Math.random()*10000)
                    }
                )
            });
        }
    }
    // 帝国が選択されていた場合、
    if (req.body.empires) {
        dominionList.empires.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "帝国",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "split": a.split,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
        // ランドマークが選択されていた場合
        if (randmark > 0) {
            dominionList.empires.randmark.forEach(a => {
                randomRandmarkList.push(
                    {
                        "name": a.name,
                        "series": "帝国",
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort,
                        "random": Math.floor(Math.random()*10000)
                    }
                )
            });
        }
        // 帝国のイベントが選択されていた場合、
        if (empiresEvent > 0) {
            dominionList.empires.event.forEach(a => {
                randomEmpiresEventList.push(
                    {
                        "name": a.name,
                        "series": "帝国",
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort,
                        "random": Math.floor(Math.random()*10000)
                    }
                )
            });

        }
    }
    // 夜想曲が選択されていた場合、
    if (req.body.nocturne) {
        dominionList.nocturne.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "夜想曲",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // ルネサンスが選択されていた場合、
    if (req.body.renaissance) {
        dominionList.renaissance.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "ルネサンス",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
    }
    // ルネサンスのプロジェクトが選択されていた場合、
    if (project > 0) {
        dominionList.renaissance.project.forEach(a => {
            projectRandomList.push(
                {
                    "name": a.name,
                    "series": "ルネサンス",
                    "type": a.type,
                    "color": a.color,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        });
    }
    // 移動動物園が選択されていた場合、
    if (req.body.menagerie) {
        dominionList.menagerie.cardList.forEach(a => {
            supplyList.push(
                {
                    "name": a.name,
                    "series": "移動動物園",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "split": a.split,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        })
        dominionList.menagerie.way.forEach(a => {
            randomWayList.push(
                {
                    "name": a.name,
                    "series": "移動動物園",
                    "type": a.type,
                    "type2": a.type2,
                    "color": a.color,
                    "color2": a.color2,
                    "sort": a.sort,
                    "random": Math.floor(Math.random()*10000)
                }
            )
        });
        // 移動動物園のイベントが選択されていた場合、
        if (menagerieEvent > 0) {
            dominionList.menagerie.event.forEach(a => {
                randomMenagerieEventList.push(
                    {
                        "name": a.name,
                        "series": "移動動物園",
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort,
                        "random": Math.floor(Math.random()*10000)
                    }
                )
            });

        }
    }
    // 対象のカードを降順でソートして、１０件を配列に格納
    supplyList
    .sort((a, b) => {
        return a.random - b.random;
    })
    .forEach((a, index) => {
        if (index > 9) {
            return;
        }
        returnSupply.push(
            {
                "name": a.name,
                "series": a.series,
                "type": a.type,
                "type2": a.type2,
                "color": a.color,
                "color2": a.color2,
                "sort": a.sort
            }
        )
        // 錬金術のカードが存在する場合、ノンサプライのリストを追加
        if (a.sort === 4 && !alchemyNonSupplySetFlag) {
            dominionList.alchemy.nonSupplyList.forEach(b => {
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "錬金術",
                        "type": b.type,
                        "type2": b.type2,
                        "color": b.color,
                        "color2": b.color2,
                        "sort": b.sort
                    }  
                )
            });
            alchemyNonSupplySetFlag = true;
        }
        // 繁栄のカードが存在する場合、ノンサプライのリストを追加
        if (a.sort === 5 && !prosperityNonSupplySetFlag) {
            dominionList.prosperity.nonSupplyList.forEach(b => {
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "繁栄",
                        "type": b.type,
                        "type2": b.type2,
                        "color": b.color,
                        "color2": b.color2,
                        "sort": b.sort
                    }  
                )
            });
            prosperityNonSupplySetFlag = true;
        }
        // 収穫祭のカードが存在する場合、ノンサプライのリストを追加
        if (a.sort === 6 && !cornucopiaNonSupplySetFlag && a.name === '馬上槍試合') {
            dominionList.cornucopia.nonSupplyList.forEach(b => {
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "収穫祭",
                        "type": b.type,
                        "type2": b.type2,
                        "color": b.color,
                        "color2": b.color2,
                        "sort": b.sort
                    }  
                )
            });
            cornucopiaNonSupplySetFlag = true;
        }
        // 暗黒時代のカードが存在する場合、ノンサプライ、避難所のリストを追加
        if (a.sort === 8 && !darkAgesNonSupplySetFlag) {
            dominionList.darkAges.nonSupplyList.forEach(b => {
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "暗黒時代",
                        "type": b.type,
                        "type2": b.type2,
                        "color": b.color,
                        "color2": b.color2,
                        "sort": b.sort
                    }  
                )
            });
            dominionList.darkAges.selterList.forEach(b => {
                selterList.push(
                    {
                        "name": b.name,
                        "series": "暗黒時代",
                        "type": b.type,
                        "type2": b.type2,
                        "color": b.color,
                        "color2": b.color2,
                        "sort": b.sort
                    }  
                )
            });
            darkAgesNonSupplySetFlag = true;
        }
        // 暗黒時代のカードが存在する、かつ略奪者の場合、廃墟のリストを追加
        if (a.sort === 8 && !ruinsSetFlag && a.type2 === '略奪者') {
            dominionList.darkAges.ruins.forEach(b => {
                ruinsList.push(
                    {
                        "name": b.name,
                        "series": "暗黒時代",
                        "type": b.type,
                        "type2": b.type2,
                        "color": b.color,
                        "color2": b.color2,
                        "sort": b.sort
                    }  
                )
            });
            ruinsSetFlag = true;
        }
        // 冒険時代のカードが存在する場合、イベントのリストを追加
        if (a.sort === 10 && !adventuresEventSetFlag) {
            randomAdventuresEventList
            .sort((a, b) => {
                return a.random - b.random;
            })
            .forEach((a, index) => {
                if (index >= adventuresEvent) {
                    return;
                }
                adventuresEventList.push(
                    {
                        "name": a.name,
                        "series": a.series,
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort
                    }
                )
            });
            adventuresEventSetFlag = true;
        }
        if (a.sort === 10 && !travelerSetFlag) {
            // トラベラー、騎士見習いが選択されていた場合
            if (traveler === '1') {
                for (let i = 0; i < 5; i++) {
                    travelerList.push(
                        {
                            "name": dominionList.adventures.traveler[i].name,
                            "series": "冒険",
                            "type": dominionList.adventures.traveler[i].type,
                            "type2": dominionList.adventures.traveler[i].type2,
                            "color": dominionList.adventures.traveler[i].color,
                            "color2": dominionList.adventures.traveler[i].color2,
                            "sort": dominionList.adventures.traveler[i].sort
                        }
                    )
                }
            }
            // トラベラー、教師が選択されていた場合
            if (traveler === '2') {
                for (let i = 5; i < 10; i++) {
                    travelerList.push(
                        {
                            "name": dominionList.adventures.traveler[i].name,
                            "series": "冒険",
                            "type": dominionList.adventures.traveler[i].type,
                            "type2": dominionList.adventures.traveler[i].type2,
                            "color": dominionList.adventures.traveler[i].color,
                            "color2": dominionList.adventures.traveler[i].color2,
                            "sort": dominionList.adventures.traveler[i].sort
                        }
                    )
                }
            }
            // トラベラー、両方が選択されていた場合
            if (traveler === '3') {
                for (let i = 0; i < 10; i++) {
                    travelerList.push(
                        {
                            "name": dominionList.adventures.traveler[i].name,
                            "series": "冒険",
                            "type": dominionList.adventures.traveler[i].type,
                            "type2": dominionList.adventures.traveler[i].type2,
                            "color": dominionList.adventures.traveler[i].color,
                            "color2": dominionList.adventures.traveler[i].color2,
                            "sort": dominionList.adventures.traveler[i].sort
                        }
                    )
                }
            }
            travelerSetFlag = true;
        }
        // 帝国のカードが存在する場合、イベントのリストを追加
        if (a.sort === 11 && !empiresEventSetFlag) {
            randomEmpiresEventList
            .sort((a, b) => {
                return a.random - b.random;
            })
            .forEach((a, index) => {
                if (index >= empiresEvent) {
                    return;
                }
                empiresEventList.push(
                    {
                        "name": a.name,
                        "series": a.series,
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort
                    }
                )
            });
            empiresEventSetFlag = true;
        }
        // 帝国のカードが存在する場合、ランドマークのリストを追加
        if (a.sort === 11 && !randmarkEventSetFlag) {
            randomRandmarkList
            .sort((a, b) => {
                return a.random - b.random;
            })
            .forEach((a, index) => {
                if (index >= randmark) {
                    return;
                }
                randmarkList.push(
                    {
                        "name": a.name,
                        "series": a.series,
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort
                    }
                )
            });
            randmarkEventSetFlag = true;
        }
        if (a.sort === 11 && a.split !== "") {
            returnSupply.push(
                {
                    "name": a.split.name,
                    "series": "帝国",
                    "type": a.split.type,
                    "type2": a.split.type2,
                    "color": a.split.color,
                    "color2": a.split.color2,
                    "sort": a.sort
                }
            )
        }
        // 悪魔祓いが存在する場合、精霊カードを追加
        if (a.sort === 12 && a.name === '悪魔祓い') {
            dominionList.nocturne.nonSupplyList.forEach(b => {
                if (b.type2 !== '精霊') {
                    return;
                }
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "夜想曲",
                        "type": b.type,
                        "type2": b.type2,
                        "type3": b.type3,
                        "color": b.color,
                        "color2": b.color2,
                        "color3": b.color3,
                        "sort": b.sort
                    }
                )
                willOWispSetFlag = true;
                impSetFlag = true;
                ghostSetFlag = true;
            })
        }
        // 幸運のカードが存在する場合、祝福カードを追加
        if (a.sort === 12 && a.type2 === '幸運' && !blessingSetFlag) {
            dominionList.nocturne.blessing.forEach(b => {
                blessingList.push(
                    {
                        "name": b.name,
                        "series": "夜想曲",
                        "type": b.type,
                        "color": b.color,
                        "sort": b.sort
                    }  
                )
            });
            blessingSetFlag = true;
            // 祝福カードが存在する場合、ウィル・オ・ウィスプを追加
            if (!willOWispSetFlag) {
                nonSupplyList.push(
                    {
                        "name": "ウィル・オ・ウィスプ",
                        "series": "夜想曲",
                        "type": "アクション",
                        "type2": "精霊",
                        "type3": "",
                        "color": "#fff",
                        "color2": "#fff",
                        "color3": "#fff",
                        "sort": a.sort
                    }
                )
                willOWispSetFlag = true;
            }
            // 祝福カードが存在する場合、ゴーストを追加
            if (!ghostSetFlag) {
                nonSupplyList.push(
                    {
                        "name": "幽霊",
                        "series": "夜想曲",
                        "type": "夜行",
                        "type2": "精霊",
                        "type3": "持続",
                        "color": "#333333",
                        "color2": "#fff",
                        "color3": "#FFCC99",
                        "sort": a.sort
                    }
                )
                ghostSetFlag = true;
            }
        }
        // 不運のカードが存在する場合、呪詛カードを追加
        if (a.sort === 12 && a.type2 === '不運' && !curseSetFlag) {
            dominionList.nocturne.curse.forEach(b => {
                curseList.push(
                    {
                        "name": b.name,
                        "series": "夜想曲",
                        "type": b.type,
                        "color": b.color,
                        "sort": b.sort
                    }  
                )
            });
            curseSetFlag = true;
        }
        // レプラコーン、秘密の洞窟が存在する場合、願いを追加
        if (a.sort === 12 && !wishSetFlag && 
            (a.name === 'レプラコーン' || a.name === '秘密の洞窟')
           ) 
        {
            nonSupplyList.push(
                {
                    "name": "願い",
                    "series": "夜想曲",
                    "type": "アクション",
                    "type2": "",
                    "type3": "",
                    "color": "#fff",
                    "color2": "#fff",
                    "color3": "#fff",
                    "sort": a.sort
                }
            )
            wishSetFlag = true;
        }
        // 悪魔の工房、迫害者が存在する場合、インプを追加
        if (a.sort === 12 && !impSetFlag && 
            (a.name === '悪魔の工房' || a.name === '迫害者')
        ) 
        {
            nonSupplyList.push(
                {
                    "name": "インプ",
                    "series": "夜想曲",
                    "type": "アクション",
                    "type2": "精霊",
                    "type3": "",
                    "color": "#fff",
                    "color2": "#fff",
                    "color3": "#fff",
                    "sort": a.sort
                }
            )
            impSetFlag = true;
        }
        // 吸血鬼が存在する場合、コウモリを追加
        if (a.sort === 12 && !batSetFlag && 
            (a.name === '吸血鬼')
        ) 
        {
            nonSupplyList.push(
                {
                    "name": "コウモリ",
                    "series": "夜想曲",
                    "type": "夜行",
                    "type2": "",
                    "type3": "",
                    "color": "#333333",
                    "color2": "#fff",
                    "color3": "#fff",
                    "sort": a.sort
                }
            )
            batSetFlag = true;
        }
        // ネクロマンサーが存在する場合、ゾンビを追加
        if (a.sort === 12 && !zombieSetFlag && 
            (a.name === 'ネクロマンサー')
        ) 
        {
            dominionList.nocturne.nonSupplyList.forEach(b => {
                if (b.type2 !== 'ゾンビ') {
                    return;
                }
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "夜想曲",
                        "type": b.type,
                        "type2": b.type2,
                        "type3": b.type3,
                        "color": b.color,
                        "color2": b.color2,
                        "color3": b.color3,
                        "sort": b.sort
                    }
                )    
            })
            zombieSetFlag = true;
        }
        // 家宝カードの設定　heirloomList
        // 墓地が存在する場合、呪いの鏡を追加
        if (a.sort === 12 && a.name === '墓地') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.呪いの鏡.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.呪いの鏡.type,
                    "type2": dominionList.nocturne.heirloom.呪いの鏡.type2,
                    "type3": dominionList.nocturne.heirloom.呪いの鏡.type3,
                    "color": dominionList.nocturne.heirloom.呪いの鏡.color,
                    "color2": dominionList.nocturne.heirloom.呪いの鏡.color2,
                    "color3": dominionList.nocturne.heirloom.呪いの鏡.color3,
                    "sort": dominionList.nocturne.heirloom.呪いの鏡.sort
                }
            )
        }
        // 秘密の洞窟が存在する場合、魔法のランプを追加
        if (a.sort === 12 && a.name === '秘密の洞窟') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.魔法のランプ.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.魔法のランプ.type,
                    "type2": dominionList.nocturne.heirloom.魔法のランプ.type2,
                    "type3": dominionList.nocturne.heirloom.魔法のランプ.type3,
                    "color": dominionList.nocturne.heirloom.魔法のランプ.color,
                    "color2": dominionList.nocturne.heirloom.魔法のランプ.color2,
                    "color3": dominionList.nocturne.heirloom.魔法のランプ.color3,
                    "sort": dominionList.nocturne.heirloom.魔法のランプ.sort
                }
            )
            // 願いがセットされていない場合はセット
            if (!wishSetFlag) {
                nonSupplyList.push(
                    {
                        "name": "願い",
                        "series": "夜想曲",
                        "type": "アクション",
                        "type2": "",
                        "type3": "",
                        "color": "#fff",
                        "color2": "#fff",
                        "color3": "#fff",
                        "sort": a.sort
                    }
                )
                wishSetFlag = true;
            }
        }
        // ピクシーが存在する場合、ヤギを追加
        if (a.sort === 12 && a.name === 'ピクシー') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.ヤギ.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.ヤギ.type,
                    "type2": dominionList.nocturne.heirloom.ヤギ.type2,
                    "type3": dominionList.nocturne.heirloom.ヤギ.type3,
                    "color": dominionList.nocturne.heirloom.ヤギ.color,
                    "color2": dominionList.nocturne.heirloom.ヤギ.color2,
                    "color3": dominionList.nocturne.heirloom.ヤギ.color3,
                    "sort": dominionList.nocturne.heirloom.ヤギ.sort
                }
            )
        }
        // 羊飼いが存在する場合、牧草地を追加
        if (a.sort === 12 && a.name === '羊飼い') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.牧草地.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.牧草地.type,
                    "type2": dominionList.nocturne.heirloom.牧草地.type2,
                    "type3": dominionList.nocturne.heirloom.牧草地.type3,
                    "color": dominionList.nocturne.heirloom.牧草地.color,
                    "color2": dominionList.nocturne.heirloom.牧草地.color2,
                    "color3": dominionList.nocturne.heirloom.牧草地.color3,
                    "sort": dominionList.nocturne.heirloom.牧草地.sort
                }
            )
        }
        // 追跡者が存在する場合、革袋を追加
        if (a.sort === 12 && a.name === '追跡者') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.革袋.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.革袋.type,
                    "type2": dominionList.nocturne.heirloom.革袋.type2,
                    "type3": dominionList.nocturne.heirloom.革袋.type3,
                    "color": dominionList.nocturne.heirloom.革袋.color,
                    "color2": dominionList.nocturne.heirloom.革袋.color2,
                    "color3": dominionList.nocturne.heirloom.革袋.color3,
                    "sort": dominionList.nocturne.heirloom.革袋.sort
                }
            )
        }
        // 愚者が存在する場合、幸運のコインを追加
        if (a.sort === 12 && a.name === '愚者') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.幸運のコイン.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.幸運のコイン.type,
                    "type2": dominionList.nocturne.heirloom.幸運のコイン.type2,
                    "type3": dominionList.nocturne.heirloom.幸運のコイン.type3,
                    "color": dominionList.nocturne.heirloom.幸運のコイン.color,
                    "color2": dominionList.nocturne.heirloom.幸運のコイン.color2,
                    "color3": dominionList.nocturne.heirloom.幸運のコイン.color3,
                    "sort": dominionList.nocturne.heirloom.幸運のコイン.sort
                }
            )
        }
        // プーカが存在する場合、呪われた金貨を追加
        if (a.sort === 12 && a.name === 'プーカ') {
            heirloomList.push(
                {
                    "name": dominionList.nocturne.heirloom.呪われた金貨.name,
                    "series": "夜想曲",
                    "type": dominionList.nocturne.heirloom.呪われた金貨.type,
                    "type2": dominionList.nocturne.heirloom.呪われた金貨.type2,
                    "type3": dominionList.nocturne.heirloom.呪われた金貨.type3,
                    "color": dominionList.nocturne.heirloom.呪われた金貨.color,
                    "color2": dominionList.nocturne.heirloom.呪われた金貨.color2,
                    "color3": dominionList.nocturne.heirloom.呪われた金貨.color3,
                    "sort": dominionList.nocturne.heirloom.呪われた金貨.sort
                }
            )
        }
        // ルネサンスのカードが存在する場合、プロジェクトのリストを追加
        if (a.sort === 13 && !projectSetFlag) {
            projectRandomList
            .sort((a, b) => {
                return a.random - b.random;
            })
            .forEach((a, index) => {
                if (index >= project) {
                    return;
                }
                projectList.push(
                    {
                        "name": a.name,
                        "series": a.series,
                        "type": a.type,
                        "type2": a.type2,
                        "color": a.color,
                        "color2": a.color2,
                        "sort": a.sort
                    }
                )
            });
            projectSetFlag = true;
        }
        // 移動動物園のカードが存在する場合、イベント,習性のリストを追加
        if (a.sort === 14) {
            if (!menagerieEventSetFlag) {
                randomMenagerieEventList
                .sort((a, b) => {
                    return a.random - b.random;
                })
                .forEach((a, index) => {
                    if (index >= menagerieEvent) {
                        return;
                    }
                    menagerieEventList.push(
                        {
                            "name": a.name,
                            "series": a.series,
                            "type": a.type,
                            "type2": a.type2,
                            "color": a.color,
                            "color2": a.color2,
                            "sort": a.sort
                        }
                    )
                });
                menagerieEventSetFlag = true;
            }
            if (!waySetFlag) {
                randomWayList
                .sort((a, b) => {
                    return a.random - b.random;
                })
                .forEach((a, index) => {
                    if (index >= way) {
                        return;
                    }
                    wayList.push(
                        {
                            "name": a.name,
                            "series": a.series,
                            "type": a.type,
                            "type2": a.type2,
                            "color": a.color,
                            "color2": a.color2,
                            "sort": a.sort
                        }
                    )
                });
                waySetFlag = true;
            }
        }
        // 移動動物園が存在する場合、馬を追加
        if (a.sort === 14 && !menagerieNonSupplySetFlag) {
            dominionList.menagerie.nonSupplyList.forEach(b => {
                nonSupplyList.push(
                    {
                        "name": b.name,
                        "series": "移動動物園",
                        "type": b.type,
                        "type2": b.type2,
                        "type3": b.type3,
                        "color": b.color,
                        "color2": b.color2,
                        "color3": b.color3,
                        "sort": b.sort
                    }
                )
            })
            menagerieNonSupplySetFlag = true;
        }
    });
    res.json({
        "supplyList":
        returnSupply.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "nonSupplyList":
        nonSupplyList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "selterList":
        selterList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "ruinsList":
        ruinsList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "travelerList":
        travelerList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "adventuresEventList":
        adventuresEventList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "empiresEventList":
        empiresEventList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "randmarkList":
        randmarkList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "blessingList":
        blessingList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "curseList":
        curseList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "heirloomList":
        heirloomList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "projectList":
        projectList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "menagerieEventList":
        menagerieEventList.sort((a, b) => {
            return a.sort - b.sort;
        }),
        "wayList":
        wayList.sort((a, b) => {
            return a.sort - b.sort;
        })
    });
});

app.get('*', (req, res) => {
    res.json({
        message: 'サーバーが起動しています。',
    })
});
  
app.listen(PORT, () => console.log(`> Ready on http://localhost:${PORT}`));
