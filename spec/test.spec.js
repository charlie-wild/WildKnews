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
  it('ERROR - responds with status 404 and "Page Not Found" when passed an invalid endpoint', () => request.get('/api/bananas')
    .expect(404)
    .then((res) => {
      expect(res.body.msg).to.equal('Page Not Found');
    }));
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
    it('ERROR - DELETE - responds with a 405 and "Msg: Method Not Allowed" when a delete is attempted', () => request
      .delete('/api/topics')
      .expect(405)
      .then((res) => {
        expect(res.body.msg).to.equal('Method Not Allowed');
      }));
    it('ERROR - POST- responds with status 422 and "Slug already exists" when try to post a topic with existing slug', () => {
      const newTopic = {
        description: 'Error time',
        slug: 'mitch',
      };
      return request.post('/api/topics').send(newTopic)
        .expect(422)
        .then((res) => {
          expect(res.body.msg).to.equal('Key already exists');
        });
    });
    describe('/:topic/articles', () => {
      it('GET - responds with status 200 and and array of articles for given topic', () => request
        .get('/api/topics/mitch/articles')
        .expect(200)
        .then((res) => {
          expect(res.body.articles).to.have.length(10);
          expect(res.body.articles[1]).to.have.keys('article_id', 'title', 'votes', 'created_by', 'created_at', 'topic', 'body', 'author', 'comment_count');
        }));
      it('GET - allows a limit query, which limits number of responses (default 10)', () => request
        .get('/api/topics/mitch/articles?limit=5')
        .expect(200).then((res) => {
          expect(res.body.articles).to.have.length(5);
        }));
      it('GET - allows a sort_by query, which sorts the article by column (default to date)', () => request.get('/api/topics/mitch/articles?sort_criteria=article_id')
        .expect(200).then((res) => {
          expect(res.body.articles[0].article_id).to.equal(12);
        }));
      it('GET - specifies the page at which to start - starts at page one if not specified', () => request.get('/api/topics/mitch/articles?limit=5&?p=2')
        .expect(200).then((res) => {
          expect(res.body.articles).to.have.length(5);
        }));
      it('GET - sorts in ascending order when sort_ascending is specified true', () => request.get('/api/topics/mitch/articles?sort_critera=created_at&sort_ascending=true')
        .expect(200).then((res) => {
          expect(res.body.articles[0].article_id).to.equal(2);
        }));
      it('ERROR - GET - responds with status 404 and page not found if an invalid topic slug is provided', () => request.get('/api/topics/banana/articles')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Topic Not Found');
        }));
      it('ERROR - PATCH - responds with status 405 and "Method Not Allowed"', () => request.patch('/api/topics/mitch/articles')
        .expect(405)
        .then(((res) => {
          expect(res.body.msg).to.equal('Method Not Allowed');
        })));
    });
  });
});
