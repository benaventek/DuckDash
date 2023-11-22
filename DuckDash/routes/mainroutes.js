import { Router } from 'express';
const router = Router();

router.route('/').get(async (req, res) => {
  res.render('home', { title: 'DuckDash Homepage' });
});

router.route('/leaderboard').get(async (req, res) => {
  res.render('leaderboard', { title: 'Leaderboards' });
});

router.route('/search').get(async (req, res) => {
  res.render('search', { title: 'Search' });
});

router.route('/login').get(async (req, res) => {
  res.render('login', { title: 'Login' });
});

export default router;
