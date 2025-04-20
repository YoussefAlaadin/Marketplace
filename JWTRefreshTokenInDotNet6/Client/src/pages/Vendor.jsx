import { useParams } from "react-router-dom";

export default function VendorDashboard() {
  const { username } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-600">Welcome, {username} 👋</h1>
        <p className="text-gray-600">This is your vendor dashboard.</p>
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );
}
