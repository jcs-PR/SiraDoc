/**
 * $File: sira.js $
 * $Date: 2021-08-28 23:16:25 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2021 by Shen, Jen-Chieh $
 */

"use strict";

/*
 * Dependencies
 */
const fs = require("fs");
const path = require('path');

const fse = require('fs-extra');
const dirTree = require('directory-tree');
const replaceExt = require('replace-ext');

const HTMLParser = require('node-html-parser');
const showdown = require('showdown');
const showdownHighlight = require("showdown-highlight");

const util = require('./util');

/* Global Variables */
var layerNum = -1;

/*
 * Util
 */
function info(msg) { console.log("[INFO] " + msg); }
function error(msg) { console.log("[ERROR] " + msg); }

function mkdir(path) { fs.mkdirSync(path, { recursive: true }); }
function readFile(path) { return fs.readFileSync(path, 'utf8'); }
function writeFile(path, content) { fs.writeFileSync(path, content, { encoding: 'utf8' }); }

/*
 * Core
 */

/* Create index with directory. */
function createIndexWithDir(dir, inParent) {
  let ul = HTMLParser.parse('<ul></ul>');
  inParent.appendChild(ul);

  let parent = inParent.querySelector('ul');

  ++layerNum;

  let currentDir = "";

  for (let index = 0; index < dir.length; ++index) {
    let pathObj = dir[index];

    if (pathObj.path.charAt(0) != "/")
      currentDir = pathObj.path;

    let sbType = "sb-dir";
    if (pathObj.type == "file") {
      sbType = "sb-file";
    }

    let isDir = (pathObj.type != "file");

    let newPath = pathObj.path;
    // Remove extension if file.
    if (!isDir) newPath = newPath.replace(/\.[^/.]+$/, "");

    /* IMPORTANT: Apply conversion rule. */
    newPath = util.applyConversionRule(newPath);

    let dirOrFileName = pathObj.name;
    dirOrFileName = dirOrFileName.replace(/\.[^/.]+$/, "");  // Remove extension if there is.

    let li = HTMLParser.parse("<li class=" + sbType +" id=" + newPath + "></li>");
    parent.appendChild(li);

    let newPathNode = parent.querySelector('#' + newPath);

    let htmlDirOrFileName = "<span>" + dirOrFileName + "</span>";
    if (isDir) {
      htmlDirOrFileName = "<div class='arrow'>+</div>" + htmlDirOrFileName;
    }

    let temp = HTMLParser.parse(htmlDirOrFileName);
    newPathNode.appendChild(temp);

    newPathNode.classList.add("sb-layer-" + layerNum);

    if (pathObj.children != null && pathObj.children.length != 0) {
      createIndexWithDir(pathObj.children, newPathNode);
    }
  }

  --layerNum;

  return inParent;
}

function prepareSite(src, dest) {
  info('Copying template to current directory...');
  let sitePath = path.join(__dirname, '..', 'site');
  fse.copySync(sitePath, dest);
}

function getDocTree(path, ext) {
  const tree = dirTree(path, { extensions: ext, normalizePath: true });
  sortTreeByType(tree.children, 'directory');
  var removePath = path;
  removePath = removePath.replace("./", "");
  removePath = removePath.replace(/\\/g, '/');
  removeLeadPath(tree.children, removePath);
  return tree;
}

function md2html(markdown) {
  showdown.setFlavor('github');
  let converter = new showdown.Converter({ extensions: [showdownHighlight({ pre: true })]});
  return converter.makeHtml(markdown);
}

function genHtmlFromMd(src, dest) {
  let markdown = readFile(src);
  let html = md2html(markdown);
  writeFile(dest, html);
}

function buildHtmlFiles(tree, src, dest) {
  for (let index = 0; index < tree.length; ++index) {
    let pathObj = tree[index];
    if (pathObj.children != null && pathObj.children.length != 0) {
      buildHtmlFiles(pathObj.children, src, dest);
    }

    if (pathObj.type === 'file') {
      let destFile = path.join(dest, replaceExt(pathObj.path, '.html'));
      let destDir = path.dirname(destFile);
      mkdir(destDir);

      let srcFile = path.join(src, pathObj.path);
      genHtmlFromMd(srcFile, destFile);
    }
  }
}

