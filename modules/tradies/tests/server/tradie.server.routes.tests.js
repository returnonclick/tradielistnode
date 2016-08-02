'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tradie = mongoose.model('Tradie'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tradie;

/**
 * Tradie routes tests
 */
describe('Tradie CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Tradie
    user.save(function () {
      tradie = {
        name: 'Tradie name'
      };

      done();
    });
  });

  it('should be able to save a Tradie if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tradie
        agent.post('/api/tradies')
          .send(tradie)
          .expect(200)
          .end(function (tradieSaveErr, tradieSaveRes) {
            // Handle Tradie save error
            if (tradieSaveErr) {
              return done(tradieSaveErr);
            }

            // Get a list of Tradies
            agent.get('/api/tradies')
              .end(function (tradiesGetErr, tradiesGetRes) {
                // Handle Tradie save error
                if (tradiesGetErr) {
                  return done(tradiesGetErr);
                }

                // Get Tradies list
                var tradies = tradiesGetRes.body;

                // Set assertions
                (tradies[0].user._id).should.equal(userId);
                (tradies[0].name).should.match('Tradie name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tradie if not logged in', function (done) {
    agent.post('/api/tradies')
      .send(tradie)
      .expect(403)
      .end(function (tradieSaveErr, tradieSaveRes) {
        // Call the assertion callback
        done(tradieSaveErr);
      });
  });

  it('should not be able to save an Tradie if no name is provided', function (done) {
    // Invalidate name field
    tradie.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tradie
        agent.post('/api/tradies')
          .send(tradie)
          .expect(400)
          .end(function (tradieSaveErr, tradieSaveRes) {
            // Set message assertion
            (tradieSaveRes.body.message).should.match('Please fill Tradie name');

            // Handle Tradie save error
            done(tradieSaveErr);
          });
      });
  });

  it('should be able to update an Tradie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tradie
        agent.post('/api/tradies')
          .send(tradie)
          .expect(200)
          .end(function (tradieSaveErr, tradieSaveRes) {
            // Handle Tradie save error
            if (tradieSaveErr) {
              return done(tradieSaveErr);
            }

            // Update Tradie name
            tradie.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tradie
            agent.put('/api/tradies/' + tradieSaveRes.body._id)
              .send(tradie)
              .expect(200)
              .end(function (tradieUpdateErr, tradieUpdateRes) {
                // Handle Tradie update error
                if (tradieUpdateErr) {
                  return done(tradieUpdateErr);
                }

                // Set assertions
                (tradieUpdateRes.body._id).should.equal(tradieSaveRes.body._id);
                (tradieUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tradies if not signed in', function (done) {
    // Create new Tradie model instance
    var tradieObj = new Tradie(tradie);

    // Save the tradie
    tradieObj.save(function () {
      // Request Tradies
      request(app).get('/api/tradies')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tradie if not signed in', function (done) {
    // Create new Tradie model instance
    var tradieObj = new Tradie(tradie);

    // Save the Tradie
    tradieObj.save(function () {
      request(app).get('/api/tradies/' + tradieObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tradie.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tradie with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tradies/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tradie is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tradie which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tradie
    request(app).get('/api/tradies/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tradie with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tradie if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tradie
        agent.post('/api/tradies')
          .send(tradie)
          .expect(200)
          .end(function (tradieSaveErr, tradieSaveRes) {
            // Handle Tradie save error
            if (tradieSaveErr) {
              return done(tradieSaveErr);
            }

            // Delete an existing Tradie
            agent.delete('/api/tradies/' + tradieSaveRes.body._id)
              .send(tradie)
              .expect(200)
              .end(function (tradieDeleteErr, tradieDeleteRes) {
                // Handle tradie error error
                if (tradieDeleteErr) {
                  return done(tradieDeleteErr);
                }

                // Set assertions
                (tradieDeleteRes.body._id).should.equal(tradieSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tradie if not signed in', function (done) {
    // Set Tradie user
    tradie.user = user;

    // Create new Tradie model instance
    var tradieObj = new Tradie(tradie);

    // Save the Tradie
    tradieObj.save(function () {
      // Try deleting Tradie
      request(app).delete('/api/tradies/' + tradieObj._id)
        .expect(403)
        .end(function (tradieDeleteErr, tradieDeleteRes) {
          // Set message assertion
          (tradieDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tradie error error
          done(tradieDeleteErr);
        });

    });
  });

  it('should be able to get a single Tradie that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Tradie
          agent.post('/api/tradies')
            .send(tradie)
            .expect(200)
            .end(function (tradieSaveErr, tradieSaveRes) {
              // Handle Tradie save error
              if (tradieSaveErr) {
                return done(tradieSaveErr);
              }

              // Set assertions on new Tradie
              (tradieSaveRes.body.name).should.equal(tradie.name);
              should.exist(tradieSaveRes.body.user);
              should.equal(tradieSaveRes.body.user._id, orphanId);

              // force the Tradie to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Tradie
                    agent.get('/api/tradies/' + tradieSaveRes.body._id)
                      .expect(200)
                      .end(function (tradieInfoErr, tradieInfoRes) {
                        // Handle Tradie error
                        if (tradieInfoErr) {
                          return done(tradieInfoErr);
                        }

                        // Set assertions
                        (tradieInfoRes.body._id).should.equal(tradieSaveRes.body._id);
                        (tradieInfoRes.body.name).should.equal(tradie.name);
                        should.equal(tradieInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Tradie.remove().exec(done);
    });
  });
});
