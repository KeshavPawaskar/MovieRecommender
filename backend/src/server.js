const http = require("node:http");
const { getOptions, getRecommendations } = require("./services/recommendationService");

const port = Number(process.env.PORT || 4000);

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);

  if (url.pathname === "/api/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (url.pathname === "/api/options") {
    sendJson(res, 200, getOptions());
    return;
  }

  if (url.pathname === "/api/recommendations") {
    sendJson(res, 200, getRecommendations(Object.fromEntries(url.searchParams)));
    return;
  }

  sendJson(res, 404, { error: "Route not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`MovieRecommender API running at http://localhost:${port}`);
});
