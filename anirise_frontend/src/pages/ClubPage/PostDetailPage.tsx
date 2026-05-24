import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { clubApi } from "../../api/clubApi";
import { clubPostCommentsApi } from "../../api/clubPostCommentApi";
import { ClubPostDTO, ReactionType } from "../../api/types/club.types";
import { CommentDTO } from "../../api/types/comment.types";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import ReactionButtons from "./components/ReactionButtons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import HtmlContent from "../../components/HtmlContent";

const COMMENT_LIMIT = 10;

const PostDetailPage: React.FC = () => {
  const { clubId, postId } = useParams<{ clubId: string; postId: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [post, setPost] = useState<ClubPostDTO | null>(null);
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!clubId || !postId) return;
    const posts = await clubApi.getClubPosts(Number(clubId), 0, 100);
    const p = posts.find((x) => x.id === Number(postId));
    if (p) setPost(p);
  }, [clubId, postId]);

  const fetchComments = useCallback(
    async (page = 0) => {
      if (!postId || loadingComments || !hasMoreComments) return;
      setLoadingComments(true);
      try {
        const allComments = await clubPostCommentsApi.getComments(Number(postId));
        const offset = page * COMMENT_LIMIT;
        const pageComments = allComments.slice(offset, offset + COMMENT_LIMIT);

        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const filtered = pageComments.filter((c) => !existingIds.has(c.id));
          return [...prev, ...filtered];
        });

        setHasMoreComments(pageComments.length === COMMENT_LIMIT);
        setCommentPage(page + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    },
    [postId, loadingComments, hasMoreComments]
  );

  const handleReactPost = async (reaction: ReactionType) => {
    if (!post || !user) return;
    await clubApi.reactPost(post.id, reaction);
    await fetchPost();
  };

  const handleReactComment = async (
    commentId: number,
    reaction: ReactionType
  ) => {
    if (!user) return;

    setComments(prev =>
      prev.map(c => {
        if (c.id !== commentId) return c;

        const prevReaction = c.userReaction;

        let likes = c.likes;
        let dislikes = c.dislikes;
        let newReaction: ReactionType | undefined;

        if (prevReaction === reaction) {
          newReaction = undefined;
          if (reaction === 1) likes--;
          if (reaction === -1) dislikes--;
        } else {
          newReaction = reaction;
          if (reaction === 1) likes++;
          if (reaction === -1) dislikes++;
          if (prevReaction === 1) likes--;
          if (prevReaction === -1) dislikes--;
        }

        return {
          ...c,
          likes,
          dislikes,
          userReaction: newReaction,
        };
      })
    );

    try {
      await clubPostCommentsApi.reactComment(commentId, reaction);
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments(0);
  }, [fetchPost, fetchComments]);

  const addCommentToState = (newComment: CommentDTO) => {
    setComments(prev => [newComment, ...prev]);
  };

  if (!post) return <div>Loading post...</div>;

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--bg-main)", color: "var(--text-main)" }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div
          className="p-6 rounded-2xl shadow-md border"
          style={{ background: "var(--card-bg)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-sm font-semibold">
                {post.authorUsername[0].toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{post.authorUsername}</div>
                <div className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{comments.length} comments</div>
          </div>

          <HtmlContent
            html={post.content}
            className="prose max-w-none mb-4 dark:prose-invert"
          />

          <div className="mt-4">
            <ReactionButtons
              likes={post.likes}
              dislikes={post.dislikes}
              userReaction={post.userReaction}
              onReact={handleReactPost}
            />
          </div>
        </div>

        {/* ================= COMMENT FORM / BLOCK MESSAGE ================= */}

        {user && (
          <div
            className="p-4 rounded-xl shadow-md border"
            style={{ background: "var(--card-bg)" }}
          >
            {user.isBlocked ? (
              <div className="text-red-500 font-semibold">
                You are not allowed to post comments.
                <div className="text-sm text-red-400 mt-1">
                  Your account has been blocked. Please contact support to restore access.
                </div>
              </div>
            ) : (
              <CommentForm
                postId={post.id}
                onCommentAdded={addCommentToState}
              />
            )}
          </div>
        )}

        {/* ================= COMMENTS LIST ================= */}

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CommentList
              comments={comments}
              onReact={handleReactComment}
              onLoadMore={() => fetchComments(commentPage)}
              hasMore={hasMoreComments}
              loading={loadingComments}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostDetailPage;
