const fetchData = async searchTerm => {
  const respose = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "87c8fe40",
      s: searchTerm
    }
  });
  console.log(respose.data);
};

const input = document.querySelector("input");

const onInput = e => {
  fetchData(e.target.value);
};
input.addEventListener("input", debounce(onInput, 500));
