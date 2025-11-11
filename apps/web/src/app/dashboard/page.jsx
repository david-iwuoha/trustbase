import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  LogOut,
  Clock,
  BarChart3,
  MessageSquare,
  User,
  Building2,
  ToggleLeft,
  ToggleRight,
  Bell,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function Dashboard() {
  const { data: user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userAvatar =
    user?.image ||
    `https://res.cloudinary.com/denaqakxw/image/upload/v1762727249/fox_fat7fy.png`;

  // Fetch organizations data
  const { data: organizationsData, loading: orgsLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await fetch("/api/organizations");
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      return response.json();
    },
  });

  // Fetch data access permissions
  const { data: accessData } = useQuery({
    queryKey: ["data-access"],
    queryFn: async () => {
      const response = await fetch("/api/data-access");
      if (!response.ok) {
        throw new Error("Failed to fetch data access");
      }
      return response.json();
    },
  });

  const organizations = organizationsData?.organizations || [];
  const grantedCount = accessData?.granted_count || 0;

  const handleToggleAccess = async (orgId, currentStatus) => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/data-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: orgId,
          access_granted: !currentStatus,
        }),
      });

      if (response.ok) {
        // Invalidate and refetch both queries
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        queryClient.invalidateQueries({ queryKey: ["data-access"] });
      } else {
        // log error body for debugging
        const text = await response.text();
        console.error("Error toggling access:", response.status, text);
      }
    } catch (error) {
      console.error("Failed to toggle access:", error);
    } finally {
      // Keep the popup visible for 4 seconds before hiding it
      setTimeout(() => {
        setIsProcessing(false);
      }, 4000);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "gpt", label: "TrustBase GPT", icon: MessageSquare },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TrustBase</span>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Data Access Counter */}
              <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  {grantedCount} organizations have access to your data
                </span>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </div>

              {/* Logout */}
              <motion.a
                href="/account/logout"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col md:top-16 md:bg-white md:border-r md:border-gray-200">
        <div className="flex flex-col flex-1 min-h-0 pt-5 pb-4">
          <div className="flex-1 flex flex-col overflow-y-auto px-3">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 pt-0 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dashboard Header */}
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-gray-600">
                    Manage your data privacy settings and monitor organization
                    access.
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Organizations
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {organizations.length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Access Granted
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {grantedCount}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Privacy Score
                        </p>
                        <p className="text-2xl font-bold text-orange-500">
                          {organizations.length > 0
                            ? Math.round(
                                organizations.reduce(
                                  (sum, org) => sum + org.privacy_score,
                                  0
                                ) / organizations.length
                              )
                            : 0}
                          /10
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Organizations List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Organizations ({organizations.length})
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage data access permissions for each organization
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {orgsLoading ? (
                      <div className="p-8 text-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">
                          Loading organizations...
                        </p>
                      </div>
                    ) : organizations.length === 0 ? (
                      <div className="p-8 text-center">
                        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No organizations found</p>
                      </div>
                    ) : (
                      organizations.map((org) => (
                        <motion.div
                          key={org.id}
                          whileHover={{
                            backgroundColor: "rgba(249, 250, 251, 1)",
                          }}
                          className="p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <img
                                src={org.logo_url}
                                alt={org.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                  {org.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-1">
                                  {org.category}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  <strong>Access reason:</strong>{" "}
                                  {org.data_access_reason}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs font-medium text-gray-500">
                                    Privacy Score:
                                  </span>
                                  <span
                                    className={`text-xs font-bold ${
                                      org.privacy_score >= 8
                                        ? "text-green-600"
                                        : org.privacy_score >= 6
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {org.privacy_score}/10
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <motion.button
                                onClick={() =>
                                  handleToggleAccess(org.id, org.access_granted)
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isProcessing}
                                aria-disabled={isProcessing}
                                className="flex items-center space-x-2"
                              >
                                {org.access_granted ? (
                                  <ToggleRight className="w-8 h-8 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    org.access_granted
                                      ? "text-green-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {org.access_granted
                                    ? "Access Granted"
                                    : "Access Denied"}
                                </span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== "dashboard" && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const item = navigationItems.find(
                      (item) => item.id === activeTab
                    );
                    if (item?.icon) {
                      const Icon = item.icon;
                      return <Icon className="w-8 h-8 text-blue-600" />;
                    }
                    return null;
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {navigationItems.find((item) => item.id === activeTab)?.label}
                </h2>
                {activeTab === "gpt" ? (
                  <div>
                    <p className="text-gray-600 mb-6">
                      Chat with our AI assistant about data privacy and
                      transparency.
                    </p>
                    <motion.a
                      href="/trustbase-gpt"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Open TrustBase GPT</span>
                    </motion.a>
                  </div>
                ) : activeTab === "timeline" ? (
                  <div>
                    <p className="text-gray-600 mb-6">
                      Visualize your data usage timeline with interactive
                      heatmaps and organization insights.
                    </p>
                    <motion.a
                      href="/timeline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                    >
                      <Clock className="w-5 h-5" />
                      <span>View Timeline</span>
                    </motion.a>
                  </div>
                ) : activeTab === "statistics" ? (
                  <div>
                    <p className="text-gray-600 mb-6">
                      Explore detailed analytics and generate comprehensive
                      privacy reports.
                    </p>
                    <motion.a
                      href="/statistics"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>View Statistics</span>
                    </motion.a>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    This section is coming soon. Stay tuned for more features!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 font-medium">
                Processing request, please wait...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


