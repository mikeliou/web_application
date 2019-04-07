package com.omdb.proj.controller.resource;

public class BookmarkResource {

    private String movieId;
    private String error;

    public BookmarkResource() {
    }

    public BookmarkResource(String movieId, String error) {
        this.movieId = movieId;
        this.error = error;
    }

    public static BookmarkResource withError(String error) {
        return new BookmarkResource(null, error);
    }

    public static BookmarkResource withSuccess(String movieId) {
        return new BookmarkResource(movieId, null);
    }

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
