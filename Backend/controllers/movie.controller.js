const Movie = require('../models/movie.model');

//Add Movie
  
exports.addMovie = async (req, res) => {
  try {
    const { title, genre, rate, description,duration,releaseDate,director,userId } = req.body;
    const { filename } = req.file;
    
    const movie = new Movie({
      title,
      image: `/uploads/${filename}`,
      genre,
      rate,
      description,
      duration,
      director,
      releaseDate,
      userId
    });

    await movie.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred while adding the movie' });
  }
};

//Get Movie by user id

exports.getMoviesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const movies = await Movie.find({ userId: userId });
    
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Delete Movie 
exports.deleteMoviebyId= async (req, res) => {
  try {
    const movieId = req.params.id;
    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//Update Movie

exports.updateMovieById = async (req, res) => {
  try {
    const { title, genre, rate, description, duration, releaseDate, director, userId } = req.body;
    const { filename } = req.file;
    const id = req.params.id;

    const movie = await Movie.findById(id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    if (userId !== movie.userId.toString()) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    movie.title = title;
    movie.genre = genre;
    movie.image = `/uploads/${filename}`;
    movie.description = description;
    movie.rate = rate;
    movie.director = director;
    movie.duration = duration;
    movie.releaseDate = releaseDate;
    movie.userId = userId;

    await movie.save();

    res.json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while updating the movie' });
  }
};