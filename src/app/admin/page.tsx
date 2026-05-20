"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  category: { slug: string; name: string } | string;
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    unit: "250g",
    categorySlug: "",
    imageUrl: "",
    inStock: true,
    featured: false,
    tags: "",
  });

  const canCreate = useMemo(
    () =>
      draft.name.trim() &&
      draft.slug.trim() &&
      draft.description.trim() &&
      draft.unit.trim() &&
      draft.categorySlug.trim() &&
      draft.imageUrl.trim() &&
      Number.isFinite(draft.price) &&
      draft.price >= 0,
    [draft],
  );

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/products"),
      ]);
      const catJson = (await catRes.json()) as { data?: Category[]; error?: string };
      const prodJson = (await prodRes.json()) as { data?: Product[]; error?: string };
      if (!catRes.ok) throw new Error(catJson.error ?? "Failed to load categories");
      if (!prodRes.ok) throw new Error(prodJson.error ?? "Failed to load products");
      setCategories(catJson.data ?? []);
      setProducts(prodJson.data ?? []);

      if (!draft.categorySlug && (catJson.data?.[0]?.slug ?? "")) {
        setDraft((prev) => ({ ...prev, categorySlug: catJson.data![0]!.slug }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadAll();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!canCreate) return;
    setError("");

    try {
      const resp = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          slug: draft.slug.trim().toLowerCase(),
          tags: draft.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const json = (await resp.json()) as { error?: string };
      if (!resp.ok) throw new Error(json.error ?? "Failed to create product");
      setDraft((prev) => ({ ...prev, name: "", slug: "", description: "", imageUrl: "" }));
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  }

  async function patchProduct(id: string, update: Partial<Product> & { categorySlug?: string }) {
    const resp = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    const json = (await resp.json()) as { error?: string };
    if (!resp.ok) throw new Error(json.error ?? "Update failed");
  }

  async function onUpdatePrice(id: string, price: number) {
    setError("");
    try {
      await patchProduct(id, { price });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update price");
    }
  }

  async function onUpdateImage(id: string, imageUrl: string) {
    setError("");
    try {
      await patchProduct(id, { imageUrl });
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setError("");
    try {
      const resp = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = (await resp.json()) as { error?: string };
      if (!resp.ok) throw new Error(json.error ?? "Delete failed");
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Admin</h1>
          <p className="mt-1 text-stone-600">Manage products (price, photos, stock).</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-full border border-amber-300 bg-white px-5 py-2 text-sm font-medium text-stone-800 transition hover:border-amber-500"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-stone-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-900"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <form onSubmit={onCreate} className="rounded-2xl border border-amber-200/70 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-900">Add product</h2>
          <div className="mt-4 grid gap-4">
            <label>
              <span className="text-sm font-medium text-stone-700">Name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Slug</span>
              <input
                value={draft.slug}
                onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))}
                placeholder="e.g. kashmiri-chili-powder"
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                rows={3}
                required
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-medium text-stone-700">Price (INR)</span>
                <input
                  type="number"
                  value={draft.price}
                  onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  min={0}
                  step="0.01"
                  required
                />
              </label>
              <label>
                <span className="text-sm font-medium text-stone-700">Unit</span>
                <input
                  value={draft.unit}
                  onChange={(e) => setDraft((p) => ({ ...p, unit: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  required
                />
              </label>
            </div>
            <label>
              <span className="text-sm font-medium text-stone-700">Category</span>
              <select
                value={draft.categorySlug}
                onChange={(e) => setDraft((p) => ({ ...p, categorySlug: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Image URL</span>
              <input
                value={draft.imageUrl}
                onChange={(e) => setDraft((p) => ({ ...p, imageUrl: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium text-stone-700">Tags (comma separated)</span>
              <input
                value={draft.tags}
                onChange={(e) => setDraft((p) => ({ ...p, tags: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-amber-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={draft.inStock}
                  onChange={(e) => setDraft((p) => ({ ...p, inStock: e.target.checked }))}
                />
                In stock
              </label>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft((p) => ({ ...p, featured: e.target.checked }))}
                />
                Featured
              </label>
            </div>
            <button
              type="submit"
              disabled={!canCreate}
              className="rounded-full bg-amber-800 px-6 py-3 text-sm font-medium text-amber-50 transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create product
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-amber-200/70 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-900">Products</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-amber-100" />
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {products.map((p) => (
                <div key={p._id} className="rounded-xl border border-amber-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-900">{p.name}</p>
                      <p className="text-sm text-stone-500">{p.slug}</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {formatPrice(p.price, "INR")} / {p.unit}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void onDelete(p._id)}
                      className="text-sm font-medium text-red-700 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="font-medium text-stone-700">Update price (INR)</span>
                      <input
                        type="number"
                        defaultValue={p.price}
                        min={0}
                        step="0.01"
                        onBlur={(e) => void onUpdatePrice(p._id, Number(e.target.value))}
                        className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="font-medium text-stone-700">Update image URL</span>
                      <input
                        defaultValue={p.imageUrl}
                        onBlur={(e) => void onUpdateImage(p._id, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      />
                    </label>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-sm text-stone-600">No products yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

