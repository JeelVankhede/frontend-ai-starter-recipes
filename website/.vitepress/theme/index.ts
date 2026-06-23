import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { useRouter } from 'vitepress';
import { defineComponent, onMounted, h } from 'vue';
import './style.css';

const CONSENT_KEY = 'cookie_consent';

const CookieBanner = defineComponent({
  setup() {
    onMounted(() => {
      if (localStorage.getItem(CONSENT_KEY)) return;

      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.style.cssText =
        'position:fixed;bottom:0;left:0;right:0;background:#1e1e1e;color:#ccc;' +
        'padding:12px 20px;display:flex;align-items:center;gap:16px;font-size:13px;' +
        'z-index:9999;border-top:1px solid #333';
      banner.innerHTML = `
        <span style="flex:1">This site uses cookies for anonymous usage analytics. No personal data is collected.</span>
        <button id="cc-accept" style="background:#3b82f6;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:13px">Accept</button>
        <button id="cc-decline" style="background:transparent;color:#aaa;border:1px solid #555;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:13px">Decline</button>
      `;
      document.body.appendChild(banner);

      document.getElementById('cc-accept')?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        banner.remove();
        (window as any).mixpanel?.track?.('page_view', {
          source: 'docs',
          path: window.location.pathname,
          title: document.title,
          referrer: document.referrer,
        });
      });
      document.getElementById('cc-decline')?.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        (window as any).mixpanel?.opt_out_tracking?.();
        banner.remove();
      });
    });
    return () => null;
  },
});

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(CookieBanner),
    });
  },

  setup() {
    if (typeof window !== 'undefined') {
      const router = useRouter();
      router.onAfterRouteChanged = (to: string) => {
        (window as any).mixpanel?.track?.('page_view', {
          source: 'docs',
          path: to,
          title: document.title,
          referrer: document.referrer,
        });
      };
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
        (window as any).mixpanel?.track?.('page_view', {
          source: 'docs',
          path: window.location.pathname,
          title: document.title,
          referrer: document.referrer,
        });
      }
    }
  },
} satisfies Theme;
