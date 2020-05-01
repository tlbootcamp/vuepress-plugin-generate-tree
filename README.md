<h1 align="center">vuepress-plugin-generate-tree</h1>
<div align="center">

Vuepress Plugin for generating tree object with each page in locale prefix


![Version](https://img.shields.io/npm/v/@b0g3r/vuepress-plugin-generate-tree?style=flat-square)
![License](https://img.shields.io/npm/l/@b0g3r/vuepress-plugin-generate-tree?style=flat-square)

</div>

## Sorry, plugin for what?
In our [Teamlead Roadmap](https://github.com/tlbootcamp/tlroadmap) we wanted to generate a tree with pages structure and meta-data.

It is very useful for automatically build sidebar, and vuepress community has [plugin](https://github.com/shanyuhai123/vuepress-plugin-auto-sidebar) for it. But we need not only sidebar, but also meta-data, exporting to file, special ordering, so we decided to create a new specific plugin 🙄 (yes, [NIH syndrome](https://en.wikipedia.org/wiki/Not_invented_here))

Main idea of Teamlead Roadmap is maintaining big mindmap with teamleader's competencies and roles based on VuePress site generator. Web-interface is a good place for beginning, but people want use other mindmap tools and generating other artifacts is a necessity for us. Plugin solves this problem and generate tree of pages with metadata from frontmatter and $page object.

## Install

```sh
yarn add -D @b0g3r/vuepress-plugin-generate-tree
# OR npm install -D @b0g3r/vuepress-plugin-generate-tree
```

## Usage
TODO:
```js
module.exports = {
  plugins: [
  ]
}
```

## Options
TODO: