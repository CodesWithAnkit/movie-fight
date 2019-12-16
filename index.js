createAutoComplete({
  root: document.querySelector(".autocomplete"),

  renderOption(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
    `;
  },
  onOptionSelect(movie) {
    onMovieSelect(movie);
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
});

const onMovieSelect = async movie => {
  const respose = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "87c8fe40",
      i: movie.imdbID
    }
  });
  document.getElementById("summary").innerHTML = movieTemplate(respose.data);
};

const movieTemplate = movieDetails => {
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
    <article class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
