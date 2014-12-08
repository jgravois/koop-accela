module.exports = {
  //'post /accela': 'register',
  //'get /accela': 'list',
  //'get /accela/:id': 'find',

  //'get /accela/:id/:item.:format': 'findResource',
  'get /accela/:item': 'item',
  'post /accela/:item': 'item',
  'get /accela/:item/FeatureServer/:layer/:method': 'featureserver',
  'get /accela/:item/FeatureServer/:layer': 'featureserver',
  'get /accela/:item/FeatureServer': 'featureserver',
  'post /accela/:item/FeatureServer/:layer/:method': 'featureserver',
  'post /accela/:item/FeatureServer/:layer': 'featureserver',
  'post /accela/:item/FeatureServer': 'featureserver',

  //'get /accela/:id/:item/thumbnail': 'thumbnail',
  //'get /accela/:id/:item/tiles/:z/:x/:y.:format': 'tiles',
  //'delete /accela/:id': 'del',
  //'get /accela/:item/preview': 'preview',
  //'get /accela/:id/:item/drop': 'drop'
}