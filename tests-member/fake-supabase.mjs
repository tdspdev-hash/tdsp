// Local stand-in for Supabase Auth and REST, for member-portal tests. Synthetic data only.
// It does NOT implement Row Level Security: it lets the tests check what the app asks for.
import http from "node:http";

const USERS = {
  "member@example.com": { id: "00000000-0000-4000-8000-000000000001", name: "Mwanachama Wa Majaribio", member: true, category: "hai" },
  "applicant@example.com": { id: "00000000-0000-4000-8000-000000000002", name: "Mwombaji Wa Majaribio" },
  "broken@example.com": { id: "00000000-0000-4000-8000-000000000003", name: "Hitilafu Wa Majaribio", broken: true },
  "sparse@example.com": { id: "00000000-0000-4000-8000-000000000004", name: "Pungufu Wa Majaribio", member: true, category: null },
};
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const exp = Math.floor(Date.now() / 1000) + 3600;
const tokenFor = (email) => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: USERS[email].id, email, role: "authenticated", aud: "authenticated", exp })}.c2ln`;
const userFor = (email) => ({ id: USERS[email].id, email, aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" });
const emailOf = (req) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  return Object.keys(USERS).find((email) => tokenFor(email) === token);
};
const log = [];

http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const send = (code, data) => {
        res.writeHead(code, { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" });
        res.end(data === undefined ? "" : JSON.stringify(data));
      };
      if (req.method === "OPTIONS") return send(204);
      const url = new URL(req.url, "http://x");
      if (url.pathname === "/log") return send(200, log);
      if (url.pathname === "/auth/v1/token") {
        const email = JSON.parse(body || "{}").email;
        if (!USERS[email]) return send(400, { code: "invalid_credentials", message: "Invalid login credentials" });
        return send(200, { access_token: tokenFor(email), token_type: "bearer", expires_in: 3600, expires_at: exp, refresh_token: "r", user: userFor(email) });
      }
      const email = emailOf(req);
      if (url.pathname === "/auth/v1/logout") return send(204);
      if (url.pathname === "/auth/v1/user") return email ? send(200, userFor(email)) : send(401, { message: "no session" });
      if (!url.pathname.startsWith("/rest/v1/")) return send(404, { message: "not faked" });

      log.push({ method: req.method, table: url.pathname.slice(9), query: url.search, as: email ?? null });
      const u = USERS[email];
      if (!u) return send(200, []);
      const table = url.pathname.slice(9);
      if (table === "profiles") {
        if (req.method === "PATCH") return send(200, [{ id: u.id }]);
        return send(200, [{ full_name: u.name, phone: "+255700000000", gender: null, region: "Mkoa wa Majaribio", district: "Wilaya", ward: "Kata", village: null, occupation: null, participation_areas: [] }]);
      }
      if (table === "memberships") {
        if (u.broken) return send(500, { code: "XX000", message: "synthetic failure" });
        return send(200, u.member ? [{ member_number: "TDSP/0001/2026", approved_at: "2026-11-20T09:00:00Z", application_id: "00000000-0000-4000-8000-0000000000a1" }] : []);
      }
      if (table === "membership_applications") return send(200, u.category ? [{ requested_category: u.category, created_at: "2026-11-18T09:00:00Z" }] : []);
      send(200, []);
    });
  })
  .listen(54999);
