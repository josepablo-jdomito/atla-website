import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const token = process.env.SANITY_WRITE_TOKEN || (JSON.parse(readFileSync(join(homedir(), ".config/sanity/config.json"), "utf8")) as any).authToken;
const client = createClient({ projectId: "dvufm78f", dataset: "production", apiVersion: "2023-10-01", token, useCdn: false });
const R: Array<[string, string]> = [
  ["We made it in 2022 at MK+2, José Pablo's studio before Atla, working with Elipsis Arquitectos.", "We made it in 2022, working with Elipsis Arquitectos."],
  ["We made it in 2022 at MK+2, José Pablo's studio before Atla.", "We made it in 2022."],
  ["In 2021 it came to MK+2, José Pablo's studio before Atla, for a strategy and an identity.", "In 2021 it came to us for a strategy and an identity."],
  ["The brand was made at MK+2, his studio before Atla, before the doors opened.", "The brand was made before the doors opened."],
  ["In 2022 Brittany brought it to MK+2, José Pablo's studio before Atla, to rebrand it", "In 2022 Brittany brought it to us to rebrand it"],
  ["described MK+2 to contacts at a16z", "described us to contacts at a16z"],
  ["MK+2, José Pablo's studio before Atla, took it on that spring, as the studio was starting", "We took it on that spring, as the studio was starting"],
  ["In 2023 the team came to MK+2, José Pablo's studio before Atla, on a referral", "In 2023 the team came to us on a referral"],
  ["We made it at MK+2, José Pablo's studio before Atla, between 2020 and 2021,", "We made it between 2020 and 2021,"],
  ["In 2021 they asked MK+2, José Pablo's studio before Atla, for an identity", "In 2021 they asked us for an identity"],
  ["Through the following year, MK+2 sent it to prospective clients as a sample of its work.", "Through the following year, we sent it to prospective clients as a sample of our work."],
  ["Suhail Alameri brought it to MK+2, José Pablo's studio before Atla, in 2021.", "Suhail Alameri brought it to us in 2021."],
  ["MK+2 used the work as one of its sales cases", "We used the work as one of our sales cases"],
  ["In 2022 the team came to MK+2, José Pablo's studio before Atla, after trying", "In 2022 the team came to us after trying"],
  ["they came to MK+2, José Pablo's studio before Atla, for a brand", "they came to us for a brand"],
];
const fix = (s: string) => R.reduce((t, [a, b]) => t.split(a).join(b), s);
async function main() {
  const write = process.argv.includes("--write");
  const docs: any[] = await client.fetch(`*[_type=="project" && (description match "MK*" || pt::text(caseStudy) match "MK*")]{_id,"slug":slug.current,description,caseStudy}`);
  for (const d of docs) {
    const desc = fix(d.description ?? "");
    const cs = (d.caseStudy ?? []).map((b: any) => b._type === "block" ? { ...b, children: (b.children ?? []).map((c: any) => ({ ...c, text: fix(c.text ?? "") })) } : b);
    const left = (desc + " " + cs.map((b: any) => (b.children ?? []).map((c: any) => c.text).join("")).join(" ")).match(/MK\s*\+?\s*2/g);
    console.log(`${write ? "patch" : "would"} ${d.slug}${left ? `  STILL: ${left.length}` : ""}`);
    if (write) await client.patch(d._id).set({ description: desc, caseStudy: cs }).commit();
  }
  console.log(write ? `${docs.length} patched` : "dry run");
}
main().catch((e) => { console.error(e); process.exit(1); });
