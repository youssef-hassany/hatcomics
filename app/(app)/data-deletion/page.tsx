import React from "react";
import { Trash2, Shield, Clock, CheckCircle } from "lucide-react";

const DataDeletionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-zinc-900">
              H
            </div>
            <h1 className="text-xl font-semibold text-zinc-100">HatComics</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-zinc-100">
              Data Deletion Request
            </h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Manage your data and privacy with HatComics
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-semibold text-sm">1</span>
              </div>
              <h3 className="font-semibold text-zinc-100">Submit Request</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Fill out the form below to request deletion of your data from our
              systems.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="font-semibold text-zinc-100">Processing</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              We&apos;ll process your request within 30 days and send you a
              confirmation email.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-500" />
              </div>
              <h3 className="font-semibold text-zinc-100">Complete</h3>
            </div>
            <p className="text-zinc-400 text-sm">
              Your data will be permanently deleted from all our systems and
              backups.
            </p>
          </div>
        </div>

        {/* Data Deletion Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            Request Data Deletion
          </h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="facebook-id"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Facebook User ID (Optional)
                </label>
                <input
                  type="text"
                  id="facebook-id"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Your Facebook User ID"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Reason for Deletion (Optional)
              </label>
              <textarea
                id="reason"
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
                placeholder="Please let us know why you'd like to delete your data..."
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold rounded-lg transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 outline-none"
            >
              Submit Deletion Request
            </button>
          </form>
        </div>

        {/* Information Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex items-start space-x-3 mb-6">
            <Shield className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                What Data We Delete
              </h2>
              <p className="text-zinc-400 mb-4">
                When you request data deletion, we will permanently remove the
                following information from our systems:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-zinc-200 mb-3">
                Account Information
              </h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>• Profile information and preferences</li>
                <li>• Login credentials and session data</li>
                <li>• Account settings and configurations</li>
                <li>• Facebook authentication tokens</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-200 mb-3">Usage Data</h3>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li>• Reading history and bookmarks</li>
                <li>• Comments and reviews</li>
                <li>• Analytics and usage statistics</li>
                <li>• Device and browser information</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
            <h3 className="font-semibold text-zinc-200 mb-2">
              Important Notes
            </h3>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>• Data deletion is permanent and cannot be undone</li>
              <li>• Processing may take up to 30 business days</li>
              <li>
                • Some data may be retained for legal or security purposes as
                required by law
              </li>
              <li>
                • You will receive an email confirmation when deletion is
                complete
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-zinc-400 mb-2">
            Questions about data deletion or privacy?
          </p>
          <a
            href="mailto:privacy@hat-comic.com"
            className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
          >
            Contact our Privacy Team
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/50 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center font-bold text-zinc-900 text-sm">
                H
              </div>
              <span className="text-zinc-400">
                © 2024 HatComics. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-zinc-400 hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-zinc-400 hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataDeletionPage;
