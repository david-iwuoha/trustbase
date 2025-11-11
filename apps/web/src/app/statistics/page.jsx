import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3,
  ArrowLeft,
  Download,
  PieChart,
  TrendingUp,
  Shield,
  Users,
  Calendar,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function StatisticsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [typingText, setTypingText] = useState("");

  // Sample data for visualizations
  const categoryData = [
    { name: "Financial", value: 25, count: 3 },
    { name: "Government", value: 23, count: 3 },
    { name: "E-commerce", value: 15, count: 2 },
    { name: "Telecom", value: 8, count: 1 },
    { name: "Others", value: 29, count: 4 },
  ];

  const privacyTrendData = [
    { month: "Jan", score: 6.2 },
    { month: "Feb", score: 6.8 },
    { month: "Mar", score: 7.1 },
    { month: "Apr", score: 7.3 },
    { month: "May", score: 7.5 },
    { month: "Jun", score: 7.2 },
  ];

  const accessData = [
    { organization: "GTBank", accesses: 45 },
    { organization: "MTN", accesses: 32 },
    { organization: "Paystack", accesses: 28 },
    { organization: "NIMC", accesses: 15 },
    { organization: "Others", accesses: 67 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const handleGenerateSummary = async () => {
    setShowSummaryModal(true);
    setSummaryLoading(true);

    // Simulate 2-second loading
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSummaryLoading(false);

    // Simulate typing effect
    const fullSummary = `# Your Data Privacy Summary

## Overview
Your current digital privacy footprint analysis:

## Key Findings

### Data Access Patterns
• 13 organizations track your data
• 7 organizations have active permissions
• Average privacy score: 7.2/10

### Privacy Trends
• Privacy score improved 16% over 6 months
• Most trustworthy: NIMC and CBN (9/10)
• Needs attention: Bolt (5/10)

## Recommendations
1. Review organizations with scores below 6
2. Enable two-factor authentication
3. Monthly privacy settings review

This summary was generated based on your TrustBase profile.`;

    // Typing effect
    let currentText = "";
    for (let i = 0; i < fullSummary.length; i++) {
      currentText += fullSummary[i];
      setTypingText(currentText);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  };

  const downloadPDF = () => {
    const blob = new Blob([typingText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_data_summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
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
    <div className="min-h-screen bg-gray-50">
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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Privacy Statistics
                  </h1>
                  <p className="text-sm text-gray-500">
                    Analyze your data privacy patterns
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleGenerateSummary}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Generate Summary
            </motion.button>
          </div>
        </div>
      </div>

      {/* Statistics Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Data Privacy Analytics
          </h2>
          <p className="text-gray-600">
            Interactive visualizations of your data sharing patterns and privacy
            metrics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Users,
              label: "Total Organizations",
              value: "13",
              color: "blue",
            },
            {
              icon: Shield,
              label: "Average Privacy Score",
              value: "7.2/10",
              color: "green",
            },
            {
              icon: Calendar,
              label: "Data Accesses (30d)",
              value: "187",
              color: "orange",
            },
            {
              icon: TrendingUp,
              label: "Privacy Improvement",
              value: "+16%",
              color: "purple",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-${stat.color}-50 rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visualization Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Organization Categories Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              Organizations by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Tooltip />
                  <RechartsPieChart.Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </RechartsPieChart.Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Privacy Score Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Privacy Score Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={privacyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Data Access Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Data Access Frequency (Last 30 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="organization" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accesses" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Summary Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSummaryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Your Data Privacy Summary
                </h3>
                <div className="flex items-center space-x-3">
                  {!summaryLoading && typingText && (
                    <motion.button
                      onClick={downloadPDF}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                  )}
                  <button
                    onClick={() => setShowSummaryModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {summaryLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">
                      Generating your privacy summary...
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                      {typingText}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



