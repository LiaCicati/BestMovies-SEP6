import MoviesCardList from "../MoviesCardList/MoviesCardList";
import cards from "../../utils/movies";

function Movies() {
  return (
    <>
      <div className="movies">
        <MoviesCardList cards={cards} buttonMore={true} />
      </div>
    </>
  );
}

export default Movies;
