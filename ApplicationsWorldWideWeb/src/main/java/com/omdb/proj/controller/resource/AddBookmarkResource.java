package com.omdb.proj.controller.resource;

import java.util.UUID;

public class AddBookmarkResource {

    private String movieId;
    private UUID userkey;

    public String getMovieId() {
        return movieId;
    }

    public void setMovieId(String movieId) {
        this.movieId = movieId;
    }

    public UUID getUserkey() {
        return userkey;
    }

    public void setUserkey(UUID userkey) {
        this.userkey = userkey;
    }
}
