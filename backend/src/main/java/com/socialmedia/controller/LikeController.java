package com.socialmedia.controller;

import com.socialmedia.model.Like;
import com.socialmedia.service.LikeService;
import com.socialmedia.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/posts/{postId}/likes")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser
    ) {
        Optional<Like> result = likeService.toggleLike(postId, currentUser);
        return result.isPresent()
                ? ResponseEntity.ok().build()
                : ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getLikesCount(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getPostLikesCount(postId));
    }

    @GetMapping("/status")
    public ResponseEntity<Boolean> hasUserLikedPost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(likeService.hasUserLikedPost(postId, currentUser));
    }
}