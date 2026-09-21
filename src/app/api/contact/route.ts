import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, message, website, elapsed } = body;

    // bot 対策（本番は api/contact.php 側が同じ判定をする。ここは開発で動きを確かめる用）。
    // ハニーポットが埋まっている／開いてから3秒未満での送信は自動投稿とみなし、
    // 保存せずに成功と同じ応答を返す（はじいたことをボットに教えないため）
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true, id: 0 }, { status: 201 });
    }
    if (typeof elapsed === "number" && elapsed < 3000) {
      return NextResponse.json({ success: true, id: 0 }, { status: 201 });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "お名前・メール・お問い合わせ内容は必須です" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "メールアドレスの形式が正しくありません" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: { name, company: company || null, email, phone: phone || null, message },
    });

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "送信に失敗しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
