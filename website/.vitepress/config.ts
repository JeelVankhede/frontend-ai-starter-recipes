import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid(
  defineConfig({
    title: 'Fare',
    description:
      'Documentation for frontend-ai-starter-recipes — AI agent rules, skills, and workflows for frontend projects.',
    base: '/frontend-ai-starter-recipes/',
    outDir: '.vitepress/dist',

    head: [
      [
        'script',
        {},
        `(function(c,a){window.mixpanel=a;var b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";var d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=a[f]=[]:f="mixpanel";g.people=g.people||[];var h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config".split(" ");for(var e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.1})(document,window.mixpanel||[]);
  if ("${process.env.VITE_MIXPANEL_TOKEN ?? ''}") {
    mixpanel.init("${process.env.VITE_MIXPANEL_TOKEN ?? ''}");
  }`,
      ],
    ],

    themeConfig: {
      logo: '/logo.svg',

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/1-the-problem', activeMatch: '/guide/' },
        { text: 'Community', link: '/community/contributing' },
        {
          text: 'Wiki',
          link: 'https://github.com/JeelVankhede/frontend-ai-starter-recipes/wiki',
        },
        {
          text: 'v1.2',
          items: [
            { text: 'v1.2 (current)', link: '/', target: '_self' },
            {
              text: 'v1.1',
              link: 'https://jeelvankhede.github.io/frontend-ai-starter-recipes/v1.1/',
              target: '_self',
            },
          ],
        },
      ],

      sidebar: {
        '/guide/': [
          {
            text: 'Start here',
            items: [
              { text: 'The problem', link: '/guide/1-the-problem' },
              { text: 'How it works', link: '/guide/2-how-it-works' },
              { text: 'Installation', link: '/guide/3-installation' },
              { text: 'Usage', link: '/guide/4-usage' },
              { text: 'Understanding the output', link: '/guide/5-the-output' },
              { text: 'Recommended workflow', link: '/guide/6-workflow' },
              { text: 'Lifecycle in practice', link: '/guide/7-lifecycle-demo' },
            ],
          },
          {
            text: 'Migration',
            items: [
              { text: 'Upgrading to v1.2', link: '/guide/8-migration-v1.2' },
            ],
          },
        ],
        '/community/': [
          {
            text: 'Community',
            items: [{ text: 'Contributing & support', link: '/community/contributing' }],
          },
        ],
      },

      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/JeelVankhede/frontend-ai-starter-recipes',
        },
      ],

      editLink: {
        pattern:
          'https://github.com/JeelVankhede/frontend-ai-starter-recipes/edit/main/website/:path',
        text: 'Edit this page on GitHub',
      },

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © Jeel Vankhede',
      },

      search: {
        provider: 'local',
      },

      outline: {
        level: [2, 3],
      },
    },

    mermaid: {
      theme: 'default',
    },
  }),
);
