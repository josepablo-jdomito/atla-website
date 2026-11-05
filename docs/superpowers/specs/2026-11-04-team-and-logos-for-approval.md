# Team and logos for JP's approval

Date: 2026-11-04 · Status: waiting on JP · Nothing here is published until JP approves it.

**Recommendation:** publish the team as it is today minus Paola while she is on leave, and show client names as type in place of logos, because no logo files exist yet.

## Team (About page)

| Name | Role | City | Source (read 2026-11-04) |
|---|---|---|---|
| José Pablo Domínguez | Founder & Creative Director | not recorded | `client/src/pages/AtlaAbout.tsx:48`, `client/public/llms.txt:3` |
| Paola Díaz | COO | not recorded | `AtlaAbout.tsx:49` (on leave since 2026-10-08) |
| Levi Ramírez | Head of Growth | not recorded | `AtlaAbout.tsx:50` |
| Mariela Alata | Project Manager | not recorded | `AtlaAbout.tsx:51` |
| Tais Kahatt | Art Director | not recorded | `AtlaAbout.tsx:52` |
| Adriana Méndez | Brand Designer | not recorded | `AtlaAbout.tsx:53` |
| José Aceves Covarrubias | Brand Designer | not recorded | `AtlaAbout.tsx:54` |

- Studio cities: Austin, Mexico City, Barcelona, Lima, Caracas (`client/public/llms.txt:3`).
- There is no per-person city anywhere in the repo, so the page lists the cities once rather than per person.
- Attio workspace members: only JP (`josepablo@atla.design`, admin), so Attio adds no names.

## Clients for the logo row

- Source: Sanity `project` documents with `status == "published"`, read 2026-11-04 from the public API.
- No project has a logo field, and the repo has no client logo files. The only logo files in it belong to the /audit pages, which are prospects, not clients.

| Client | Project slug | Featured | Logo file |
|---|---|---|---|
| Acre Resort | rustico | yes | none |
| Alma Brava | alma-brava | yes | none |
| Anything AI | anything-ai | yes | none |
| Hanks Leather | hanks-leather | yes | none |
| Pax & Beneficia | pax-and-beneficia | yes | none |
| Reggie | reggie | yes | none |
| Tequila Unido | tequila-unido | yes | none |
| TigreTigre | tigretigre | yes | none |
| Ando | ando | no | none |
| Bovi Health | bovi-health | no | none |
| Castro Capital | castro-capital | no | none |
| Conscious Care Co | conscious-care-co | no | none |
| Huémac | huemac | no | none |
| Oxylife | oxylife | no | none |
| Pathize Health | pathize-health | no | none |
| Peachy Patients | peachy-patients | no | none |
| Persona Nutrition | persona | no | none |
| PuppyPy | puppypy | no | none |
| Shop Latinx | shop-latinx | no | none |
| The Bridge | the-bridge | no | none |
| The Internet Empires | the-internet-empires | no | none |

- The Atla project (slug `atla`) is left out of this list because it is our own brand.
- Permission note: every client here is shown on the current site as a case study already. A name in a client row adds nothing new.

## After approval
Fill `siteCopy.about.team` and the home logo row in one follow-up commit. While the list stays empty, the row stays hidden (`LogoRow` renders nothing).

Decision: JP approves the team list and picks how the client row shows.
