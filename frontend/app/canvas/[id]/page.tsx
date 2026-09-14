import { notFound } from "next/navigation";
import CanvasEditor from "../../../components/editor/CanvasEditor";
import { canvasApi } from "../../../lib/api";

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const canvas = await canvasApi.get(id);
    return <CanvasEditor initialCanvas={canvas} />;
  } catch {
    notFound();
  }
}
