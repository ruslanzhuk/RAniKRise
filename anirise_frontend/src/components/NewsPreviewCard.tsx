import React from "react";
import { NewsPreviewDTO } from "../api/news_data";
import { Link } from "react-router-dom";

interface Props {
  news: NewsPreviewDTO;
}

const NewsPreviewCard: React.FC<Props> = ({ news }) => {
  return (
    <Link
      to={`/industry/news/${news.id}`}
      className="block bg-gray-800 dark:bg-gray-900 p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-shadow shadow-md"
    >
      <h3 className="font-bold text-lg mb-2 text-white dark:text-gray-100">
        {news.title}
      </h3>

      <div
        className="text-gray-300 dark:text-gray-300 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: news.previewContent }}
      />
    </Link>
  );
};

export default NewsPreviewCard;
