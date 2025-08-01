import ProductCard from "@/components/productCard";
import type { ReceiptProduct } from "@/components/receiptItem";
import Receipt from "@/components/receiptSide";
import { refreshToken } from "@/utils/auth";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  category: { id: string; name: string };
  createdAt: string;
  image: string | null; // ← new
}

export default function Sales() {
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [receiptProducts, setReceiptProducts] = useState<ReceiptProduct[]>([]);
  const fetchProduct = useCallback(async () => {
    try {
      await refreshToken();
      const access_token = localStorage.getItem("accessToken");

      const packet = {
        params: { search: search, categoryID: "" },
        headers: { Authorization: `Bearer ${access_token}` },
      };
      const response = await axios.get(
        "https://fe-api-training.ssit.company/api/products",
        packet
      );
      const responseData = response.data.data.products;
      setProducts(responseData);
      console.log("runned");
    } catch (err) {
      console.log({ err });
    }
  }, [search]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <div className="flex-row flex w-full h-full gap-10 ">
      <div className=" h-full w-[67%] flex gap-8 flex-col ">
        <div className=" h-fit w-full ">
          <input
            type="text"
            placeholder="Search something..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-[98%] bg-[#252525] rounded-xl px-3 focus:outline-0 focus:border-white focus:border-2 transition duration-200"
          />
        </div>
        <div className="w-full h-full grid grid-cols-3 gap-5 pr-6 overflow-scroll">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              setReceiptProducts={setReceiptProducts}
            ></ProductCard>
          ))}
        </div>
      </div>
      <div className="w-[33%] ">
        <Receipt
          items={receiptProducts}
          setReceiptProduct={setReceiptProducts}
        ></Receipt>
      </div>
    </div>
  );
}
