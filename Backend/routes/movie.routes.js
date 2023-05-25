const express = require('express');
const movieController = require('../controllers/movie.controller');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');



router.post('/create', upload.single('image'), movieController.addMovie);
router.get('/:userId', movieController.getMoviesByUserId);
router.patch('/:id', upload.single('image'),movieController.updateMovieById)
router.delete('/:id', movieController.deleteMoviebyId);

module.exports = router;