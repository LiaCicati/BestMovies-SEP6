import "./MoviesCard.css";
import { Link, useLocation } from "react-router-dom";
import iconLiked from "../../images/liked.svg";
import iconLike from "../../images/like.svg";
import iconDelete from "../../images/icon-delete.svg";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MoviesCard = ({ card, onCardClickButton }) => {
  const location = useLocation();

  const isFavoriteMoviesPage = location.pathname === "/favorites";
  const isMoviesPage = location.pathname === "/";
  const isMyRatingsPage = location.pathname === "/my-ratings";

  const likedMovie = <img src={iconLiked} alt="Liked" />;
  const likeMovie = <img src={iconLike} alt="Like" />;
  const deleteMovie = <img src={iconDelete} alt="Delete" />;

  const loggedInUser = JSON.parse(localStorage.getItem("current-user"));

  function handleCardClickButton() {
    onCardClickButton(card);
  }

  return (
    <li className="card">
      <div className="card__image-container">
        {isMoviesPage ? (
          <img
            src={
              !card.backdrop_path && !card.poster_path
                ? "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/581/5043/no-image__46830.1665666735.jpg?c=2"
                : !card.backdrop_path
                ? API_IMG + card.poster_path
                : API_IMG + card.backdrop_path
            }
            alt={card.title}
            className="card__image"
          ></img>
        ) : (
          <img
            src={card.backdrop_path}
            alt={card.title}
            className="card__image"
          ></img>
        )}

        <div className="card__data">
          {loggedInUser && !isMyRatingsPage && (
            <button
              className="card__button"
              type="button"
              onClick={handleCardClickButton}
            >
              {isMoviesPage && card.isFavorite && likedMovie}
              {isMoviesPage && !card.isFavorite && likeMovie}
              {isFavoriteMoviesPage && deleteMovie}
            </button>
          )}
          <div className="card__text">
            {isFavoriteMoviesPage && (
              <Link to={`/favorites/${card._id}`}>
                <div className="card__button-details">Details</div>
                <h3 className="card__title">{card.title}</h3>
              </Link>
            )}
            {isMoviesPage && (
              <Link to={`/movies/${card.id}`}>
                <div className="card__button-details">Details</div>
                <h3 className="card__title">{card.title}</h3>
              </Link>
            )}
            {isMyRatingsPage && (
              <Link to={`/my-ratings/${card._id}`}>
                <div className="card__button-details">Details</div>
                <h3 className="card__title">{card.title}</h3>
              </Link>
            )}
        
            {isMyRatingsPage ? (
              <p className="card__rating">  <span className="card__rating-star"> &#9733; </span>{card.my_rating}</p>
            ) :     <p className="card__rating">
            {" "}
            <span className="card__rating-star"> &#9733; </span>
            {card.vote_average}
          </p>}
          </div>
        </div>
      </div>
    </li>
  );
};

export default MoviesCard;
