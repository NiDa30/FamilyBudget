import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Ăn uống", icon: "🍽️", color: "#0D9488", isDefault: true },
    { id: 2, name: "Di chuyển", icon: "🚗", color: "#06B6D4", isDefault: true },
    { id: 3, name: "Giải trí", icon: "🎬", color: "#3B82F6", isDefault: true },
    { id: 4, name: "Giáo dục", icon: "📚", color: "#8B5CF6", isDefault: true },
    { id: 5, name: "Y tế", icon: "🏥", color: "#EC4899", isDefault: true },
    { id: 6, name: "Nhà cửa", icon: "🏠", color: "#F59E0B", isDefault: true },
  ]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    color: "#0D9488",
  });

  const deleteCategory = (categoryId) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...formData } : cat
        )
      );
      setEditingCategory(null);
    } else {
      setCategories([
        ...categories,
        { ...formData, id: Date.now(), isDefault: false },
      ]);
      setShowAddCategory(false);
    }
    setFormData({ name: "", icon: "", color: "#0D9488" });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowAddCategory(false);
    setFormData({ name: "", icon: "", color: "#0D9488" });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="flex justify-between items-center mb-6 w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h2>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition shadow-lg"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {category.isDefault ? "Mặc định" : "Tùy chỉnh"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="pt-3 border-t">
              <div
                className="h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal thêm/sửa */}
      {(showAddCategory || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
                  placeholder="Chọn emoji"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Màu sắc
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-10 border-2 border-gray-200 rounded-xl cursor-pointer"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2 rounded-xl hover:from-teal-600 hover:to-cyan-700 transition font-medium shadow-lg"
                >
                  <Save size={18} />
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
