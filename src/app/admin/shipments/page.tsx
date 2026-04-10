'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Shipment {
  id: string;
  user_id: string;
  order_id: string;
  product_name: string;
  tracking_number?: string;
  carrier?: string;
  shipment_status: string;
  estimated_delivery?: string;
  created_at: string;
  user_profiles?: { full_name: string; email: string };
}

interface FormState {
  user_id: string;
  order_id: string;
  product_name: string;
  tracking_number: string;
  carrier: string;
  shipment_status: string;
  estimated_delivery: string;
}

const EMPTY_FORM: FormState = {
  user_id: '',
  order_id: '',
  product_name: '',
  tracking_number: '',
  carrier: '',
  shipment_status: 'processing',
  estimated_delivery: '',
};

const STATUS_COLORS: Record<string, string> = {
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-amber-50 text-amber-700 border-amber-200',
  in_transit: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  returned: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<Shipment | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/shipments');
      const json = await res.json();
      if (json.data) setShipments(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const openEdit = (item: Shipment) => {
    setEditingItem(item);
    setForm({
      user_id: item.user_id,
      order_id: item.order_id,
      product_name: item.product_name,
      tracking_number: item.tracking_number ?? '',
      carrier: item.carrier ?? '',
      shipment_status: item.shipment_status,
      estimated_delivery: item.estimated_delivery ? item.estimated_delivery.split('T')[0] : '',
    });
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.product_name.trim()) { setSaveError('Product name is required.'); return; }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const payload = {
        ...form,
        estimated_delivery: form.estimated_delivery || null,
        tracking_number: form.tracking_number || null,
        carrier: form.carrier || null,
      };
      let res: Response;
      if (editingItem) {
        res = await fetch('/api/shipments', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        if (!form.user_id.trim()) { setSaveError('User ID is required.'); setSaving(false); return; }
        if (!form.order_id.trim()) { setSaveError('Order ID is required.'); setSaving(false); return; }
        res = await fetch('/api/shipments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save.');
      } else {
        setSaveSuccess(editingItem ? 'Shipment updated!' : 'Shipment created!');
        await fetchData();
        setTimeout(() => { setShowEditor(false); setSaveSuccess(''); }, 1200);
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await fetch(`/api/shipments?id=${id}`, { method: 'DELETE' });
      setShipments(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    let res = await fetch('/api/shipments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, shipment_status: status }),
    });
    if (res.ok) setShipments(prev => prev.map(s => s.id === id ? { ...s, shipment_status: status } : s));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Shipment Tracking</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />Add Shipment
          </button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : (
            <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['Student', 'Product', 'Tracking', 'Carrier', 'Status', 'Est. Delivery', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {shipments.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-sm font-sans text-stone-400">No shipments yet. Add your first one!</td></tr>
                  ) : shipments.map(ship => (
                    <tr key={ship.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700">{ship.user_profiles?.full_name || ship.user_id.slice(0, 8) + '…'}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500">{ship.product_name}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{ship.tracking_number || '—'}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs">{ship.carrier || '—'}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={ship.shipment_status}
                          onChange={e => updateStatus(ship.id, e.target.value)}
                          className="text-xs font-sans border border-stone-200 rounded-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40"
                        >
                          {['processing', 'shipped', 'in_transit', 'delivered', 'returned'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{ship.estimated_delivery ? new Date(ship.estimated_delivery).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(ship)} className="text-stone-400 hover:text-amber-700 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteId(ship.id)} className="text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowEditor(false)} />
          <div className="relative ml-auto w-full max-w-xl h-full bg-[#FAF8F4] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
              <div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Shipments</p>
                <p className="font-serif text-lg text-stone-800">{editingItem ? 'Edit Shipment' : 'New Shipment'}</p>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && <span className="flex items-center gap-1.5 text-xs font-sans text-green-700"><CheckCircle size={13} />{saveSuccess}</span>}
                {saveError && <span className="flex items-center gap-1.5 text-xs font-sans text-red-600"><AlertCircle size={13} />{saveError}</span>}
                <button onClick={() => setShowEditor(false)} className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {!editingItem && (
                <>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">User ID *</label>
                    <input type="text" value={form.user_id} onChange={e => setForm(f => ({ ...f, user_id: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="UUID of the student" />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Order ID *</label>
                    <input type="text" value={form.order_id} onChange={e => setForm(f => ({ ...f, order_id: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="UUID of the order" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Product Name *</label>
                <input type="text" value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="e.g. Healing Kit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Tracking Number</label>
                  <input type="text" value={form.tracking_number} onChange={e => setForm(f => ({ ...f, tracking_number: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="e.g. IN123456789" />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Carrier</label>
                  <input type="text" value={form.carrier} onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="e.g. India Post" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Status</label>
                  <select value={form.shipment_status} onChange={e => setForm(f => ({ ...f, shipment_status: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700">
                    {['processing', 'shipped', 'in_transit', 'delivered', 'returned'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Est. Delivery</label>
                  <input type="date" value={form.estimated_delivery} onChange={e => setForm(f => ({ ...f, estimated_delivery: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-end gap-3">
              <button onClick={() => setShowEditor(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50">
                {saving && <Loader2 size={12} className="animate-spin" />}
                {editingItem ? 'Update' : 'Save Shipment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-sm border border-stone-200 p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-serif text-lg text-stone-800 mb-2">Delete Shipment?</h3>
            <p className="text-sm font-sans text-stone-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting} className="text-xs font-sans font-medium px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {deleting && <Loader2 size={12} className="animate-spin" />}Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
