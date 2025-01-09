package com.socialmedia.service;

import com.socialmedia.model.Like;
import com.socialmedia.model.Post;
import com.socialmedia.user.User;
import com.socialmedia.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostService postService;

    @Transactional
    public Optional<Like> toggleLike(Long postId, User currentUser) {
        Post post = postService.getPost(postId);

        return likeRepository.findByPostAndUser(post, currentUser)
                .map(like -> {
                    likeRepository.delete(like);
                    return Optional.<Like>empty();
                })
                .orElseGet(() -> {
                    Like newLike = Like.builder()
                            .post(post)
                            .user(currentUser)
                            .build();
                    return Optional.of(likeRepository.save(newLike));
                });
    }

    public boolean hasUserLikedPost(Long postId, User currentUser) {
        return likeRepository.existsByPostIdAndUserId(postId, currentUser.getId());
    }

    public long getPostLikesCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}