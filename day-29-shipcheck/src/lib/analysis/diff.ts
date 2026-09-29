import { classifyFile } from "./classify";
import type { ChangedFile } from "@/types/release";

export function parseUnifiedDiff(input: string): ChangedFile[] {
  const lines = input.split(/\r?\n/);
  const files: ChangedFile[] = [];

  let current: ChangedFile | null = null;
  let patch: string[] = [];

  function commitCurrent() {
    if (!current) return;

    current.patch = patch.join("\n");
    current.areas = classifyFile(current.path);
    files.push(current);

    current = null;
    patch = [];
  }

  for (const line of lines) {
    if (line.startsWith("diff --git ")) {
      commitCurrent();

      const match = line.match(
        /^diff --git a\/(.+?) b\/(.+)$/,
      );

      if (!match) continue;

      current = {
        path: match[2],
        status: "modified",
        additions: 0,
        deletions: 0,
        areas: [],
      };

      patch.push(line);
      continue;
    }

    if (!current) continue;

    patch.push(line);

    if (line.startsWith("new file mode")) {
      current.status = "added";
    }

    if (line.startsWith("deleted file mode")) {
      current.status = "deleted";
    }

    if (line.startsWith("rename to ")) {
      current.status = "renamed";
      current.path = line.replace("rename to ", "").trim();
    }

    if (
      line.startsWith("+") &&
      !line.startsWith("+++")
    ) {
      current.additions += 1;
    }

    if (
      line.startsWith("-") &&
      !line.startsWith("---")
    ) {
      current.deletions += 1;
    }
  }

  commitCurrent();

  return files;
}