# Accessibility Skill — AuditKit

This skill is auto-included in the generated ZIP when the Accessibility pillar score is below 90.

## WCAG 2.1 Quick Reference

The most common failures caught by Lighthouse (axe-core):

## Images

```html
<!-- Every <img> needs meaningful alt text -->
<img src="/hero.jpg" alt="Team working in a modern office">

<!-- Decorative images use empty alt -->
<img src="/divider.svg" alt="" role="presentation">

<!-- Next.js -->
<Image src="/hero.jpg" alt="Team working in a modern office" width={1200} height={600} />
```

## Colour Contrast

- Normal text: minimum **4.5:1** contrast ratio
- Large text (18px+): minimum **3:1**
- UI components (buttons, borders): minimum **3:1**

```css
/* Bad — grey text on white */
color: #999999; /* 2.85:1 — fails */

/* Good */
color: #767676; /* 4.54:1 — passes AA */
```

Check contrast: https://webaim.org/resources/contrastchecker/

## Interactive Elements

```html
<!-- Buttons must have accessible labels -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- Links must be descriptive -->
<!-- Bad: -->
<a href="/post">Read more</a>
<!-- Good: -->
<a href="/post">Read more about Core Web Vitals</a>

<!-- Form inputs need labels -->
<label for="email">Email address</label>
<input id="email" type="email" name="email">
```

## Keyboard Navigation

```tsx
// All interactive elements must be keyboard accessible
// Use native elements when possible (button, a, input)
// If using div/span for clicks, add:
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

## ARIA

```html
<!-- Navigation landmark -->
<nav aria-label="Main navigation">...</nav>

<!-- Skip link (place first in body) -->
<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>

<!-- Live regions for dynamic content -->
<div aria-live="polite" aria-atomic="true">
  <!-- Content that updates dynamically -->
</div>

<!-- Modal -->
<dialog aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
  ...
</dialog>
```

## Tailwind CSS Utilities

```html
<!-- Screen reader only text -->
<span class="sr-only">Loading...</span>

<!-- Focus visible (don't remove outlines!) -->
<button class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">...</button>
```

## Testing

```bash
# Install axe-core browser extension for manual testing
# Or run Lighthouse in Chrome DevTools → Accessibility

# Automated: axe-playwright
npm install @axe-core/playwright
```

```typescript
import { checkA11y } from 'axe-playwright'
test('home page passes accessibility', async ({ page }) => {
  await page.goto('/')
  await checkA11y(page)
})
```
