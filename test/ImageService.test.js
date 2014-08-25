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

    it('should support image CRUD operations', function(done) {

        // POST - Create
        request(url)
            .post('/image')
            .send({ blob: '<ImageData>' })
            .expect('Content-Type', /json/)
            .expect(201) //Status code
            .end(function(err,res) {
                if (err) { throw err; }
                res.body.should.have.property('_id');
                res.body.blob.should.equal('<ImageData>');

                // GET by ID
                request(url)
                    .get('/image?_id=' + res.body._id)
                    .expect('Content-Type', /json/)
                    .expect(200) //Status code
                    .end(function(err,res) {
                        var item = null;
                        if (err) { throw err; }
                        res.body.should.be.a('array');
                        res.body.length.should.be.equal(1);
                        item = res.body[0];
                        item.should.have.property('_id');
                        item.blob.should.equal('<ImageData>');

                        // PUT update
                        request(url)
                            .put('/image/' + item._id)
                            .send({ blob: '<ModifiedImageData>' })
                            .expect(200) //Status code
                            .end(function(err,res) {
                                if (err) { throw err; }

                                // GET by ID
                                request(url)
                                    .get('/image?_id=' + item._id)
                                    .expect('Content-Type', /json/)
                                    .expect(200) //Status code
                                    .end(function(err,res) {
                                        var item2 = null;
                                        if (err) { throw err; }
                                        res.body.should.be.a('array');
                                        res.body.length.should.be.equal(1);
                                        item2 = res.body[0];
                                        item2.should.have.property('_id');
                                        item2.blob.should.equal('<ModifiedImageData>');

                                        // DELETE
                                        request(url)
                                            .delete('/image/' + item._id)
                                            .expect(200) //Status code
                                            .end(function(err,res) {
                                                if (err) { throw err; }

                                                // GET
                                                request(url)
                                                    .get('/image?_id=' + item._id)
                                                    .expect('Content-Type', /json/)
                                                    .expect(200) //Status code
                                                    .end(function(err,res) {
                                                        var item2 = null;
                                                        if (err) { throw err; }
                                                        res.body.should.be.a('array');
                                                        res.body.length.should.be.equal(0);

                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
});
