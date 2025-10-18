"use client";

import { useState, ChangeEvent } from "react";
import { Plus, X } from "lucide-react";
import ProductCard, {
  Category,
  Product,
} from "@/app/components/product/ProductCard";
import {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsBySearchQuery,
} from "@/app/redux/productApis";
import { useGetAllCategoriesQuery } from "@/app/redux/categoryApis";

export default function ProductManager() {
  const { data: categories } = useGetAllCategoriesQuery({});

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    images: "",
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: allProducts,
    isLoading: allProductsLoading,
    refetch,
  } = useGetAllProductsQuery(
    { offset: 0, limit: itemsPerPage, categoryId: selectedCategory },
    { skip: searchText.length > 0 }
  );

  const { data: searchProducts, isLoading: searchLoading } =
    useGetAllProductsBySearchQuery(
      { searchedText: searchText },
      { skip: searchText.length === 0 }
    );

  const [createProduct, { isLoading: createLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useUpdateProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] =
    useDeleteProductMutation();

  const products = searchText.length > 0 ? searchProducts : allProducts;

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.category.id,
        images: product.images.join(", "),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        images: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Name, price, and category are required!");
      return;
    }

    const images = formData.images
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      images,
    };

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: payload }).unwrap();
        alert("Product updated successfully!");
        refetch();
      } else {
        await createProduct(payload).unwrap();
        alert("Product created successfully!");
        refetch();
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      alert("Product deleted successfully!");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  const loading = allProductsLoading || searchLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Product Manager</h1>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg flex-1"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              {categories?.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={20} /> Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 animate-pulse flex flex-col gap-4"
              >
                <div className="bg-gray-200 h-40 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2 mt-auto">
                  <div className="h-8 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-8 flex-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={openModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            {products &&
              products.length > 0 &&
              products.length < (allProducts?.total || 1000) && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setItemsPerPage((prev) => prev + 10)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Load More
                  </button>
                </div>
              )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Category</option>
                {categories?.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="images"
                placeholder="Image URLs, comma-separated"
                value={formData.images}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  {editingProduct ? "Update" : "Create"}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
