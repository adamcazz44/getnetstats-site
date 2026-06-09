// Serves /ads.txt. Generated from NEXT_PUBLIC_ADSENSE_CLIENT at build time so
// it auto-populates once the AdSense publisher id is set — no manual file edit.
export const dynamic = "force-static";

// Google's fixed AdSense certification-authority id for ads.txt.
const GOOGLE_CERT_ID = "f08c47fec0942fa0";

export function GET(): Response {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // e.g. ca-pub-1234567890123456
  const pub = client?.replace(/^ca-/, ""); // -> pub-1234567890123456

  const body = pub
    ? `google.com, ${pub}, DIRECT, ${GOOGLE_CERT_ID}\n`
    : "# ads.txt — set NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-…) to authorize Google AdSense\n";

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
