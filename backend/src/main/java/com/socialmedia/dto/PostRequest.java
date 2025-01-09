package com.socialmedia.dto;

import com.socialmedia.model.Post.MediaType;
import lombok.Data;

@Data
public class PostRequest {
    private String caption;
    private String mediaUrl;
    private MediaType mediaType;
}