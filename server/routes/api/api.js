const express = require('express');
const router = express.Router();
const request = require('request');
import mongoose from 'mongoose';



router.get('/exchange/btc', function (req, res, next) {
  let start = Date.now();
  const { MarketModel } = req.models;
  MarketModel.find({}, (err, markets) => {
    markets.forEach((market) => {
      console.log(market.Name);
      console.log(market.updatedAt);
      console.log(new Date(market.updatedAt).getTime());
    });
  });
  request("https://www.binance.com/api/v1/ticker/allPrices", function (err, response, body) {
    if (response && response.statusCode == 200) {
      const data = JSON.parse(body);
      const result = data.filter(paires => paires.symbol.endsWith('BTC') || paires.symbol === 'BTCUSDT');
      //récuperer en base de données les Markets, et y ajouter les prix dans currentValue et "binance" dans availableOn
      //si USDT alors ajouter le prix a BTC 
      //cela mettra a jour le updatedAt
      request("https://bittrex.com/api/v1.1/public/getmarketsummaries", function (err, response, body) {
        console.log("REPONSE RECU = " + (Date.now() - start))
        //on recupera le updatedAt et on mettra a jour uniquement les données updaté il y a plus de X minutes (les données qui ne sont pas sur binance)
        //"MarketName": "BTC-LTC",
        //"Last": 0.01752,
      });
      return res.json(result);
    } else {
      return res.json({ "error": "fail to fetch data from binance" })
    }
  });
  // request("https://www.binance.com/exchange/public/product", function (err, response, body) {
  //   if (response && response.statusCode == 200) {
  //     const { data } = JSON.parse(body);
  //     console.log("REPONSE RECU = " + (Date.now() - start))
  //     const result = data.filter(paires => paires.quoteAsset === 'BTC' || paires.symbol === 'BTCUSDT');
  //     return res.json(result);
  //   } else {
  //     return res.json({ "error": "fail to fetch data from binance" })
  //   }
  // });
});
router.get('/test', function (req, res, next) {
  return res.json("result");
});
/**
 * Create the market collection in mongodb with all currencies
 */
router.get('/add/coinlist', function (req, res, next) {
  const { MarketModel } = req.models;
  request("https://www.cryptocompare.com/api/data/coinlist/", function (err, response, body) {
    if (response && response.statusCode == 200) {
      const { Data } = JSON.parse(body);
      const nbTotalCoins = Object.keys(Data).length;
      let nbCoinsSaved = 1;
      for (var prop in Data) {
        const { Id, Url, ImageUrl, Name, CoinName, FullName, SortOrder } = Data[prop];
        const coin = new MarketModel({ Id, Url, ImageUrl, Name, CoinName, FullName, SortOrder });
        coin.save(function (err, data) {
          nbCoinsSaved++;
          if (err) console.log(err.message);
          if (nbTotalCoins === nbCoinsSaved) {
            return res.json({ msg: `All ${nbCoinsSaved} coins has been added` });
          }
        });
      }
    } else {
      return res.json({ "error": "fail to fetch data from binance" })
    }
  });
});


module.exports = router;
