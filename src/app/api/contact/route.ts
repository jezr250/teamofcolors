import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, message } = body;

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
