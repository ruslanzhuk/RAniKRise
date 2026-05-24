import React from "react";
import { Users, Zap, Monitor, Heart, Cpu } from "lucide-react";


const AboutPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-white space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold animate-pulse">About AniRise</h1>
        <p className="text-gray-400 text-lg md:text-xl">
          A passionate anime platform built by a single enthusiast, for anime lovers everywhere.
        </p>
      </header>

      {/* Who We Are */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-indigo-500 animate-bounce" size={32} /> Who We Are
        </h2>
        <p className="text-gray-300 leading-relaxed">
          AniRise is the brainchild of a devoted anime fan who has watched over 150 anime series. 
          This platform started as a university diploma project at the <strong>University of Warmia and Mazury</strong>, 
          but it is so much more than a simple assignment. It's a space where anime enthusiasts can discover, 
          share, and interact with the world of anime in a meaningful way. Built solo over 4 months, it combines 
          modern technology with pure passion.
        </p>
      </section>

      {/* Why We Created AniRise */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="text-red-500 animate-bounce" size={32} /> Why AniRise Exists
        </h2>
        <p className="text-gray-300 leading-relaxed">
          I wanted a place where anime fans could easily browse information about series, 
          characters, and studios, while also interacting with other fans. Existing platforms were either too broad, 
          cluttered, or mixed manga and anime together — AniRise focuses purely on anime, giving you a clean, 
          immersive experience. 
        </p>
        <p className="text-gray-300 leading-relaxed">
          Beyond being an encyclopedia, AniRise is a community. Users can rate anime, track their watch status, 
          comment on series, join clubs with like-minded fans, and participate in discussions. 
          All interactions are designed to be friendly, safe, and enjoyable.
        </p>
      </section>

      {/* Our Technology */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
            <Monitor className="text-green-500 animate-bounce" size={32} /> Our Technology
        </h2>
        <p className="text-gray-300 leading-relaxed">
          AniRise is a modern web platform built with a <strong>fullstack approach</strong>. 
          This means both frontend and backend are integrated, giving full control over architecture 
          and user experience. The platform leverages advanced technologies to provide fast, scalable, 
          and engaging features.
        </p>
        <p className="text-gray-300 leading-relaxed">
          A standout feature is the experimental AI-powered <strong>Character Detection</strong> module. 
          Users can upload images to identify which anime characters appear in them, adding a fun, interactive, 
          and tech-forward element to exploring anime.
        </p>
      </section>

      {/* Our Community */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="text-pink-500 animate-bounce" size={32} /> Our Community
        </h2>
        <p className="text-gray-300 leading-relaxed">
          AniRise is more than information — it’s a place to connect. You can create a profile, add friends, 
          maintain your anime lists, write posts, and join clubs centered on your favorite series or themes. 
          Clubs have posts, discussions, and reactions. You can comment, engage, and make new friends along the way.
        </p>
        <p className="text-gray-300 leading-relaxed">
          We take community rules seriously: comments should be polite, free of swearing, and spoilers must be marked. 
          Messages are monitored; repeated violations result in warnings, and persistent violations may lead to temporary 
          or permanent bans. This ensures a safe and welcoming environment for all fans.
        </p>
      </section>

      {/* Looking Forward */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
            <Cpu className="text-yellow-500 animate-bounce" size={32} /> The Future
        </h2>
        <p className="text-gray-300 leading-relaxed">
          While AniRise began as a diploma project, the goal is to continue developing it into a commercial platform. 
          My dream is to create a space where anime fans worldwide can gather, share, and explore the art they love — 
          a place built by a fan, for fans.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
