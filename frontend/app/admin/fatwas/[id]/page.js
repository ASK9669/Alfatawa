import { Suspense } from "react";
import Link from "next/link";
import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import { getAdminFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Fatwa from "@/models/Fatwa";
import Category from "@/models/Category";
import AnswerForm from "./AnswerForm";
import BackButton from "../../BackButton";

async function Content({ params }) {
  const { id } = await params;

  const admin = await getAdminFromCookie();
  if (!admin) redirect("/admin/login");
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const f = await Fatwa.findById(id).lean();
  if (!f) notFound();

  const categoryDocs = await Category.find().sort({ nameOromo: 1 }).lean();
  const categories = categoryDocs.map((c) => ({
    id: String(c._id),
    nameOromo: c.nameOromo,
  }));

  const fatwa = {
    id: String(f._id),
    number: f.number || null,
    slug: f.slug || "",
    status: f.status,
    questionOromo: f.questionOromo || "",
    answerOromo: f.answerOromo || "",
    youtubeUrl: f.youtubeUrl || "",
    category: f.category ? String(f.category) : "",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <BackButton />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {fatwa.number ? `Fatwa No. ${fatwa.number}` : "Gaafii Haaraa"}
      </h1>
      <AnswerForm fatwa={fatwa} categories={categories} />
    </main>
  );
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<p className="p-4 text-muted">Loading...</p>}>
      <Content params={params} />
    </Suspense>
  );
}
