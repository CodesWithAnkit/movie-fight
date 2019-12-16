const fetchData = async searchTerm => {
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
};

const input = document.querySelector("input");

const onInput = async e => {
  const movies = await fetchData(e.target.value);

  for (let movie of movies) {
    const div = document.createElement("div");

    div.innerHTML = `
    <img src="${movie.Poster}"/>
    <h1>${movie.Title}</h1>
    `;
    // Adding to the DOM
    document.querySelector("#target").appendChild(div);
  }
};
input.addEventListener("input", debounce(onInput, 500));
