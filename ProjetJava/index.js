document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4f320d51';
    let currentPage = 1;
  
    function loadTrendingMovies(page = 1) {
      fetch(`https://www.omdbapi.com/?apiKey=${apiKey}&s=2024&type=movie&y=2024&page=${page}`)
        .then(response => response.json())
        .then(data => {
          if (data.Response === 'True') {
            const films = data.Search;
            const filmsContainer = document.getElementById('films-tendances');
            
            films.forEach(film => {
              fetch(`https://www.omdbapi.com/?apiKey=${apiKey}&i=${film.imdbID}`)
                .then(response => response.json())
                .then(movieDetails => {
                  const filmCard = document.createElement('div');
                  filmCard.classList.add('col-12', 'mb-4');
                  filmCard.innerHTML = `
                    <div class="card film-card">
                      <div class="film-poster">
                        <img src="${film.Poster}" alt="${film.Title}">
                      </div>
                      <div class="film-info">
                        <h5 class="card-title">${film.Title}</h5>
                        <div class="film-meta">
                          <span>Genre: ${movieDetails.Genre}</span> • 
                          <span>Durée: ${movieDetails.Runtime}</span> • 
                          <span>Année: ${film.Year}</span>
                        </div>
                        <p class="card-text">${movieDetails.Plot}</p>
                        <a href="movie.html?id=${film.imdbID}" class="btn btn-primary">En savoir plus</a>
                      </div>
                    </div>
                  `;
                  filmsContainer.appendChild(filmCard);
                });
            });
          }
        })
        .catch(error => console.error('Error:', error));
    }
  
    loadTrendingMovies();
  
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.classList.add('btn', 'btn-primary', 'load-more');
    loadMoreBtn.textContent = 'Charger plus de films';
    document.querySelector('.container').appendChild(loadMoreBtn);
  
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      loadTrendingMovies(currentPage);
    });
  });
