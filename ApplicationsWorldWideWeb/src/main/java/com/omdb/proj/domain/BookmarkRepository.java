package com.omdb.proj.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByMovieIdAndUserId(String movieId, Long userId);

    List<Bookmark> findAllByUserId(Long userId);

    void deleteByMovieIdAndUserId(String movieId, Long userId);
}
