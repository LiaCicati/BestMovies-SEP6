import React from "react";
import MoviesCard from "../MoviesCard/MoviesCard";
import "./MoviesCardList.css";

const MoviesCardList = ({
  cards,
  buttonMore,
  onClickMoreButton,
  onCardClickButton,
}) => {
  const areVisibleCards = cards.length > 0;
  return (
    <section className="cards">
      {!areVisibleCards && (
        <p className="cards__message">
          Sorry, we couldn't find any movies that match your search criteria.
        </p>
      )}
      {areVisibleCards && (
        <ul className="cards__list">
          {cards.map((card) => (
            <MoviesCard
              key={card.id}
              card={card}
              onCardClickButton={onCardClickButton}
            />
          ))}
        </ul>
      )}
      {buttonMore && (
        <div className="cards__button-container">
          <button
            className="cards__button"
            type="button"
            name="more"
            onClick={onClickMoreButton}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default MoviesCardList;
