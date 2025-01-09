package com.socialmedia.service;

import com.socialmedia.model.Comment;
import com.socialmedia.model.Post;
import com.socialmedia.user.User;
import com.socialmedia.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostService postService;

    @Transactional
    public Comment createComment(Long postId, String content, User currentUser) {
        Post post = postService.getPost(postId);

        Comment comment = Comment.builder()
                .content(content)
                .post(post)
                .user(currentUser)
                .build();

        return commentRepository.save(comment);
    }

    public Comment getComment(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    public Page<Comment> getPostComments(Long postId, Pageable pageable) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);
    }

    @Transactional
    public Comment updateComment(Long id, String content, User currentUser) {
        Comment comment = getComment(id);
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to update this comment");
        }

        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id, User currentUser) {
        Comment comment = getComment(id);
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to delete this comment");
        }
        commentRepository.delete(comment);
    }
}
