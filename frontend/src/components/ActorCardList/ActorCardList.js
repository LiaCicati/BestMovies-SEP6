import React from "react";
import ActorCard from "../ActorCard/ActorCard";
import "./ActorCardList.css";

const ActorCardList = ({ cards, onCardClickButton }) => {
  return (
    <section className="cards">
      <ul className="cards__list">
        {cards.map((card) => (
          <ActorCard
            key={card.id}
            card={card}
            onCardClickButton={onCardClickButton}
          />
        ))}
      </ul>
    </section>
  );
};

export default ActorCardList;
