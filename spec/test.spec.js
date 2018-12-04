process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('/api', () => {
  beforeEach(() => connection.migrate.rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection.seed.run()));
  after(() => {
    connection.destroy();
  });
  it('ERROR - responds with status 404 and "Page Not Found" when passed an invalid endpoint', () => {
    request.get('/api/bananas')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).to.equal('Page Not Found');
      });
  });
  describe('/topics', () => {
    it('GET - responds with status 200 and a list of all topics', () => request
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics).to.have.length(2);
        expect(res.body.topics[0]).to.have.keys('slug', 'description');
      }));
    it('POST - responds with status 201 and a new topic object', () => {
      const newTopic = {
        description: 'Definitely not a slug',
        slug: 'slimy',
      };
      return request.post('/api/topics').send(newTopic).expect(201)
        .then((res) => {
          expect(res.body.newTopic).to.have.length(1);
          expect(res.body.newTopic[0]).to.have.keys('slug', 'description');
          expect(res.body.newTopic[0].slug).to.equal('slimy');
        });
    });
    it('DELETE - responds with a 405 and "Msg: Method Not Allowed" when a delete is attempted', () => request
      .delete('/api/topics')
      .expect(405)
      .then((res) => {
        expect(res.body.msg).to.equal('Method Not Allowed');
      }));
  });
});
