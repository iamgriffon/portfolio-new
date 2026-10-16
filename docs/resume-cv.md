# CV download

The resume exports both public Convex collections, regardless of the selected
UI tab. Contacts come from the existing cached public social-links query. No
mutation, new endpoint, schema migration or backend PDF processing is involved.
The browser imports `@react-pdf/renderer` on click and downloads a Blob URL;
that URL is released after 60 seconds. Errors permit retry and an empty resume
cannot be exported. The success message means the download was initiated, not
that the user saved the file.

The A4 document uses selectable text, one column, conventional section headings,
visible contact URLs and automatic pagination. These choices aid ATS parsing;
compatibility with every proprietary ATS is not guaranteed. The active locale
controls headings, dates, roles, degrees and curated achievements. Missing role
or degree translations retain the existing English fallback. Empty education
achievements are omitted rather than exported in the wrong language.

## Content provenance

Jobs and education always use the current public query results. The source of
truth for curated, translated STAR bullets is `src/lib/resume-achievements.ts`.
The legacy `job_history.achievements` string has no locale contract and is not
silently interpreted as localized content. Adding editable translated STAR
content in Convex would be a separate schema/content change.

The five Ticketbolt bullets use the owner's direct account provided on
2026-10-16, replacing the narrower legacy-session examples. They cover
infrastructure architecture; backoffice capabilities; web/mobile e-commerce;
ticket lifecycle and external integrations; and testing, monitoring, incident
notifications and security hardening. Translations preserve the distinction
between features developed and areas actively contributed to.

The bullets describe context, actions and delivered capabilities. No measured
business impact, availability target, traffic volume or performance improvement
was supplied, so none is asserted. They do not claim complete quantified STAR
stories where the source does not provide those outcomes.

PayPal bullets use the owner's direct account of integrating large clients and
participating in the wallet system sunset and migration to payment solutions.
They do not imply ownership of the migration or claim unreported outcomes.
Órulo, WebHub and Agilizeware use generic role descriptions based on existing
job titles and technology lists, as requested by the owner. These are not
presented as measured STAR accomplishments.

No sufficient legacy evidence was found for Trevo/freelancing in the bounded
search. No additional positions, dates or accomplishments were invented.

## Validation

Run `bun test src/lib/resume-data.test.ts` without lint/typecheck/build.
In the browser, open `/en/resume`, `/pt-BR/resume`, `/es/resume` and `/zh/resume`;
download in each locale and check headings, accents, Chinese glyphs and text
selection. Export from both tabs. Simulate a failed asset request and retry.
Check multi-page documents for clipping, lost text and stranded headings.

No production build, lint or typecheck may run without explicit permission.

### Initial feature validation (before the content revision)

- 27 Bun tests passed (resume data, existing stack scoring and backup converter).
- Chrome downloads completed in Portuguese and Chinese.
- Generated PDFs for all four locales from the current public data (5 jobs,
  3 education records, 6 social links). All have two pages; extracted text and
  page bounds were checked and all pages visually inspected.
- A synthetic 65-bullet document paginated to seven pages with every marker
  preserved and all text inside page margins.
- `git diff --check` passed.

Lint, typecheck and production build were not run because explicit permission
was not given. Safari/Firefox, mobile download behavior and simulated browser
network failures remain unverified. Invalid dates, unsupported locales and empty
input are covered by unit tests, but these do not replace UI failure testing.

The Chinese font asset is approximately 10 MB and fetched only for Chinese
export; the resulting PDF embeds only used glyphs (size varies with content). Font assets and the renderer chunk still require network access on
first use. No resume data is uploaded for generation.

### Ticketbolt content revision, 2026-10-16

The 9 focused resume tests passed after replacing the bullets. PDFs regenerated
in all four locales still have two pages; text extraction and page-bound checks
passed. The updated experience sections were visually reviewed. No lint,
typecheck or build was executed.

## Current postgraduate study

The owner confirmed current enrollment at uniPDS on 2026-10-16. The official
[Applied AI Engineering program page](https://unipds.com.br/tf-pos-ia/) was
consulted that day for the program title and curriculum. The PDF lists the
program first in education, in progress, with a short course-topic description
in all four locales. Topics are curriculum, not claimed completed achievements.
The owner confirmed an enrollment date of 2026-02-20, displayed as month/year.
No expected graduation date, certificate or academic credit hours are inferred. The source advertises a partnership with Anhanguera, but
the CV does not claim an awarded qualification or certificate.

A fallback PDF entry lives in `src/lib/resume-education.ts`. The matching
Convex record takes priority and the fallback is omitted to avoid duplication.

### Convex education record

On 2026-10-16 the uniPDS course was appended to the `education` table in
`cautious-chihuahua-297`, with all four translations, `start_date: 2026-02-20`,
`end_date: null`, legacy `id: 4` and `order_index: 0`. The official course URL
is stored; no certificate URL is claimed. The public query returned four
education records, the previous three matched the pre-import snapshot exactly,
and the CV adapter returned exactly one uniPDS entry using the database record.
The course now also appears in the website's education tab. No schema change,
function deployment, lint, typecheck or build was required.

The owner subsequently added RAG, neural networks and vector databases to the
course topics, and TensorFlow, Python, MCP, Neo4j, PostgreSQL and Markdown to
technologies. These updates and topic capitalization are synchronized across
the four locales in Convex and the local fallback. The course-description
prefix was removed. All 11 focused resume tests passed after these updates.
