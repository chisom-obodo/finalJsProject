const API_KEY = "ef835d0d2b09d1767242ecd4793f1ba2";
const MOVIE = `https://api.themoviedb.org/3`;
const getTrendingMovieURL = `${MOVIE}/trending/movie/day?api_key=${API_KEY}`;
const getActionMovieURL = `${MOVIE}/discover/movie?api_key=${API_KEY}&with_genres=28`;
const getRomanceMovieURL = `${MOVIE}/discover/movie?api_key=${API_KEY}&with_genres=10749`;
const getHorrorMovieURL = `${MOVIE}/discover/movie?api_key=${API_KEY}&with_genres=27`;
const getComedyMovieURL = `${MOVIE}/discover/movie?api_key=${API_KEY}&with_genres=35`;

// Function to fetch movie data from API
const fetchData = async () => {
  try {
    const [
      trendingMovies,
      actionMovies,
      romanceMovies,
      horrorMovies,
      comedyMovies,
    ] = await Promise.all([
      fetch(getTrendingMovieURL).then((res) => res.json()),
      fetch(getActionMovieURL).then((res) => res.json()),
      fetch(getRomanceMovieURL).then((res) => res.json()),
      fetch(getHorrorMovieURL).then((res) => res.json()),
      fetch(getComedyMovieURL).then((res) => res.json()),
    ]);
    displayMovies(trendingMovies.results, "");
    displayMovies(actionMovies.results, "");
    displayMovies(romanceMovies.results, "");
    displayMovies(horrorMovies.results, "");
    displayMovies(comedyMovies.results, "");
    console.log(result);
    return actionMovies.results;
  } catch (error) {
    console.log(error);
  }
};
//

const fetchMoviesByGenre = async (genreURL) => {
  try {
    const response = await fetch(genreURL);
    const data = await response.json();
    return data.results; // Return movie results from the API
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

//

// Function to display movies
const displayMovies = (movies, category) => {
  const moviesContainer = document.querySelector(".movies-container");
  const categorySection = document.createElement("div");
  categorySection.innerHTML = `<h2>${category}</h2>`;
  categorySection.classList.add("category-section");

  const movieList = document.createElement("div");
  movieList.classList.add("movie-list");

  // Display each movie in a card
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const movieImage = document.createElement("img");
    movieImage.classList.add("movie-image");
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImage.alt = movie.title;
    movieCard.appendChild(movieImage);

    const movieTitle = document.createElement("h5");
    movieTitle.classList.add("movie-title");
    movieTitle.textContent = movie.title;
    movieCard.appendChild(movieTitle);

    const movieDetail = document.createElement("p");
    movieDetail.classList.add("movie-detail");
    movieDetail.textContent = movie.overview.slice(0, 100) + "...";
    movieCard.appendChild(movieDetail);

    const movieRating = document.createElement("p");
    movieRating.textContent = `Rating: ${movie.vote_average}`;
    movieDetail.classList.add("movie-rating");
    movieCard.appendChild(movieRating);

    const addToWatchlistBtn = document.createElement("button");
    addToWatchlistBtn.textContent = "Add to Watchlist";
    addToWatchlistBtn.classList.add("button");
    addToWatchlistBtn.addEventListener("click", () => {
      addToWatchlist(movie);
    });
    movieCard.appendChild(addToWatchlistBtn);

    movieList.appendChild(movieCard);
  });

  categorySection.appendChild(movieList);
  moviesContainer.appendChild(categorySection);
};
// function to search for movies

const search = document.querySelector("#search-input");
search.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const searchResult = MOVIE.filter((movie) => {
    return movie.title.toLowerCase().includes(searchTerm);
  });
  console.log(searchResult);
});


// function to filter movies

const filterMovies = (movies) => {
  const movieFilter = document.getElementById("filter-movie");
  movieFilter.innerHTML = "";

  movies.forEach(movie => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");

    movieItem.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
    `;
    
    movieFilter.appendChild(movieItem); 
  });
};
const movieFilter = document.getElementById("movie-filter");
movieFilter.addEventListener("change", async (e) => {
  const selectedValue = e.target.value;
  let genreURL;

  switch (selectedValue) {
    case "trending":
      genreURL = getTrendingMovieURL;
      break;
    case "comedy":
      genreURL = getComedyMovieURL;
      break;
    case "romance":
      genreURL = getRomanceMovieURL;
      break;
    case "action":
      genreURL = getActionMovieURL;
      break;
    case "horror":
      genreURL = getHorrorMovieURL;
      break;
    default:
      genreURL = getTrendingMovieURL; 
  }
  const movies = await fetchMoviesByGenre(genreURL);
  filterMovies(movies);
});




// Add to watchlist function
const addToWatchlist = (movie) => {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (!watchlist.find((item) => item.id === movie.id)) {
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    displayWatchlist();
    alert(`${movie.title} added to your watchlist!`);
  } else {
    alert(`${movie.title} is already in your watchlist.`);
  }
};

// Display the movies in the watchlist
const displayWatchlist = () => {
  const watchlistContainer = document.getElementById("watchlist-movies");
  watchlistContainer.classList.add("watch-list");
  watchlistContainer.innerHTML = "";

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  watchlist.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const movieImage = document.createElement("img");
    movieImage.classList.add("movie-images");
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImage.alt = movie.title;
    movieCard.appendChild(movieImage);

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.title;
    movieCard.appendChild(movieTitle);

    const removeFromWatchlistBtn = document.createElement("button");
    removeFromWatchlistBtn.classList.add("button");
    removeFromWatchlistBtn.textContent = "Remove from Watchlist";
    removeFromWatchlistBtn.addEventListener("click", () => {
      removeFromWatchlist(movie.id);
    });
    movieCard.appendChild(removeFromWatchlistBtn);

    watchlistContainer.appendChild(movieCard);
  });
};

const removeFromWatchlist = (movieId) => {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist = watchlist.filter((movie) => movie.id !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  displayWatchlist();
};
// Function to apply theme
const applyTheme = () => {
  const hour = new Date().getHours();

  if (hour >= 7 && hour <= 18) {
    document.body.classList.remove("dark-mode");
  } else {
    document.body.classList.add("dark-mode");
  }
};

const toggleTheme = () => {
  document.body.classList.toggle("dark-mode");
};

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
});
// Fetch and display movies when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  await fetchData();
  displayWatchlist();
});
