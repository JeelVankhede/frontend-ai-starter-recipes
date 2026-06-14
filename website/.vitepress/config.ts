import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

export default withMermaid(
  defineConfig({
    title: 'Fare — Frontend Ai starter REcipes',
    description:
      'Documentation for frontend-ai-starter-recipes — AI agent rules, skills, and workflows for frontend projects.',
    base: '/frontend-ai-starter-recipes/',
    outDir: '.vitepress/dist',

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
          text: 'GitHub',
          link: 'https://github.com/JeelVankhede/frontend-ai-starter-recipes',
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
