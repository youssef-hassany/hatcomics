import React from "react";
import {
  ExternalLink,
  Users,
  Languages,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { communityAccounts } from "@/constants/community-accounts";

// Type definitions
type AccountType = "content_creator" | "translator" | "social_media" | "store";

interface CommunityAccount {
  id: number;
  name: string;
  type: AccountType;
  description: string;
  platform: string;
  followers: string;
  avatar: string;
  link: string;
  verified: boolean;
}

const CommunityPage: React.FC = () => {
  const getTypeIcon = (type: AccountType) => {
    switch (type) {
      case "content_creator":
        return <Users className="w-5 h-5" />;
      case "translator":
        return <Languages className="w-5 h-5" />;
      case "social_media":
        return <MessageCircle className="w-5 h-5" />;
      case "store":
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: AccountType) => {
    switch (type) {
      case "content_creator":
        return "Content Creator";
      case "translator":
        return "Translator";
      case "social_media":
        return "Social Media";
      case "store":
        return "Store";
      default:
        return "Community Member";
    }
  };

  const getTypeColor = (type: AccountType) => {
    switch (type) {
      case "content_creator":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "translator":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "social_media":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "store":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  const filterByType = (type: AccountType) => {
    return communityAccounts.filter((account) => account.type === type);
  };

  const accountTypes: AccountType[] = [
    "content_creator",
    "translator",
    "social_media",
    "store",
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Community</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Meet the amazing people who make our community thrive. From content
            creators to translators, social media accounts to stores - discover
            the accounts that matter most to our community.
          </p>
        </div>

        {/* Account Type Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {accountTypes.map((type) => (
            <div
              key={type}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getTypeColor(
                type
              )}`}
            >
              {getTypeIcon(type)}
              <span className="font-medium">{getTypeLabel(type)}</span>
              <span className="bg-black/20 px-2 py-1 rounded-full text-xs">
                {filterByType(type).length}
              </span>
            </div>
          ))}
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {account.name}
                      </h3>
                      {account.verified && (
                        <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-zinc-400 text-sm">{account.platform}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                {account.description}
              </p>

              {/* Type Badge and Action */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getTypeColor(
                    // @ts-ignore
                    account.type
                  )}`}
                >
                  {/* @ts-ignore */}
                  {getTypeIcon(account.type)}
                  <span className="text-sm font-medium">
                    {/* @ts-ignore */}
                    {getTypeLabel(account.type)}
                  </span>
                </div>
                <a
                  href={account.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  Visit
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
