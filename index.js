import request from 'request'
import url from 'url'
import querystring from 'querystring'

const Geocode = {};

Geocode.location = function (config, callback, apiKey) {
    if (!config || !callback) {
        throw new Error('Invalid arguments number.');
    } else if (!config.latitude || !config.longitude) {
        throw new Error('Latitude or Longitude not found.');
    }

    let latitude = config.latitude;
    let longitude = config.longitude;
    let map = config.map;

    delete config.latitude;
    delete config.longitude;

    let address = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude;

    if (apiKey) {
        address = address + '&key=' + querystring.stringify(apiKey)
    }

    switch (map) {
        case 'baidu':
            address = 'http://api.map.baidu.com/geocoder/v2/?output=json&location=' + latitude + ',' + longitude;
            break;
        case 'opencage':
            address = 'https://api.opencagedata.com/geocode/v1/json?q=' + latitude + ',' + longitude;
            break;
        default:
            break;
    }

    delete config.map;

    address += '&' + querystring.stringify(config);

    try {
        request(address, function (error, response, body) {
            if (error) {
                callback(error);
                return;
            }

            var data = JSON.parse(body);

            //be ware, every interface return back data was not same.
            if (data.status === 'OK' || data.status === 0 || data.status.message === 'OK') {
                callback(undefined, data);
            } else {
                callback(data.status);
            }
        });
    } catch (err) {
        callback(err);
    }
};


export default Geocode
