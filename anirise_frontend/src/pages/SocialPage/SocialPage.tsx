import React from "react";
import {
  Mail,
  Send,
  Facebook,
  Users,
  Sparkles,
} from "lucide-react";

const SocialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Intro */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold flex justify-center items-center gap-3">
            <Sparkles className="text-indigo-500" size={36} />
            Stay Connected
          </h1>
          <p className="text-gray-400 text-lg">
            AniRise is just getting started — but we’d love to stay in touch.
          </p>
        </section>

        {/* AniRise Social */}
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Users className="text-indigo-400" />
            AniRise Social Accounts
          </h2>

          <p className="text-gray-300 leading-relaxed">
            At the moment, AniRise does not yet have official social media accounts.
            This project started as a <strong>solo diploma project</strong> and is still
            actively evolving.
          </p>

          <p className="text-gray-300 leading-relaxed">
            In the future, you’ll be able to find us across popular platforms under the name:
          </p>

          <div className="text-indigo-400 font-semibold text-lg">
            @anirise
          </div>

          <p className="text-gray-400 text-sm">
            Follow us soon — once AniRise spreads its wings 🌱
          </p>

          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="text-pink-400" />
            <span>Official contact email:</span>
            <span className="font-semibold">anirise@gmail.com</span>
          </div>
        </section>

        {/* Developer Contacts */}
        <section className="bg-gray-900 rounded-2xl p-8 space-y-6 shadow-lg">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Send className="text-green-400" />
            Developer Contact
          </h2>

          <p className="text-gray-300 leading-relaxed">
            AniRise is designed and developed by a single developer driven by passion
            for anime, modern web technologies, and clean architecture.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-red-400" />
              <span className="font-semibold">
                ruslanzhukotynskyi@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Send className="text-blue-400" />
              <span className="font-semibold">
                Telegram: @DariusREvil
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Facebook className="text-indigo-500" />
              <span className="font-semibold">
                Ruslan Zhukotynskyi
              </span>
            </div>
          </div>
        </section>

        {/* Footer message */}
        <section className="text-center text-gray-500 text-sm">
          Built with ❤️, sleepless nights, and a lot of anime.
          <br />
          This is just the beginning.
        </section>

      </div>
    </div>
  );
};

export default SocialPage;
