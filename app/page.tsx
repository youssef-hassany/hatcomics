"use client";

import React from "react";

const HatComicsLanding = () => {
  return (
    <div className="bg-zinc-900 min-h-screen text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            HatComics
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-zinc-400 max-w-2xl mx-auto">
            The ultimate community for comic book enthusiasts. Write, review,
            and connect with fellow fans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-500 transition-colors shadow-lg">
              Join the Community
            </button>
            <button className="px-8 py-3 border-2 border-blue-500 text-blue-400 rounded-lg font-semibold text-lg hover:bg-blue-500 hover:text-white transition-colors">
              Explore Comics
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            What You Can Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Write Blogs",
                description:
                  "Share your thoughts and deep dives into your favorite comics.",
              },
              {
                title: "Review Comics",
                description:
                  "Rate and review comics to help others discover great reads.",
              },
              {
                title: "Connect",
                description:
                  "Follow other enthusiasts and join discussions about comics.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-zinc-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-red-400">
                  {feature.title}
                </h3>
                <p className="text-zinc-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
            Join Our Community
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "10K+", label: "Members" },
              { number: "50K+", label: "Reviews" },
              { number: "25K+", label: "Blog Posts" },
            ].map((stat, index) => (
              <div key={index} className="bg-zinc-800 p-6 rounded-lg">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join thousands of comic fans sharing their passion.
          </p>
          <button className="px-10 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-500 transition-colors shadow-lg">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white">
                H
              </div>
              <span className="text-xl font-bold text-white">HatComics</span>
            </div>
            <div className="flex space-x-6 text-zinc-400">
              <a href="#" className="hover:text-red-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-red-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-700 text-center text-zinc-500">
            <p>&copy; 2025 HatComics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HatComicsLanding;
