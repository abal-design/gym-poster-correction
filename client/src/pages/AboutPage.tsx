const AboutPage = () => {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">About Smart Gym Assistant</h1>
      <p className="max-w-3xl text-slate-700">
        Smart Gym Posture Assistant is designed to help lifters and fitness beginners perform exercises with safer,
        cleaner mechanics. The platform combines secure authentication, structured exercise coaching, and progress
        tracking so users can build healthy movement habits.
      </p>
      <p className="max-w-3xl text-slate-700">
        The app is built on MERN architecture with backend protections such as JWT verification, rate limiting,
        NoSQL/XSS mitigation, and strict input validation. Both users and admins have dedicated workflows for a reliable
        training experience.
      </p>
    </section>
  );
};

export default AboutPage;
