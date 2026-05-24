import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getNewsById,
  addReactionToNews,
  removeReactionFromNews,
  ReactionType,
  NewsDetailsDTO,
} from "../../api/news_data";

import NewsReactionButtons from "./components/NewsReactionButtons";

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      const data = await getNewsById(Number(id));
      setNews(data);
      setLoading(false);
    };

    load();
  }, [id]);

  const handleReact = async (reaction: ReactionType) => {
    if (!news || reacting) return;
    setReacting(true);

    const alreadyReacted = news.userReaction === reaction;
    let ok = false;

    if (alreadyReacted) {
      ok = await removeReactionFromNews(news.id);
      if (ok) {
        setNews({
          ...news,
          userReaction: null,
          likes:
            reaction === ReactionType.Like ? news.likes - 1 : news.likes,
          dislikes:
            reaction === ReactionType.Dislike ? news.dislikes - 1 : news.dislikes,
        });
      }
    } else {
      ok = await addReactionToNews(news.id, reaction);
      if (ok) {
        setNews({
          ...news,
          userReaction: reaction,
          likes:
            reaction === ReactionType.Like
              ? news.likes + 1
              : news.userReaction === ReactionType.Like
              ? news.likes - 1
              : news.likes,
          dislikes:
            reaction === ReactionType.Dislike
              ? news.dislikes + 1
              : news.userReaction === ReactionType.Dislike
              ? news.dislikes - 1
              : news.dislikes,
        });
      }
    }

    if (!ok) toast.error("Failed to update reaction");
    setReacting(false);
  };

  if (loading)
    return <div className="text-center mt-10 text-zinc-400">Loading...</div>;

  if (!news)
    return <div className="text-center mt-10 text-zinc-400">News not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {news.title}
      </h1>

      <div className="text-sm text-gray-500 mb-6">
        By {news.authorName} • {new Date(news.createdAt).toLocaleDateString()}
      </div>

      <div
        className="prose dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: news.contentHtml }}
      />

      <div className="border-t pt-4">
        <NewsReactionButtons
          likes={news.likes}
          dislikes={news.dislikes}
          userReaction={news.userReaction}
          onReact={handleReact}
        />
      </div>
    </div>
  );
};

export default NewsDetailPage;
