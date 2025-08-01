import type React from "react";
import type { ReceiptProduct } from "./receiptItem";

interface ProductCardProps {
  name: string;
  price: number;
  image: string | null;
  id: string;
  setReceiptProducts: React.Dispatch<React.SetStateAction<ReceiptProduct[]>>;
}

export default function ProductCard({
  name,
  price,
  image,
  id,
  setReceiptProducts,
}: ProductCardProps) {
  const handleOnClick = () => {
    setReceiptProducts((prev) => {
      const index = prev.findIndex((product) => product.id === id);
      if (index === -1) {
        const newProduct: ReceiptProduct = {
          id: id,
          name: name,
          price: price,
          quantity: 1,
        };
        return [...prev, newProduct];
      }
      const update = [...prev];
      update[index].quantity += 1;
      return [...update];
    });
  };
  return (
    <div className="w-full h-fit bg-[#252525] rounded-xl border border-transparent box-border hover:border-white" onClick={handleOnClick}>
      <div className="w-full h-46 bg-white/3 flex items-center justify-center overflow-hidden rounded-t-xl">
        {image ? (
          <img src={image} alt={name} className="object-cover h-full w-full rounded-xl" />
        ) : (
          <span className="text-black/">no img to display</span>
        )}
      </div>
      <div className="pt-2 rounded-b-2xl pl-2">
        <h3 className="text-base font-semibold text-amber-400">{name}</h3>
        <p className="text-white font-bold text-small mt-1 pb-2">
          {new Intl.NumberFormat("vi-VN").format(price)}VND
        </p>
      </div>
    </div>
  );
}
