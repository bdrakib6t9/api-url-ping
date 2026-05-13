import axios from "axios";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 📁 JSON read manually (safe way)
    const filePath = path.join(process.cwd(), "data", "urls.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const urlsData = JSON.parse(raw);

    const urls = urlsData.urls;

    const results = await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const start = Date.now();

          await axios.get(url, { timeout: 10000 });

          return {
            url,
            status: "success",
            time: Date.now() - start
          };
        } catch (err) {
          return {
            url,
            status: "failed",
            error: err.message
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      total: urls.length,
      results
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
