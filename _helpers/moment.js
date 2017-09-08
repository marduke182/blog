var moment  = require('moment');
var _       = require('lodash');

module.exports = function(context, block) {
  if (context && context.hash) {
    block = _.cloneDeep(context);
    context = undefined;
  }
  var date = moment(context);

  for (var i in block.hash) {
    if (date[i]) {
      date = date[i](block.hash[i]);
    } else {
      console.log('moment.js does not support "' + i + '"');
    }
  }
  return date;
};
