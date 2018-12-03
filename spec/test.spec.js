process.env.NODE_ENV = 'test';
const {
  expect,
} = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const connection = require('../db/connection');

describe('/api', () => {
  after(() => {
    connection.destroy();
  });
  describe('/topics', () => {
    it('GET - responds with status 200 and a list of all topics', () => request
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics).to.have.length(2);
      }));
  });
});
