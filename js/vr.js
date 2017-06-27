/*global $ _*/
$(document).on('ready', function (event) {
    $.getJSON('data/movies.json', function (movies) {
        createMovieList(movies).appendTo('.flex-container');
        showAll(movies);
        filterGenre(movies);
        initializeLightbox(movies);
        searchTarget(movies);
      }).fail(function () {
        console.log('getJSON on product data failed!');
      });

  });

// 1. To create a list item for every new genre
// 2. On click of that item only show items that match that id
function filterGenre(movies) {
  var pluckedGenres = _.unique(_.pluck(movies, 'genre1')).sort().reverse();
  var filteredLists = _.map(pluckedGenres, function (pluckedGenre) {
                return $('<li>')
              .attr('id', 'genre1')
              .append($('<a href="#">').html(pluckedGenre))
              .prependTo('.dropdown-menu')
              .on('click', function () {
                  $('.list-movies').hide();
                  $('.thumbnail').hide();
                  _.map(movies, function (movie) {
                        if (movie.genre1 === pluckedGenre) {
                          return createMovieListItem(movie).appendTo('.flex-container');
                        }
                      });

                  initializeLightbox(movies);
                });
              });

  return filteredLists;
}

function showAll(movies) {
  $('#show-all').on('click', function () {
        $('.list-movies').hide();
        $('.thumbnail').hide();
        _.map(movies, function (movie) {
            return createMovieListItem(movie).appendTo('.flex-container');
          });

        initializeLightbox();
      });
}

function searchTarget(movies) {
  $('#button-search').on('click', function (event) {
        event.preventDefault();
        $('.list-movies').hide();
        $('.thumbnail').hide();
        var target = document.getElementById('input').value;
        var newList = _.map(search(movies, target), function (movie) {
            createMovieListItem(movie).appendTo('.flex-container');
          });

        initializeLightbox(movies);
        return newList;
      });
}

function initializeLightbox(movies) {
  $('.thumbnail').on('click', function (event) {
          $('.modal-body').empty();
          $('modal-header').empty();
          var imageUrl = $(event.currentTarget).attr('url');
          var description = $(event.currentTarget).attr('description');
          var title = $(event.currentTarget).attr('title');
          var date = $(event.currentTarget).attr('date');
          var director = $(event.currentTarget).attr('director');
          var studio = $(event.currentTarget).attr('studio');
          var country = $(event.currentTarget).attr('country');
          var genre1 = $(event.currentTarget).attr('genre1');
          var language = $(event.currentTarget).attr('language');
          var duration = $(event.currentTarget).attr('duration');
          $('.modal-header').append($('h1').html(title + ' (' + date.slice(date.length - 4) + ')'));
          $('.modal-body').append($('<img>').attr('src', imageUrl)
            .attr('id', 'temp-image').addClass('.col-6 .col-md-4'))
            .append($('<p>')
            .html('Director: ' + director + '<br></br>'
            + 'Studio: ' + studio + '<br></br>'
            + 'Country: ' + country + '<br></br>'
            + 'Genre: ' + genre1 + '<br></br>'
            + 'Language: ' + language + '<br></br>'
            + 'Duration: ' + duration + '<br></br>' + description)
            .addClass('.col .col-md-8'));
          $('#myModal').modal('show');
          $('.close').one('click', function () {
            $('.modal-body').empty();
            $('modal-header').empty();

          });

        });
}

//create ul, add id, class, dynamically add product item
function createMovieList(movies) {
  return $('<ul>')
        .attr('id', 'list-movies')
        .addClass('list-movies')
        .append(_.map(movies, function (movie, index) {
            return createMovieListItem(movie);
          }));
}

function createMovieListItem(movie) {
  return $('<li>')
        .attr('id', 'li-movie')
        .addClass('thumbnail')
        .attr('url', 'images/modal/' + movie.image)
        .attr('description', movie.description)
        .attr('title', movie.title)
        .attr('date', movie.release_date)
        .attr('genre1', movie.genre1)
        .attr('country', movie.country)
        .attr('director', movie.director)
        .attr('studio', movie.studio)
        .attr('language', movie.language)
        .attr('duration', movie.duration)
        .append(createMovieImageDiv('images/thumbnails/' + movie.image))
        .append(createMoviesDetailsDiv(movie.title,
        movie.country, 'Duration: ' + movie.duration));
}

function createMovieImageDiv(url) {
  return $('<div>').addClass('image-div')
        .append($('<img>').attr('src', url).addClass('image'));
}

function createMoviesDetailsDiv(title, country, duration) {
  var title = $('<div>')
        .addClass('title')
        .html(title);
  var country = $('<div>')
        .addClass('country')
        .html(country);
  var duration = $('<div>')
        .addClass('duration')
        .html(duration);
  return $('<div>').addClass('movie-details').append(title, country, duration);
}

//recursion function

function isCollection(value) {
  //weeds out false positives for objects and returns true if value is Array or Object intended as collection
  if (typeof value !== null && value instanceof Date === false && typeof value === 'object') {
    return true;
  }

  return false;
}

function search(collection, target) {
  var output = [];
  _.each(collection, function (value) {
      if (typeof value === 'string') {
        if (value.toLowerCase().indexOf(target.toLowerCase()) > -1) {
          output.push(value);
        }
      } else if (isCollection(value)) {
        if (search(value, target).length) {
          output.push(value);
        }
      }
    });

  return output;
}
