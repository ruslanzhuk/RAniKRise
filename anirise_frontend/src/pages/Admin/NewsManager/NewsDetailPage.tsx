import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdminNewsById } from "../../../api/adminApi";
import HtmlContent from "../../../components/HtmlContent";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);

  useEffect(() => {
    getAdminNewsById(Number(id)).then(setNews);
  }, [id]);

  if (!news) return null;

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-3xl font-bold">{news.title}</h1>
      <p className="text-sm text-gray-400">
        By {news.authorName} ·{" "}
        {new Date(news.createdAt).toLocaleString()}
      </p>

      <HtmlContent
        html={news.contentHtml}
        className="prose max-w-none"
      />
    </div>
  );
};

export default NewsDetailPage;
