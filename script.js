const btnXHR = document.getElementById("xhrSearch");
const btnFetch = document.getElementById("fetchSearch");
const btnFetchAsyncAwait = document.getElementById("fetchAsyncAwait");

let searchQueryElem = document.getElementById("query");
let searchResults = document.getElementById("searchResults");

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = "R11IL0IR5ZQWNnnYw-m2H67k1QfyyctF_LAsx_g5xro";

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

function getParams(query) {
  if (!query || query.trim().length === 0) {
    return;
  }
  return "client_id=" + API_KEY + "&query=" + query + "&per_page=5";
}

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

  let params = getParams(query);
  xhr.open("GET", API_URL + "?" + params);
  xhr.setRequestHeader("Authorization", "Client-ID " + API_KEY); // Set header
  xhr.send();
}

function searchUsingFetch(query) {
  let params = getParams(query);
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
  let params = getParams(query);
  fetch(API_URL + "?" + params, { method: "GET" });
  let response = await fetch(API_URL + "?" + params, { method: "GET" });
  let data = await response.json();
  displayResults(data);
}

function createImageCard(result) {
  const {
    urls: { small },
    description,
    user: { name, location },
    views,
    tags,
  } = result;

  const tagTitles = tags.map(tag => tag.title).join(', ') || 'N/A';
  const imageDescription = description || 'N/A';
  const userLocation = location || 'N/A';

  return `
    <div class="image-card">
      <img src="${small}" alt="${imageDescription}" />
      <div class="image-info">
        <p><strong>Description:</strong> ${imageDescription}</p>
        <p><strong>Creator:</strong> ${name}</p>
        <p><strong>Location:</strong> ${userLocation}</p>
        <p><strong>Views:</strong> ${views}</p>
        <p><strong>Tags:</strong> ${tagTitles}</p>
      </div>
    </div>
  `;
}

function displayResults(data) {
  const searchResults = document.getElementById('searchResults');

  if (!data || !data.results || data.results.length === 0) {
    searchResults.innerHTML = 'No results found';
    return;
  }

  const images = data.results.map(createImageCard).join('');
  searchResults.innerHTML = images;
}
