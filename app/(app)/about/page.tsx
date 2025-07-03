"use client";

import {
  changesToPolicy,
  contactInfo,
  dataSecurity,
  howWeUseInfo,
  informationWeCollect,
  privacyPolicy,
  sharingInfo,
  termsOfService,
  yourRights,
} from "@/constants/terms-policies";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function InfoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentView = searchParams.get("view") || "terms";

  const handleViewChange = (view: string) => {
    router.push(`/about?view=${view}`);
  };

  const renderPrivacyPolicy = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-300 text-lg">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Privacy Policy Overview */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Privacy Policy Overview
        </h2>
        <div className="space-y-3">
          {privacyPolicy.map((policy, index) => (
            <p key={index} className="text-zinc-300 leading-relaxed">
              {policy}
            </p>
          ))}
        </div>
      </div>

      {/* Information We Collect */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {informationWeCollect.title}
        </h2>
        <div className="space-y-4">
          {informationWeCollect.items.map((item, index) => (
            <div key={index}>
              <h3 className="text-xl font-medium text-orange-400 mb-2">
                {item.subTitle}
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} className="text-zinc-300">
                    {subItem}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How We Use Info */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {howWeUseInfo.title}
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          {howWeUseInfo.items.map((item, index) => (
            <li key={index} className="text-zinc-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Sharing Info */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {sharingInfo.title}
        </h2>
        <p className="text-zinc-300 mb-4">{sharingInfo.intro}</p>
        <div className="space-y-3">
          {sharingInfo.items.map((item, index) => (
            <div key={index}>
              <h3 className="text-lg font-medium text-orange-400">
                {item.subTitle}
              </h3>
              <p className="text-zinc-300 ml-4">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Security */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {dataSecurity.title}
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          {dataSecurity.items.map((item, index) => (
            <li key={index} className="text-zinc-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Your Rights */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4 capitalize">
          {yourRights.title}
        </h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          {yourRights.items.map((item, index) => (
            <li key={index} className="text-zinc-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Changes to Policy */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {changesToPolicy.title}
        </h2>
        <p className="text-zinc-300">{changesToPolicy.description}</p>
      </div>

      {/* Contact Info */}
      <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {contactInfo.title}
        </h2>
        <p className="text-zinc-300 mb-4">{contactInfo.description}</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          {contactInfo.items.map((item, index) => (
            <li key={index} className="text-zinc-300">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderTermsOfService = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          {termsOfService.title}
        </h1>
        <p className="text-zinc-300 text-lg">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      {termsOfService.sections.map((section, index) => (
        <div
          key={index}
          className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
        >
          <h2 className="text-2xl font-semibold text-white mb-4 capitalize">
            {section.title}
          </h2>

          {section.content && (
            <p className="text-zinc-300 leading-relaxed">{section.content}</p>
          )}

          {section.items && (
            <ul className="list-disc list-inside space-y-2 ml-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-zinc-300">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => handleViewChange("terms")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentView === "terms"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => handleViewChange("privacy")}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentView === "privacy"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
            }`}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {currentView === "privacy"
            ? renderPrivacyPolicy()
            : renderTermsOfService()}
        </div>
      </div>
    </div>
  );
}

export default function InfoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <InfoPageContent />
    </Suspense>
  );
}
