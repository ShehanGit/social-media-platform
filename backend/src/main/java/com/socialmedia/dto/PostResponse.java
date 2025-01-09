package com.socialmedia.dto;

import com.socialmedia.model.Post.MediaType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String caption;
    private String mediaUrl;
    private MediaType mediaType;
    private String authorName;
    private Integer authorId;
    private long likesCount;
    private long commentsCount;
    private boolean isLiked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}