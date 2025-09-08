import db from "../db/index.js";
import { shortenPostRequestSchema } from "../validation/request.validation.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { eq , and} from "drizzle-orm";

// Helper: normalize URL (adds https:// if missing)
function normalizeUrl(inputUrl) {
  if (!/^https?:\/\//i.test(inputUrl)) {
    return `https://${inputUrl}`;
  }
  return inputUrl;
}

export async function createShortUrl(req, res) {
  const validationResult = await shortenPostRequestSchema.safeParseAsync(req.body);

  if (!validationResult.success) {  
    return res.status(400).json({ error: validationResult.error });
  }

  let { target_url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  // ✅ normalize input URL
  target_url = normalizeUrl(target_url);

  try {
    // 1. Check if code already exists
    const existing = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.code, shortCode));

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Code already taken, please choose another one" });
    }

    // ✅ get userId from middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: userId missing" });
    }

    // 2. Insert if unique
    const [result] = await db
      .insert(urlsTable)
      .values({
        code: shortCode,
        url: target_url,
        userId,  // ✅ now defined
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
    });
  } catch (err) {
    console.error("Error inserting URL:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export async function redirectToUrl(req, res) {
  const { code } = req.params;

  try {
    const [url] = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.code, code));

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    let target = url.url;
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    console.log("Redirecting to:", target);
    return res.redirect(target);
  } catch (err) {
    console.error("Error redirecting to URL:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export async function deleteCodeofUser(req, res) {
  //const id = req.params.id; // keep as string since UUIDs are strings

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await db
      .delete(urlsTable)
      .where(eq(urlsTable.userId, userId));
      
     console.log("Delete result:", result);
    if (result.length === 0) {
      return res.status(404).json({ error: "Code not found or not owned by user" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting code:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}


export async function getAllCodes(req, res) {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.user_Id, req.user.id));

  return res.status(200).json(codes);
};