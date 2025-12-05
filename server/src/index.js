import { Router } from "itty-router";
import { PrismaClient } from "@prisma/client";
import { R2 } from "@cloudflare/workers-r2";

const router = Router();
const prisma = new PrismaClient();

router.get("/api/inventory", async (request, env) => {
  const items = await prisma.inventoryItem.findMany();
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
});

router.post("/api/inventory", async (request, env) => {
  const data = await request.json();
  const newItem = await prisma.inventoryItem.create({ data });
  return new Response(JSON.stringify(newItem), {
    headers: { "Content-Type": "application/json" },
  });
});

router.post("/api/r2/presigned-url", async (request, env) => {
  const { filename } = await request.json();
  const url = await env.R2_BINDING.createPresignedUrl({
    method: "PUT",
    key: filename,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
  return new Response(JSON.stringify({ url }), {
    headers: { "Content-Type": "application/json" },
  });
});

router.post("/api/ai/generate-seo", async (request, env) => {
  const { keywords } = await request.json();
  const response = await fetch("https://api.gemini.ai/seo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({ keywords }),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

router.get("/api/finance", async (request, env) => {
  const expenses = await prisma.expense.findMany();
  const inventory = await prisma.inventoryItem.findMany();

  const netProfit = inventory.reduce((acc, item) => acc + item.net_profit, 0);

  return new Response(
    JSON.stringify({
      expenses,
      netProfit,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});

export default {
  fetch: router.handle,
};