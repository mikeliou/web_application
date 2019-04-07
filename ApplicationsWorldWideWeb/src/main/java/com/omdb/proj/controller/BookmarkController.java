package com.omdb.proj.controller;

import com.omdb.proj.controller.resource.AddBookmarkResource;
import com.omdb.proj.controller.resource.BookmarkResource;
import com.omdb.proj.controller.resource.DeleteBookmarkResource;
import com.omdb.proj.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("api/bookmark")
public class BookmarkController {

    private BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping
    public ResponseEntity<BookmarkResource> saveBookmark(@RequestBody AddBookmarkResource resource) {
        BookmarkResource bookmarkResource = bookmarkService.addBookmark(resource);

        return bookmarkResource.getError() == null
                ? ResponseEntity.ok(bookmarkResource)
                : ResponseEntity.badRequest().body(bookmarkResource);
    }

    @GetMapping("/{userkey}")
    public ResponseEntity<List<BookmarkResource>> getBookmarks(@PathVariable(name = "userkey") UUID userkey) {
        List<BookmarkResource> myBookmarks = bookmarkService.getMyBookmarks(userkey);

        if (myBookmarks == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(myBookmarks);
    }

    @DeleteMapping("/{userkey}/{movieId}")
    public ResponseEntity<DeleteBookmarkResource> deleteBookmark(@PathVariable(name = "userkey") UUID userkey,
                                                                 @PathVariable(name = "movieId") String movieId) {

        DeleteBookmarkResource response = bookmarkService.delete(userkey, movieId);

        if (response.getResult().equalsIgnoreCase("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
