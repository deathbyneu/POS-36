import type React from "react";

export interface ReceiptProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  setReceiptProduct: React.Dispatch<React.SetStateAction<ReceiptProduct[]>>;
}
export default function ReceiptItem({
  id,
  name,
  price,
  quantity,
  setReceiptProduct,
}: ReceiptItemProps) {
  const updateQty = (id: string, newQty: number) => {
    if (newQty < 0) {
      return;
    }
    setReceiptProduct((prev) => {
      const index = prev.findIndex((product) => product.id === id);
      const update = [...prev];
      update[index].quantity = newQty;
      return [...update];
    });
  };
  const handleRemove = () => {
    setReceiptProduct((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="border-b w-full h-fit flex p-5 justify-between">
      <div className="flex flex-col h-full gap-6">
        <p className="text-white text-lg font-semibold">{name}</p>
        <p className="text-white/80">
          Price:{new Intl.NumberFormat("vi-VN").format(price)} VND
        </p>
      </div>
      <div className="flex-col flex gap-5 items-end">
        <div className="flex space-x-4">
          <button
            className="w-8 h-8 bg-white/20 textwhite rounded hover:bg-white/50"
            onClick={() => {
              updateQty(id, quantity - 1);
            }}
          >
            -
          </button>
          <input
            type="text"
            min={0}
            value={quantity}
            className="w-8 text-center h-8"
          ></input>
          <button
            className="w-8 h-8 bg-white/20 textwhite rounded hover:bg-white/50"
            onClick={() => {
              updateQty(id, quantity + 1);
            }}
          >
            +
          </button>
          <button
            className="bg-red-500 w-8 h-8 textwhite rounded hover:bg-white hover:text-red-500"
            onClick={handleRemove}
          >
            x
          </button>
        </div>
        <span>
          {new Intl.NumberFormat("vi-VN").format(price * quantity)} VND
        </span>
      </div>
    </div>
  );
}
