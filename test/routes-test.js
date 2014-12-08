var should = require('should'),
    request = require('supertest'),
    config = require('config'),
    koop = require('koop-server')(config);

global.config = config;

before(function (done) {
  Cache.db = PostGIS.connect( config.db.postgis.conn );
  try { koop.register(require("../index.js")); } catch(e){ console.log('Error require ../index', e); }
  //console.log(koop)
  done(); 
});

describe('Koop Routes', function(){
  // TODO - add tests
});
