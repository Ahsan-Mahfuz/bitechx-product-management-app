"use client";
import { useGetSingleProductQuery } from "@/app/redux/productApis";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: product, isLoading } = useGetSingleProductQuery(id!);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 "></div>
      </div>
    );

  if (!product)
    return <p className="text-center mt-12 text-red-500">Product not found!</p>;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 flex flex-col items-center">
      <button
        onClick={() => router.back()}
        className="self-start mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-4xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center gap-4">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/400"}
            alt={product.name}
            className="rounded-lg object-cover w-full max-w-md h-64 md:h-80 shadow"
          />
          <div className="flex items-center gap-2">
            <span className="font-semibold">Category:</span>
            <img
              src={product.category?.image || "https://via.placeholder.com/50"}
              alt={product.category?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span>{product.category?.name}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Price:</span> ${product.price}
            </p>
            <p className="text-gray-700 mb-4">{product.description}</p>
          </div>

          <div className="text-gray-500 text-sm mt-4">
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {formatDate(product.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Updated At:</span>{" "}
              {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
