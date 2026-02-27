'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Utensils, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from './ConfirmModal';

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  menu_categories?: {
    id: string;
    name: string;
  };
};

export type MenuCategory = {
  id: string;
  name: string;
};

export type MenuItemsTableProps = {
  items: MenuItem[];
  categories: MenuCategory[];
  onEdit: (item: MenuItem) => void;
  onAdd: () => void;
};

export default function MenuItemsTable({ items, categories, onEdit, onAdd }: MenuItemsTableProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return `₵${amount.toFixed(2)}`;
  };

  const handleDelete = (itemId: string) => {
    setSelectedItem(itemId);
    setShowDeleteConfirm(true);
  };

  const deleteMenuItem = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/menu-items?id=${selectedItem}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      router.refresh();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const response = await fetch('/api/admin/menu-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_available: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Failed to update menu item. Please try again.');
    }
  };

  const filteredItems = filterCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === filterCategory);

  if (items.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
        <Utensils className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No menu items found</h3>
        <p className="text-white/60 mb-6">Create your first menu item to get started.</p>
        <Button onClick={onAdd} className="gradient-gold text-black font-semibold">
          Add Menu Item
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          onClick={() => setFilterCategory('all')}
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          className={filterCategory === 'all' ? 'gradient-gold text-black' : ''}
        >
          All Items ({items.length})
        </Button>
        {categories.map((category) => {
          const count = items.filter(item => item.category_id === category.id).length;
          return (
            <Button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              variant={filterCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className={filterCategory === category.id ? 'gradient-gold text-black' : ''}
            >
              {category.name} ({count})
            </Button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-white">Item</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-white">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-white">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-white">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Utensils className="w-6 h-6 text-white/40" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-white">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-white/60 line-clamp-1">{item.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#D4AF37]/10 text-[#D4AF37]">
                      {item.menu_categories?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{formatCurrency(item.price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAvailability(item.id, item.is_available)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                        item.is_available
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {item.is_available ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Available
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Unavailable
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => onEdit(item)}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-red-400 hover:text-red-300 hover:border-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={deleteMenuItem}
          title="Delete Menu Item"
          message="Are you sure you want to delete this menu item? This action cannot be undone."
          isLoading={isDeleting}
          variant="danger"
        />
      )}
    </>
  );
}
