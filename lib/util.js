/**
 * $File: util.js $
 * $Date: 2021-08-29 13:32:24 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2021 by Shen, Jen-Chieh $
 */

"use strict";

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

/*
 * Module Exports
 */
module.exports.applyConversionRule = applyConversionRule;
