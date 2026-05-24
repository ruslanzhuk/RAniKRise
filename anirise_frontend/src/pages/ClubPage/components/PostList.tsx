import React, { useEffect, useState, useCallback } from "react";
import { ClubPostDTO, ReactionType } from "../../../api/types/club.types";
import PostCard from "./PostCard";
import { clubApi } from "../../../api/clubApi";

interface Props {
  clubId: number;
}

const PostList: React.FC<Props> = ({ clubId }) => {
  const [posts, setPosts] = useState<ClubPostDTO[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const newPosts = await clubApi.getClubPosts(clubId, offset, 10);

      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const filtered = newPosts.filter(p => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });

      setOffset(prev => prev + newPosts.length);
      if (newPosts.length < 10) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clubId, offset]);

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    fetchPosts();
  }, [clubId]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= fullHeight - 200) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts, loading, hasMore]);

  const handleReact = async (postId: number, reaction: ReactionType) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p;
        let likes = p.likes;
        let dislikes = p.dislikes;
        let userReaction = p.userReaction;

        if (!userReaction) {
          if (reaction === 1) likes++;
          if (reaction === -1) dislikes++;
          userReaction = reaction;
        } else if (userReaction === reaction) {
          if (reaction === 1) likes--;
          if (reaction === -1) dislikes--;
          userReaction = undefined;
        } else {
          if (userReaction === 1) likes--;
          if (userReaction === -1) dislikes--;
          if (reaction === 1) likes++;
          if (reaction === -1) dislikes++;
          userReaction = reaction;
        }

        return { ...p, likes, dislikes, userReaction };
      })
    );

    try {
      await clubApi.reactPost(postId, reaction);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onReact={r => handleReact(post.id, r as ReactionType)}
        />
      ))}
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {!hasMore && <div className="text-center text-gray-500">No more posts</div>}
    </div>
  );
};

export default PostList;
