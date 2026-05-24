import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import Header from "./features/Header/Header";
import Sidebar from "./features/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import UserProfile from "./pages/UserProfile/UserProfile";
import Home from "./pages/Home/Home";
import AnimeSearchPage from "./pages/AnimeSearchPage/AnimeSearchPage";
import PopularAnime from "./pages/PopularAnime/PopularAnime";
import AiringAnime from "./pages/AiringAnime/AiringAnime";
import AnimePage from "./pages/AnimePage/AnimePage";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage";
import WideSlider from "./components/WideSlider";
// import UserAnimeListPage from "./pages/UserAnimeListPage/UserAnimeListPage";
import UserAnimeDashboardPage from "./pages/UserAnimeDashboard/UserAnimeDashboardPage";
import ClubPage from "./pages/ClubPage/ClubPage";
import PostDetailPage from "./pages/ClubPage/PostDetailPage";
import JoinClubPage from "./pages/JoinClubPage/JoinClubPage";
import DetectionPage from "./pages/DetectionPage/DetectionPage";
import CharacterPage from "./pages/CharacterPage/CharacterPage";
import FriendsList from "./pages/UserProfile/FriendsList";
import UserClubsPage from "./pages/UserProfile/UserClubsPage";
import UserFavoritesPage from "./pages/UserProfile/UserFavoritesPage";
import MessagesPage from "./pages/UserProfile/MessagesPage";
import MessageDetails from "./pages/UserProfile/MessageDetails";
import SettingsPage from "./pages/Settings/SettingsPage";
import UserPostsPage from "./pages/UserProfile/UserPostsPage";
import CreatePostPage from "./pages/UserProfile/CreatePostPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ForgotPassword/ResetPassword";
import UsersPage from "./pages/UsersPage/UsersPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import NewsDetailPage from "./pages/NewsPage/NewsDetailPage";
import HelpPage from "./pages/Help/HelpPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import SocialPage from "./pages/SocialPage/SocialPage";
import CharactersSearchPage from "./pages/CharactersSearch/CharactersSearchPage";
import AnimeCharactersPage from "./pages/AnimeCharactersPage/AnimeCharactersPage";
import StudiosPage from "./pages/Studios/StudiosPage";
import StudioPage from "./pages/Studios/StudioPage";
import AuthorPage from "./pages/Authors/AuthorPage";
import AuthorsByAnimePage from "./pages/Authors/AuthorsByAnimePage";
import MyCollectionsPage from "./pages/Collections/MyCollectionsPage";
import CollectionDetailsPage from "./pages/Collections/CollectionDetailsPage";
import UserCollectionsPage from "./pages/Collections/UserCollectionsPage";

import AdminAuthWrapper from "./admin/AdminAuthWrapper";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLayout from "./pages/Admin/components/AdminLayout";
import AdminRequire from "./admin/AdminRequire";

import Dashboard from "./pages/Admin/Dashboard";
import AnimeListPage from "./pages/Admin/AnimeManager/AnimeListPage";
import AnimeFormPage from "./pages/Admin/AnimeManager/AnimeFormPage";
import AnimeDetailPage from "./pages/Admin/AnimeManager/AnimeDetailPage";
import LoginPage from "./pages/Admin/LoginPage";
import ClubListPage from "./pages/Admin/ClubManager/ClubListPage";
import ClubFormPage from "./pages/Admin/ClubManager/ClubFormPage";
import ClubDetailPage from "./pages/Admin/ClubManager/ClubDetailPage";
import ClubPostsListPage from "./pages/Admin/ClubPostsManager/ClubPostsListPage";
import ClubPostDetailPage from "./pages/Admin/ClubPostsManager/ClubPostDetailPage";
import ClubPostFormPage from "./pages/Admin/ClubPostsManager/ClubPostFormPage";
import AdminClubSelectorPage from "./pages/Admin/ClubPostsManager/AdminClubSelectorPage";
import HomeAnnouncementsListPage from "./pages/Admin/HomeAnnouncements/HomeAnnouncementsListPage";
import HomeAnnouncementDetailPage from "./pages/Admin/HomeAnnouncements/HomeAnnouncementDetailPage";
import HomeAnnouncementFormPage from "./pages/Admin/HomeAnnouncements/HomeAnnouncementFormPage";
import NewsListPage from "./pages/Admin/NewsManager/NewsListPage";
import NewsFormPage from "./pages/Admin/NewsManager/NewsFormPage";
import AdminNewsDetailPage from "./pages/Admin/NewsManager/NewsDetailPage";
import MediaManagerHome from "./pages/Admin/MediaManager/MediaManagerHome";
import AnimeMediaListPage from "./pages/Admin/MediaManager/Anime/AnimeMediaListPage";
import AnimeMediaDetailPage from "./pages/Admin/MediaManager/Anime/AnimeMediaDetailPage";
import AuthorMediaListPage from "./pages/Admin/MediaManager/Authors/AuthorMediaListPage";
import AuthorMediaDetailPage from "./pages/Admin/MediaManager/Authors/AuthorMediaDetailPage";
import CharacterMediaListPage from "./pages/Admin/MediaManager/Characters/CharacterMediaListPage";
import CharacterMediaDetailPage from "./pages/Admin/MediaManager/Characters/CharacterMediaDetailPage";
import StudioMediaListPage from "./pages/Admin/MediaManager/Studios/StudioMediaListPage";
import StudioMediaDetailPage from "./pages/Admin/MediaManager/Studios/StudioMediaDetailPage";
import CommentManagerHome from "./pages/Admin/CommentManager/CommentManagerHome";
import AnimeCommentsPage from "./pages/Admin/CommentManager/AnimeCommentsPage";
import PostCommentsPage from "./pages/Admin/CommentManager/PostCommentsPage";
import ClubPostCommentsPage from "./pages/Admin/CommentManager/ClubPostCommentsPage";
import UserCommentsPage from "./pages/Admin/CommentManager/UserCommentsPage";
import CommentDetailPage from "./pages/Admin/CommentManager/CommentDetailPage";
import AllCommentsPage from "./pages/Admin/CommentManager/AllCommentsPage";
import AnimeImportPage from "./pages/Admin/AnimeImport/AnimeImportPage";