function buildIntro(src, dest) {
  info('Building intro pages...');

  let srcIntroManual = path.join(src, 'Manual.md');
  let srcIntroScriptRef = path.join(src, 'ScriptReference.md');

  let destIntroManual = path.join(dest, 'Manual', 'intro.html');
  let destIntroScriptRef = path.join(dest, 'ScriptReference', 'intro.html');

  genHtmlFromMd(srcIntroManual, destIntroManual);
  genHtmlFromMd(srcIntroScriptRef, destIntroScriptRef);
}

function buildDocs(src, dest) {
  info('Building documents directory...');

  let pathManual = path.join(src, 'Manual');
  let pathScriptRef = path.join(src, 'ScriptReference');
  let treeManual = getDocTree(pathManual, /\.md/);
  let treeScriptRef = getDocTree(pathScriptRef, /\.md/);

  let oPathManual = path.join(dest, 'Manual', 'doc');
  let oPathScriptRef = path.join(dest, 'ScriptReference', 'api');

  buildHtmlFiles(treeManual.children, pathManual, oPathManual);
  buildHtmlFiles(treeScriptRef.children, pathScriptRef, oPathScriptRef);
}

function buildIndex(indexPath, docPath) {
  let html = readFile(indexPath);
  let tree = getDocTree(docPath, /\.html/);

  let root = HTMLParser.parse(html);
  let indexPos = root.querySelector('#index-pos');

  let newPage = createIndexWithDir(tree.children, indexPos);
  indexPos.replaceWith(newPage);
  writeFile(indexPath, root.toString());
}

function buildSidebar(src, dest) {
  let indexManual = path.join(dest, 'Manual', 'index.html');
  let indexScriptRef = path.join(dest, 'ScriptReference', 'index.html');

  let oPathManual = path.join(dest, 'Manual', 'doc');
  let oPathScriptRef = path.join(dest, 'ScriptReference', 'api');

  buildIndex(indexManual, oPathManual);
  buildIndex(indexScriptRef, oPathScriptRef);
}

function buildSite(src, dest) {
  info('Generating static site...');

  buildSidebar(src, dest);  // build index links on the side
}

function build(iPath, oPath) {
  let src = path.join(process.cwd(), iPath);
  let dest = path.join(process.cwd(), oPath);

  prepareSite(src, dest);  // copy template over
  buildIntro(src, dest);
  buildDocs(src, dest);
  buildSite(src, dest);
}

/**
 * Sort the tree result by directory/file type.
 * @param { tree.children } tree : Tree children.
 * @param { string } type : Sort type, enter 'directory' or 'file'.
 */
function sortTreeByType(tree, type = 'directory') {
  if (type != 'directory' && type != 'file')
    return;

  let tarList = [];  // target list.
  let anoList = [];  // another list.

  /* Split path object into two arrays by type. */
  for (let index = 0; index < tree.length; ++index) {
    let pathObj = tree[index];
    if (pathObj.children != null && pathObj.children.length != 0) {
      sortTreeByType(pathObj.children, type);
    }

    // Add path object by type.
    if (pathObj.type == type)
      tarList.push(pathObj);
    else
      anoList.push(pathObj);
  }

  /* Copy array over. */
  let resultTree = tarList.concat(anoList);

  for (let index = 0; index < tree.length; ++index) {
    tree[index] = resultTree[index];
  }
}

/**
 * Remove the `MANUAL_DIR_PATH' or `API_DIR_PATH', so when the client
 * receive the data would not need to care where is the api directory located.
 * @param { JSON } dir : directory JSON object.
 * @param { typename } rmPath : Param desc here..
 */
function removeLeadPath(dir, rmPath) {
  for (let index = 0; index < dir.length; ++index) {
    let pathObj = dir[index];

    if (pathObj.children != null && pathObj.children.length != 0) {
      removeLeadPath(pathObj.children, rmPath);
    }

    // Remove the `MANUAL_DIR_PATH' or `API_DIR_PATH' path.
    pathObj.path = pathObj.path.replace(rmPath, "");
  }
}

/*
 * Module Exports
 */
module.exports.build = build;
