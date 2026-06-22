2:42:54 PM: Netlify Build                                                 
2:42:54 PM: ────────────────────────────────────────────────────────────────
2:42:54 PM: ​
2:42:54 PM: ❯ Version
2:42:54 PM:   @netlify/build 36.0.0
2:42:54 PM: ​
2:42:54 PM: ❯ Flags
2:42:54 PM:   accountId: 688af72ac994b737a7a70d9f
2:42:54 PM:   baseRelDir: true
2:42:54 PM:   buildId: 6a3507ff114aa935a1a2baf8
2:42:54 PM:   deployId: 6a3507ff114aa935a1a2bafa
2:42:54 PM: ​
2:42:54 PM: ❯ Current directory
2:42:54 PM:   /opt/build/repo
2:42:54 PM: ​
2:42:54 PM: ❯ Config file
2:42:54 PM:   /opt/build/repo/netlify.toml
2:42:54 PM: ​
2:42:54 PM: ❯ Context
2:42:54 PM:   production
2:42:54 PM: ​
2:42:54 PM: ❯ Installing extensions
2:42:54 PM:    - neon
2:43:07 PM: ​
2:43:07 PM: ❯ Using Next.js Runtime - v5.15.12
2:43:07 PM: ​
2:43:07 PM: ❯ Loading extensions
2:43:07 PM:    - neon
2:43:09 PM: No Next.js cache to restore
2:43:09 PM: ​
2:43:09 PM: build.command from netlify.toml                               
2:43:09 PM: ────────────────────────────────────────────────────────────────
2:43:09 PM: ​
2:43:09 PM: $ npm run build
2:43:09 PM: > para-games-report@0.1.0 build
2:43:09 PM: > next build
2:43:09 PM: ⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
2:43:09 PM: ▲ Next.js 16.2.9 (Turbopack)
2:43:09 PM:   Creating an optimized production build ...
2:43:14 PM: ✓ Compiled successfully in 4.8s
2:43:14 PM:   Running TypeScript ...
2:43:18 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
2:43:17 PM:   Finished TypeScript in 2.7s ...
2:43:17 PM:   Collecting page data using 2 workers ...
2:43:17 PM:   Generating static pages using 2 workers (0/11) ...
2:43:17 PM: Error occurred prerendering page "/admin/login". Read more: https://nextjs.org/docs/messages/prerender-error
2:43:17 PM: TypeError: Invalid URL
2:43:17 PM:     at c.default (.next/server/chunks/ssr/_047gjxt._.js:1:18554)
2:43:17 PM:     at module evaluation (.next/server/chunks/ssr/_047gjxt._.js:1:26418)
2:43:17 PM:     at instantiateModule (.next/server/chunks/ssr/[turbopack]_runtime.js:853:9)
2:43:17 PM:     at getOrInstantiateModuleFromParent (.next/server/chunks/ssr/[turbopack]_runtime.js:877:12)
2:43:17 PM:     at Context.esmImport [as i] (.next/server/chunks/ssr/[turbopack]_runtime.js:281:20)
2:43:17 PM:     at module evaluation (.next/server/chunks/ssr/_047gjxt._.js:1:30769)
2:43:17 PM:     at instantiateModule (.next/server/chunks/ssr/[turbopack]_runtime.js:853:9)
2:43:17 PM:     at getOrInstantiateModuleFromParent (.next/server/chunks/ssr/[turbopack]_runtime.js:877:12)
2:43:17 PM:     at Context.commonJsRequire [as r] (.next/server/chunks/ssr/[turbopack]_runtime.js:302:12) {
2:43:17 PM:   code: 'ERR_INVALID_URL',
2:43:17 PM:   input: '',
2:43:17 PM:   digest: '322069288'
2:43:17 PM: }
2:43:17 PM: Export encountered an error on /admin/login/page: /admin/login, exiting the build.
2:43:17 PM: ⨯ Next.js build worker exited with code: 1 and signal: null
2:43:18 PM: ​
2:43:18 PM: "build.command" failed                                        
2:43:18 PM: ────────────────────────────────────────────────────────────────
2:43:18 PM: ​
2:43:18 PM:   Error message
2:43:18 PM:   Command failed with exit code 1: npm run build (https://ntl.fyi/exit-code-1)
2:43:18 PM: ​
2:43:18 PM:   Error location
2:43:18 PM:   In build.command from netlify.toml:
2:43:18 PM:   npm run build
2:43:18 PM: ​
2:43:18 PM:   Resolved config
2:43:18 PM:   build:
2:43:18 PM:     command: npm run build
2:43:18 PM:     commandOrigin: config
2:43:18 PM:     environment:
2:43:18 PM:       - ADMIN_EMAIL
2:43:18 PM:       - ADMIN_PASSWORD
2:43:18 PM:       - DATABASE_URL
2:43:18 PM:       - NEXTAUTH_SECRET
2:43:18 PM:       - NEXTAUTH_URL
2:43:18 PM:     publish: /opt/build/repo/.next
2:43:18 PM:     publishOrigin: config
2:43:18 PM:   plugins:
2:43:18 PM:     - inputs: {}
2:43:18 PM:       origin: config
2:43:18 PM:       package: "@netlify/plugin-nextjs"
2:43:18 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
2:43:18 PM: Failing build: Failed to build site
2:43:18 PM: Finished processing build request in 46.994s