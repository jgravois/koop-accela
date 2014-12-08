//var citybikes = require('citybikes-js'),
  extend = require('node.extend'),
  BaseController = require('koop-server/lib/BaseController.js');

// inherit from base controller
var Controller = function(Accela) {

  var controller = {};
  controller.__proto__ = BaseController();

  // general helper for not found repos
  controller.notFound = function(req, res) {
    res.send('Must specify a valid item id in request', 404);
  };

  // renders an empty map with a text input
  controller.index = function(req, res) {
    res.render(__dirname + '/../views/index');
  };

  // general helper for error'd requests
  function sendError(req, res) {
    res.send('There was a problem...', 500);
  };

  function getItem(req, res, forFeatureServer) {
    var key = ['accela'];

    var callback = req.query.callback;
    delete req.query.callback;

    if ( req.params.item ){
        Accela.find(req.params.item, req.query, callback = function(err, itemData ){
          if(!err) {
            if (forFeatureServer !== false) {
              delete req.query.geometry;
              //why not Controller._processFeatureServer...
              controller.processFeatureServer(req, res, err, itemData);
            } else {
              res.json(itemData[0], 200);
            }
          } else {
            sendError(req, res);
          }


        });
      } else {
        controller.notFound(req, res);
      }
  }

  controller.item = function(req, res) {
    getItem(req, res, false);
  }

  controller.featureserver = function(req, res) {
    getItem(req, res);
  }

  return controller;
}

module.exports = Controller;