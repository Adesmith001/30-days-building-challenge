import { describe, expect, it } from "vitest";
import { parseUnifiedDiff } from "@/lib/analysis/diff";

describe("unified diff parser", () => {
  it("parses changed files and line stats", () => {
    const diff = `
diff --git a/src/api/test.ts b/src/api/test.ts
--- a/src/api/test.ts
+++ b/src/api/test.ts
@@ -1,2 +1,3 @@
-old
+new
+another
`;

    const files = parseUnifiedDiff(diff);

    expect(files).toHaveLength(1);
    expect(files[0].path).toBe("src/api/test.ts");
    expect(files[0].additions).toBe(2);
    expect(files[0].deletions).toBe(1);
    expect(files[0].areas).toContain("API");
  });

  it("detects new files", () => {
    const diff = `
diff --git a/src/new.ts b/src/new.ts
new file mode 100644
--- /dev/null
+++ b/src/new.ts
+hello
`;

    const [file] = parseUnifiedDiff(diff);

    expect(file.status).toBe("added");
  });
});
