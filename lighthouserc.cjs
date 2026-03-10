const projectDetailUrl = process.env.LHCI_PROJECT_DETAIL_URL || 'http://127.0.0.1:3000/projects'

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: [
        'http://127.0.0.1:3000/',
        'http://127.0.0.1:3000/projects',
        projectDetailUrl,
      ],
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.98 }],
        'categories:seo': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'label-content-name-mismatch': 'error',
        'link-name': 'error',
        'lcp-lazy-loaded': 'error',
        'render-blocking-resources': ['error', { maxNumericValue: 100 }],
        'unused-javascript': ['warn', { maxNumericValue: 25000 }],
        'legacy-javascript': ['warn', { maxNumericValue: 12000 }],
        'bf-cache': 'warn',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%',
    },
  },
}
