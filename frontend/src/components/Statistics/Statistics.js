import React, { useState, useEffect } from "react";
import "./Statistics.css";
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
import ActorCardList from "../ActorCardList/ActorCardList";
import Preloader from "../Preloader/Preloader";
const Statistics = () => {
  const [actors, setActors] = useState([]);
  const [selectedActorId, setSelectedActorId] = useState("");
  const [selectedActorName, setSelectedActorName] = useState("");
  const [movies, setMovies] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [genres, setGenres] = useState([]);
  const [showStatistics, setShowStatistics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load actors data from local storage or fetch from API
  useEffect(() => {
    const fetchActors = () => {
      setIsLoading(true);
      movieService
        .getPopularActors()
        .then((response) => {
          const actorData = response.results.filter(
            (actor) => actor.known_for_department === "Acting"
          );

          setActors(actorData);
          localStorage.setItem("actors", JSON.stringify(actorData));
        })
        .catch((error) => {
          console.error("Error fetching actors:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  const handleActorCardClick = (actor) => {
    setSelectedActorId(actor.id);
    setSelectedActorName(actor.name);
    setShowStatistics(true);
  };

  const handleBackButtonClick = () => {
    setSelectedActorId("");
    setShowStatistics(false);
  };

  return (
    <div className="statistics">
      <h2 className="statistics__title">Actor Statistics</h2>
      {isLoading && <Preloader />}
      {!showStatistics && (
        <ActorCardList
          cards={actors}
          onCardClickButton={handleActorCardClick}
        />
      )}

      {showStatistics && (
        <>
          <button className="back-button" onClick={handleBackButtonClick}>
            Back
          </button>
          <div>
            {showNoDataMessage && (
              <p>No movie data available for the selected actor.</p>
            )}
            {movies.length > 0 && !showNoDataMessage && (
              <div>
                <h2> {selectedActorName} </h2>
                <div className="statistics__rating">
                  <h3 className="statistics__subtitle">
                    Average rating of all movies
                  </h3>
                  <BarChart width={700} height={400} data={movies}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="title"
                      interval={0}
                      tick={null}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis domain={[0, 10]} stroke="#FFFFFF" />
                    <Tooltip />
                    <Legend layout="vertical" />
                    <Bar
                      dataKey="vote_average"
                      fill="#8884d8"
                      name="Average Rating of a movie"
                    />
                  </BarChart>
                  {averageRating && (
                    <p className="statistics__paragraph">
                      <b>
                        Average Rating of all the movies {selectedActorName}{" "}
                        starred in:
                      </b>{" "}
                      <span className="statistics__result">
                        {averageRating}{" "}
                      </span>{" "}
                    </p>
                  )}
                </div>
                <h3 className="statistics__subtitle">Genres</h3>
                <BarChart width={700} height={400} data={prepareGenreData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="genre"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#FFFFFF"
                    tick={{ fill: "#FFFFFF" }}
                  />
                  <YAxis stroke="#FFFFFF" tick={{ fill: "#FFFFFF" }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Number of Movies" />
                </BarChart>
              </div>
            )}
            {topGenres.length > 0 && (
              <p className="statistics__paragraph">
                <b>
                  Top 3 genres {selectedActorName} is mostly associated with:{" "}
                </b>
                <span className="statistics__result">
                  {topGenres.join(", ")}
                </span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
