﻿$(function () {
    var typingTimer; //time identifier
    var doneTypingInterval = 500; //time in ms for getting search results

    //print error for every ajax request that fails
    $.ajaxSetup({
        error: function (xhr, status, error) {
            console.log("An error occured: " + status + "\nError: " + error);
        }
    });

    //show top rated movies as recommended
    var recommendedMovies = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569']; //moviesIDs
    recommendedMovies.forEach(function (movieID) {
        $.get("http://www.omdbapi.com", { //get results using API
            apikey: '397d19a0',
            i: movieID
        }, function (data, status) {
            if (data.Response == "True" && status == "success") { //check response and status of request
                //create a new div on the fly for each movie
                var $newDiv = $('<div class="col-sm-3"></div >');
                $newDiv.append($('<p class="rec-movie-title">' + data.Title + '</p>' + '<p>' + '(' + data.Year + ', ' + data.Runtime + ')' + '</p>'));
                $newDiv.append('<img src="' + data.Poster + '" class="img-responsive rec-movie-img">');

                $('#recommendedMovies').append($newDiv); //append new div to recommendedMovies container
            }
        });
    });

    //show autocomplete suggestions for movies while user is typing
    $("#searchMovieInput").keyup(function () { //trigger event on keyup while searching a movie
        if ($(this).val() != '') {
            clearTimeout(typingTimer); //clear timer every time user presses a key
            var str = $(this).val();
            $("#searchMovieInput").autocomplete({ //autocomplete function
                highlight: true,
                source: function (request, response) {
                    $.get("http://www.omdbapi.com", { //get suggestion results using API
                        apikey: '397d19a0',
                        s: str
                    }, function (data, status) {
                        if (data.Response == "True" && status == "success") {
                            var suggestMovies = [];
                            data.Search.forEach(function (searchResult) {
                                suggestMovies.push(searchResult.Title);
                            });

                            response(suggestMovies);
                        }
                        }).fail(function () {
                            console.log("error in autocomplete request");
                        });
                },
                select: function (event, ui) {
                    showMovieByTitle(ui.item.label);
                }
            });
        }
        typingTimer = setTimeout(doneTyping, doneTypingInterval); //when condition is met fires doneTyping()
    });

    //when time > doneTypingInterval show search results
    function doneTyping() {
        showMovieByTitle($("#searchMovieInput").val());
    }

    function showMovieByTitle(movieTitle)
    {
        $.get("http://www.omdbapi.com", { //get movie using API
            apikey: '397d19a0',
            t: movieTitle
        }, function (data, status) {
            if (data.Response == "True" && status == "success") {
                $('#searchResultsContainer').show(); //show searchResultsContainer
                $('#searchResults').empty(); //clear previous results

                //create a new div with movie info on the fly
                var $newDiv = $('<div class="col-sm-12" id="searchMovieDiv"></div>');
                $newDiv.append($('<h4>' + data.Title + '</h4>' + '(' + data.Year + ')'));
                $newDiv.append($('<h5>' + data.Type + ' | ' + data.Runtime + ' | ' + data.Genre + ' | ' + data.Released + '</h5>'));

                //iterate through data.Ratings object to show all ratings
                var $listRatings = ($('<table class="table-ratings"></table>'));
                data.Ratings.forEach(function (rating) {
                    $listRatings.append($('<tr></tr>'));
                    //if rating is by IMDB show votes info                    
                    var strRating = rating.Source + ': ' + rating.Value;
                    if (rating.Source == 'Internet Movie Database') strRating += ' (' + data.imdbVotes + ' votes)';
                    $listRatings.append($('<td align="left"><img src="star.png"/><span>' + strRating + '</span></td>'));
                });

                $newDiv.append($listRatings);
                $newDiv.append('<img src="' + data.Poster + '" class="img-responsive search-movie-img" align="center"><br>');
                $newDiv.append($('<p id="searchMoviePlot">' + data.Plot + '</p>'));
                $newDiv.append($('<p align="left"><b> Director: </b>' + data.Director + '</p>'));
                $newDiv.append($('<p align="left"><b> Writer: </b>' + data.Writer + '</p>'));
                $newDiv.append($('<p align="left"><b> Actors: </b>' + data.Actors + '</p>'));
                $newDiv.append($('<a id="textReadMore" href="#">Read more...</a>'));
                $newDiv.append($('<p id="searchMovieID" hidden>' + data.imdbID + '</p>'));

                //append new div to searchResults container
                $('#searchResults').append($newDiv);
            }
        }).fail(function () {
            console.log("error in showmovie request");
        });
    }

    //when user clicks on a poster of recommended movies show details of movie
    $(document).on('click', '.rec-movie-img', function () {
        var imageTitle = $(this).parent().find('p.rec-movie-title').text();

        showMovieByTitle(imageTitle);
    });

    //when user presses Read More show extra info
    $(document).on('click', '#textReadMore', function () {
        $.get("http://www.omdbapi.com", { //get movie info with full plot using API
            apikey: '397d19a0',
            i: $('#searchMovieID').text(),
            plot: 'full'
        }, function (data, status) {
            if (data.Response == 'True' && status == 'success') {
                $("#textReadMore").hide();
                $("#searchMoviePlot").text(data.Plot);

                var $searchMovieDiv = $('#searchMovieDiv');
                $searchMovieDiv.append($('<p align="left"><b> Rated: </b>' + data.Rated + '</p>'));
                $searchMovieDiv.append($('<p align="left"><b> Language: </b>' + data.Language + '</p>'));
                $searchMovieDiv.append($('<p align="left"><b> Country: </b>' + data.Country + '</p>'));
                $searchMovieDiv.append($('<p align="left"><b> Awards: </b>' + data.Awards + '</p>'));
                $searchMovieDiv.append($('<p align="left"><b> DVD: </b>' + data.DVD + '</p>'));
                $searchMovieDiv.append($('<p align="left"><b> Box Office: </b>' + data.BoxOffice + '</p>'));
                $searchMovieDiv.append($('<p align="left"><b> Production: </b>' + data.Production + '</p>'));
                //if data.Website is not empty or N/A show as link
                if (data.Website != 'N/A' && data.Website != '') data.Website = '<a href="' + data.Website + '">' + data.Website + '</a>';
                $searchMovieDiv.append($('<p align="left"><b> Website: </b>' + data.Website + '</p>'));
            }
            }).fail(function () {
                console.log("error in readmore request");
            });
        return false; //return false to avoid reloading page
    });

});