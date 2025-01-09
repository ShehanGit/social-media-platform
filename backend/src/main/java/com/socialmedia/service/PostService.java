package com.socialmedia.service;

import com.socialmedia.exception.PostNotFoundException;
import com.socialmedia.exception.UnauthorizedAccessException;
import com.socialmedia.model.Post;
import com.socialmedia.model.Post.MediaType;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<Post> getPosts(String sortBy, Pageable pageable) {
        return switch (sortBy.toLowerCase()) {
            case "likes" -> postRepository.findAllOrderByLikesCount(pageable);
            default -> postRepository.findAllByOrderByCreatedAtDesc(pageable);
        };
    }

    @Transactional(readOnly = true)
    public Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found with id: " + postId));
    }

    @Transactional
    public Post createPost(User user, String caption, MultipartFile mediaFile) throws IOException {
        String mediaUrl = fileStorageService.storeFile(mediaFile);
        MediaType mediaType = determineMediaType(mediaFile.getContentType());

        Post post = Post.builder()
                .user(user)
                .caption(caption)
                .mediaUrl(mediaUrl)
                .mediaType(mediaType)
                .build();

        return postRepository.save(post);
    }

    @Transactional
    public Post updatePost(Long postId, User user, String caption) {
        Post post = getPost(postId);

        if (!Objects.equals(post.getUser().getId(), user.getId())) {
            throw new UnauthorizedAccessException("You can only update your own posts");
        }

        post.setCaption(caption);
        return postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long postId, User user) {
        Post post = getPost(postId);

        if (!Objects.equals(post.getUser().getId(), user.getId())) {
            throw new UnauthorizedAccessException("You can only delete your own posts");
        }

        fileStorageService.deleteFile(post.getMediaUrl());
        postRepository.delete(post);
    }

    private MediaType determineMediaType(String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type cannot be null");
        }

        return contentType.startsWith("video/") ? MediaType.VIDEO : MediaType.IMAGE;
    }
}