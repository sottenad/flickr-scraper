/*==============================================*/
var SEARCH_TERM = 'hotel';
var MIN_WIDTH = 636;
var NUMBER_OF_PHOTOS = 150; //Max is 500
var CREATIVE_COMMONS = false;
var SORT_ORDER = 'relevance';
/*==============================================*/


var _ = require('underscore');
var request = require('request');
var fs = require('fs');

var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "b242f763323669340ff6ba3581919bb4",
      secret: "67ecc423be339724"
    };


var getImages = function(){
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
        flickr.photos.search({
            text: SEARCH_TERM,
            sort: 'interestingness-desc',
            //is_commons: CREATIVE_COMMONS, //Keep it to creative commons files
            per_page: NUMBER_OF_PHOTOS
        }, function(err, result) {
          if(err) { throw new Error(err); }
          // do something with result
            var photos = result.photos.photo
            var photoCount = 0;
            _.each(photos, function(value, key, list){
                flickr.photos.getSizes({
                    photo_id: value.id}, function(error, image){
                    var sizes = image.sizes.size;
                    for(var i=0; i<sizes.length; i++){
                        var w = sizes[i].width;
                        if(w > MIN_WIDTH){
                            console.log(sizes[i].source);
                            download(sizes[i].source, 'images/image-'+photoCount+'.png', function(){});
                            photoCount++;
                            break;
                        }
                    }
                    
                });
            });

        });
    });
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

getImages();


