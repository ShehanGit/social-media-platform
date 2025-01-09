package com.socialmedia.controller;

import com.socialmedia.dto.PostRequest;
import com.socialmedia.dto.PostResponse;
import com.socialmedia.model.Post;
import com.socialmedia.service.PostService;
import com.socialmedia.service.LikeService;
import com.socialmedia.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final LikeService likeService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Post post = Post.builder()
                .caption(request.getCaption())
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .build();

        Post savedPost = postService.createPost(post, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToPostResponse(savedPost, currentUser));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getFeedPosts(
            @AuthenticationPrincipal User currentUser,
            Pageable pageable
    ) {
        Page<Post> posts = postService.getFeedPosts(pageable);
        return ResponseEntity.ok(posts.map(post -> mapToPostResponse(post, currentUser)));
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<PostResponse>> getTrendingPosts(
            @AuthenticationPrincipal User currentUser,
            Pageable pageable
    ) {
        Page<Post> posts = postService.getTrendingPosts(pageable);
        return ResponseEntity.ok(posts.map(post -> mapToPostResponse(post, currentUser)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        Post post = postService.getPost(id);
        return ResponseEntity.ok(mapToPostResponse(post, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Post postToUpdate = Post.builder()
                .caption(request.getCaption())
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .build();

        Post updatedPost = postService.updatePost(id, postToUpdate, currentUser);
        return ResponseEntity.ok(mapToPostResponse(updatedPost, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        postService.deletePost(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    private PostResponse mapToPostResponse(Post post, User currentUser) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setCaption(post.getCaption());
        response.setMediaUrl(post.getMediaUrl());
        response.setMediaType(post.getMediaType());
        response.setAuthorName(post.getUser().getFirstname() + " " + post.getUser().getLastname());
        response.setAuthorId(post.getUser().getId());
        response.setLikesCount(likeService.getPostLikesCount(post.getId()));
        response.setCommentsCount(post.getComments().size());
        response.setLiked(likeService.hasUserLikedPost(post.getId(), currentUser));
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        return response;
    }
}
