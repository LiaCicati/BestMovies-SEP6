import React, { useEffect, useState } from "react";
import ratingService from "../../services/ratingService";
import MoviesCardList from "../MoviesCardList/MoviesCardList";
function RatedMovies() {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    ratingService
      .getRatings(token)
      .then((fetchedRatings) => {
        setRatings(fetchedRatings);
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error);
      });
  }, []);

  return (
    <div className="rated-movies">
      <MoviesCardList cards={ratings} />
    </div>
  );
}

export default RatedMovies;
