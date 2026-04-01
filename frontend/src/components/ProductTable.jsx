import React from "react";
import Button from "./Button";
import { Pencil, Wand2 } from "lucide-react";

function Badge({ children, variant="default" }){
  const styles = {
    default: "bg-white/10 text-slate-100",
    warn: "bg-amber-500/20 text-amber-200 border border-amber-500/30"
  };
  return <span className={"px-2 py-1 rounded-full text-xs "+styles[variant]}>{children}</span>
}

export default function ProductTable({ items, canManage, onEdit, onGenerate }){
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Products</div>
          <div className="text-sm text-slate-300">Inventory list with AI descriptions.</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950/40">
            <tr className="text-left text-slate-300">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Keywords</th>
              <th className="px-5 py-3">Description</th>
              {canManage ? <th className="px-5 py-3 text-right">Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td className="px-5 py-6 text-slate-300" colSpan={canManage?6:5}>No products.</td></tr>
            ) : items.map(p => {
              const low = p.stock <= 5;
              return (
                <tr key={p._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-5 py-4 font-semibold">{p.name}</td>
                  <td className="px-5 py-4">₹{Number(p.price).toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {p.stock}
                      {low ? <Badge variant="warn">Low</Badge> : null}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{(p.keywords||[]).join(", ") || "-"}</td>
                  <td className="px-5 py-4 text-slate-300 max-w-xs"><div className="line-clamp-3">{p.description || "-"}</div></td>
                  {canManage ? (
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => onGenerate(p)}><Wand2 size={16}/> AI</Button>
                        <Button variant="ghost" onClick={() => onEdit(p)}><Pencil size={16}/> Edit</Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
