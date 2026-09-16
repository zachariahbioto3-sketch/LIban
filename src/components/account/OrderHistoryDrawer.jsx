import React from "react";
import { X, Package, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";

export const OrderHistoryDrawer = ({ open, onClose }) => {
  const { orders, formatPrice, setActiveOrderToTrack, setOrderTrackerOpen } = useStore();
  const { user } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50" />
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }}
        className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl">

        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-liban-dark text-white">
          <div>
            <h2 className="font-bold">Order History</h2>
            <p className="text-xs text-gray-400">{user?.first_name || user?.username}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <Package className="w-12 h-12 text-gray-300" />
              <p className="font-semibold text-gray-500">No orders yet</p>
              <p className="text-xs text-gray-400">Your completed orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded p-4 hover:border-brand-red transition-colors cursor-pointer"
                  onClick={() => { setActiveOrderToTrack(order); setOrderTrackerOpen(true); onClose(); }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-liban-dark">{order.orderNumber}</span>
                    <span className="text-xs text-brand-red font-semibold">{order.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</span>
                    <div className="flex items-center gap-1 text-xs text-brand-red font-semibold">
                      Track Order <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
