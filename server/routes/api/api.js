const express = require('express');
const router = express.Router();
const request = require('request');
import mongoose from 'mongoose';

const WebSocket = require('ws');



router.get('/binance/btc', function (req, res, next) {
  let start = Date.now();
  request("https://www.binance.com/exchange/public/product", function (err, response, body) {
    if (response && response.statusCode == 200) {
      const { data } = JSON.parse(body);
      console.log("REPONSE RECU = " + (Date.now() - start))
      const result = data.filter(paires => paires.quoteAsset === 'BTC' || paires.symbol === 'BTCUSDT');
      return res.json(result);
    } else {
      return res.json({ "error": "fail to fetch data from binance" })
    }
  });
});

router.get('/coinlist', function (req, res, next) {
  const { CoinModel } = req.models;
  request("https://www.cryptocompare.com/api/data/coinlist/", function (err, response, body) {
    if (response && response.statusCode == 200) {
      const { Data } = JSON.parse(body);
      for (var prop in Data) {
        const { Id, Url, ImageUrl, Name, CoinName, FullName, SortOrder } = Data[prop];
        const coin = new CoinModel({ Id, Url, ImageUrl, Name, CoinName, FullName, SortOrder });
        coin.save(function (err, data) {
          if (err) console.log(err.message);
        });
      }
      return res.json({ res: "OK" });
    } else {
      return res.json({ "error": "fail to fetch data from binance" })
    }
  });
});


router.get('/wss', function (req, res, next) {
  var ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
  ws.on('open', function () {
    console.log('open!!!');
  });
  ws.on('message', (json) => {
    let response = JSON.parse(json);
    console.log(response);
  });
});

module.exports = router;
