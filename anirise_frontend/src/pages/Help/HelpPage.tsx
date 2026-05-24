import React, { useState } from "react";
import { sendSupportMessage } from "../../api/supportApi";
import toast from "react-hot-toast";

const HelpPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || !email.trim()) {
      toast.error("Please fill in both your email and message");
      return;
    }

    try {
      setIsSending(true);
      await sendSupportMessage({ message, email });
      setMessage("");
      setEmail("");
      toast.success("Your message has been sent to support. We'll get back to you within 5 business days.");
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
        <p className="text-gray-400">
          Here you can learn how AniRise works, and contact our support team if you have any questions.
        </p>
      </div>

      {/* Section 1 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">How AniRise Works</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            AniRise is your social space for everything anime. You can discover new shows, connect with friends, and manage your anime lists all in one place.
          </p>

          <p>
            On the <strong>Home Page</strong>, you’ll see currently airing anime, trending shows, and personal recommendations. You can also explore sections like Popular, New, or Filter by Genre to find exactly what you like.
          </p>

          <p>
            Each <strong>Anime Page</strong> gives you detailed info about the show: synopsis, characters, staff, media, and ratings. Logged-in users can add anime to their personal lists, rate it, leave comments, or react to other users' comments.
          </p>

          <p>
            <strong>Clubs</strong> are community spaces where you can join discussions about specific topics, read posts, comment, and interact with other members. Make sure to check each club’s rules before posting.
          </p>

          <p>
            On <strong>User Profiles</strong>, you can see someone’s anime lists, posts, and friends. You can send friend requests and interact with their content. Profiles also let you manage your own lists, posts, and settings.
          </p>

          <p>
            There’s also <strong>Character Detection</strong> – upload an image, and AniRise will try to identify the anime character for you using machine learning.
          </p>

          <p className="text-yellow-400">
            <strong>Comment Rules:</strong> Keep all comments respectful. Avoid swearing. Always mark spoilers clearly. Comments are monitored: you get 2 warnings for breaking rules, and a 3rd violation can lead to account ban, which requires a complex unblocking process.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>

        <p className="text-gray-300 mb-4">
          If you have questions, issues, or suggestions, send a message to our support team. Be sure to include your email so we can reply directly to you.
        </p>

        <div className="space-y-4 max-w-xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email..."
            className="w-full rounded-lg p-3 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            className="w-full min-h-[140px] rounded-lg p-3 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleSubmit}
            disabled={isSending}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition text-white"
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;
