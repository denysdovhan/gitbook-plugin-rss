import title from 'get-md-title';
import desc  from 'get-md-desc';
import RSS   from 'rss';
import { writeFileSync as write } from 'fs';
import { resolve } from 'path';

// Define variables
let site, feed;

export default {
  website: {
    assets: './assets',
    js: [ 'plugin.js' ]
  },

  hooks: {
    // Get and init RSS configuration
    'init': function () {
      site = this.config.options.pluginsConfig.rss;
      feed = new RSS(site);
    },

    // Collect all pages
    'page': function (page) {
      // If README.md, then change it to root
      const url = site.site_url +
        ( page.path === 'README.md'
        ? ''
        : page.path.replace(/.md$/,'.html'));

      feed.item({
        title: title(page.content).text,
        description: desc(page.content).text,
        url,
        author: site.author
      });

      return page;
    },

    // Generate XML and write to file
    'finish': function () {
      const xml = feed.xml({ indent: true });
      write(resolve(this.options.output, 'rss.xml'), xml, 'utf-8');
    }
  }
};
