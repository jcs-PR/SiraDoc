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

/* Global Variables */
var layerNum = -1;

/* Conversion Keywords */
var slashKey = "_sl_";
var spaceKey = "_sp_";  // Must be the same as server.

var obKey      = "_ob_";   // open bracket '('.
var cbKey      = "_cb_";   // close bracket ')'.
var ocbKey     = "_ocb_";  // open curly bracket '{'.
var ccbKey     = "_ccb_";  // close curly bracket '}'.
var osbKey     = "_osb_";  // open square bracket '['.
var csbKey     = "_csb_";  // close square bracket ']'.

var atKey      = "_at_";   // At key '@'.
var caretKey   = "_cr_";   // Caret key '^'.
var bqKey      = "_bq_";   // Back quote key '`'.
var tildeKey   = "_tl_";   // Tilde key '~'.
var hashKey    = "_hs_";   // Hash key '#'.
var dollarKey  = "_dl_";   // Dollar '$' key.
var percentKey = "_pc_";   // Percent '%' key.
var andKey     = "_and_";  // And '&' key.
var plusKey    = "_pl_";   // And '+' key.
var quoteKey   = "_qt_";   // Quote ' key.
var exclaimKey = "_ex_";   // Exclamation mark key '!'.

var periodKey    = "_pri_";  // Period '.' key.
var equalKey     = "_eq_";   // Equals ' =' key.
var commaKey     = "_cma_";  // Comma ',' key.
var semicolonKey = "_sc_";   // Semicolon ';' key.


/*
 * Util
 */
function info(msg) { console.log("[INFO] " + msg); }
function error(msg) { console.log("[ERROR] " + msg); }

function mkdir(path) { fs.mkdirSync(path, { recursive: true }); }
function readFile(path) { fs.readFileSync(path, 'utf8'); }
function writeFile(path, content) { fs.writeFileSync(path, content, { encoding: 'utf8' }); }

/*
 * Core
 */

/**
 * Apply conversion rules.
 * @param { string } rawStr : Unrefined string that have not apply
 * conversion rules.
 * @param { boolean } revert : Convert back.
 */
