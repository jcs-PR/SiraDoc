/**
 * $File: main.js $
 * $Date: 2018-09-27 20:38:08 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2018 by Shen, Jen-Chieh $
 */

"use strict";


/**
 * jQuery entry.
 */
(function ($) {
  /* Collect all pages. */
  var manualPage = $('#manual-page');
  var scriptReferencePage = $('#script-reference-page');

  /* Collect Require Components. */
  var scrollBarTitle = $('#scroll-bar-title');
  var indexPos = $('#index-pos');

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

    if (currentContentPage != null)
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
