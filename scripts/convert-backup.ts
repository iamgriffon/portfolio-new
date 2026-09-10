import { gunzipSync } from "node:zlib";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const tables = ["job_history", "education", "socials"] as const;
type Row = Record<string, string | number | null>;

// Decode PostgreSQL COPY text, keeping SQL NULL distinct from a literal \N.
export function decodeCopy(value: string): string | null {
  if (value === "\\N") return null;
  const escapes: Record<string, number> = {
    b: 8, f: 12, n: 10, r: 13, t: 9, v: 11,
  };
  const bytes: number[] = [];
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== "\\") {
      const character = String.fromCodePoint(value.codePointAt(i)!);
      bytes.push(...Buffer.from(character));
      i += character.length - 1;
      continue;
    }
    if (++i >= value.length) throw new Error("Incomplete COPY escape");
    const number = value.slice(i).match(/^(?:[0-7]{1,3}|x[0-9a-fA-F]{1,2})/);
    if (number) {
      bytes.push(number[0][0] === "x"
        ? parseInt(number[0].slice(1), 16)
        : parseInt(number[0], 8));
      i += number[0].length - 1;
    } else {
      bytes.push(...(escapes[value[i]] === undefined
        ? Buffer.from(value[i])
        : [escapes[value[i]]]));
    }
  }
  return Buffer.from(bytes).toString("utf8");
}

export function parseBackup(sql: string): Record<string, Row[]> {
  const result: Record<string, Row[]> = {};
  const lines = sql.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const header = lines[i].match(/^COPY public\.(job_history|education|socials) \((.+)\) FROM stdin;$/);
    if (!header) continue;
    const [, table, columnsText] = header;
    if (result[table]) throw new Error(`Duplicate COPY section: ${table}`);
    const columns = columnsText.split(", ");
    if (!columns.includes("id") || new Set(columns).size !== columns.length) {
      throw new Error(`Invalid columns: ${table}`);
    }
    const rows: Row[] = [];
    const ids = new Set<number>();
    for (i++; i < lines.length && lines[i] !== "\\."; i++) {
      const values = lines[i].split("\t");
      if (values.length !== columns.length) throw new Error(`Invalid COPY row: ${table}, line ${i + 1}`);
      const row: Row = {};
      columns.forEach((column, index) => {
        const value = decodeCopy(values[index]);
        if (value !== null && (column === "id" || column === "order_index")) {
          if (!/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
            throw new Error(`Invalid integer: ${table}.${column}`);
          }
          row[column] = Number(value);
        } else {
          row[column] = value;
        }
      });
      if (typeof row.id !== "number" || ids.has(row.id)) throw new Error(`Invalid or duplicate ID: ${table}`);
      ids.add(row.id);
      rows.push(row);
    }
    if (i === lines.length) throw new Error(`Unterminated COPY section: ${table}`);
    result[table] = rows;
  }
  for (const table of tables) {
    if (!result[table]) throw new Error(`Missing COPY section: ${table}`);
  }
  return result;
}

if (import.meta.main) {
  const [input, output = "backup/convex"] = process.argv.slice(2);
  if (!input) throw new Error("Usage: bun run backup:convert <dump.backup.gz> [output-directory]");
  const data = parseBackup(gunzipSync(await readFile(input)).toString("utf8"));
  await mkdir(output, { recursive: true });
  for (const table of tables) {
    await writeFile(resolve(output, `${table}.jsonl`),
      data[table].map((row) => JSON.stringify(row)).join("\n") + (data[table].length ? "\n" : ""));
    console.log(`${table}: ${data[table].length} records`);
  }
}
