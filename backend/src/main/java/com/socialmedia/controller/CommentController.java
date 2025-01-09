package com.socialmedia.controller;

import com.socialmedia.dto.CommentRequest;
import com.socialmedia.dto.CommentResponse;
import com.socialmedia.model.Comment;
import com.socialmedia.service.CommentService;
import com.socialmedia.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts/{postId}/comments")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Comment comment = commentService.createComment(postId, request.getContent(), currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToCommentResponse(comment));
    }

    @GetMapping
    public ResponseEntity<Page<CommentResponse>> getPostComments(
            @PathVariable Long postId,
            Pageable pageable
    ) {
        Page<Comment> comments = commentService.getPostComments(postId, pageable);
        return ResponseEntity.ok(comments.map(this::mapToCommentResponse));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Comment comment = commentService.updateComment(commentId, request.getContent(), currentUser);
        return ResponseEntity.ok(mapToCommentResponse(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal User currentUser
    ) {
        commentService.deleteComment(commentId, currentUser);
        return ResponseEntity.noContent().build();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setAuthorName(comment.getUser().getFirstname() + " " + comment.getUser().getLastname());
        response.setAuthorId(comment.getUser().getId());
        response.setPostId(comment.getPost().getId());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }
}
