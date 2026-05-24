import React, { useEffect, useState } from "react";
import { getLatestNews, NewsPreviewDTO } from "../../api/news_data";
import NewsCard from "./NewsCard";
import NewsPagination from "./NewsPagination";

const PAGE_SIZE = 8;

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsPreviewDTO[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await getLatestNews({
        limit: PAGE_SIZE,
        page,
        sortBy: "CreatedAt",
        sortOrder: "desc",
      });
      setNews(data);
      setHasNext(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-main">Latest News</h1>

      {loading ? (
        <div className="text-center text-secondary mt-8">Loading...</div>
      ) : news.length === 0 ? (
        <div className="text-center text-secondary mt-8">No news found.</div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="mb-6 break-inside-avoid">
              <NewsCard news={item} />
            </div>
          ))}
        </div>
      )}

      <NewsPagination page={page} onPageChange={setPage} hasNext={hasNext} />
    </div>
  );
};

export default NewsPage;