function applyConversionRule(rawStr, revert = false) {
  if (revert) {
    rawStr = rawStr.split(slashKey).join("/");
    rawStr = rawStr.split(spaceKey).join(" ");

    rawStr = rawStr.split(obKey).join("(");
    rawStr = rawStr.split(cbKey).join(")");
    rawStr = rawStr.split(ocbKey).join("{");
    rawStr = rawStr.split(ccbKey).join("}");
    rawStr = rawStr.split(osbKey).join("[");
    rawStr = rawStr.split(csbKey).join("]");

    rawStr = rawStr.split(atKey).join("@");
    rawStr = rawStr.split(bqKey).join("`");
    rawStr = rawStr.split(caretKey).join("^");
    rawStr = rawStr.split(tildeKey).join("~");
    rawStr = rawStr.split(hashKey).join("#");
    rawStr = rawStr.split(dollarKey).join("$");
    rawStr = rawStr.split(percentKey).join("%");
    rawStr = rawStr.split(andKey).join("&");
    rawStr = rawStr.split(plusKey).join("+");
    rawStr = rawStr.split(quoteKey).join("'");
    rawStr = rawStr.split(exclaimKey).join("!");

    rawStr = rawStr.split(periodKey).join(".");
    rawStr = rawStr.split(equalKey).join("=");
    rawStr = rawStr.split(commaKey).join(",");
    rawStr = rawStr.split(semicolonKey).join(";");
  } else {
    rawStr = rawStr.replace(/\//g, slashKey);
    rawStr = rawStr.replace(/ /g, spaceKey);

    rawStr = rawStr.replace(/\(/g, obKey);
    rawStr = rawStr.replace(/\)/g, cbKey);
    rawStr = rawStr.replace(/\{/g, ocbKey);
    rawStr = rawStr.replace(/\}/g, ccbKey);
    rawStr = rawStr.replace(/\[/g, osbKey);
    rawStr = rawStr.replace(/\]/g, csbKey);

    rawStr = rawStr.replace(/\@/g, atKey);
    rawStr = rawStr.replace(/\`/g, bqKey);
    rawStr = rawStr.replace(/\^/g, caretKey);
    rawStr = rawStr.replace(/\~/g, tildeKey);
    rawStr = rawStr.replace(/\#/g, hashKey);
    rawStr = rawStr.replace(/\$/g, dollarKey);
    rawStr = rawStr.replace(/\%/g, percentKey);
    rawStr = rawStr.replace(/\&/g, andKey);
    rawStr = rawStr.replace(/\+/g, plusKey);
    rawStr = rawStr.replace(/\'/g, quoteKey);
    rawStr = rawStr.replace(/\!/g, exclaimKey);

    rawStr = rawStr.replace(/\./g, periodKey);
    rawStr = rawStr.replace(/\=/g, equalKey);
    rawStr = rawStr.replace(/\,/g, commaKey);
    rawStr = rawStr.replace(/\;/g, semicolonKey);
  }
  return rawStr;
}

/* Get layer number class string. */
function getLayerByNum(layerNum) { return "sb-layer-" + layerNum; }

/* Create index with directory. */
function createIndexWithDir(dir, inParent) {
  inParent.append("<ul></ul>");

  let parent = inParent.find('ul');

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
    newPath = newPath.replace(/\//g, slashKey);  // slash to key.
    // Remove extension if file.
    if (!isDir)
      newPath = newPath.replace(/\.[^/.]+$/, "");

    /* IMPORTANT: Apply conversion rule. */
    newPath = applyConversionRule(newPath);

    let dirOrFileName = pathObj.name;
    dirOrFileName = dirOrFileName.replace(/\.[^/.]+$/, "");  // Remove extension if there is.


    parent.append("<li class=" + sbType +" id=" + newPath + "></li>");

    let newPathNode = $('#' + newPath);

    let htmlDirOrFileName = "<span>" + dirOrFileName + "</span>";

    if (isDir) {
      htmlDirOrFileName = "<div class='arrow'>+</div>" + htmlDirOrFileName;
    }

    newPathNode.append(htmlDirOrFileName);

    newPathNode.addClass(getLayerByNum(layerNum));

    if (pathObj.children != null && pathObj.children.length != 0) {
      createIndexWithDir(pathObj.children, newPathNode);
    }
  }

  --layerNum;
}

function prepareSite(src, dest) {
  info('Copying template to current directory...');
  let sitePath = path.join(__dirname, '..', 'site');
  fse.copySync(sitePath, dest);
}

function getDocTree(path) {
  const tree = dirTree(path, { extensions: /\.md/, normalizePath: true });
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
      let markdown = readFile(srcFile);
      let html = md2html(markdown);
      writeFile(destFile, html);
    }
  }
}

function buildDocs(src, dest) {
  info('Building documents directory...');

  let pathManual = path.join(src, 'Manual');
  let pathScriptRef = path.join(src, 'ScriptReference');
  let treeManual = getDocTree(pathManual);
  let treeScriptRef = getDocTree(pathScriptRef);

  let oPathManual = path.join(dest, 'Manual', 'doc');
  let oPathScriptRef = path.join(dest, 'ScriptReference', 'api');

  buildHtmlFiles(treeManual.children, pathManual, oPathManual);
  buildHtmlFiles(treeScriptRef.children, pathScriptRef, oPathScriptRef);
}

function buildIndex(indexPath, docPath) {
  let html = readFile(indexPath);

  let root = HTMLParser.parse(html);
  let indexPos = root.querySelector('#index-pos');
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

  buildSidebar();  // build index links on the side
}

function build(iPath, oPath) {
  let src = path.join(process.cwd(), iPath);
  let dest = path.join(process.cwd(), oPath);

  prepareSite(src, dest);  // copy template over
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
