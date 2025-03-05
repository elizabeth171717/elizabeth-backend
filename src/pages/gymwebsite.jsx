import "react";

const GymWebsite = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Hero Section */}
      <div className="text-center p-8 bg-gradient-to-r from-black to-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">
          Powerful Fitness, Powerful Code! 💪
        </h1>
        <p className="text-lg mt-2">
          A sleek and modern gym website built with React & Tailwind CSS.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-lg">
            React
          </span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-lg">
            Node.js
          </span>
          <span className="bg-purple-500 text-white px-3 py-1 rounded-lg">
            Tailwind CSS
          </span>
        </div>
      </div>

      {/* Project Overview */}
      <div className="p-6">
        <h2 className="text-3xl font-semibold">Project Overview</h2>
        <p className="text-lg mt-2">
          This modern gym website offers interactive schedules, membership
          plans, and an engaging blog for fitness enthusiasts.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>💪 Membership Plan Selector</li>
          <li>📅 Class Booking System</li>
          <li>🎨 Custom UI with Tailwind CSS</li>
        </ul>
        <div className="mt-4">
          <a
            href="#"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
          >
            View Live
          </a>
          <a href="#" className="bg-gray-700 text-white px-4 py-2 rounded-lg">
            GitHub Code
          </a>
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <img
          src="screenshot1.jpg"
          alt="Gym Website Screenshot"
          className="rounded-lg shadow-lg"
        />
        <img
          src="screenshot2.jpg"
          alt="Membership Page"
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* How It Works Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <p className="mt-2">
          This gym website was built using React for the frontend and Node.js
          for handling memberships.
        </p>
        <pre className="bg-gray-900 text-white p-4 rounded-lg mt-2">
          {`const handleMembership = () => {
  fetch('/api/membership')
    .then(res => res.json())
    .then(data => setMemberships(data));
};`}
        </pre>
      </div>

      {/* Lessons & Future Improvements */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">
          Lessons & Future Improvements
        </h2>
        <p className="mt-2">
          This project taught me how to handle API calls efficiently and improve
          UI responsiveness.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>🚀 Future: Add user authentication</li>
          <li>💳 Future: Implement Stripe for real payments</li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold">
          Interested in My Work? Let&apos;s Connect! 🚀
        </h2>
        <p>Check out more projects on my portfolio or reach out on LinkedIn.</p>
        <div className="mt-4">
          <a
            href="#"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
          >
            Portfolio
          </a>
          <a href="#" className="bg-gray-700 text-white px-4 py-2 rounded-lg">
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default GymWebsite;
