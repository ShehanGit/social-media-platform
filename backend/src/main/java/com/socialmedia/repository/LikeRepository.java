package com.socialmedia.repository;

import com.socialmedia.model.Like;
import com.socialmedia.model.Post;
import com.socialmedia.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByPostAndUser(Post post, User user);
    boolean existsByPostIdAndUserId(Long postId, Integer userId);
    long countByPostId(Long postId);
}