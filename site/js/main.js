/**
 * $File: main.js $
 * $Date: 2018-09-27 20:38:08 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2018 by Shen, Jen-Chieh $
 */

"use strict";

/* Conversion Keywords */
const slashKey = "_sl_";
const spaceKey = "_sp_";  // Must be the same as server.

const obKey      = "_ob_";   // open bracket '('.
const cbKey      = "_cb_";   // close bracket ')'.
const ocbKey     = "_ocb_";  // open curly bracket '{'.
const ccbKey     = "_ccb_";  // close curly bracket '}'.
const osbKey     = "_osb_";  // open square bracket '['.
const csbKey     = "_csb_";  // close square bracket ']'.

const atKey      = "_at_";   // At key '@'.
const caretKey   = "_cr_";   // Caret key '^'.
const bqKey      = "_bq_";   // Back quote key '`'.
const tildeKey   = "_tl_";   // Tilde key '~'.
const hashKey    = "_hs_";   // Hash key '#'.
const dollarKey  = "_dl_";   // Dollar '$' key.
const percentKey = "_pc_";   // Percent '%' key.
const andKey     = "_and_";  // And '&' key.
const plusKey    = "_pl_";   // And '+' key.
const quoteKey   = "_qt_";   // Quote ' key.
const exclaimKey = "_ex_";   // Exclamation mark key '!'.

const periodKey    = "_pri_";  // Period '.' key.
const equalKey     = "_eq_";   // Equals ' =' key.
const commaKey     = "_cma_";  // Comma ',' key.
const semicolonKey = "_sc_";   // Semicolon ';' key.


/**
 * jQuery entry.
 */
(function ($) {
  /* Collect all pages. */
  var manualPage = $('#manual-page');
  var scriptReferencePage = $('#script-reference-page');

  /* Collect Require Components. */
  var scrollBarTitle = $('#scroll-bar-title');

  /* Content */
  var content = $('#content');

  /* Buttons */

  /* Regular Decoration */
  var sbContainer = $('#scroll-bar-container');

  /* Search Input */
  var searchForm = $('#search-input-container form');
  var searchInputBorder = $('#search-input-border');
  var searchInputContainer = $('#search-input-container');
  var searchInput = $('#search-input-container input');
  var searchBtn = $('#search-btn');

  /* Search Result */
  var searchRes = null;

  //---------------------- Functions ---------------------------//

  /* Search Input */
  searchInputContainer.click(function () {
    searchInput.focus();
  });

  searchBtn.click(function () {
    doSearch();
  });


  // Prevent search default submit action.
  searchForm.submit(function(e) { e.preventDefault(); });

  searchInput.keypress(function (e) {
    if (e.which != 13)
      return;
    doSearch();
  });

  /**
   * Do the search.
   */
  function doSearch() {
    let searchKeyword = searchInput.val().trim();

    // If search for nothing just return it.
    if (searchKeyword == "")
      return;

    /* IMPORTANT: Apply conversion rule. */
    // This rule must match the server side.
    searchKeyword = searchKeyword.replace(/ /g, spaceKey);

    // Load to search page.
    addParamToURL('search', searchKeyword, true);
  }

  function showChildren(obj) { obj.children().show(); }
  function hideChildren(obj) { obj.children().hide(); }

  /* Open the SB directory and turn the arrow text off. */
  function openSBDir(items, arrow) {
    showChildren(items);
    arrow.text("-");
  }

  /* Close the SB directory and turn the arrow text on. */
  function closeSBDir(items, arrow) {
    hideChildren(items);
    arrow.text("+");
  }

  /* Toggle the SB directory and turn the arrow text on/off. */
  function toggleSBDir(items, arrow) {
    if (arrow.text() == "+")
      openSBDir(items, arrow);
    else
      closeSBDir(items, arrow);
  }


  /* Register button event */
  function addSBDirButtonEvent() {
    let sbDir = $('.sb-dir');
    let arrows = $('.arrow');
    let arrowsText = $('.arrow + span');

    arrows.click(function (e) {
      // Stop overlaping `li' tag's click event trigger.
      e.stopPropagation();

      let items = $(this).siblings('ul');

      toggleSBDir(items, $(this));
    });

    arrowsText.click(function (e) {
      // Stop overlaping `li' tag's click event trigger.
      e.stopPropagation();

      let items = $(this).siblings('ul');
      let arrow = $(this).siblings('.arrow');

      toggleSBDir(items, arrow);
    });

    let currentContentPage = getUrlParameter('page');

    let pathDir = [];

    if (currentContentPage !== null)
      pathDir = currentContentPage.split(slashKey);

    let currentPathDir = pathDir[0];

    let dirLayer = 0;

    // Initialize by URL param.
    sbDir.each(function () {
      let items = $(this).find('ul');
      let arrow = $(this).find('.arrow');

      let path = $(this).attr('id');

      if (currentPathDir == path) {
        openSBDir(items, arrow);

        // Add up directory layer.
        ++dirLayer;

        // Setup the next directory tree.
        currentPathDir += slashKey + pathDir[dirLayer];
      } else {
        // Close the directory as default.
        closeSBDir(items, arrow);
      }
    });
  }
  addSBDirButtonEvent();  // Do it once at initialize time.

  function addSBFileButtonEvent() {
    let sbFile = $('.sb-file');

    sbFile.click(function (e) {
      // Stop overlaping `div' tag's click event trigger.
      e.stopPropagation();

      let contentPage = $(this).attr('id');

      addParamToURL("page", contentPage, true);
    });

    let currentContentPage = getUrlParameter('page');

    let selectedFilename = [];

    if (currentContentPage != null) {
      selectedFilename = currentContentPage.split(slashKey);
      selectedFilename = selectedFilename[selectedFilename.length - 1];
    }

    // Check if current file selected. Highlight it!
    sbFile.each(function () {
      let filePath = $(this).attr('id');

      let filename = filePath.split(slashKey);
      filename = filename[filename.length - 1];

      // Found the selected file?
      if (selectedFilename == filename) {
        $(this).addClass('sb-file-selected');

        // Scroll to that file selected.
        sbContainer.animate({
          /*
           * NOTE: 100 is the height from the header, and plus 10 just
           * to offset a bit more to look better.
           */
          scrollTop: $(this).offset().top - 110
        }, 500);
      }
    });
  }
  addSBFileButtonEvent();  // Do it once at initialize time.

  /**
   * Add a parameter to current URL.
   *
   * @param { string } paramName : parameter name.
   * @param { string } paramValue : parameter value.
   * @param { boolean } clean : Clean param?
   */
  function addParamToURL(paramName, paramValue, clean) {
    let url = document.location.href;

    // Remove all parameters?
    if (clean)
      url = url.split('?')[0];

    if (url.indexOf('?') != -1) {
      url += "&";
    } else {
      url += "?";
    }

    url += paramName + "=" + paramValue;

    // Set URL and reload the page.
    document.location = url;
  }

  function applyConfig() {
    /* Reload possible changing variables. */
    let manualName = $('.manual-name');
    let copyright = $('.copyright');
    let homepageLink = $('.homepage-link');

    let versionTitle01 = $('.version-title-01');
    let versionTitle02 = $('.version-title-02');
    let versionTitle03 = $('.version-title-03');
    let versionTitle04 = $('.version-title-04');
    let versionTitle05 = $('.version-title-05');
    let versionTitle06 = $('.version-title-06');
    let versionTitle07 = $('.version-title-07');

    let versionNum01 = $('.version-num-01');
    let versionNum02 = $('.version-num-02');
    let versionNum03 = $('.version-num-03');
    let versionNum04 = $('.version-num-04');
    let versionNum05 = $('.version-num-05');
    let versionNum06 = $('.version-num-06');
    let versionNum07 = $('.version-num-07');

    manualName.text(manual_name);
    copyright.text(copyright_text);
    homepageLink.text(homepage_text);
    homepageLink.attr('href', homepage_url);

    versionTitle01.text(version_title_01);
    versionTitle02.text(version_title_02);
    versionTitle03.text(version_title_03);
    versionTitle04.text(version_title_04);
    versionTitle05.text(version_title_05);
    versionTitle06.text(version_title_06);
    versionTitle07.text(version_title_07);

    versionNum01.text(version_num_01);
    versionNum02.text(version_num_02);
    versionNum03.text(version_num_03);
    versionNum04.text(version_num_04);
    versionNum05.text(version_num_05);
    versionNum06.text(version_num_06);
    versionNum07.text(version_num_07);
  }
  applyConfig();

  /**
   * Apply customizable color.
   */
  function applyTheme() {
    let header = $('header');
    header.css('background-color', header_color);

    let arrows = $('.arrow');
    arrows.css('background-color', arrow_color);

    let th = $('th');
    th.css('background-color', th_color);

    if (th_show == false) {
      let thead = $('thead');
      thead.css('display', 'none');
    }
  }
  applyTheme();

  function loadContent() {
    let url = window.location.href;
    let type = basePath(window.location.pathname);
    let base = window.location.origin + type;
    let docBase = '';

    if (type === '/Manual') {
      document.title = manual_name + ' - Scripting Manual';
      scrollBarTitle.text(manual_name + " Manul");
      searchInput.attr('placeholder', si_manual_placeholder);
      docBase = '/doc';
    } else {
      document.title = manual_name + ' - Scripting API';
      scrollBarTitle.text("Scripting API");
      searchInput.attr('placeholder', si_api_placeholder);
      docBase = '/api';
    }

    let page = getUrlParameter('page');
    if (page !== null)
      page = applyConversionRule(page, true);
    else {
      docBase = "";
      page = "/intro";
    }

    let docPath = base + docBase + page + '.html';

    $.get(docPath, function(result) { content.html(result); });
  }
  loadContent();

}(this.jQuery));


/**
 * Get URL parameter.
 *
 * SOURCE: https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
 * @param { string } paramName : name of the parameter.
 */
function getUrlParameter(paramName) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1));
  let sURLVariables = sPageURL.split('&');
  for (let index = 0; index < sURLVariables.length; ++index) {
    let sParameterName = sURLVariables[index].split('=');
    if (sParameterName[0] === paramName) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
  return null;
}

/**
 * Clean all URL parameters.
 */
function cleanParamFromURL() {
  let url = document.location.href;

  let splitUrl = url.split('?');
  url = splitUrl[0];

  // Make sure there are not param after url.
  if (splitUrl.length == 2)
    document.location = url;
}

/** Return base of the url/path. */
function basePath(path) { return path.replace(/\/[^\/]+\/?$/, ''); }

/**
 * Apply conversion rules.
 * @param { string } rawStr : Unrefined string that have not apply conversion rules.
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
