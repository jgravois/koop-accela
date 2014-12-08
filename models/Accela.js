/*

The three resources that need translated
http://www.civicdata.com/api[3?]/action/datastore_search?resource_id=e53f0901-62fb-443d-a22c-9a5afc851aef
bfd101f6-1875-4803-aa1f-5fef91e53303
c0f1d950-3b2a-4640-9bd6-85bf021431ae

http://www.civicdata.com/api/3/action/datastore_search?resource_id=c0f1d950-3b2a-4640-9bd6-85bf021431ae

Wishlist
an RSS provider for this:
http://maps.cmpd.org/datafeeds/accidentsgeorss.ashx

http://localhost:1337/accela/e53f0901-62fb-443d-a22c-9a5afc851aef

to do:
reproject coordinates to lat/long
leverage cache
try /api/3/ if call to /api/ fails
return featureCollection?
?
*/

BaseModel = require('koop-server/lib/BaseModel.js'),
_ = require('lodash'),
request = require('request');

var Accela = function(koop) {  //maybe accela too?

  var accela = {};
  accela.__proto__ = BaseModel(accela);

  accela.find = function(item, options, callback) {
    //better to round robin between /api/ and /api/3/ ?
    baseUrl = 'http://www.civicdata.com/api/action/datastore_search';

    var key = [item].join('/'),
    type = 'Accela';

    koop.Cache.get(type, key, options, function(err, entry) {
      if (err) {
        request(baseUrl + '?resource_id=' + item, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            accelaFeatures = {
              data: _.indexBy(_.map(JSON.parse(body).result.records, geoJSONify), 'id')
            };
            var done = [{ features: [] }];
            for (i=0; i <= JSON.parse(body).result.records.length - 1; i++) {
              done[0].features.push(geoJSONify(JSON.parse(body).result.records[i]));
            }
            //koop.Cache.insert( type, key...
            return callback(null, done);
            //return callback(null, processOutput(accelaFeatures));

          } else {
            return callback(error, null);
          }
        });
      } else {
        console.log("cached!")
        callback(null, entry);
      }
    });
  }

  function geoJSONify(item) {
    var workItem = item;
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        //need to reproject these State Plane coordinates to WGS84
        "coordinates": [workItem.X_COORD, workItem.Y_COORD]
        //"coordinates": [-110, 45]
      },
      //"properties": workItem,
      "properties": _.omit(workItem, ['X_COORD', 'Y_COORD', '_id']),
      "id": workItem._id
    };
  }

  //get nick to explain what this function did
  function processOutput(output) {
    //pretty much no idea whats going on here...
    return _.values(_.mapValues(_.cloneDeep(output.data), function(n) {
      return n;
    }));
  }

  return accela;
};

module.exports = Accela;