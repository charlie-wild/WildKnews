# Wild NC News

This is the back-end for my NC News News Aggregator project. It has been created using express, and hosted on Heroku. Developed using TDD, with help from Chai and Supertest.

#Usage

- Clone and download from github.
- Navigate into folder, and use 'npm install' to install all relevant dependencies.
- use npm test to run the test suite.
- User can navigate to the following endpoints, with the specified methods: 

/api/topics -> get, post
/api/topics/:topic/articles:-> get, post
/api/articles -> get
/api/articles/:article_id -> get, patch, delete
/api/articles/:article_id/comments -> get, post
/api/articles/:article_id/comments/:comment_id -> patch, delete,
/api/users -> get
/api/users/:username -> get

#Dependencies

- body-parser 1.18.3
- chai 4.2.0
- cors 2.8.5
- express 4.16.4
- heroku 7.19.3
- knex 0.15.2
- moment 2.22.2
- pg 7.6.1
- supertest 3.3.0