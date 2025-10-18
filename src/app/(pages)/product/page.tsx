import ProductManagers from "@/app/components/product/ProductManagers";
import ProtectedRoute from "@/app/components/product/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ProductManagers />
    </ProtectedRoute>
  );
}
