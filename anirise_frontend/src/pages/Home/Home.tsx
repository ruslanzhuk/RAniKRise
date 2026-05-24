import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTopRatedOnPlatform } from "../../api/animeApi";
import { getLatestNews } from "../../api/news_data";
import { getClubs } from "../../api/club_data";
import HomeAnnouncement from "../../components/HomeAnnouncement";
import NewsPreviewCard from "../../components/NewsPreviewCard";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreNews = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const data = await getLatestNews({
      limit: 4,
      page,
      sortBy: "CreatedAt",
      sortOrder: "desc",
    });

    if (data.length < 4) setHasMore(false);

    setNews(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const filtered = data.filter(n => !existingIds.has(n.id));
      return [...prev, ...filtered];
    });

    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        loadMoreNews();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="space-y-28">

      {/* HOME ANNOUNCEMENT */}
      <HomeAnnouncement />

      {/* BROWSE */}
      <section className="home-card animate-fade-in">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-main mb-2">
            Browse Anime
          </h2>
          <p className="text-secondary">
            Explore seasons, popularity and top-rated titles
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { label: "Winter 2025", query: "winter2025" },
            { label: "Spring 2025", query: "spring2025" },
            { label: "Summer 2025", query: "summer2025" },
            { label: "Autumn 2025", query: "autumn2025" },
            { label: "Most Popular", query: "popular" },
            { label: "Top Rated", query: "top" },
          ].map(f => (
            <Link
              key={f.label}
              to={`/search?filter=${f.query}`}
              className="
                rounded-xl px-6 py-5 text-center
                font-medium text-main
                bg-[var(--hover-bg)]
                transition-all duration-200
                hover:bg-[var(--accent)]
                hover:text-white
                hover:scale-[1.02]
              "
            >
              {f.label}
            </Link>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section className="home-card animate-fade-in">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-main mb-2">
            Latest News
          </h2>
          <p className="text-secondary">
            Fresh updates from the anime world
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map(n => (
            <NewsPreviewCard key={n.id} news={n} />
          ))}
        </div>

        {loading && (
          <div className="text-center py-10 text-secondary">
            Loading…
          </div>
        )}

        {!hasMore && (
          <div className="text-center py-10 text-secondary">
            No more news
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
