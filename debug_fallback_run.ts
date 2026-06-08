import fs from "fs";
import axios from "axios";

async function run() {
  const db = JSON.parse(fs.readFileSync("db-fallback.json", "utf8"));
  const userAccessToken = db.sessions?.["fb_perseusbotx_gmail_com"]?.userAccessToken;
  
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  
  if (!userAccessToken) {
    console.log("No token found.");
    return;
  }
  
  if (!appId || !appSecret) {
    console.log("Facebook App ID or Secret missing from env.");
    return;
  }
  
  console.log("Using access token starting with:", userAccessToken.substring(0, 10));
  
  let rawPages: any[] = [];
  try {
    // Standard fetch
    const res = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${encodeURIComponent(userAccessToken)}&fields=name,id,access_token&limit=250`);
    rawPages = res.data?.data || [];
    console.log("Standard accounts count retrieved:", rawPages.length);
  } catch (err: any) {
    console.error("Standard fetch failed:", err.message);
  }

  try {
    console.log("[FB Pages Direct Fetch Fallback] Calling debug_token to resolve any missing pages...");
    const debugRes = await axios.get(`https://graph.facebook.com/debug_token`, {
      params: {
        input_token: userAccessToken,
        access_token: `${appId}|${appSecret}`
      },
      timeout: 15000
    });
    
    const granularScopes = debugRes.data?.data?.granular_scopes || [];
    const authorizedPageIds = new Set<string>();
    
    for (const s of granularScopes) {
      if (s.scope === "pages_show_list" && Array.isArray(s.target_ids)) {
        for (const id of s.target_ids) {
          if (id) {
            authorizedPageIds.add(String(id));
          }
        }
      }
    }
    
    console.log(`[FB Pages Direct Fetch Fallback] Found ${authorizedPageIds.size} authorized Page IDs in token scopes.`);
    
    if (authorizedPageIds.size > 0) {
      const rawPagesIds = new Set(rawPages.map((p: any) => String(p.id)));
      const missingPageIds = Array.from(authorizedPageIds).filter(id => !rawPagesIds.has(id));
      
      console.log(`[FB Pages Direct Fetch Fallback] Found ${missingPageIds.length} missing page IDs. Fetching them directly...`);
      
      if (missingPageIds.length > 0) {
        // Fetch them directly
        const directFetchPromises = missingPageIds.map(async (pageId) => {
          try {
            const pageUrl = `https://graph.facebook.com/v19.0/${pageId}?access_token=${encodeURIComponent(userAccessToken)}&fields=name,id,access_token,category,is_published`;
            const pageRes = await axios.get(pageUrl, { timeout: 15000 });
            if (pageRes.data && pageRes.data.id) {
              console.log(`[FB Pages Direct Fetch Fallback] Successfully fetched missing page: ${pageRes.data.name} (${pageId})`);
              return pageRes.data;
            }
          } catch (pageErr: any) {
            console.error(`[FB Pages Direct Fetch Fallback] Direct fetch failed for page ID ${pageId}:`, pageErr.response?.data || pageErr.message);
          }
          return null;
        });
        
        const directFetchedPages = await Promise.all(directFetchPromises);
        const validDirectPages = directFetchedPages.filter((p: any) => p !== null);
        console.log(`Fetched ${validDirectPages.length} missing pages.`);
      }
    }
  } catch (err: any) {
    console.error("Direct fallback debug error:", err.response?.data || err.message);
  }
}

run();
