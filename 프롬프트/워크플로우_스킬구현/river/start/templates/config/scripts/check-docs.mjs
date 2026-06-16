#!/usr/bin/env node
// 얇은 문서 센서: 기획 문서가 올바른 폴더에 + 템플릿 필수 헤딩을 갖췄는지 검사.
// "그래야 한다(가이드)"를 "안 하면 막힌다(벽)"로. CI/pre-commit에서 실행.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const RULES = {
  "docs/specs": ["## 목적/배경", "## 사용자·시나리오", "## 범위", "## 수용 기준", "## 필요 데이터"],
  "docs/screens": ["## 목적", "## 진입 경로", "## 구성 요소", "## 상태", "## 인터랙션"],
};

let failed = false;

for (const [dir, required] of Object.entries(RULES)) {
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".md") && f !== "_template.md");
  } catch {
    continue; // 폴더 없으면 통과(아직 문서 없음)
  }
  for (const file of files) {
    const body = await readFile(join(dir, file), "utf8");
    const missing = required.filter((h) => !body.includes(h));
    if (missing.length) {
      failed = true;
      console.error(`✗ ${dir}/${file} — 필수 헤딩 누락: ${missing.join(", ")}`);
    }
  }
}

if (failed) {
  console.error("\n문서 양식 검사 실패. docs/README.md 지도의 템플릿을 따르세요.");
  process.exit(1);
}
console.log("✓ 문서 양식 검사 통과");
