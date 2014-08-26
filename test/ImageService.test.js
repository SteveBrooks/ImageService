var should = require('chai').should();
var request = require('supertest');
var svc = require('../ImageService.js');
var http = require('http');

var url = 'http://localhost:3000';

describe('ImageService', function() {

    var s = svc.createService();

    before( function(done) {
        s.start( function(startStatus) {
            console.log(startStatus);
            done();
        });
    });

    after( function(done) {
        s.stop( function(stopStatus) {
            console.log(stopStatus);
            done();
        });
    });

    function Post(data,onPost) {
        request(url)
            .post('/image')
            .send(data)
            .expect('Content-Type', /json/)
            .expect(201) //Status code
            .end(onPost);
    }

    function GetAll(onGet) {
        request(url)
            .get('/image')
            .expect('Content-Type', /json/)
            .expect(200) //Status code
            .end(onGet);
    }

    function Get(id,onGet) {
        request(url)
            .get('/image/' + id)
            .expect('Content-Type', /json/)
            .expect(200) //Status code
            .end(onGet);
    }

    function GetNonexistant(id,onGet) {
        request(url)
            .get('/image/' + id)
            .expect(404) //Status code
            .end(onGet);
    }

    function Put(id,data,onPut) {
        request(url)
            .put('/image/' + id + '/data')
            .send(data)
            .expect(200) //Status code
            .end(onPut);
    }

    function Delete(id,onDelete) {
        request(url)
            .delete('/image/' + id)
            .expect(200) //Status code
            .end(onDelete);
    }

    it('should support image CRUD operations', function(done) {
        var d0 = { blob: '<ImageData>' };
        var d1 = { blob: '<ModifiedImageData>' };

        // POST
        Post(d0, function(err,res) {
            if (err) { throw err; }
            res.body.should.have.property('_id');
            res.body.blob.should.equal(d0.blob);

            // GET
            Get(res.body._id, function(err,res) {
                var item = null;
                if (err) { throw err; }
                //res.body.should.be.a('array');
                //res.body.length.should.be.equal(1);
                item = res.body;
                item.should.have.property('_id');
                item.blob.should.equal(d0.blob);

                // PUT
                Put(item._id, d1, function(err,res) {
                    if (err) { throw err; }

                    // GET
                    Get(item._id, function(err,res) {
                        var item2 = null;
                        if (err) { throw err; }
                        item2 = res.body;
                        item2.blob.should.equal(d1.blob);

                        // DELETE
                        Delete(item._id, function(err,res) {
                            if (err) { throw err; }

                            // GET
                            GetNonexistant(item._id, function(err,res) {
                                var item2 = null;
                                if (err) { throw err; }
                                console.log(res.body);
                                //res.body.should.be.equal(0);

                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});
