import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import movieService from "../../services/movieService";

const Statistics = () => {
  const [actors, setActors] = useState([]);
  const [selectedActorId, setSelectedActorId] = useState("");
  const [movies, setMovies] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [genres, setGenres] = useState([]);

  // Load actors data from local storage or fetch from API
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await movieService.getPopularActors();
        const actorData = response.results;
        console.log(actorData);
        console.log(response);
        setActors(actorData);
        localStorage.setItem("actors", JSON.stringify(actorData));
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    };

    const cachedActors = localStorage.getItem("actors");
    if (cachedActors) {
      setActors(JSON.parse(cachedActors));
    } else {
      fetchActors();
    }
  }, []);

  // Load genres data from local storage or fetch from API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await movieService.getMoviesGenres();
        const genreData = response.genres;
        setGenres(genreData);
        localStorage.setItem("genres", JSON.stringify(genreData));
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const cachedGenres = localStorage.getItem("genres");
    if (cachedGenres) {
      setGenres(JSON.parse(cachedGenres));
    } else {
      fetchGenres();
    }
  }, []);

  useEffect(() => {
    if (selectedActorId) {
      const fetchMovies = async () => {
        try {
          const response = await movieService.getMoviesByActor(selectedActorId);
          const movieData = response.cast;

          // Filter out movies without average rating
          const filteredMovies = movieData.filter(
            (movie) => movie.vote_average
          );

          if (filteredMovies.length === 0) {
            setShowNoDataMessage(true);
          } else {
            setShowNoDataMessage(false);
          }

          // Update the movie object with the genres array
          const moviesWithGenres = filteredMovies.map((movie) => {
            const movieGenres = genres
              .filter((genre) => movie.genre_ids.includes(genre.id))
              .map((genre) => genre.name);

            return {
              ...movie,
              genres: movieGenres,
            };
          });

          setMovies(moviesWithGenres);

          const ratingSum = moviesWithGenres.reduce(
            (sum, movie) => sum + movie.vote_average,
            0
          );
          const average = ratingSum / moviesWithGenres.length;
          setAverageRating(average.toFixed(2));
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      };

      fetchMovies();
    }
  }, [selectedActorId, genres]);

  const handleActorChange = (event) => {
    const selectedId = event.target.value;
    setSelectedActorId(selectedId);
  };

  const prepareGenreData = () => {
    const genreData = {};

    movies.forEach((movie) => {
      movie.genres.forEach((genre) => {
        if (genreData[genre]) {
          genreData[genre]++;
        } else {
          genreData[genre] = 1;
        }
      });
    });

    const formattedData = Object.keys(genreData).map((genre) => ({
      genre,
      count: genreData[genre],
    }));

    return formattedData;
  };

  const getTopGenres = () => {
    const genreData = prepareGenreData();

    // Sort genres in descending order based on the count
    const sortedGenres = [...genreData].sort((a, b) => b.count - a.count);

    // Get the top 3 genres
    const topGenres = sortedGenres.slice(0, 3).map((genre) => genre.genre);

    return topGenres;
  };

  const topGenres = getTopGenres();

  return (
    <div>
      <h2>Actor Statistics</h2>
      <select value={selectedActorId} onChange={handleActorChange}>
        <option value="">Select an actor</option>
        {actors.map((actor) => (
          <option key={actor.id} value={actor.id}>
            {actor.name}
          </option>
        ))}
      </select>
      {showNoDataMessage && (
        <p>No movie data available for the selected actor.</p>
      )}
      {movies.length > 0 && !showNoDataMessage && (
        <div>
          <h3>Actor Rating</h3>
          <BarChart width={600} height={300} data={movies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              interval={0}
              tick={null}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="vote_average"
              fill="#8884d8"
              name="Average Rating of a movie"
            />
          </BarChart>
          {/* ... */}
          {averageRating && (
            <p>Average Rating of all movies the actor stared in: {averageRating}</p>
          )}
          <h3>Genres</h3>
          <BarChart width={600} height={300} data={prepareGenreData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="genre"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" name="Number of Movies" />
          </BarChart>
        </div>
      )}
      {topGenres.length > 0 && (
        <p>
          Top 3 genres the actor is mostly associated with:{" "}
          {topGenres.join(", ")}
        </p>
      )}
    </div>
  );
};

export default Statistics;
