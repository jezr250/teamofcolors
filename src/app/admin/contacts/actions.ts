"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStatus(id: number, status: string) {
  await prisma.contact.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contacts");
}
