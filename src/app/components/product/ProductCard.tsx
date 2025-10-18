"use client";
import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  category: Category;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <div>
        <Link href={`/product/${product.slug}`}>
          <div className="h-40 bg-gray-200 overflow-hidden">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img
                src={
                  product?.images?.[0] && isValidUrl(product.images[0])
                    ? product.images[0]
                    : "https://via.placeholder.com/200"
                }
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {product?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {product?.category?.name}
                </p>
              </div>
              <p className="font-bold text-blue-600">${product?.price}</p>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product?.description}
            </p>
          </div>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-2"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={() => onDelete(product?.id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
