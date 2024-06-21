// Constants for API and DOM elements
const apiKey = '7434b459';  // Replace with your OMDB API key
const apiUrl = 'http://www.omdbapi.com/';

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const latestMoviesContainer = document.getElementById('latestMovies');
const latestTVShowsContainer = document.getElementById('latestTVShows');
const searchResultsContainer = document.getElementById('searchResults');
const movieModal = document.getElementById('movieModal');
const suggestionsContainer = document.getElementById('suggestions');

// Event listener for search input (for suggestions)
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        fetchSuggestions(searchTerm);
    } else {
        suggestionsContainer.style.display = 'none';
    }
});

// Event listener for search button
searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();

    // Clear previous search results
    searchResultsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    if (searchTerm !== '') {
        searchMovies(searchTerm);
    }
});

// Function to fetch search suggestions
function fetchSuggestions(query) {
    const url = `${apiUrl}?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displaySuggestions(data.Search);
            } else {
                suggestionsContainer.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            suggestionsContainer.style.display = 'none';
        });
}

// Function to display search suggestions
function displaySuggestions(results) {
    suggestionsContainer.innerHTML = '';
    results.forEach(result => {
        const { Title, Year, imdbID } = result;
        const suggestionElement = document.createElement('p');
        suggestionElement.textContent = `${Title} (${Year})`;
        suggestionElement.addEventListener('click', () => {
            searchInput.value = Title;
            suggestionsContainer.style.display = 'none';
            searchMovies(Title);
        });
        suggestionsContainer.appendChild(suggestionElement);
    });
    suggestionsContainer.style.display = 'block';
}

// Function to search movies by title
function searchMovies(title) {
    const url = `${apiUrl}?s=${encodeURIComponent(title)}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                displaySearchResults(data.Search);
            } else {
                searchResultsContainer.innerHTML = '<p>No results found</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to display search results
function displaySearchResults(results) {
    results.forEach(result => {
        const { Title, Year, Poster, imdbID } = result;

        const resultElement = document.createElement('div');
        resultElement.classList.add('search-item');

        const posterUrl = Poster === 'N/A' ? 'placeholder.jpg' : Poster;

        resultElement.innerHTML = `
            <img src="${posterUrl}" alt="${Title}">
            <div class="search-item-details">
                <h2>${Title}</h2>
                <p>Year: ${Year}</p>
                <button onclick="getMovieDetails('${imdbID}')">Details</button>
            </div>
        `;

        searchResultsContainer.appendChild(resultElement);
    });
}

// Function to fetch and display movie details in a modal
function getMovieDetails(imdbID) {
    const url = `${apiUrl}?i=${imdbID}&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { Title, Year, Poster, imdbRating, Released, Genre, Plot } = data;

            const posterUrl = Poster === 'N/A' ? 'placeholder.jpg' : Poster;

            const movieDetailsElement = document.getElementById('movieDetails');
            movieDetailsElement.innerHTML = `
                <img src="${posterUrl}" alt="${Title}">
                <h2>${Title}</h2>
                <p>Rating: ${imdbRating}</p>
                <p>Released: ${Released}</p>
                <p>Genre: ${Genre}</p>
                <p>${Plot}</p>
            `;

            movieModal.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}

// Function to close the modal
function closeModal() {
    movieModal.style.display = 'none';
}

// Function for logout (dummy example)
function logout() {
    // Implement your logout logic here (e.g., clear session, redirect to login page)
    console.log('User logged out');
}

// Function to load latest movies and TV shows
function loadLatestContent() {
    // Hardcode some movie and TV show IDs for the latest content
    const latestMoviesIDs = [
        'tt0111161', 'tt0068646', 'tt0071562', 
        'tt0108052', 'tt0110912', 'tt0468569', 
        'tt0050083', 'tt0109830', 'tt0167260',
        'tt0137523', 'tt1375666', 'tt0120737'
    ];
    const latestTVShowsIDs = [
        'tt0944947', 'tt0903747', 'tt1475582',
        'tt7366338', 'tt0141842', 'tt0306414',
        'tt1474684', 'tt0108778', 'tt2861424',
        'tt5753856', 'tt6769208', 'tt5071412'
    ];

    // Fetch and display latest movies
    latestMoviesIDs.forEach(imdbID => {
        fetch(`${apiUrl}?i=${imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(movie => {
                const { Title, Year, Poster } = movie;
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie');

                const posterUrl = Poster === 'N/A' ? 'placeholder.jpg' : Poster;

                movieElement.innerHTML = `
                    <img src="${posterUrl}" alt="${Title}">
                    <div class="movie-details">
                        <h2>${Title}</h2>
                        <p>Year: ${Year}</p>
                        <button onclick="getMovieDetails('${imdbID}')">Details</button>
                    </div>
                `;

                latestMoviesContainer.appendChild(movieElement);
            })
            .catch(error => console.error('Error fetching movie:', error));
    });

    // Fetch and display latest TV shows
    latestTVShowsIDs.forEach(imdbID => {
        fetch(`${apiUrl}?i=${imdbID}&apikey=${apiKey}`)
            .then(response => response.json())
            .then(show => {
                const { Title, Year, Poster } = show;
                const showElement = document.createElement('div');
                showElement.classList.add('tv-show');

                const posterUrl = Poster === 'N/A' ? 'placeholder.jpg' : Poster;

                showElement.innerHTML = `
                    <img src="${posterUrl}" alt="${Title}">
                    <div class="tv-show-details">
                        <h2>${Title}</h2>
                        <p>Year: ${Year}</p>
                        <button onclick="getMovieDetails('${imdbID}')">Details</button>
                    </div>
                `;

                latestTVShowsContainer.appendChild(showElement);
            })
            .catch(error => console.error('Error fetching TV show:', error));
    });
}

// Load latest movies and TV shows on page load
window.addEventListener('DOMContentLoaded', loadLatestContent);
