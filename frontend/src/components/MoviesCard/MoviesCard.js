import "./MoviesCard.css";

const MoviesCard = ({ card }) => {
  return (
    <li className="card">
      <div className="card__image-container">
        <a
          className="card__image-link"
          href={card.link}
          target="_blank"
          rel="noreferrer"
        >
          <img src={card.image} alt={card.title} className="card__image"></img>
        </a>
      </div>
      <div className="card__text">
        <h3 className="card__title">{card.title}</h3>
        <span className="card__rating">{card.rating}</span>
      </div>
    </li>
  );
};

export default MoviesCard;
