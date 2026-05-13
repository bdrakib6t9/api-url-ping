import axios from "axios";
import urlsData from "../data/urls.json" assert { type: "json" };

export default async function handler(req, res) {
  const urls = urlsData.urls;

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const start = Date.now();

        await axios.get(url, {
          timeout: 10000
        });

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
}
