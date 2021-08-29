#!/usr/bin/env node
/**
 * $File: cli.js $
 * $Date: 2021-08-28 23:15:54 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2021 by Shen, Jen-Chieh $
 */

"use strict";

const fs = require('fs');
const sira = require('./sira');

const usage =
      "usage : sira I_FOLDER [output O_FOLDER] \n" +
      "\n" +
      "SiraDoc : Export static website for your Scripting Manual\n" +
      "\n" +
      "positional arguments:\n" +
      "  I_FOLDER          Directory with your makrdown files\n" +
      "\n" +
      "optional arguments:\n" +
      "  O_FOLDER          Output documentation in this directory\n";

/* CLI */
const cli_md = function (iPath, oPath) {
  iPath = iPath || "";
  oPath = oPath || "";

  // Check valid args.
  if (iPath == "")
    console.log(usage);
  // Check directory/file exists.
  else if (!fs.existsSync(iPath)) {
    console.log("Invalid build path for SiraDoc to build");
  }
  // Do build action.
  else {
    sira.build(iPath, oPath);
  }
};


if (require.main === module) {
  let args = process.argv;
  cli_md(args[2], args[3]);
}
