$(function () {
    var typingTimer; //time identifier
    var doneTypingInterval = 500; //time in ms for getting search results

    //print error for every ajax request that fails
    $.ajaxSetup({
        error: function (xhr, status, error) {
            console.log("An error occured: " + status + "\nError: " + error);
        }
    });

    //show top rated movies
    var recommendedMovies = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569']; //moviesIDs
    var recommendedMoviesTrailers = {
        'The Godfather': 'https://www.youtube.com/embed/sY1S34973zA', 
        'The Shawshank Redemption': 'https://www.youtube.com/embed/6hB3S9bIaco',
        'The Godfather: Part II': 'https://www.youtube.com/embed/9O1Iy9od7-A', 
        'The Dark Knight': 'https://www.youtube.com/embed/EXeTwQWrcwY'
        }; //trailers per movie

    for (var c = 0; c < recommendedMovies.length; c++) {
        $.get("http://www.omdbapi.com", { //get results using API
            apikey: '397d19a0',
            i: recommendedMovies[c]
        }, function (data, status) {
            if (data.Response == "True" && status == "success") { //check response and status of request
                //create a new div on the fly for each movie
                var $newDiv = $('<div class="col-sm-3"></div>');
                $newDiv.append($('<p class="rec-movie-title">' + data.Title + '</p>' + '<p>' + '(' + data.Year + ', ' + data.Runtime + ')' + '</p>'));

                var $containerDiv = $('<div class="rec-container"></div>');
                $containerDiv.append('<img src="' + data.Poster + '" class="img-responsive rec-movie-img">');
                
                //overlay effect for watching trailer
                $containerDiv.append('<div class="overlay"><a href="#" class="icon" title="Watch trailer" data-url="' + recommendedMoviesTrailers[data.Title] + '" data-toggle="modal" data-target="#myModal"><i class="fa fa-play"></i></a></div>');

                $newDiv.append($containerDiv);

                $('#recommendedMovies').append($newDiv); //append new div to recommendedMovies container
            }
        });
    };

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
        else
            $('#searchResultsContainer').hide(); //hide container if search bar is empty

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
                $newDiv.append($('<div class="headline"><h4><b>' + data.Title + '</b></h4>' + ' (' + data.Year + ')' +
                                 '<img id="imgIsBookmark" src="heart-blank.png" /></div>'));
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

                $newDiv.append($('<p id="searchMovieID" hidden>' + data.imdbID.trim() + '</p>'));

                //append new div to searchResults container
                $('#searchResults').append($newDiv);

                $.get("http://www.omdbapi.com", { //get similar movies results using API
                    apikey: '397d19a0',
                    s: movieTitle
                }, function (similarMoviesData, similarMoviesStatus) {
                    if (similarMoviesData.Response == "True" && similarMoviesStatus == "success") {
                        $('#similarMoviesDiv').empty(); //clear previous results

                        //create similar movies div
                        var $similarMoviesDiv = $('<div class="col-sm-12" id="similarMoviesDiv"></div>');
                        $similarMoviesDiv.append($('<h3>More search results: </h3>'));

                        //create table to show similar movies, first row = titles, second row = posters
                        var $tableSimilarMovies = ($('<table id="similarMoviesTable"></table>'));
                        var $rowTitle = $('<tr></tr>');
                        for (i = 0; i < similarMoviesData.Search.length; i++) {
                            $rowTitle.append($('<td><p><b>' + similarMoviesData.Search[i].Title + '</b></p></td>'));
                        }
                        $tableSimilarMovies.append($rowTitle);

                        var $rowPoster = $('<tr></tr>');
                        for (i = 0; i < similarMoviesData.Search.length; i++) {
                            $rowPoster.append('<td><img src="' + similarMoviesData.Search[i].Poster + '" class="img-responsive similar-movie-img" data-title="' + similarMoviesData.Search[i].Title + '"></td>');
                        }
                        $tableSimilarMovies.append($rowPoster);

                        $similarMoviesDiv.append($tableSimilarMovies);
                        $('#searchResults').append($similarMoviesDiv);

                        //create pages for all similar movies
                        paginateTable();
                    }
                }).fail(function () {
                    console.log("error in similar movies request");
                });
            }
        }).fail(function () {
            console.log("error in showmovie request");
        });
    }

    //when user clicks on a similar movie, show that movie
    $(document).on('click', '.similar-movie-img', function () {
        var similarMovieTitle = $(this).data('title');

        showMovieByTitle(similarMovieTitle);
    });

    //when user clicks on a poster of recommended movies show trailer on modal
    $(document).on('click', '.icon', function () {
        var url = $(this).data('url');

        $('#iframeModal').attr('src', url);
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
                if (data.Website != 'N/A' && data.Website != '') data.Website = '<a align="left" href="' + data.Website + '">' + data.Website + '</a>';
                $searchMovieDiv.append($('<p align="left"><b> Website: </b>' + data.Website + '</p>'));
            }
            }).fail(function () {
                console.log("error in readmore request");
            });
        return false; //return false to avoid reloading page
    });

    $('MyBookmarks.html').ready(function () {

        //************************************CHANGE TO API CALL*************************
        let carouselMovies = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt1375666', 'tt1130884'];
        //*******************************************************************************

        let arraySavedBookmarks = [];
        for (let c = 0; c < carouselMovies.length; c++) {
            $.get("http://www.omdbapi.com", { //get results using API
                apikey: '397d19a0',
                i: carouselMovies[c]
            }, function (data, status) {
                if (data.Response == "True" && status == "success") { //check response and status of request
                    if (c == 0)
                        $('.carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="' + c + '" class="active"></li>');
                    else
                        $('.carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="' + c + '"></li>');

                    let $divCarousel = $('.carousel-inner');

                    if (c == 0)
                        var $divItem = $('<div class="item active"></div>');
                    else
                        var $divItem = $('<div class="item"></div>');

                    let $imgMovie = $('<img src="' + data.Poster + '" />');
                    $divItem.append($imgMovie);

                    //var $divCarouselCaption = $('<div class="carousel-caption"><h3>' + data.Title + '</h3><p>' + data.Plot + '</p ></div > ');
                    //$divItem.append($divCarouselCaption);

                    $divCarousel.append($divItem);

                    let $divBookmarkMovie = $('<div class="col-sm-4"><p class="rec-movie-title">' + data.Title + '</p><img src="' + data.Poster + '" /></div>');
                    arraySavedBookmarks.push($divBookmarkMovie);

                    if (c == carouselMovies.length - 1) {
                        let $divSavedBookmarks = $('#savedBookmarksDiv');

                        for (let i = 0, j = arraySavedBookmarks.length; i < j; i += 3) {
                            let temparray = arraySavedBookmarks.slice(i, i + 3);

                            $rowSavedBookmarks = $('<div class="row"></div>')
                            temparray.forEach(function ($tempitem) {
                                $rowSavedBookmarks.append($tempitem);
                            });

                            $divSavedBookmarks.append($rowSavedBookmarks);
                        }
                        
                    }
                }
            });
        }
    });

    $('#formLogin').submit(function (event) {
        let formArray = $('#formLogin').serializeArray();

        $.post("http://localhost", { //send post request to login
            username: formArray.find(o => o.name === 'username').value,
            password: formArray.find(o => o.name === 'password').value
        }, function () {
            alert('hey');
        }).fail(function () {
            console.log("error in readmore request");
        });

        //event.preventDefault();
    });

    $('#formSignup').submit(function (event) {
        let formArray = $('#formSignup').serializeArray();

        $.post("http://localhost", { //send post request to login
            firstName: formArray.find(o => o.name === 'firstName').value,
            lastName: formArray.find(o => o.name === 'lastName').value
        }, function () {
            alert('hey');
        }).fail(function () {
            console.log("error in readmore request");
        });

        //event.preventDefault();
    });

    //paginate table to not show all similar movies in one page
    function paginateTable() {
        $('#similarMoviesTable').after('<div id="nav"></div>');
        var $tableRows = $('#similarMoviesTable tr');
        if ($tableRows.length > 0) {
            var moviesTotal = $('td', $tableRows[0]).length;
            var moviesShown = 4;
            var numPages = moviesTotal / moviesShown;
            for (i = 0; i < numPages; i++) {
                //create links with page numbers
                var pageNum = i + 1;
                $('#nav').append('<a href="#" rel="' + i + '" class="nav-link">' + pageNum + '</a> ');
            }

            //hide all movies
            $('#similarMoviesTable td').hide();
            $tableRows.each(function () {
                $('td', this).slice(0, moviesShown).show();
            });
            
            $('#nav a:first').addClass('active');
            $('#nav a').bind('click', function () {
                //on page number click show only that range of movies
                $('#nav a').removeClass('active');
                $(this).addClass('active');
                var currPage = $(this).attr('rel');
                var startItem = currPage * moviesShown;
                var endItem = startItem + moviesShown;

                $tableRows.each(function () {
                    $('td', this).css('opacity', '0.0').hide().slice(startItem, endItem).
                        css('display', 'table-cell').animate({ opacity: 1 }, 300);
                });

                return false;
            });
        }
        
    }
});