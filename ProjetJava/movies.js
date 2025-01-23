document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4f320d51';
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');
    const filmDetailsContainer = document.getElementById('film-details');
  
    function formatDate(dateString) {
      if (!dateString || dateString === 'N/A') return 'Non disponible';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  
    if (imdbID) {
      fetch(`https://www.omdbapi.com/?apiKey=${apiKey}&i=${imdbID}&plot=full`)
        .then(response => response.json())
        .then(data => {
          if (data.Response === 'True') {
            filmDetailsContainer.innerHTML = `
              <div class="container">
                <div class="row">
                  <div class="col-md-4">
                    <img src="${data.Poster}" class="img-fluid" alt="${data.Title}">
                  </div>
                  <div class="col-md-8">
                    <div class="film-content">
                      <h2>${data.Title}</h2>
                      
                      <div class="film-meta-info">
                        <div><strong>Année:</strong> ${data.Year}</div>
                        <div><strong>Durée:</strong> ${data.Runtime}</div>
                        <div><strong>Genre:</strong> ${data.Genre}</div>
                        <div><strong>Date de sortie:</strong> ${formatDate(data.Released)}</div>
                        <div><strong>Sortie DVD:</strong> ${formatDate(data.DVD)}</div>
                      </div>
  
                      <div class="film-synopsis">
                        <h3>Synopsis</h3>
                        <p>${data.Plot}</p>
                      </div>
  
                      <div class="film-rating">
                        <h3>Notes et critiques</h3>
                        ${data.Ratings.map(rating => `
                          <div class="rating-item">
                            <strong>${rating.Source}:</strong>
                            <span>${rating.Value}</span>
                          </div>
                        `).join('')}
                        ${data.imdbVotes ? `
                          <div class="rating-item">
                            <strong>Nombre de votes:</strong>
                            <span>${parseInt(data.imdbVotes).toLocaleString()} votes</span>
                          </div>
                        ` : ''}
                      </div>
  
                      <div class="film-meta-info">
                        <div><strong>Réalisateur:</strong> ${data.Director}</div>
                        <div><strong>Scénariste:</strong> ${data.Writer}</div>
                        <div><strong>Acteurs:</strong> ${data.Actors}</div>
                        ${data.Awards !== 'N/A' ? `<div><strong>Récompenses:</strong> ${data.Awards}</div>` : ''}
                      </div>
  
                      <div class="mt-4">
                        <a href="https://www.imdb.com/title/${data.imdbID}" class="btn btn-primary" target="_blank">Voir sur IMDb</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          } else {
            filmDetailsContainer.innerHTML = '<div class="container"><p>Film introuvable.</p></div>';
          }
        })
        .catch(error => console.error('Error:', error));
    }
  });
