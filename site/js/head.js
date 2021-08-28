/**
 * $File: head.js $
 * $Date: 2018-09-29 01:44:08 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2018 by Shen, Jen-Chieh $
 */

"use strict";

/**
 * NOTE(jenchieh): The goal of this file is to minimize the HTML
 * code in all `index.html' files. So we can have consistence
 * style in each page.
 *
 * Mainly we do not have to change anything here, instead we will
 * often change the code in the `css-lib.html' file instead. :D
 */


/**
 * jQuery entry.
 */
(function ($) {
  let jsLib = $('#js-lib');
  let cssLib = $('#css-lib');

  /**
   * jQuery program entry.
   */
  function jQueryMain() {
    jsLib.load('../js-lib.html');
    cssLib.load('../css-lib.html');
  }
  jQueryMain();  // Execute the program entry.

}(this.jQuery));
