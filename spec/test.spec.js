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
          expect(res.body.msg).to.equal('Key Already Exists');
        });
    });
    describe('/:topic/articles', () => {
      const newArticle = {
        title: 'Test Article',
        body: 'test article body',
        user_id: 2,
      };
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
          expect(res.body.articles[0].article_id).to.equal(12);
        }));
      it('ERROR - GET - responds with status 404 and page not found if an invalid topic slug is provided', () => request.get('/api/topics/banana/articles')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Page Not Found');
        }));
      it('ERROR - PATCH - responds with status 405 and "Method Not Allowed"', () => request.patch('/api/topics/mitch/articles')
        .expect(405)
        .then(((res) => {
          expect(res.body.msg).to.equal('Method Not Allowed');
        })));
      it('POST - accepts an object containing a title, body and user_id property and responds with the posted article', () => request.post('/api/topics/mitch/articles')
        .expect(201)
        .send(newArticle)
        .then((res) => {
          expect(res.body.article).to.have.length(1);
          expect(res.body.article[0].title).to.equal('Test Article');
        }));
      it.skip('ERROR - POST - responds with status 404 and invalid parameter when invalid topic provided', () => request.post('/api/topics/error/articles')
        .send(newArticle)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).to.equal('Topic Not Found');
        }));
      it('ERROR - POST - responds with status 400 when submission is provided with incorrect keys', () => request.post('/api/topics/mitch/articles')
        .send({ title: 'test', body: 'test' })
        .expect(400)
        .then((res) => {
          expect(res.status).to.equal(400);
        }));
      it('ERROR - POST - responds with status 422 and invalid user_id when submission has invalid user_id', () => request.post('/api/topics/mitch/articles')
        .send({ title: 'test', body: 'test', user_id: 23434 })
        .expect(422)
        .then((res) => {
          expect(res.status).to.equal(422);
          expect(res.body.msg).to.equal('Invalid Parameter');
        }));
    });
  });
  describe('/articles', () => {
    it('GET - responds with 200 and an array of article objects', () => request.get('/api/articles')
      .expect(200)
      .then((res) => {
        expect(res.body.articles[1]).to.have.keys('article_id', 'title', 'votes', 'created_by', 'created_at', 'topic', 'body', 'author', 'comment_count');
        expect(res.body.articles).to.have.length(10);
      }));
    it('GET - responds with 200 and a limited number of articles if limit is provided (default 10', () => request.get('/api/articles?limit=5')
      .expect(200)
      .then((res) => {
        expect(res.body.articles).to.have.length(5);
      }));
    it('GET - responds with 200 and articles sorted by any valid column (defaults to date)', () => request.get('/api/articles?sort_criteria=comment_count')
      .expect(200)
      .then((res) => {
        expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man');
      }));
    it('GET - specifies the page at which to start - starts at page one if not specified', () => request.get('/api/articles?limit=5&?p=2')
      .expect(200).then((res) => {
        expect(res.body.articles).to.have.length(5);
      }));
    it('GET - sorts in ascending order when sort_ascending is specified true', () => request.get('/api/articles?sort_critera=created_at&sort_ascending=true')
      .expect(200).then((res) => {
        expect(res.body.articles[0].article_id).to.equal(12);
      }));
    it('ERROR - responds with 400 if there is an incorrect query provided', () => request.get('/api/articles?sort_criteria=2343')
      .expect(400).then((res) => {
        expect(res.status).to.equal(400);
      }));
    describe('/:article_id', () => {
      it('GET - responds with an article object with the provided id', () => request.get('/api/articles/3')
        .expect(200).then((res) => {
          expect(res.body.articles[0].title).to.equal('Eight pug gifs that remind me of mitch');
        }));
      it('ERROR - responds with 400 if the article id is malformed', () => request.get('/api/articles/error')
        .expect(400).then((res) => {
          expect(res.status).to.equal(400);
        }));
      it('ERROR - responds with 404 if the article does not exist', () => request.get('/api/articles/45')
        .expect(404).then((res) => {
          expect(res.status).to.equal(404);
        }));
      it('PATCH - updates the votes property of the article by the given positive amount', () => {
        const votes = { inc_votes: 5 };
        return request.patch('/api/articles/3')
          .send(votes)
          .expect(200).then((res) => {
            expect(res.body.article[0].votes).to.equal(5);
          });
      });
      it('PATCH - updates the votes property of the article by the given negative amount', () => {
        const votes = {
          inc_votes: -5,
        };
        return request.patch('/api/articles/3')
          .send(votes)
          .expect(200).then((res) => {
            expect(res.body.article[0].votes).to.equal(-5);
          });
      });
      it('ERROR - PATCH - responds with status 404 and not found if a valid but non existent id is provided', () => request.patch('/api/articles/45')
        .send({ inc_votes: -5 })
        .expect(404).then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('Page Not Found');
        }));
      it('ERROR - PATCH - responds with status 400 if article request is malformed syntax', () => request.patch('/api/articles/error')
        .send({ inc_votes: 5 })
        .expect(400).then((res) => {
          expect(res.status).to.equal(400);
        }));
      it('ERROR - PATCH - responds with status 400 if votes are malformed syntax', () => request.patch('/api/articles/3')
        .send({
          inc_votes: 'string',
        })
        .expect(400).then((res) => {
          expect(res.status).to.equal(400);
        }));
      it('DELETE - responds with status 204 and deletion message when article is deleted', () => request.delete('/api/articles/3')
        .expect(204).then((res) => {
          expect(res.body.result).to.eql({});
        }).then(() => request.get('/api/articles/3')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Page Not Found');
          })));
      it('ERROR - DELETE - respond with status 404 if delete request on a non-existent article', () => request.delete('/api/articles/34')
        .expect(404).then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.eql('Page Not Found');
        }));
    });
    describe('/:article_id/comments', () => {
      it('GET - responds with status 2000 and an array of comments for the given article', () => request.get('/api/articles/1/comments')
        .expect(200).then((res) => {
          expect(res.body.comments).to.have.length(10);
          expect(res.body.comments[0]).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'body');
        }));
      it('GET - responds with 200 and a limited number of comments if limit is provided (default 10)', () => request.get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then((res) => {
          expect(res.body.comments).to.have.length(5);
        }));
      it('GET - responds with 200 and comments sorted by any valid column (defaults to date)', () => request.get('/api/articles/1/comments?sort_criteria=votes')
        .expect(200)
        .then((res) => {
          expect(res.body.comments[0].author).to.equal('icellusedkars');
        }));
      it('GET - responds with 200 and specifies the page at which to start - starts at page one if not specified', () => request.get('/api/articles/1/comments?limit=5&?p=2')
        .expect(200).then((res) => {
          expect(res.body.comments).to.have.length(5);
        }));
      it('GET - responds with 200 sorts in ascending order when sort_ascending is specified true', () => request.get('/api/articles/1/comments?sort_critera=created_at&sort_ascending=true')
        .expect(200).then((res) => {
          expect(res.body.comments[0].comment_id).to.equal(18);
        }));
      it('ERROR - GET - responds with 404 if article being accessed has no comments', () => request.get('/api/articles/8/comments')
        .expect(404)
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('Page Not Found');
        }));
      it('ERROR - DELETE - responds with 405 if user attempts to delete all comments on article', () => request.delete('/api/articles/1/comments')
        .expect(405)
        .then((res) => {
          expect(res.status).to.equal(405);
          expect(res.body.msg).to.equal('Method Not Allowed');
        }));
      it('POST - responds with 201 and the posted comment when a comment is posted', () => {
        const comment = {
          user_id: 1,
          body: 'test comment',
        };
        return request.post('/api/articles/8/comments')
          .expect(201)
          .send(comment)
          .then((res) => {
            expect(res.body.comment).to.have.length(1);
            expect(res.body.comment[0].body).to.equal('test comment');
            expect(res.body.comment[0]).to.have.keys('comment_id', 'user_id', 'article_id', 'votes', 'created_at', 'body');
          });
      });
      it('ERROR - POST - responds with 400 and invalid input if body or user_id not provided', () => {
        const comment = {};
        return request.post('/api/articles/8/comments')
          .expect(400)
          .send(comment)
          .then((res) => {
            expect(res.status).to.equal(400);
          });
      });
      it.skip('ERROR - POST - responds with 404 if attempting to post to non-existent article', () => {
        const comment = {
          user_id: 1,
          body: 'test comment',
        };
        return request.post('/api/articles/343/comments')
          .expect(404)
          .send(comment)
          .then((res) => {
            expect(res.status).to.equal(404);
          });
      });
      it('PATCH - updates the votes property of the comment by the given positive amount', () => {
        const votes = {
          inc_votes: 5,
        };
        return request.patch('/api/articles/1/comments/2')
          .send(votes)
          .expect(200).then((res) => {
            console.log(res.body);
            expect(res.body.comment[0].votes).to.equal(19);
          });
      });
      it('PATCH - updates the votes property of the comment by the given negative amount', () => {
        const votes = {
          inc_votes: -5,
        };
        return request.patch('/api/articles/1/comments/2')
          .send(votes)
          .expect(200).then((res) => {
            expect(res.body.comment[0].votes).to.equal(9);
          });
      });
      it('ERROR - PATCH - responds with status 400 and invalid format if the votes value is not an integer', () => {
        const votes = {
          inc_votes: 'string',
        };
        return request.patch('/api/articles/1/comments/2')
          .send(votes)
          .expect(400).then((res) => {
            expect(res.status).to.equal(400);
          });
      });
      it('ERROR - PATCH -responds with status 404 if comment does not exist', () => {
        const votes = {
          inc_votes: -5,
        };
        return request.patch('/api/articles/1/comments/1')
          .send(votes)
          .expect(404)
          .then((res) => {
            expect(res.status).to.equal(404);
          });
      });
      it('DELETE - responds with status 204 and deletion message when article is deleted', () => request.delete('/api/articles/1/comments/2')
        .expect(204).then((res) => {
          expect(res.body).to.eql({});
        }).then(() => request.get('/api/articles/1/comments/2')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).to.equal('Page Not Found');
          })));
      it('ERROR - DELETE - responds with 404 if comment does not exist', () => request.delete('/api/articles/1/comments/1')
        .expect(404).then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('Page Not Found');
        }));
      it('ERROR - DELETE - responds with 400 if comment_id type is invalid', () => request.delete('/api/articles/1/comments/cheese')
        .expect(400).then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.msg).to.equal('invalid input syntax for type integer');
        }));
    });
  });
  describe('/users', () => {
    it('GET - responds with status 200 and an array of user objects', () => request.get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body.users[0]).to.have.keys('user_id', 'username', 'avatar_url', 'name');
        expect(res.body.users).to.have.length(3);
      }));
    it('ERROR - DELETE - responds with status 405 when a delete action is attempted', () => request.delete('/api/users')
      .expect(405)
      .then((res) => {
        expect(res.status).to.equal(405);
        expect(res.body.msg).to.equal('Method Not Allowed');
      }));
    describe('/:user_id', () => {
      it('GET - responds with a user with the specified ID', () => {
        request.get('/api/users/1')
          .expect(200)
          .then((res) => {
            expect(res.body.user).to.have.length(1);
            expect(res.body.user[0].name).to.equal('jonny');
          });
      });
      it('ERROR - DELETE - responds with status 405 when a delete action is attempted', () => request.delete('/api/users/1')
        .expect(405)
        .then((res) => {
          expect(res.status).to.equal(405);
          expect(res.body.msg).to.equal('Method Not Allowed');
        }));
      it('ERROR - GET - responds with 404 if a non-existent username is requested', () => request.get('/api/users/45')
        .expect(404)
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('Page Not Found');
        }));
      it('ERROR - GET - responds with 400 if username is incorrect syntax', () => request.get('/api/users/error')
        .expect(400)
        .then((res) => {
          expect(res.status).to.equal(400);
          expect(res.body.msg).to.equal('invalid input syntax for type integer');
        }));
    });
  });
});
