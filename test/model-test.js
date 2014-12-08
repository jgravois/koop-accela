var should = require('should'),
    config = require('config'),
    koopserver = require('koop-server')(config);

global.config = config;

before(function (done) {
  global['Github'] = require('../models/Accela.js');
  done();
});

describe('Accela Model', function(){
  // TODO: Add tests
});
