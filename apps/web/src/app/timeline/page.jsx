import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ArrowLeft,
  Calendar,
  TrendingUp,
  MessageSquare,
  X,
  ExternalLink,
  Clock,
  Lock,
  Eye,
  CheckCircle,
  AlertTriangle,
  Hash,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function TimelinePage() {
  const { data: user, loading: userLoading } = useUser();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [hoveredOrg, setHoveredOrg] = useState(null);
  const [activeTab, setActiveTab] = useState("data-access");
  const popupRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch organizations and usage data
  const { data: timelineData, loading: timelineLoading } = useQuery({
    queryKey: ["timeline"],
    queryFn: async () => {
      const response = await fetch("/api/timeline");
      if (!response.ok) {
        throw new Error("Failed to fetch timeline data");
      }
      return response.json();
    },
  });

  // Fetch transparency ledger data
  const { data: ledgerData, loading: ledgerLoading } = useQuery({
    queryKey: ["transparency-ledger"],
    queryFn: async () => {
      const response = await fetch("/api/transparency-ledger");
      if (!response.ok) {
        throw new Error("Failed to fetch transparency ledger");
      }
      return response.json();
    },
    enabled: activeTab === "transparency-ledger",
  });

  const organizations = timelineData?.organizations || [];
  const ledgerEntries = ledgerData?.entries || [];
  const ledgerStats = ledgerData?.statistics || {};
  const chainIntegrity = ledgerData?.chain_integrity || { valid: true };

  // Generate heatmap data for each organization (simulated)
  const generateHeatmapData = (orgId, privacyScore) => {
    const days = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate activity based on privacy score (lower score = more activity)
      const baseActivity = (10 - privacyScore) / 10;
      const activity = Math.max(
        0,
        Math.min(1, baseActivity + (Math.random() - 0.5) * 0.4),
      );

      days.push({
        date: date.toISOString().split("T")[0],
        activity: activity,
        count: Math.floor(activity * 15) + 1,
      });
    }
    return days;
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getActivityColor = (activity) => {
    if (activity === 0) return "#f3f4f6";
    if (activity < 0.25) return "#dbeafe";
    if (activity < 0.5) return "#93c5fd";
    if (activity < 0.75) return "#3b82f6";
    return "#1d4ed8";
  };

  const handleAskGPT = (orgName) => {
    // Open TrustBase GPT with a pre-filled question
    const question = `Tell me about how ${orgName} typically uses customer data and what I should know about their privacy practices.`;
    const encodedQuestion = encodeURIComponent(question);
    window.open(`/trustbase-gpt?q=${encodedQuestion}`, "_blank");
  };

  if (userLoading || timelineLoading || ledgerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timeline data...</p>
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

  return (
    <div className="min-h-screen bg-gray-50" onMouseMove={handleMouseMove}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.a>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Data Usage Timeline
                  </h1>
                  <p className="text-sm text-gray-500">
                    Track when organizations access your data
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Last 90 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === "data-access"
                  ? "Organization Data Access Activity"
                  : "Transparency Ledger"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "data-access"
                  ? "Visual representation of how often organizations access your data."
                  : "Public, tamper-evident audit trail of all data access permission changes."}
              </p>
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("data-access")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "data-access"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Data Access Timeline</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("transparency-ledger")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "transparency-ledger"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Transparency Ledger</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "data-access" && (
            <motion.div
              key="data-access"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Organizations Grid */}
              <div className="space-y-6">
                {organizations.map((org) => {
                  const heatmapData = generateHeatmapData(
                    org.id,
                    org.privacy_score,
                  );
                  const totalActivity = heatmapData.reduce(
                    (sum, day) => sum + day.count,
                    0,
                  );

                  return (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={org.logo_url}
                            alt={org.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {org.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {org.category}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                Total accesses: {totalActivity}
                              </span>
                              <span
                                className={`text-xs font-semibold ${
                                  org.privacy_score >= 8
                                    ? "text-green-600"
                                    : org.privacy_score >= 6
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                Privacy Score: {org.privacy_score}/10
                              </span>
                            </div>
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleAskGPT(org.name)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Ask TrustBase GPT</span>
                          <ExternalLink className="w-3 h-3" />
                        </motion.button>
                      </div>

                      {/* Heatmap */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-gray-700">
                            Data Access Heatmap (Last 90 days)
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Less</span>
                            <div className="flex space-x-1">
                              {[0, 0.2, 0.4, 0.6, 0.8].map((level, i) => (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-sm"
                                  style={{
                                    backgroundColor: getActivityColor(level),
                                  }}
                                />
                              ))}
                            </div>
                            <span>More</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-13 gap-1">
                          {heatmapData.map((day, index) => (
                            <motion.div
                              key={index}
                              className="w-3 h-3 rounded-sm cursor-pointer relative"
                              style={{
                                backgroundColor: getActivityColor(day.activity),
                              }}
                              whileHover={{ scale: 1.2 }}
                              onHoverStart={() =>
                                setHoveredOrg({ ...org, day, index })
                              }
                              onHoverEnd={() => setHoveredOrg(null)}
                            />
                          ))}
                        </div>

                        <div className="flex justify-between text-xs text-gray-500">
                          <span>
                            {new Date(
                              Date.now() - 89 * 24 * 60 * 60 * 1000,
                            ).toLocaleDateString()}
                          </span>
                          <span>Today</span>
                        </div>
                      </div>

                      {/* Access Reason */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Access Reason:</strong>{" "}
                          {org.data_access_reason}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Understanding Your Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Heatmap Colors:
                    </p>
                    <ul className="space-y-1">
                      <li>• Light blue: Minimal data access</li>
                      <li>• Medium blue: Regular data access</li>
                      <li>• Dark blue: Frequent data access</li>
                      <li>• Gray: No data access</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Privacy Scores:
                    </p>
                    <ul className="space-y-1">
                      <li>
                        • <span className="text-green-600">8-10:</span>{" "}
                        Excellent privacy practices
                      </li>
                      <li>
                        • <span className="text-yellow-600">6-7:</span> Good
                        privacy practices
                      </li>
                      <li>
                        • <span className="text-red-600">1-5:</span> Needs
                        improvement
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "transparency-ledger" && (
            <motion.div
              key="transparency-ledger"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Ledger Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Total Entries
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {parseInt(ledgerStats.total_entries) || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Access Granted
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {parseInt(ledgerStats.grants_count) || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Access Revoked
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {parseInt(ledgerStats.revokes_count) || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    {chainIntegrity.valid ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      Chain Integrity
                    </span>
                  </div>
                  <p
                    className={`text-sm font-bold mt-1 ${chainIntegrity.valid ? "text-green-600" : "text-red-600"}`}
                  >
                    {chainIntegrity.valid ? "Verified" : "Compromised"}
                  </p>
                </div>
              </div>

              {/* Public Notice */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <Eye className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Public Transparency Ledger:</strong> This is a
                      public audit trail that anyone can verify. All entries are
                      anonymized - no personal data is stored, only anonymized
                      user and organization IDs with timestamps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ledger Entries */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Transparency Events
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Chronological record of all data access permission changes
                  </p>
                </div>

                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {ledgerEntries.length === 0 ? (
                    <div className="p-8 text-center">
                      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No transparency entries yet
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Entries will appear here when users grant or revoke data
                        access
                      </p>
                    </div>
                  ) : (
                    ledgerEntries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                entry.action_type === "granted"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {entry.anonymized_user_id} {entry.action_type}{" "}
                                data access from {entry.anonymized_org_id}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(entry.timestamp).toLocaleString()} •
                                Entry #{entry.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {entry.entry_hash.substring(0, 12)}...
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How Transparency Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Tamper Evidence:
                    </p>
                    <ul className="space-y-1">
                      <li>• Each entry contains a cryptographic hash</li>
                      <li>• Hashes are chained together like a blockchain</li>
                      <li>• Any tampering breaks the chain integrity</li>
                      <li>• Public verification ensures accountability</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">
                      Privacy Protection:
                    </p>
                    <ul className="space-y-1">
                      <li>• User IDs are anonymized (e.g., User #2398)</li>
                      <li>
                        • Organization IDs are anonymized (e.g., Org #0007)
                      </li>
                      <li>• No personal data is stored in the ledger</li>
                      <li>• Only permission changes are recorded</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover Popup */}
      <AnimatePresence>
        {hoveredOrg && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 40,
            }}
          >
            <div>
              <p className="font-semibold">{hoveredOrg.name}</p>
              <p>{new Date(hoveredOrg.day.date).toLocaleDateString()}</p>
              <p>{hoveredOrg.day.count} data accesses</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles for 13-column grid */}
      <style jsx>{`
        .grid-cols-13 {
          grid-template-columns: repeat(13, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
}



