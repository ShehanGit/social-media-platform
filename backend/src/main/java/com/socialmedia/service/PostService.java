package com.socialmedia.service;

import com.socialmedia.model.Post;
import com.socialmedia.model.Like;
import com.socialmedia.model.Comment;
import com.socialmedia.user.User;
import com.socialmedia.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    @Transactional
    public Post createPost(Post post, User currentUser) {
        post.setUser(currentUser);
        return postRepository.save(post);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Page<Post> getFeedPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Post> getTrendingPosts(Pageable pageable) {
        return postRepository.findAllByOrderByLikesCountDesc(pageable);
    }

    @Transactional
    public Post updatePost(Long id, Post postDetails, User currentUser) {
        Post post = getPost(id);
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to update this post");
        }

        post.setCaption(postDetails.getCaption());
        post.setMediaUrl(postDetails.getMediaUrl());
        post.setMediaType(postDetails.getMediaType());

        return postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long id, User currentUser) {
        Post post = getPost(id);
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to delete this post");
        }
        postRepository.delete(post);
    }
}
