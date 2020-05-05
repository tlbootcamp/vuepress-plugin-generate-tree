/**
 * Add-on for dumping a tree as JSON in plantuml2freemind format.
 * @module p2f
 */

/* eslint-disable no-param-reassign */

import { Tree } from './types';

interface JSONTree extends Tree {
  left?: Tree;
  right?: Tree;
}

let urlBase: string;

/**
 * Transform tree node's fields with respect to plantuml2freemind format.
 */
function remapFields(node: Tree): void { // TODO move style to meta
  const mapping = {
    title: 'text',
    path: 'link',
  };
  const mutations = {
    path: (value: string): string => `${urlBase}${value}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: (value: any): any => value,
  };
  const exclude = [
    'additionalFields',
    'children',
    'left',
    'right',
    'style',
    'color',
  ];
  const enforce = {
    style: 'fork',
    link: null,
    color: null,
  };
  for (const field of Object.keys(node)) {
    if (exclude.includes(field)) {
      continue;
    }
    if (field in mapping) {
      const mutation = mutations[field] || mutations._;
      node[mapping[field]] = mutation(node[field]);
    }
    delete node[field];
  }
  for (const [key, defaultValue] of Object.entries(enforce)) {
    if (key in node) {
      continue;
    }
    node[key] = defaultValue;
  }
}

/**
 * Traverse tree node recursively and remap fields.
 */
function transformChildren(node: Tree): void {
  if (!node.children) {
    return;
  }
  node.children.forEach((child) => { transformChildren(child); });
  remapFields(node);
}

/**
 * Dump tree as JSON to a file.
 */
export default function dumpTree(tree: Tree, base: string): JSONTree {
  urlBase = base;
  // deep-copy the tree to keep it intact
  const root: JSONTree = JSON.parse(JSON.stringify(tree));
  root.left = root.children.find((node) => node.direction === 'left');
  root.right = root.children.find((node) => node.direction === 'right');
  if (!root.left || !root.right) {
    throw new TypeError('At least one of the directed (left/right) nodes must exist');
  }

  [root, root.left, root.right].forEach((node) => { node.style = 'bubble'; });
  delete root.children;
  remapFields(root);

  [root.left, root.right].forEach((node) => { transformChildren(node); });

  return root;
}
