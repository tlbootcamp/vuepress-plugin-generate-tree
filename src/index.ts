import { Page, Plugin } from 'vuepress-types';

type Tree = {
  key: string,
  title: string,
  children: Tree[],
  collapsable: boolean,
  path?: string,
}

/**
 * Create sidebar leaf of sidebar group.
 * Sidebar element without path isn't clickable.
 */
function convertToTreeElement(page: Page, key: string, path?: string): Tree {
  return {
    title: page.frontmatter.title || page.title,
    children: [],
    collapsable: false,
    path,
    key,
  };
}


/**
 * Find parent in tree structure.
 * Iterates over keys and on every step tries to find next subtree within children.
 */
function findParent(tree: Tree, keys: string[]): Tree {
  let parent = tree;
  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    // eslint-disable-next-line no-restricted-syntax
    for (const subtree of parent.children) {
      if (subtree.key === key) {
        parent = subtree;
        break;
      }
    }
  }
  return parent;
}

const SIDEBARS = new Map();

export interface GenerateTreePluginOptions {
  locales: Map<string, string>
}

const GenerateTreePlugin: Plugin<GenerateTreePluginOptions> = (options, ctx) => ({
  name: 'vuepress-plugin-generate-tree',

  async ready() {
    let { pages } = ctx;
    /** @type Map<string, string> */
    const { locales } = options;
    const prefixes = Array.from(locales.values());

    pages = pages.sort((p1, p2) => {
      if (p1.path < p2.path) return -1;
      if (p1.path > p2.path) return 0;
      return 0;
    });

    prefixes.forEach((prefix) => {
      // Find a root page
      const rootPage = pages.find((page) => page.path === prefix);
      if (rootPage === undefined) {
        throw new TypeError(`Your page tree does not have root page. It should be placed in directory as ${prefix}index.md or ${prefix}README.md`);
      }

      // Convert the root page to tree element
      const tree = convertToTreeElement(rootPage, '');

      let prefixPages = pages.filter(
        (page) => page.path !== prefix // exclude root page
          && page.path.startsWith(prefix), // include only pages with prefix
      );
      // special case for default prefix `/`: because other prefixes are substring
      // of `/` prefix we need explicitly exclude pages with other prefixes
      if (prefix === '/') {
        const otherPrefixes = prefixes.filter((p) => p !== '/');
        prefixPages = prefixPages.filter(
          // each page shouldn't start with any other prefix
          (page) => !otherPrefixes.some((otherPrefix) => page.path.startsWith(otherPrefix)),
        );
      }

      // fill the tree with pages
      prefixPages.forEach((page) => {
        // split path by `/` and remove empty parts
        // /abc/ -> ["abc"]
        // /abc/d.html -> ["abc", "d.html"]
        const keys = page.path.split('/').filter((pathPart) => pathPart).filter((pathPart) => pathPart !== prefix);
        const parent = findParent(tree, keys);

        // eslint-disable-next-line no-underscore-dangle
        if (page._strippedContent.trim()) {
          // if page has content we should create clickable tree leaf
          parent.children.push(convertToTreeElement(page, keys[keys.length - 1], page.path));
        } else {
          parent.children.push(convertToTreeElement(page, keys[keys.length - 1].slice(0, -5)));
        }
      });

      // add tree to mapping `prefix → tree`
      SIDEBARS.set(prefix, tree);
    });
  },

  async enhanceAppFiles() {
    let content = '';
    SIDEBARS.forEach((sidebar, prefix) => {
      content += `siteData.themeConfig.locales['${prefix}'].sidebar = ${JSON.stringify([sidebar])};\n`;
    });

    return {
      name: 'generate-tree-enhance-app',
      content: `export default ({ siteData }) => {
        ${content}
      }`,
    };
  },

});


module.exports = GenerateTreePlugin;
