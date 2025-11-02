import db from "../db/index.js";
import { shortenPostRequestSchema } from "../validation/request.validation.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";


// 🧩 Helper: Normalize URL (adds https:// if missing)
function normalizeUrl(inputUrl) {
  if (!/^https?:\/\//i.test(inputUrl)) {
    return `https://${inputUrl}`;
  }
  return inputUrl;
}

// 🧱 Create Short URL
export async function createShortUrl(req, res) {
  const validationResult = await shortenPostRequestSchema.safeParseAsync(
    req.body
  );
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error });
  }

  let { target_url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);
  target_url = normalizeUrl(target_url);

  try {
    // 1️⃣ Check if code already exists
    const existing = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.code, shortCode));

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Code already taken, please choose another one" });
    }

    // 2️⃣ Get userId from middleware
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing" });
    }

    // 3️⃣ Insert new URL record
    const [result] = await db
      .insert(urlsTable)
      .values({
        code: shortCode,
        url: target_url,
        userId,
      })
      .returning({
        id: urlsTable.id,
        code: urlsTable.code,
        url: urlsTable.url,
      });

    return res.status(201).json({
      id: result.id,
      code: result.code,
      target_url: result.url,
      message: "Short URL created successfully",
    });
  } catch (err) {
    console.error("❌ Error inserting URL:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// 🚀 Redirect and Track Analytics
export async function redirectToUrl(req, res) {
  const { code } = req.params;
  try {
    // 🔍 Find the URL by code
    const [url] = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.code, code));
    if (!url) return res.status(404).json({ error: "URL not found" });


    // 🔗 Redirect to original URL
    let target = url.url;
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    return res.redirect(target);
  } catch (err) {
    console.error("Error redirecting:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// ❌ Delete a user's short URL
export async function deleteCodeofUser(req, res) {
  const { id } = req.params; // short code
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await db
      .delete(urlsTable)
      .where(eq(urlsTable.userId, userId))
      .where(eq(urlsTable.code, id))
      .returning({ code: urlsTable.code });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "Code not found or not owned by user" });
    }

    return res.status(200).json({ message: "Deleted successfully", code: id });
  } catch (err) {
    console.error("Error deleting code:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

// 📋 Get All URLs for a User
export async function getAllCodes(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const urls = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.userId, userId))
      .orderBy(urlsTable.createdAt);

    return res.status(200).json(urls);
  } catch (err) {
    console.error("Error fetching URLs:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}


