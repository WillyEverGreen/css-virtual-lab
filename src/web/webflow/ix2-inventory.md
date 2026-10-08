# Webflow IX2 Interaction Inventory

Comprehensive map of the 31 creative effects extracted from `webflow.04b571216.js`, their event IDs, target selectors, element `data-w-id`s, and owning JSX components.

## 1. Event & ActionList Mappings (from Webflow Engine)

| Effect # | Name | Trigger Type | ActionList / Keyframes | Selector / `data-w-id` | Owning Component |
|---|---|---|---|---|---|
| 1 | Services starburst spin & fade behind pill | Hover (`MOUSE_HOVER`) | a-48 (fade in + 360° rotate over 6s), fade out 50ms | `.service-pill`, `.starburst-service` / `2c3c6caa-4943-9544-af93-d85f23568d46` | `Services.jsx` |
| 2 | Team card wiggle | Hover (`MOUSE_HOVER`) | `jiggle` (±4°, 400ms) / `a-40` | `0611d640-7722-869e-b018-9f9db7824582`, `0611d640-7722-869e-b018-9f9db7824583`, `0611d640-7722-869e-b018-9f9db782458c` | `Team.jsx` |
| 3 | Nav logo jiggle | Hover (`MOUSE_HOVER`) | `jiggle` preset (100ms oscillations) | `.brand .logo` | `Navbar.jsx` |
| 4 | Process badge pulse | Hover (`MOUSE_HOVER`) | `pulse` preset (scale 1.1x) | `0a5893de-1d1f-1540-f479-f938e85b443d`, `0a5893de-1d1f-1540-f479-f938e85b4443`, `0a5893de-1d1f-1540-f479-f938e85b444f` | `Process.jsx` |
| 5 | Work grid super-zoom | Hover (`MOUSE_HOVER`) | a-65 (scale 1.08x, 500ms outQuart) | `.work-card`, `.work-img` | `Work.jsx` |
| 6 | Button text slide | Hover (`MOUSE_HOVER`) | `slideInBottom`, `slideInLeft` | `.nav-link.cta`, `.button-text` | `Navbar.jsx`, `FinalCta.jsx` |
| 7 | Legacy bg/filter shifts | Hover (`MOUSE_HOVER`) | a-51, a-52 | `.testimonial-card`, `.service-card` | `TestimonialsSlider.jsx`, `Services.jsx` |
| 8 | FAQ accordion expand | Click (`MOUSE_CLICK`) | a-63 (height auto, rotate chevron) | `.faq-item`, `.faq-question` | `Pricing.jsx`, `Instructions.tsx` |
| 9 | Seinfeld tooltip close | Click (`MOUSE_CLICK`) | scale-down / removed | `091830ae-d547-ef60-cc67-e4476f72142e` | `SeinfeldTooltip.jsx` (dropped per DEV) |
| 10 | Modal hide & CTA color swap | Click (`MOUSE_CLICK`) | a-76 (background swap) | `.cta.button` | `FinalCta.jsx`, `admin/*` |
| 11 | Hero blobs scroll slide | Scroll (`PAGE_SCROLL`) | a-2, a-4 (blue spark L, red spark R) | `918ece8e-41cc-dd2b-f80b-01212bac40ad`, `918ece8e-41cc-dd2b-f80b-01212bac40b2` | `Hero.jsx` |
| 12 | Corner flourishes drift | Scroll (`PAGE_SCROLL`) | a-5, a-6 (diagonal translate) | `.corner-accent` | `Hero.jsx`, `About.tsx` |
| 13 | Services starburst grow | Scroll (`PAGE_SCROLL`) | `growIn` (scale 0.75 -> 1.0) | `.services-bg-star` / `2c3c6caa-4943-9544-af93-d85f23568d46` | `Services.jsx` |
| 14 | Process green blob rise | Scroll (`PAGE_SCROLL`) | a-32 (translateY & rotate) | `0a5893de-1d1f-1540-f479-f938e85b4437` | `Process.jsx` |
| 15 | Team portraits drift | Scroll (`PAGE_SCROLL`) | a-35, a-36 | `45e13648-2554-c579-a2ff-36ffe3c4a562` | `Team.jsx` (dropped SEC-20) |
| 16 | Contact/footer bubbles | Scroll (`PAGE_SCROLL`) | a-44, a-45 (move & scale) | `09ae60a0-3187-8daf-e653-8ba7bc7b3225` | `ContactFooter.jsx` |
| 17 | Pricing wavy blob enlarge | Scroll (`PAGE_SCROLL`) | a-56, a-77 | `.pricing-wavy-blob` | `Pricing.jsx` |
| 18 | Final-CTA side sparkles | Scroll (`PAGE_SCROLL`) | a-58, a-59 | `62e115fe-bde3-515c-30ec-495db2e83b05` | `Section18.jsx`, `FinalCta.jsx` |
| 19 | Draggable logo rotate | Scroll (`PAGE_SCROLL`) | a-66 | `.drag-logo` | Dropped |
| 20 | Sliding work image | Scroll (`PAGE_SCROLL`) | a-69 | `.work-slider-img` | Dropped |
| 21 | Services pills pop in | Reveal (`SCROLL_INTO_VIEW`) | `pop` (outElastic 1000ms) | `.service-pill` | `Services.jsx` |
| 22 | Process cards staggered bounce | Reveal (`SCROLL_INTO_VIEW`) | `bounce` (outBounce 1000ms) | `0a5893de-1d1f-1540-f479-f938e85b443d..4f` | `Process.jsx` |
| 23 | Pricing savings star pop | Reveal (`SCROLL_INTO_VIEW`) | `pop` / `growIn` | `.savings-star` | `Pricing.jsx`, `Quiz.tsx` |
| 24 | Generic fade/rise reveals | Reveal (`SCROLL_INTO_VIEW`) | a-9, a-10, `slideInBottom` | `.reveal-block` | Multi-page |
| 25 | Hero title slide & float | Reveal (`SCROLL_INTO_VIEW`) | a-11 (slide-in), a-12 (loop float) | `918ece8e-41cc-dd2b-f80b-01212bac40ad` | `Hero.jsx` |
| 26 | Star spinners | Reveal (`SCROLL_INTO_VIEW`) | a-21, a-22 (continuous spin) | `.spin-star` | Multi-page, `NotFound.tsx` |
| 27 | Work image stacks slide | Reveal (`SCROLL_INTO_VIEW`) | a-26, a-27 | `.work-stack` | Dropped |
| 28 | Page load CTA color cycling | Load (`PAGE_START`) | a-76 (color cycle) | `.hero-cta` | `Hero.jsx` |
| 29 | Marquees CSS loops | Pure CSS | keyframe `marquee-horizontal` | `.track-horizontal`, `.track-horizontal.clients` | `CheckerMarqueeTop.jsx`, `App.jsx` |
| 30 | Nav link hover glows | Pure CSS / hover | hover classes `hover-red`, `hover-blue`, etc. | `.nav-link` | `Navbar.jsx` |
| 31 | Slider autoplay | Slider runtime | plyr / slider.js | `.slider-container` | `TestimonialsSlider.jsx` |

## 2. Re-initialization in React (Lifecycle)
When switching routes in React Router:
1. Components mount with static `data-w-id` attributes and Webflow layout classes.
2. `useWebflow()` runs in `useEffect`.
3. Calls `loadWebflowRuntime()` which loads jQuery and `webflow.04b571216.js`.
4. Executes:
   ```js
   window.Webflow.destroy();
   window.Webflow.ready();
   window.Webflow.require('ix2').init();
   document.dispatchEvent(new Event('readystatechange'));
   ```
5. If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, animation triggers are skipped so elements remain at 100% opacity without transformation.
