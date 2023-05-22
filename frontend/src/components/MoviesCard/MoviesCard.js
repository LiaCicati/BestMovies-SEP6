import "./MoviesCard.css";
import { Link, useLocation } from "react-router-dom";
import iconLiked from "../../images/liked.svg";
import iconLike from "../../images/like.svg";
import iconDelete from "../../images/icon-delete.svg";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MoviesCard = ({ card, onCardClickButton }) => {
  const location = useLocation();

  const isSavedMoviesPage = location.pathname === "/favorites";
  const isMoviesPage = location.pathname === "/";

  const likedMovie = <img src={iconLiked} alt="Liked" />;
  const likeMovie = <img src={iconLike} alt="Like" />;
  const deleteMovie = <img src={iconDelete} alt="Delete" />;

  function handleCardClickButton() {
    onCardClickButton(card);
  }

  return (
    <li className="card">
      <div className="card__image-container">
        <a
          className="card__image-link"
          href={card.link}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={
              !card.backdrop_path
                ? API_IMG + card.poster_path
                : API_IMG + card.backdrop_path
            }
            alt={card.title}
            className="card__image"
          ></img>
        </a>
        <button
          className="card__button"
          type="button"
          onClick={handleCardClickButton}
        >
          {isMoviesPage && card.isSaved && likedMovie}
          {isMoviesPage && !card.isSaved && likeMovie}
          {isSavedMoviesPage && deleteMovie}
        </button>
      </div>
      <div className="card__text">
        <Link to={`/movies/${card.id}`}>
          <h3 className="card__title">{card.title}</h3>
        </Link>
        <span className="card__rating">{card.vote_average}</span>
      </div>
    </li>
  );
};

export default MoviesCard;
