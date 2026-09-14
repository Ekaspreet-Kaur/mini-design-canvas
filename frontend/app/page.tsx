"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canvasApi } from "../lib/api";
import type { Canvas } from "../types/canvas";

export default function Home() {
  const router = useRouter();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => { setLoading(true); try { setCanvases(await canvasApi.list()); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Unable to load canvases"); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);

  const create = async () => { try { const canvas = await canvasApi.create({ name: "Untitled Canvas", width: 1200, height: 700, elements: [] }); router.push(`/canvas/${canvas._id}`); } catch (e) { setError(e instanceof Error ? e.message : "Unable to create canvas"); } };
  const remove = async (id: string) => { if (!window.confirm("Delete this canvas? This cannot be undone.")) return; try { await canvasApi.remove(id); setCanvases((items) => items.filter((item) => item._id !== id)); } catch (e) { setError(e instanceof Error ? e.message : "Unable to delete canvas"); } };

  return <main className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Glazia assignment</p><h1 className="mt-1 text-2xl font-bold tracking-tight">Canvas Studio</h1></div><button onClick={create} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700">+ New canvas</button></div></header><section className="mx-auto max-w-6xl px-6 py-10"><div className="mb-8"><h2 className="text-3xl font-bold tracking-tight">Your canvases</h2><p className="mt-2 text-slate-500">Create, edit and persist lightweight designs.</p></div>{error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}{loading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">Loading canvases…</div> : canvases.length === 0 ? <button onClick={create} className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white p-16 text-center hover:border-slate-500"><span className="text-lg font-semibold">Create your first canvas</span><span className="mt-2 block text-sm text-slate-500">Start with rectangles, circles and text.</span></button> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{canvases.map((canvas) => <article key={canvas._id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><button onClick={() => router.push(`/canvas/${canvas._id}`)} className="block w-full text-left"><div className="mb-5 flex h-36 items-center justify-center rounded-xl bg-slate-100"><div className="rounded-lg border border-slate-200 bg-white px-6 py-4 text-sm text-slate-400">{canvas.elements.length} elements</div></div><h3 className="truncate font-semibold">{canvas.name}</h3><p className="mt-1 text-xs text-slate-400">Updated {new Date(canvas.updatedAt).toLocaleString()}</p></button><div className="mt-4 flex justify-end"><button onClick={() => void remove(canvas._id)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button></div></article>)}</div>}</section></main>;
}
