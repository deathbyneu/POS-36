import { useState, useEffect, useCallback } from "react";
import axios from "axios";

type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | string;

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number; // adapt if API uses different field
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string; // ISO date string
}

interface OrdersResponse {
  data: {
    orders: Order[];
    meta?: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
    };
  };
}

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
];
const PAYMENT_OPTIONS: PaymentMethod[] = ["CASH", "CARD", "TRANSFER"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>(""); // empty = all
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>(""); // YYYY-MM-DD
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const access_token = localStorage.getItem("accessToken");
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (paymentMethod) params.paymentMethod = paymentMethod;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      console.log(params);
      const response = await axios.get<OrdersResponse>(
        "https://fe-api-training.ssit.company/api/orders",
        {
          params,
          headers: {
            Authorization: access_token ? `Bearer ${access_token}` : "",
          },
        }
      );

      // adapt depending on real shape:
      const respData = response.data.data;
      console.log(response);
      setOrders(respData.orders || []);
      if (respData.meta) {
        const tp =
          typeof respData.meta.totalPages === "number"
            ? respData.meta.totalPages
            : Math.ceil(
                (respData.meta.total || 0) / (respData.meta.limit || limit)
              );
        setTotalPages(Math.max(1, tp));
      } else {
        setTotalPages(1);
      }
    } catch (e) {
      console.error("fetch orders error", e);
      setError("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, status, paymentMethod, startDate, endDate]);

  // refetch when filters change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentMethod("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm mb-1">Search</label>
          <input
            type="text"
            placeholder="Order # or customer"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Payment</label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          >
            <option value="">All</option>
            {PAYMENT_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border rounded"
          />
        </div>

        <div className="self-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-500 rounded hover:bg-gray-300 hover:text-red-500 text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#242424] shadow rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#2f2f2f]">
            <tr>
              <th className="px-4 py-2">Order #</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t hover:bg-white/5">
                  <td className="px-4 py-3">{o.orderNumber || o.id}</td>
                  <td className="px-4 py-3">{o.customerName || "-"}</td>
                  <td className="px-4 py-3">
                    {new Intl.DateTimeFormat("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(o.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        {
                          PENDING: "bg-yellow-100 text-yellow-800",
                          COMPLETED: "bg-green-100 text-green-800",
                          CANCELLED: "bg-gray-200 text-gray-800",
                          REFUNDED: "bg-blue-100 text-blue-800",
                        }[o.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{o.paymentMethod}</td>
                  <td className="px-4 py-3 text-right">
                    {new Intl.NumberFormat("vi-VN").format(o.total)} VND
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
