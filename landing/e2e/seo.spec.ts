import { test, expect } from '@playwright/test';

test.describe('SEO Metadata', () => {
  test('homepage has correct SEO tags', async ({ page }) => {
    await page.goto('/');

    // Title
    await expect(page).toHaveTitle(/AIReady/);

    // Meta Description
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).toContain('AI');

    // Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /AIReady/
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'website'
    );

    // Open Graph Image
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toContain('logo-text.png');

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
  });

  test('blog index has correct SEO tags', async ({ page }) => {
    await page.goto('/blog');

    await expect(page).toHaveTitle(/Blog - AIReady/);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).toContain('AI-assisted development');

    // Open Graph Image
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toContain('logo-text.png');
  });

  test('blog post has correct SEO tags and schema', async ({ page }) => {
    // Navigate to the newest post
    await page.goto('/blog/the-agentic-wall');

    await expect(page).toHaveTitle(/The Agentic Wall/);

    // Open Graph Image
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    // For blog posts we expect a custom image, falling back to logo-text.png if not present
    // but the-agentic-wall has agentic-shift-series-1.png as its image
    expect(ogImage).toContain('agentic-shift-series-1.png');

    // Twitter
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );

    // Schema.org JSON-LD
    const schema = await page
      .locator('script[id="article-schema"]')
      .innerHTML();
    const schemaObj = JSON.parse(schema);
    expect(schemaObj['@type']).toBe('Article');
    expect(schemaObj['headline']).toContain('The Agentic Wall');
  });

  test('docs page has correct SEO tags', async ({ page }) => {
    await page.goto('/docs');
    await expect(page).toHaveTitle(/Documentation - AIReady/);

    // Open Graph Image
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogImage).toContain('logo-text.png');

    // Twitter Card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
  });
});
