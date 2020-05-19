import { Router } from 'express';
import * as Article from './controllers/article_controller';

const router = Router();


require('dotenv').config(); // load environment variables

router.route('/').get((req, res) => {
  res.send('Welcome to the rooted api');
});

// ARTICLES
router.route('/article/:id')
  .get((req, res) => {
    Article.getArticle(req.params.id).then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  });

router.route('/article')
  .get((req, res) => {
    Article.getArticles().then((done) => { res.status(200).send(done); }).catch((error) => { res.status(500).send(error.message); });
  });
