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
proj4 = require('proj4'),
request = require('request');

var Accela = function(koop) {  //maybe accela too?

  var accela = {};
  accela.__proto__ = BaseModel(accela);

  proj4.defs('EPSG:2264', 'PROJCS["NAD83 / North Carolina (ftUS)",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",36.16666666666666],PARAMETER["standard_parallel_2",34.33333333333334],PARAMETER["latitude_of_origin",33.75],PARAMETER["central_meridian",-79],PARAMETER["false_easting",2000000],PARAMETER["false_northing",0],UNIT["US survey foot",0.3048006096012192,AUTHORITY["EPSG","9003"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","2264"]]');

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

    var coords = proj4( "EPSG:2264", 'WGS84' ).forward([parseInt(workItem.X_COORD), parseInt(workItem.Y_COORD)]);
    var latitude = coords[0];
    var longitude = coords[1];

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        //need to reproject these State Plane coordinates to WGS84
        "coordinates": [latitude, longitude]
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