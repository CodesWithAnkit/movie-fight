const createAutoComplete = ({ root, renderOption }) => {
  root.innerHTML = `
<label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");

  const onInput = async e => {
    const movies = await fetchData(e.target.value);

    if (!movies.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let movie of movies) {
      const option = document.createElement("a");

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(movie);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = movie.Title;
        onMovieSelect(movie);
      });

      // Adding to the DOM
      resultWrapper.appendChild(option);
    }
  };
  input.addEventListener("input", debounce(onInput, 100));

  document.addEventListener("click", e => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
