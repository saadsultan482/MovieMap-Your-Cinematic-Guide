
let movieNameRef = document.getElementById('movie-name');
let searchBtn = document.getElementById('search-btn');
let result = document.getElementById('result');

let key = '91f716bc';

// Function to fetch data from API
let getMovie = (movieName) => {
    let url = `http://www.omdbapi.com/?s=${movieName}&apikey=${key}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.Response === 'True') {
                displaySuggestions(data.Search);
            } else {
                clearSuggestions();
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            clearSuggestions();
        });
};

// Function to display suggestions
let displaySuggestions = (movies) => {
    // Clear previous suggestions
    result.innerHTML = '';

    movies.forEach(movie => {
        let suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.textContent = movie.Title;
        suggestion.addEventListener('click', () => {
            // When suggestion is clicked, fill input field with the selected movie
            movieNameRef.value = movie.Title;
            // Fetch and display details for the selected movie
            fetchMovieDetails(movie.imdbID);
        });
        result.appendChild(suggestion);
    });
};

// Function to fetch and display movie details
let fetchMovieDetails = (imdbID) => {
    let url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${key}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display movie details
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            result.innerHTML = `<h3 class="msg">Network Error</h3>`;
        });
};

// Function to display movie details
let displayMovieDetails = (data) => {
    // Clear previous suggestions
    result.innerHTML = '';
    console.log(data)

    if (data.Response === 'True') {
        result.innerHTML = `
        
                <div class="info">
                    <img src=${data.Poster} class="poster">

                    <div>
                        <h2>${data.Title}</h2>

                        <div class="rating">
                            <img src = 'Images/star.png'>
                            <h4>${data.imdbRating}</h4>
                        </div>

                        <div class="details">
                            <span>${data.Rated}</span>
                            <span>${data.Year}</span>
                            <span>${data.Runtime}</span>
                        </div>

                        <div class="genre">
                            <div>${data.Genre.split(',').join('</div><div>')}</div>
                            
                        </div>

                    </div>

                </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p>
                `;
    } else {
        result.innerHTML = `<h3 class="msg">Enter Correct Movie Name</h3>`;
    }
};


// Function to clear suggestions
let clearSuggestions = () => {
    result.innerHTML = '';
};

// Event listener for input field
movieNameRef.addEventListener('input', () => {
    let inputValue = movieNameRef.value.trim();
    if (inputValue.length > 0) {
        getMovie(inputValue);
    } else {
        clearSuggestions();
    }
});

// Event listener for search button
searchBtn.addEventListener('click', () => {
    let movieName = movieNameRef.value.trim();
    if (movieName.length > 0) {
        fetchMovieDetails(movieName);
    } else {
        clearSuggestions();
    }
});
