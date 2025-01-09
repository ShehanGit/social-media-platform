package com.socialmedia.controller;

import com.socialmedia.model.Post;
import com.socialmedia.service.PostService;
import com.socialmedia.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<Post>> getPosts(
            @RequestParam(defaultValue = "time") String sortBy,
            Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPosts(sortBy, pageable));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPost(postId));
    }

    @PostMapping
    public ResponseEntity<Post> createPost(
            @AuthenticationPrincipal User user,
            @RequestParam String caption,
            @RequestParam MultipartFile mediaFile
    ) throws IOException {
        return ResponseEntity.ok(postService.createPost(user, caption, mediaFile));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user,
            @RequestParam String caption
    ) {
        return ResponseEntity.ok(postService.updatePost(postId, user, caption));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user
    ) {
        postService.deletePost(postId, user);
        return ResponseEntity.noContent().build();
    }
}
