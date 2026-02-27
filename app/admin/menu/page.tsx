'use client';

import { useState, useEffect } from 'react';
import { Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MenuItemsTable from '@/components/admin/MenuItemsTable';
import MenuItemForm from '@/components/admin/MenuItemForm';
import type { MenuItem, MenuCategory } from '@/components/admin/MenuItemsTable';

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch items and categories
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/menu-items'),
        fetch('/api/admin/menu-categories'),
      ]);

      if (!itemsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const itemsData = await itemsRes.json();
      const categoriesData = await categoriesRes.json();

      setItems(itemsData.items || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load menu data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedItem(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedItem(undefined);
    fetchData();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      const response = await fetch('/api/admin/menu-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      setNewCategoryName('');
      setShowCategoryForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
            <p className="text-white/60">Create, edit, and manage menu items and categories</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              variant="outline"
              className="font-semibold"
            >
              <Tag className="w-4 h-4 mr-2" />
              {showCategoryForm ? 'Cancel' : 'Add Category'}
            </Button>
            <Button onClick={handleAdd} className="gradient-gold text-black font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Category Form */}
        {showCategoryForm && (
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Add New Category</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name (e.g., Appetizers, Main Courses)"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} className="gradient-gold text-black font-semibold">
                Add Category
              </Button>
            </div>
            {categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-white/60 text-sm">Existing categories:</span>
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 rounded-full text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6">
            <div className="text-3xl font-bold text-white mb-2">{items.length}</div>
            <div className="text-white/60">Total Items</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6">
            <div className="text-3xl font-bold text-white mb-2">{categories.length}</div>
            <div className="text-white/60">Categories</div>
          </div>
          <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {items.filter(i => i.is_available).length}
            </div>
            <div className="text-white/60">Available Items</div>
          </div>
        </div>

        {/* Menu Items Table */}
        <MenuItemsTable
          items={items}
          categories={categories}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
      </div>

      {/* Menu Item Form Modal */}
      <MenuItemForm
        isOpen={showForm}
        onClose={handleCloseForm}
        item={selectedItem}
        categories={categories}
      />
    </>
  );
}
