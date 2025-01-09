package com.socialmedia.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private Integer authorId;
    private Long postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}