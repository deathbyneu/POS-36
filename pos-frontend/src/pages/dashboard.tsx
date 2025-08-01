// src/pages/dashboard.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { refreshToken } from "../utils/auth";

// --- Types for the API data
interface StatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      sales: {
        today: number;
        thisWeek: number;
        thisMonth: number;
        growth: number;
      };
      orders: {
        today: number;
        pending: number;
        completed: number;
        cancelled: number;
      };
      products: {
        total: number;
        lowStock: number;
        outOfStock: number;
      };
      customers: {
        total: number;
        new: number;
        returning: number;
      };
    };
  };
}

interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
  category: string;
  unit: string;
}

interface TopProductsResponse {
  success: boolean;
  message: string;
  data: { products: TopProduct[] };
}

interface Activity {
  type: "payment" | "stock" | "order" | "user";
  description: string;
  amount: number;
  timestamp: string;
  user: string;
}

interface ActivityResponse {
  success: boolean;
  message: string;
  data: { activities: Activity[] };
}

// --- Helper to get auth headers
const getAuthHeaders = () => {
  refreshToken();
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse["data"]["stats"] | null>(
    null
  );
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1) Dashboard stats
        const statsRes = await axios.get<StatsResponse>(
          "https://fe-api-training.ssit.company/api/dashboard/stats",
          { headers: getAuthHeaders() }
        );
        setStats(statsRes.data.data.stats);

        // 2) Top products (limit 5)
        const topRes = await axios.get<TopProductsResponse>(
          "https://fe-api-training.ssit.company/api/dashboard/top-products",
          {
            headers: getAuthHeaders(),
            params: { limit: 5 },
          }
        );
        setTopProducts(topRes.data.data.products);

        // 3) Recent activity (limit 10)
        const actRes = await axios.get<ActivityResponse>(
          "https://fe-api-training.ssit.company/api/dashboard/recent-activity",
          {
            headers: getAuthHeaders(),
            params: { limit: 10 },
          }
        );
        setActivities(actRes.data.data.activities);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Cannot load dashboard data.");
      }
    };

    fetchAll();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 pt-2 space-y-8 ">
      {/* Stats Grid */}
      <h2 className="text-2xl font-bold text-white mb-4">📉 Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Sales Today", value: stats.sales.today },
          { label: "This Week", value: stats.sales.thisWeek },
          { label: "This Month", value: stats.sales.thisMonth },
          { label: "Growth %", value: `${stats.sales.growth}%` },
          { label: "Orders Today", value: stats.orders.today },
          { label: "Pending Orders", value: stats.orders.pending },
          { label: "Completed Orders", value: stats.orders.completed },
          { label: "Cancelled Orders", value: stats.orders.cancelled },
          { label: "Total Products", value: stats.products.total },
          { label: "Total Customers", value: stats.customers.total },
          { label: "New Customers", value: stats.customers.new },
          { label: "Returning Customers", value: stats.customers.returning },
        ].map((stat) => (
          <div
            key={stat.label}
            className="stat-card p-4 flex flex-col items-center bg-[#252525] rounded-xl"
          >
            <div className="text-gray-400">{stat.label}</div>
            <div className="text-2xl font-semibold text-white mt-2">
              {stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">🏆 Top Products</h2>
        <div className="overflow-auto bg-[#1f1f1f] rounded-2xl shadow-lg">
          <table className="w-full table-auto text-left">
            <thead className="bg-[#252525]">
              <tr>
                {["Name", "Sold", "Revenue", "Category"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-gray-300 uppercase text-xs"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.productId} className="bg-[#252525]">
                  <td className="px-4 py-3 text-white">{p.productName}</td>
                  <td className="px-4 py-3 text-gray-200">{p.totalSold}</td>
                  <td className="px-4 py-3 text-gray-200">
                    {p.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-200">{p.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">
          🔔 Recent Activity
        </h2>
        <div className="space-y-3">
          {activities.map((a, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-[#242424] p-3 rounded-xl"
            >
              <div>
                <div className="text-gray-300">{a.description}</div>
                <div className="text-gray-500 text-sm">
                  {new Date(a.timestamp).toLocaleString()} by {a.user}
                </div>
              </div>
              <div className="text-white font-medium">
                {a.type === "stock" ? a.amount : a.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
