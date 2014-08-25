var svc = require('./ImageService.js');

svc.createService().start( function(startStatus) {
    console.log(startStatus);
});
