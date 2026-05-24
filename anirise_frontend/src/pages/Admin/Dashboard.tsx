import AdminLayout from "./components/AdminLayout";
import StatCard from "./components/StatCard";
import QuickActionCard from "./components/QuickActionCard";

const Dashboard = () => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 text-gray-900">Dashboard</h1>
        <p className="text-gray-700">Admin control panel for RAniKRise</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total anime" value={65} />
        <StatCard label="Total users" value={7} />
        <StatCard label="Clubs" value={6} />
        <StatCard label="Pending reports" value={0} />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Quick actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add new anime"
            description="Create a new anime entry"
            to="/xkey/broadmin/anime/create"
          />

          <QuickActionCard
            title="Manage anime"
            description="View and edit anime list"
            to="/xkey/broadmin/anime"
          />

          <QuickActionCard
            title="Create club"
            description="Create and manage clubs"
            to="/xkey/broadmin/clubs"
          />

          <QuickActionCard
            title="Write news"
            description="Publish site news"
            to="/xkey/broadmin/news"
          />

          <QuickActionCard
            title="Home announcement"
            description="Update homepage banner"
            to="/xkey/broadmin/home-announcements"
          />

          <QuickActionCard
            title="Manage posts"
            description="Admin club posts"
            to="/xkey/broadmin/posts"
          />

          <QuickActionCard
            title="Media Manager"
            description="Manage media for anime, authors, characters and studios"
            to="/xkey/broadmin/media"
          />

          <QuickActionCard
            title="Comment manager"
            description="Moderate all site comments"
            to="/xkey/broadmin/comments"
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
