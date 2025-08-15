import React from "react";
import { Shield, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotAuthorized = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 rounded-full p-6">
            <Shield className="w-16 h-16 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>

        {/* Description */}
        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
          You are not authorized to view this page. Please check your
          permissions or contact an administrator if you believe this is an
          error.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-zinc-700">
          <p className="text-zinc-500 text-sm">
            Need help? Contact support at{" "}
            <a
              href="mailto:hatcomicsorg@gmail.com"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              hatcomicsorg@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
