const btnXHR = document.getElementById("xhrSearch");
const btnFetch = document.getElementById("fetchSearch");
const btnFetchAsyncAwait = document.getElementById("fetchAsyncAwait");

let searchQueryElem = document.getElementById("query");
let searchResults = document.getElementById("searchResults");

const API_URL = "https://api.giphy.com/v1/gifs/search";
const API_KEY = "OOFQyDZzbZFXWQQmclci3LmNZlAALKxH";

btnXHR.addEventListener("click", function () {
  searchResults.innerHTML = "";
  searchUsingXHR(searchQueryElem.value);
});

btnFetch.addEventListener("click", function () {
  searchResults.innerHTML = "";
  searchUsingFetch(searchQueryElem.value);
});

btnFetchAsyncAwait.addEventListener("click", function () {
  searchResults.innerHTML = "";
  searchUsingFetchAsync(searchQueryElem.value);
});

function searchUsingXHR(query) {
  if (!query || query.trim().length === 0) {
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      displayResults(JSON.parse(xhr.responseText));
    }
  });

  let params = "api_key=" + API_KEY + "&q=" + query + "&limit=5&rating=g";
  xhr.open("GET", API_URL + "?" + params);
  xhr.send();
}

function searchUsingFetch(query) {
  if (!query || query.trim().length === 0) {
    return;
  }
  let params = "api_key=" + API_KEY + "&q=" + query + "&limit=5&rating=g";
  fetch(API_URL + "?" + params, { method: "GET" })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      displayResults(JSON.parse(text));
    })
    .catch((err) => {
      console.log(err);
    });
}

async function searchUsingFetchAsync(query) {
  if (!query || query.trim().length === 0) {
    return;
  }
  let params = "api_key=" + API_KEY + "&q=" + query + "&limit=5&rating=g";
  fetch(API_URL + "?" + params, { method: "GET" });
  let response = await fetch(API_URL + "?" + params, { method: "GET" });
  let data = await response.json();
  displayResults(data);
}

function displayResults(respObject) {
  for (item of respObject.data) {
    let imgElement = document.createElement("img");
    imgElement.src = item.images.downsized_medium.url;
    imgElement.alt = item.title;
    searchResults.appendChild(imgElement);
  }
}