import AdminProfilePage from "./pages/Admin/AdminProfilePage";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [sliderHeight, setSliderHeight] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-main)", color: "var(--text-main)" }}>
      <Header ref={headerRef} isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="w-full" style={{ height: headerHeight }} />

      <div className="flex flex-1 relative">
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 top-16" onClick={toggleSidebar} />}
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {location.pathname === "/" && (
          <div className="absolute top-0 left-0 w-full z-0">
            <WideSlider setHeight={setSliderHeight} />
          </div>
        )}

        <main className="flex-1 ml-16 z-10" style={{ marginTop: location.pathname === "/" ? sliderHeight : 0 }}>
          <div className="max-w-[1560px] mx-auto min-h-screen px-8 md:px-16 py-6" style={{ background: "var(--bg-surface)" }}>
            {children}
          </div>
        </main>
      </div>

      <footer className="w-full bg-gray-900 text-white text-center py-4 mt-auto">
        © 2025 RAniKRise. All rights reserved.
      </footer>
    </div>
  );
};

// ---------------------------
// App
// ---------------------------
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#1f2937", color: "#fff", borderRadius: "12px" },
            }}
          />

          <Routes>
            {/* ----------------- User routes ----------------- */}
            <Route
              path="/*"
              element={
                <UserLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/detection" element={<DetectionPage />} />
                    <Route path="/user/:username" element={<UserProfile />} />
                    <Route path="/user/:username/anime" element={<UserAnimeDashboardPage />} />
                    <Route path="/user/:username/friends" element={<FriendsList />} />
                    <Route path="/user/:username/favorites" element={<UserFavoritesPage />} />
                    <Route path="/user/:username/clubs" element={<UserClubsPage />} />
                    <Route path="/user/:username/posts" element={<UserPostsPage />} />
                    <Route path="/user/:username/posts/create" element={<CreatePostPage />} />
                    <Route path="/user/:username/notifications" element={<MessagesPage />} />
                    <Route path="/user/:username/notifications/:id" element={<MessageDetails />} />
                    <Route path="/user/:username/settings" element={<SettingsPage />} />
                    <Route path="/collections/my" element={<MyCollectionsPage />} />
                    <Route path="/collections/:id" element={<CollectionDetailsPage />} />
                    <Route path="/user/:userId/collections" element={<UserCollectionsPage />} />
                    <Route path="/anime/full-list" element={<AnimeSearchPage />} />
                    <Route path="/anime/popular" element={<PopularAnime />} />
                    <Route path="/anime/new" element={<AiringAnime />} />
                    <Route path="/anime/:id" element={<AnimePage />} />
                    <Route path="/anime/:animeId/characters" element={<AnimeCharactersPage />} />
                    <Route path="/confirm-email" element={<ConfirmEmail />} />
                    <Route path="/anime/genres" element={<div>Genres</div>} />
                    <Route path="/clubs/:clubId" element={<ClubPage />} />
                    <Route path="/clubs/:clubId/posts/:postId" element={<PostDetailPage />} />
                    <Route path="/clubs/join" element={<JoinClubPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/industry/news" element={<NewsPage />} />
                    <Route path="/industry/news/:id" element={<NewsDetailPage />} />
                    <Route path="/industry/characters" element={<CharactersSearchPage />} />
                    <Route path="/industry/characters/:id" element={<CharacterPage />} />
                    <Route path="/industry/studios" element={<StudiosPage />} />
                    <Route path="/industry/studios/:id" element={<StudioPage />} />
                    <Route path="/industry/authors/:id" element={<AuthorPage />} />
                    <Route path="/industry/anime/:animeId/authors" element={<AuthorsByAnimePage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/social" element={<SocialPage />} />
                  </Routes>
                </UserLayout>
              }
            />

            {/* ----------------- Admin routes ----------------- */}

            <Route path="/xkey/broadmin" element={<AdminAuthWrapper />}>
              {/* PUBLIC */}
              <Route path="login" element={<LoginPage />} />

              {/* PROTECTED */}
              <Route element={<AdminRequire />}>
                <Route element={<AdminLayout />}>
                  {/* <Route index element={<Dashboard />} /> */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="anime/import" element={<AnimeImportPage />} />
                  <Route path="anime" element={<AnimeListPage />} />
                  <Route path="anime/create" element={<AnimeFormPage />} />
                  <Route path="anime/:id/edit" element={<AnimeFormPage />} />
                  <Route path="anime/:id" element={<AnimeDetailPage />} />
                  <Route path="clubs" element={<ClubListPage />} />
                  <Route path="clubs/create" element={<ClubFormPage />} />
                  <Route path="clubs/:id/edit" element={<ClubFormPage />} />
                  <Route path="clubs/:id" element={<ClubDetailPage />} />
                  <Route path="posts">
                    <Route index element={<AdminClubSelectorPage />} />
                    <Route path="clubs/:clubId" element={<ClubPostsListPage />} />
                    <Route path="clubs/:clubId/create" element={<ClubPostFormPage />} />
                    <Route path=":postId" element={<ClubPostDetailPage />} />
                    <Route path=":postId/edit" element={<ClubPostFormPage />} />
                  </Route>
                  <Route path="home-announcements" >
                    <Route index element={<HomeAnnouncementsListPage />} />
                    <Route path="create" element={<HomeAnnouncementFormPage />} />
                    <Route path=":id/edit" element={<HomeAnnouncementFormPage />} />
                    <Route path=":id" element={<HomeAnnouncementDetailPage />} />
                  </Route>
                  <Route path="news" element={<NewsListPage />} />
                  <Route path="news/create" element={<NewsFormPage />} />
                  <Route path="news/:id" element={<AdminNewsDetailPage />} />
                  <Route path="news/:newsId/edit" element={<NewsFormPage />} />

                  <Route path="media">
                    <Route index element={<MediaManagerHome />} />

                    {/* Anime media */}
                    <Route path="anime">
                      <Route index element={<AnimeMediaListPage />} />
                      <Route path=":animeId" element={<AnimeMediaDetailPage />} />
                      <Route path=":animeId/edit/:mediaId" element={<AnimeMediaDetailPage />} />
                    </Route>

                    {/* Authors media */}
                    <Route path="authors">
                      <Route index element={<AuthorMediaListPage />} />
                      <Route path=":authorId" element={<AuthorMediaDetailPage />} />
                      <Route path=":authorId/edit/:mediaId" element={<AuthorMediaDetailPage />} />
                    </Route>

                    {/* Characters media */}
                    <Route path="characters">
                      <Route index element={<CharacterMediaListPage />} />
                      <Route path=":characterId" element={<CharacterMediaDetailPage />} />
                      <Route path=":characterId/edit/:mediaId" element={<CharacterMediaDetailPage />} />
                    </Route>

                    {/* Studios media */}
                    <Route path="studios">
                      <Route index element={<StudioMediaListPage />} />
                      <Route path=":studioId" element={<StudioMediaDetailPage />} />
                      <Route path=":studioId/edit/:mediaId" element={<StudioMediaDetailPage />} />
                    </Route>
                  </Route>

                  <Route path="comments" element={<CommentManagerHome />}>
                    <Route index element={<AllCommentsPage />} />
                    <Route path="anime">
                      <Route index element={<AnimeCommentsPage />} />
                      <Route path=":commentId" element={<CommentDetailPage />} />
                    </Route>

                    <Route path="posts">
                      <Route index element={<PostCommentsPage />} />
                      <Route path=":commentId" element={<CommentDetailPage />} />
                    </Route>

                    <Route path="club-posts">
                      <Route index element={<ClubPostCommentsPage />} />
                      <Route path=":commentId" element={<CommentDetailPage />} />
                    </Route>

                    <Route path="users">
                      <Route index element={<UserCommentsPage />} />
                      <Route path=":commentId" element={<CommentDetailPage />} />
                    </Route>
                  </Route>

                  <Route path="profile" element={<AdminProfilePage />} />
                </Route>
              </Route>
            </Route>
            
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;