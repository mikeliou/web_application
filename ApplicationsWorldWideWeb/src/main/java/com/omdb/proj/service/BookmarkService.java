package com.omdb.proj.service;

import com.omdb.proj.controller.resource.AddBookmarkResource;
import com.omdb.proj.controller.resource.BookmarkResource;
import com.omdb.proj.controller.resource.DeleteBookmarkResource;
import com.omdb.proj.domain.Bookmark;
import com.omdb.proj.domain.BookmarkRepository;
import com.omdb.proj.domain.User;
import com.omdb.proj.domain.UserRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private UserRepository userRepository;
    private BookmarkRepository bookmarkRepository;

    public BookmarkService(UserRepository userRepository, BookmarkRepository bookmarkRepository) {
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    /**
     * add a new bookmark into database
     */
    public BookmarkResource addBookmark(AddBookmarkResource resource) {
        User user = userRepository.findByUserkey(resource.getUserkey());

        if (user == null) {
            return BookmarkResource.withError("user does not exist");
        }

        if (bookmarkRepository.existsByMovieIdAndUserId(resource.getMovieId(), user.getId())) {
            return BookmarkResource.withError("movie with id: " + resource.getMovieId() + " already saved");
        }
        Bookmark bookmark = new Bookmark();
        bookmark.setMovieId(resource.getMovieId());
        bookmark.setUserId(user.getId());

        bookmarkRepository.save(bookmark);
        return BookmarkResource.withSuccess(resource.getMovieId());

    }

    /**
     * get all bookmarks by userkey
     */
    public List<BookmarkResource> getMyBookmarks(UUID userkey) {
        User user = userRepository.findByUserkey(userkey);

        if (user == null) {
            return null;
        }

        return bookmarkRepository.findAllByUserId(user.getId())
                .stream()
                .map(b -> BookmarkResource.withSuccess(b.getMovieId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public DeleteBookmarkResource delete(UUID userkey, String movieId) {
        User user = userRepository.findByUserkey(userkey);

        if (user == null) {
            return new DeleteBookmarkResource("user does not exist");
        }

        if (!bookmarkRepository.existsByMovieIdAndUserId(movieId, user.getId())) {
            return new DeleteBookmarkResource("movie with id: " + movieId + " does not exist");
        }

        bookmarkRepository.deleteByMovieIdAndUserId(movieId, user.getId());

        return new DeleteBookmarkResource("success");
    }
}
