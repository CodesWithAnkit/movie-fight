const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const respose = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "87c8fe40",
        s: searchTerm
      }
    });
    if (respose.data.Error) {
      return [];
    }
    return respose.data.Search;
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.getElementById("left-summary"), "left");
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.getElementById("right-summary"), "right");
  }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const respose = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "87c8fe40",
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(respose.data);

  if (side === "left") {
    leftMovie = respose.data;
  } else {
    rightMovie = respose.data;
  }

  if (leftMovie && rightMovie) {
    runComprasion();
  }
};

//Comapring function
const runComprasion = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStats, index) => {
    const rightStats = rightSideStats[index];

    // Getting the value of both side
    const leftSideValue = parseInt(leftStats.dataset.value);
    const rightSideValue = parseInt(rightStats.dataset.value);

    // Comparing and changing the color
    if (rightSideValue > leftSideValue) {
      leftStats.classList.remove("is-primary");
      leftStats.classList.add("is-warning");
    } else {
      rightStats.classList.remove("is-primary");
      rightStats.classList.add("is-warning");
    }
  });
};

const movieTemplate = movieDetails => {
  //Removing Dollar symbol from the box office value
  const dollars = parseInt(
    movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));

  const awards = movieDetails.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
  <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}" alt="${movieDetails.Title}" />
        </p>
      </figure>
      <div class="media content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
