package com.omdb.proj.controller.resource;

public class DeleteBookmarkResource {

    private String result;

    public DeleteBookmarkResource() {
    }

    public DeleteBookmarkResource(String result) {
        this.result = result;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
