import "./ActorCard.css";
import imgNotFound from "../../images/no-image.jpg";
import statisticsIcon from "../../images/statistics.svg";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

const ActorCard = ({ card, onCardClickButton }) => {
  const statistics = <img src={statisticsIcon} alt="Statistics icon" />;
  function handleCardClickButton() {
    onCardClickButton(card);
  }

  return (
    <li className="actor-card">
      <div className="actor-card__image-container">
        <img
          src={!card.profile_path ? imgNotFound : API_IMG + card.profile_path}
          alt={card.name}
          className="actor-card__image"
        ></img>

        <button
          title="View statistics"
          className="actor-card__button"
          type="button"
          onClick={handleCardClickButton}
        >
          {statistics}
        </button>
      </div>
      <div className="actor-card__text">
        <h3 className="actor-card__title">{card.name}</h3>

        <span className="actor-card__rating">{card.popularity}</span>
      </div>
    </li>
  );
};

export default ActorCard;
