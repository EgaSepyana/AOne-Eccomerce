module.exports = {
  ci: {
    collect: {
      startServerCommand:
        "NEXT_PUBLIC_MOCK_LATENCY=0 bun run build && bunx next start -p 3200",
      url: [
        "http://127.0.0.1:3200/",
        "http://127.0.0.1:3200/c/wanita",
        "http://127.0.0.1:3200/p/kaos-katun-supima-crew-neck-pria",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "mobile",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
    },
  },
};
