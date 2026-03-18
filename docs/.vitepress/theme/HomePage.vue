<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">
          <span class="version-tag">V3.1</span>
          <span class="tech-tags">TypeScript Library / CLI / MCP</span>
        </div>
        <h1 class="hero-title">builtwith-api</h1>
        <p class="hero-tagline">
          A typed TypeScript wrapper for the BuiltWith API. Query technology
          data from your code, your terminal, or your AI assistant.
        </p>
        <div class="hero-actions">
          <div class="install-pill">
            <span class="dollar">$</span>
            <span>npm install builtwith-api</span>
          </div>
          <a class="btn btn-outline" href="/guide/">Get Started</a>
          <a class="btn btn-outline" href="/api/">API Reference</a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="features-inner">
        <div class="features-header">
          <span class="features-label">THREE WAYS TO USE IT</span>
          <h2 class="features-title">One package, three interfaces.</h2>
        </div>
        <div class="features-grid">
          <a class="feature-card" href="/guide/library">
            <span class="feature-tag">LIBRARY</span>
            <h3>TypeScript SDK</h3>
            <p>
              Import createClient and call any of 13 endpoints. Typed responses
              validated with Zod — no guessing at API shapes.
            </p>
            <div class="feature-code">const data = await client.free("google.com")</div>
          </a>
          <a class="feature-card" href="/cli">
            <span class="feature-tag">CLI</span>
            <h3>Command Line</h3>
            <p>
              Query the BuiltWith API from your terminal. Supports all 13 methods
              with flags for every parameter.
            </p>
            <div class="feature-code">$ builtwith domain example.com</div>
          </a>
          <a class="feature-card" href="/mcp">
            <span class="feature-tag">MCP</span>
            <h3>AI Assistant</h3>
            <p>
              Give Claude, Cursor, or any MCP-compatible tool direct access to
              BuiltWith lookups. Just add the config and ask.
            </p>
            <div class="feature-code">npx -y builtwith-mcp</div>
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home-page {
  max-width: 100%;
}

/* ── Hero ── */
.hero {
  padding: 80px 24px 64px;
  max-width: 960px;
  margin: 0 auto;
}
.hero-inner {
  max-width: 640px;
}
.hero-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.version-tag {
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
  letter-spacing: 0.02em;
}
.tech-tags {
  color: var(--vp-c-text-2);
  font-size: 14px;
}
.hero-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0 0 20px;
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-tagline {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 40px;
  max-width: 480px;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.install-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 8px;
  user-select: all;
}
.install-pill .dollar {
  opacity: 0.5;
}
.btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}
.btn-outline {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: transparent;
}
.btn-outline:hover {
  border-color: var(--vp-c-text-2);
}

/* ── Features ── */
.features {
  padding: 0 24px 80px;
  max-width: 960px;
  margin: 0 auto;
}
.features-header {
  margin-bottom: 32px;
}
.features-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}
.features-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--vp-c-text-1);
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s;
}
.feature-card:hover {
  border-color: var(--vp-c-text-3);
}
.feature-tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: 4px;
}
.feature-card h3 {
  font-family: "Space Grotesk", sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}
.feature-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
  flex: 1;
}
.feature-code {
  margin-top: 20px;
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
