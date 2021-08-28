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
const dirTree = require('directory-tree');

/* Global Variables */
var inputDir = '';
var outputDir = '';

/* Logger */
function info(msg) { console.log("[INFO] " + msg); }
function error(msg) { console.log("[ERROR] " + msg); }

/*
 * Core
 */

function build(iPath, oPath) {

}

/*
 * Module Exports
 */
module.exports.build = build;
