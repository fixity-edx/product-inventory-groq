import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Sparkles, LogOut } from "lucide-react";
import { api } from "../lib/api";
import { clearToken, getUserFromToken } from "../lib/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Toast from "../components/Toast";
import ProductTable from "../components/ProductTable";

function GlassBG(){
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute top-40 -right-24 h-[360px] w-[360px] rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  )
}

function Modal({ open, title, children, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const user = getUserFromToken();
  const canManage = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const notify = (title, message="") => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3200);
  };

  const [search, setSearch] = useState("");
  const [filterLow, setFilterLow] = useState(false);

  const filtered = useMemo(() => {
    let out = [...items];
    if(search.trim()){
      const q = search.toLowerCase();
      out = out.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.keywords || []).join(",").toLowerCase().includes(q)
      );
    }
    if(filterLow) out = out.filter(p => p.stock <= 5);
    return out;
  }, [items, search, filterLow]);

  const fetchItems = async () => {
    try{
      setLoading(true);
      const res = await api.get("/products");
      setItems(res.data);
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // create
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ name:"", price:"", stock:"", keywords:"" });

  const create = async (e) => {
    e.preventDefault();
    try{
      await api.post("/products", {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        keywords: form.keywords.split(",").map(s => s.trim()).filter(Boolean),
      });
      setOpenAdd(false);
      setForm({ name:"", price:"", stock:"", keywords:"" });
      notify("Created", "Product added.");
      fetchItems();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  // edit
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ price:"", stock:"" });

  const openEditModal = (p) => {
    setEditing(p);
    setEditForm({ price: String(p.price), stock: String(p.stock) });
    setOpenEdit(true);
  };

  const update = async (e) => {
    e.preventDefault();
    try{
      await api.put(`/products/${editing._id}`, {
        price: Number(editForm.price),
        stock: Number(editForm.stock),
      });
      setOpenEdit(false);
      setEditing(null);
      notify("Updated", "Product updated.");
      fetchItems();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const generate = async (p) => {
    try{
      notify("Generating...", "Groq AI is generating description.");
      await api.post(`/products/${p._id}/generate-description`, {});
      fetchItems();
      notify("Done", "Description generated.");
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try{
      await api.post("/auth/logout", {});
    }catch{}
    clearToken();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen">
      <GlassBG />

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                <Sparkles size={16} />
                Secure Inventory + Groq AI
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
                Product Inventory System
              </h1>
              <p className="text-slate-300 mt-2">
                Logged in as <span className="font-semibold">{user?.name}</span> ({user?.role})
              </p>
            </div>

            <div className="flex gap-2">
              {canManage ? (
                <Button onClick={() => setOpenAdd(true)}><Plus size={18}/> Add Product</Button>
              ) : null}
              <Button variant="secondary" onClick={logout}><LogOut size={18}/> Logout</Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name/keywords/description..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>
            </div>
            <label className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 flex items-center gap-2">
              <input type="checkbox" checked={filterLow} onChange={(e) => setFilterLow(e.target.checked)} className="accent-indigo-500" />
              <span className="text-sm text-slate-200">Low-stock only (≤ 5)</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <ProductTable items={filtered} canManage={canManage} onEdit={openEditModal} onGenerate={generate} />
        </div>

        <div className="text-center text-xs text-slate-500 mt-10">
          RBAC: Admin can manage inventory. Users can view only.
        </div>
      </div>

      {/* Add */}
      <Modal open={openAdd} title="Add Product (Admin)" onClose={() => setOpenAdd(false)}>
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Product Name" required value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} />
          <Input label="Price (INR)" required type="number" value={form.price} onChange={(e) => setForm(f => ({...f, price: e.target.value}))} />
          <Input label="Stock" required type="number" value={form.stock} onChange={(e) => setForm(f => ({...f, stock: e.target.value}))} />
          <Input label="Keywords (comma separated)" value={form.keywords} onChange={(e) => setForm(f => ({...f, keywords: e.target.value}))} />
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setOpenAdd(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit */}
      <Modal open={openEdit} title={`Edit (Admin): ${editing?.name || ""}`} onClose={() => setOpenEdit(false)}>
        <form onSubmit={update} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Price (INR)" required type="number" value={editForm.price} onChange={(e) => setEditForm(f => ({...f, price: e.target.value}))} />
          <Input label="Stock" required type="number" value={editForm.stock} onChange={(e) => setEditForm(f => ({...f, stock: e.target.value}))} />
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
