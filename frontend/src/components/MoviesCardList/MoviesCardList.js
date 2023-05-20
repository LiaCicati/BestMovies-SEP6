import React from "react";
import MoviesCard from "../MoviesCard/MoviesCard";
import "./MoviesCardList.css";

const MoviesCardList = ({ cards, buttonMore, onClickMoreButton }) => {
  return (
    <section className="cards">
      <ul className="cards__list">
        {cards.map((card) => (
          <MoviesCard key={card.id} card={card} />
        ))}
      </ul>

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
