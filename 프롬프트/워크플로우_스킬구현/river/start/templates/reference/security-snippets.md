# 레퍼런스: 보안 기반 코드 스니펫 (Phase 5에서 이 패턴 그대로 생성)

> 결정성을 위해 **이 패턴을 그대로** `app/lib/` 에 생성한다. 도메인에 맞게 모델/필드만 조정.

## `app/lib/env.server.ts` — 부팅 시 env 검증
```ts
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// 부팅 시 1회 검증 — 누락/오타면 여기서 즉시 throw(런타임 늦게 터지는 것 방지).
export const env = EnvSchema.parse(process.env);
```

## `app/lib/db.server.ts` — Prisma 싱글톤
```ts
import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient();
if (env.NODE_ENV !== "production") g.prisma = db;
```

## `app/lib/auth.server.ts` — 세션쿠키 + argon2id
```ts
import { createCookieSessionStorage } from "react-router";
import { hash, verify } from "@node-rs/argon2";
import { env } from "./env.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,                          // 항상 ON — JS가 못 읽음(XSS 방어). http에서도 작동.
    sameSite: "lax",                         // CSRF 방어.
    path: "/",
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === "production",   // 로컬(http) false, 운영(https) true.
    maxAge: 60 * 60 * 24 * 7,
  },
});

// OWASP 권장 파라미터대로. 직접 크립토 금지 — 검증된 라이브러리 호출만.
export const hashPassword = (pw: string) =>
  hash(pw, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
export const verifyPassword = (digest: string, pw: string) => verify(digest, pw);
```

## `app/lib/headers.server.ts` — 보안 헤더(root에서 부여)
```ts
export function securityHeaders(): HeadersInit {
  return {
    "Content-Security-Policy":
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  };
}
```

## 신뢰 경계 패턴 — action에서 (route-create 워크플로우)
```ts
import { parseWithZod } from "@conform-to/zod";
import { LoginSchema } from "./login.schema";

export async function action({ request }: Route.ActionArgs) {
  const submission = parseWithZod(await request.formData(), { schema: LoginSchema });
  if (submission.status !== "success") return submission.reply();   // ① 검증
  // ② 인증/인가 가드 → ③ features/auth 서버 함수 호출 → ④ 세션 커밋
}
```
