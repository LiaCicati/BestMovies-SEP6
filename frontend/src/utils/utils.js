export   const getMoviesCount = () => {
    switch (true) {
      case window.innerWidth >= 944:
        return 12;
      case window.innerWidth >= 570:
        return 8;
      default:
        return 5;
    }
  };

  export   const loadMovies = () => {
    if (window.innerWidth >= 944) {
      return 3;
    }
    return 2;
  };