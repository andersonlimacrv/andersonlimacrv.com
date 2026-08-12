/**
 * Theme toggle transition styles — vanilla port of the `createAnimation` helper
 * from Skiper 26 (Theme_buttons_002), adapted to zero-JS Astro.
 *
 * Original uses React + CSS + the View Transition API:
 *   https://developer.chrome.com/docs/web-platform/view-transitions/
 * Original concept from rudrodip — https://github.com/rudrodip/theme-toggle-effect
 * Inspired by toggles.dev. Rebuilt for a vanilla TS client; no framework deps.
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 */

// Apenas a variante `circle`/`center` (sem blur) é usada pelo site. Demais
// variantes (rectangle, gif, polygon, circle-blur, circle com start ≠ center)
// e os helpers getPositionCoords/generateSVG/getTransformOrigin foram
// removidos para emagrecer o bundle do ThemeToggle (13.1 KB → < 6 KB).

interface Animation {
  name: string;
  css: string;
}

export type { Animation };

export function createAnimation(): Animation {
  return {
    name: 'circle-center',
    css: `
       ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }

      ::view-transition-new(root) {
        animation-name: reveal-light;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark;
      }

      @keyframes reveal-dark {
        from {
          clip-path: circle(0% at 50% 50%);
        }
        to {
          clip-path: circle(100.0% at 50% 50%);
        }
      }

      @keyframes reveal-light {
        from {
           clip-path: circle(0% at 50% 50%);
        }
        to {
          clip-path: circle(100.0% at 50% 50%);
        }
      }
      `,
  };
}
