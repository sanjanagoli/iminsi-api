import { Router } from 'express';
import * as Article from './controllers/article_controller';
import * as Interest from './controllers/interest_controller';
import * as Organization from './controllers/organization_controller';
import * as User from './controllers/user_controller';

const router = Router();


require('dotenv').config(); // load environment variables

router.route('/').get((req, res) => {
  res.send('Welcome to the iminsi api');
});

// ARTICLES
router.route('/article/:id')
  .get((req, res) => {
    Article.getArticle(req.params.id).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .put((req, res) => {
    Article.updateArticleScore(req.params.id, req.body.score).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  });

router.route('/article')
  .get((req, res) => {
    Article.getArticles().then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .post((req, res) => {
    Article.createArticle(req.body).then(res.status(200).send('article created')).catch((error) => { res.status(500).send(error.message); });
  });


// INTERESTS
router.route('/interest/:id')
  .get((req, res) => {
    Interest.getInterestById(req.params.id).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .delete((req, res) => {
    Interest.deleteInterest(req.params.id).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .put((req, res) => {
    Interest.updateInterestImage(req.params.id, req.body.imageURL);
  });


router.route('/interest')
  .get((req, res) => {
    Interest.getInterests().then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .post((req, res) => {
    Interest.createInterest(req.body).then(res.status(200).send('interest created')).catch((error) => { res.status(500).send(error.message); });
  });

// USER
router.route('/user')
  .get((req, res) => {
    User.getUsers().then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .post((req, res) => {
    User.signUp(req.body).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  });

router.route('/user/:id')
  .get((req, res) => {
    User.getUser(req.params.id).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .delete((req, res) => {
    User.deleteUser(req.params.id).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .post((req, res) => {
    User.signIn(req.params.id, req.body).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  })
  .put((req, res) => {
    User.updateUser(req.params.id, req.body).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  });

// ORGANIZATIONS
router.route('/organizations/:id')
  .put((req, res) => {
    Organization.incrementOrganizationScore(req.params.id, req.body.score).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  });


export default router;
