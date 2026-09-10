import { describe, expect, test } from "bun:test";
import { decodeCopy, parseBackup } from "./convert-backup";

const dump = (rows = "1\tÓrulo 中文\t\\N\t2") => `COPY public.job_history (id, company, end_date, order_index) FROM stdin;
${rows}
\\.
COPY public.education (id) FROM stdin;
1
\\.
COPY public.socials (id) FROM stdin;
1
\\.
`;

describe("PostgreSQL backup conversion", () => {
  test("preserves Unicode, numeric IDs/order, and SQL null", () => {
    expect(parseBackup(dump()).job_history).toEqual([
      { id: 1, company: "Órulo 中文", end_date: null, order_index: 2 },
    ]);
  });

  test("decodes COPY escapes without confusing literal backslashes and null", () => {
    expect(decodeCopy(String.raw`line\nnext\tcolumn\\N`)).toBe("line\nnext\tcolumn\\N");
    expect(decodeCopy(String.raw`\303\251 \xe4\xb8\xad`)).toBe("é 中");
    expect(decodeCopy("")).toBe("");
    expect(decodeCopy("\\N")).toBeNull();
  });

  test("exports only the three public tables, excluding authentication data", () => {
    const sql = `COPY auth.users (id, encrypted_password) FROM stdin;\nprivate\tsecret\n\\.\n${dump()}`;
    expect(Object.keys(parseBackup(sql)).sort()).toEqual(["education", "job_history", "socials"]);
  });

  test("rejects malformed rows and duplicate IDs", () => {
    expect(() => parseBackup(dump("1\ttoo-short"))).toThrow("Invalid COPY row");
    expect(() => parseBackup(dump("1\tA\t\\N\t1\n1\tB\t\\N\t2"))).toThrow("duplicate ID");
  });

  test("rejects invalid/unsafe integers instead of losing precision", () => {
    expect(() => parseBackup(dump("9007199254740993\tA\t\\N\t1"))).toThrow("Invalid integer");
    expect(() => parseBackup(dump("1\tA\t\\N\t"))).toThrow("Invalid integer");
  });

  test("rejects truncated dumps and missing public tables", () => {
    expect(() => parseBackup(dump().trimEnd().slice(0, -3))).toThrow("Unterminated COPY");
    expect(() => parseBackup("")).toThrow("Missing COPY section");
  });
});
