// src/components/pos/Receipt.tsx
import React, { useMemo } from "react";
import "../App.css";
import ReceiptItem, { type ReceiptProduct } from "./receiptItem";
import { refreshToken } from "@/utils/auth";
import axios from "axios";

interface ReceiptProps {
  items: ReceiptProduct[];
  setReceiptProduct: React.Dispatch<React.SetStateAction<ReceiptProduct[]>>;
}

interface OrderItem {
  productId: string;
  price: number;
  quantity: number;
}

export default function Receipt({ items, setReceiptProduct }: ReceiptProps) {
  const subTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);
  const vat = useMemo(() => {
    return subTotal * 0.1;
  }, [subTotal]);
  const total = useMemo(() => {
    return subTotal + vat;
  }, [vat, subTotal]);

  const placeOrder = async () => {
    try {
      await refreshToken();
      const accessToken = localStorage.getItem("accessToken");
      const OrderItems: OrderItem[] = items.map((item) => ({
        productId: item.id,
        price: item.price,
        quantity: item.quantity,
      }));
      const body = {
        items: OrderItems,
        customerName: "Khach Le",
        customerPhone: "0344279128",
        discountAmount: 0,
        paymentMethod: "CASH",
        notes: "",
      };

      const response = await axios.post(
        "https://fe-api-training.ssit.company/api/orders",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckerViet = () => {
    placeOrder();
    setReceiptProduct([]);
  };

  return (
    <div className="h-full flex flex-col w-full gap-6">
      {/* Receipt card: stretch to fill and stack */}
      <div className="flex flex-col h-[90%] bg-[#252525] rounded-xl p-8">
        {/* Header */}
        <div className="border-b pb-2 flex justify-between">
            <div><p className="font-bold text-2xl">36 giet ng company</p></div>
          <div><p className="text-xl">Receipt</p></div>
        </div>

        {/* ↓ Scrollable list ↓ */}
        <div className="h-[586px] overflow-y-auto space-y-2 pr-2">
          {items.map((item) => (
            <ReceiptItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              setReceiptProduct={setReceiptProduct}
            ></ReceiptItem>
          ))}
        </div>

        {/* Summary: sits below the scroll region */}
        <div className="mt-4 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{new Intl.NumberFormat("vi-VN").format(subTotal)} VND</p>
          </div>
          <div className="flex justify-between ">
            <p>VAT(10%)</p>
            <p>{new Intl.NumberFormat("vi-VN").format(vat)} VND</p>
          </div>
          <div className="flex justify-between font-bold text-xl pt-2 border-t">
            <p>Total</p>
            <p>{new Intl.NumberFormat("vi-VN").format(total)} VND</p>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <button
        className="h-[10%] border rounded-xl text-white font-bold hover:bg-amber-400 hover:text-[#1f1f1f]"
        onClick={handleCheckerViet}
      >
        Checkout
      </button>
    </div>
  );
}
