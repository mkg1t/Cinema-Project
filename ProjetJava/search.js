document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4f320d51';
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const resultsInfo = document.getElementById('search-results-info');
    const loadingElement = document.getElementById('loading');
    let currentPage = 1;
    let currentQuery = '';
    let totalResults = 0;
  
    function showLoading() {
      loadingElement.style.display = 'block';
    }
  
    function hideLoading() {
      loadingElement.style.display = 'none';
    }
  
    function updateResultsInfo(total) {
      if (total > 0) {
        resultsInfo.textContent = `${total} films trouvés`;
      } else {
        resultsInfo.textContent = '';
      }
    }
  
    function searchFilms(query, page = 1) {
      if (!query) {
        resultsContainer.innerHTML = '';
        resultsInfo.textContent = '';
        return;
      }
  
      currentQuery = query;
      showLoading();
  
      fetch(`https://www.omdbapi.com/?apiKey=${apiKey}&s=${query}&type=movie&page=${page}`)
        .then(response => response.json())
        .then(data => {
          hideLoading();
          
          if (page === 1) {
            resultsContainer.innerHTML = '';
            totalResults = data.totalResults;
            updateResultsInfo(totalResults);
          }
  
          if (data.Response === 'True') {
            data.Search.forEach(film => {
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
                        <a href="movie.html?id=${film.imdbID}" class="btn btn-primary">Plus de détails</a>
                      </div>
                    </div>
                  `;
                  resultsContainer.appendChild(filmCard);
                });
            });
  
            if (totalResults > page * 10) {
              let loadMoreBtn = document.getElementById('load-more-btn');
              if (!loadMoreBtn) {
                loadMoreBtn = document.createElement('button');
                loadMoreBtn.id = 'load-more-btn';
                loadMoreBtn.classList.add('btn', 'btn-primary', 'load-more');
                loadMoreBtn.textContent = 'Charger plus de résultats';
                document.querySelector('.container').appendChild(loadMoreBtn);
  
                loadMoreBtn.addEventListener('click', () => {
                  currentPage++;
                  searchFilms(currentQuery, currentPage);
                });
              }
            }
          } else {
            if (page === 1) {
              resultsContainer.innerHTML = `
                <div class="col-12">
                  <div class="no-results">
                    <i class="fas fa-film mb-3" style="font-size: 2rem;"></i>
                    <p>Aucun film trouvé pour "${query}"</p>
                  </div>
                </div>
              `;
            }
          }
        })
        .catch(error => {
          hideLoading();
          console.error('Error:', error);
        });
    }
  
    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      const query = e.target.value;
      currentPage = 1;
  
      debounceTimeout = setTimeout(() => {
        searchFilms(query, currentPage);
      }, 500);
    });
  
    searchInput.focus();
  });
