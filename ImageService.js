var restify = require('restify');
var imageSave = require('save')('image');

var svc = function() {
    this.server = restify.createServer( { name: 'imageserver-api'} );

    this.server
      .use(restify.fullResponse())
      .use(restify.bodyParser());

    this.server.get('/image', function(req, res, next) {
        imageSave.find({ }, function(error, images) {
            res.send(images);
        });
    });

    this.server.get('/image/:id', function(req, res, next) {
        imageSave.findOne({ _id: req.params.id }, function(error, image) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));

            if (image) {
                res.send(image);
            } else {
                res.send(404);
            }
        });
    })

    this.server.post('/image', function(req, res, next) {
        if (req.params.blob === undefined) {
            return next(new restify.InvalidArgumentError('Image must be supplied'));
        }

        imageSave.create({blob: req.params.blob}, function(error, image) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));

            res.send(201, image);
        });
    });

    this.server.put('/image/:id/data', function (req, res, next) {
        if (req.params.blob === undefined) {
            return next(new restify.InvalidArgumentError('Image must be supplied'));
        }

        imageSave.update({ _id: req.params.id, blob: req.params.blob }, function (error, image) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));

            res.send();
        });
    });

    this.server.get('/image/:id/data', function(req, res, next) {
        imageSave.findOne({ _id: req.params.id }, function(error, image) {
            if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));

            if (image) {
                res.send(image);
            } else {
                res.send(404);
            }
        });
    })

    this.server.del('/image/:id', function (req, res, next) {
      imageSave.delete(req.params.id, function (error, image) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));

        res.send();
      });
    });
};

svc.prototype.start = function(onStart) {
    this.server.listen(3000, function() {
        onStart(this.server.name + ' listening at ' + this.server.url);
    }.bind(this));
}

svc.prototype.stop = function(onStop) {
    this.server.close( function() {
        onStop(this.server.name + ' shut down.');
    }.bind(this));
}

function createService() {
    return new svc();
}

module.exports = {
    createService:  createService
};


