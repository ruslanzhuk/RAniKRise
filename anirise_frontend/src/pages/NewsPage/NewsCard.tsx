import React from "react";
import { NewsPreviewDTO } from "../../api/news_data";
import { Link } from "react-router-dom";

type Props = {
  news: NewsPreviewDTO;
};

const NewsCard: React.FC<Props> = ({ news }) => {
  return (
    <Link
      to={`/industry/news/${news.id}`}
      className="block p-6 rounded-xl bg-card text-main shadow-md
      hover:shadow-lg hover:shadow-aqua/40 transition-all hover:scale-[1.02]"
    >
      <h2 className="text-xl font-semibold mb-2 line-clamp-2">
        {news.title}
      </h2>

      <div
        className="text-sm text-secondary line-clamp-4"
        dangerouslySetInnerHTML={{ __html: news.previewContent }}
      />

      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <span>{news.likes} Likes</span>
        <span>{news.dislikes} Dislikes</span>
      </div>
    </Link>
  );
};

export default NewsCard;
