'use strict';

exports.handler = (event, context, callback) => {
    console.log('DEBUG: Name is ' + event.name);
    callback(null, "Hello" + event.name);
}