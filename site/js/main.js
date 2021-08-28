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
  /* Others */
  var layerNum = -1;

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

  /* Check if the page id <div> exists? */
  function checkPageFound (pageObj) { return (pageObj.length != 0); }

  /* Initialize the page. */
  function initPage() {
    initGlobalPage();
    if (checkPageFound(manualPage)) {
      document.title = manual_name + ' - Scripting Manual';
      initManulPage();
    } else if (checkPageFound(scriptReferencePage)) {
      document.title = manual_name + ' - Scripting API';
      initScriptReferencePage();
    } else {
      console.log("[ERROR] This page section doesn't exists");
    }
  }

  /* Initialize components that exists in all pages.*/
  function initGlobalPage() {
    loadCurrentContentPage();

    searchInput.attr('size', si_input_size);
  }

  /* Initialzie the manual page. */
  function initManulPage() {
    scrollBarTitle.text(manual_name + " Manul");
    searchInput.attr('placeholder', si_manual_placeholder);

    /* Make AJAX request. */
    {
      /* Get Manual index. */
      $.ajax({
        url: '../../manual_index_data',
        type: 'GET',
        contentType: "application/json",
        success : requestSuccess,
        error : requestError,
      });
    }
  }

  /* Initialize the script reference page. */
  function initScriptReferencePage() {
    scrollBarTitle.text("Scripting API");
    searchInput.attr('placeholder', si_api_placeholder);

    /* Get API index. */
    $.ajax({
      url: '../../api_index_data',
      type: 'GET',
      contentType: "application/json",
      success : requestSuccess,
      error : requestError,
    });
  }

  /* When successfully get the data from the server. */
  function requestSuccess(data) {
    let dir = JSON.parse(data);

    createIndexWithDir(dir.children, indexPos);

    addSBDirButtonEvent();
    addSBFileButtonEvent();

    applyTheme();
  }

  /* Error handling when request failed. */
  function requestError(e) {
    console.log(e.message);
  }

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

  /* Get layer number class string. */
  function getLayerByNum(layerNum) { return "sb-layer-" + layerNum; }


  /**
   * Load the current content page if defined. If not load the default
   * content page.
   */
  function loadCurrentContentPage() {
    // Get the current content page in the URL.
    let currentContentPage = getUrlParameter('page');
    // Is the page the search page?
    let searchKeyword = getUrlParameter('search');

    let contentPageName = "";

    // If keyword does not define load load normal page instead of search page.
    if (searchKeyword == null) {
      // If the page does not define load the intro page.
      if (currentContentPage == null)
        contentPageName = intro_content;
      else {
        /* IMPORTANT: Apply conversion rule. */
        contentPageName = applyConversionRule(currentContentPage, true);
      }
    } else {
      contentPageName = search_content;

      /* IMPORTANT: Apply conversion rule. */
      searchKeyword = applyConversionRule(searchKeyword, true);

      searchInput.attr('value', searchKeyword);
    }

    loadContentPage(contentPageName);
  }

  /**
   * Load the content HTML file.
   * @param { typename } contentPage : Content page name.
   */
  function loadContentPage(contentPage) {
    let fullPath = contentPage + content_extension;

    // Load content page base on the current page tab.
    if (contentPage == intro_content) {
      cleanParamFromURL();
    } else if (contentPage == search_content) {

      let searchKeyword = getUrlParameter('search');
      let reqUrl = '';

      if (checkPageFound(manualPage)) {
        /* Get Manual search result. */
        reqUrl = '../../search_manual/' + searchKeyword;
      } else if (checkPageFound(scriptReferencePage)) {
        /* Get API search result. */
        reqUrl = '../../search_api/' + searchKeyword;
      }

      $.ajax({
        url: reqUrl,
        type: 'GET',
        contentType: "application/json",
        success : function (data) {
          searchRes = JSON.parse(data);

          // Try to append search result.
          appendSearchResult();
        },
        error : requestError,
      });
    }
    // Else we load either manual/api page.
    else {
      if (checkPageFound(manualPage)) {
        fullPath = "./doc/" + fullPath;
      } else if (checkPageFound(scriptReferencePage)) {
        fullPath = "./api/" + fullPath;
      }
    }

    jQuery.get(fullPath, function (text) {
      showdown.setFlavor('github');
      let converter = new showdown.Converter({ extensions: ['codehighlight'] });
      converter.setOption('simpleLineBreaks', false);
      let html = converter.makeHtml(text);
      content.html(html);

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

      let searchKeyword = getUrlParameter('search');
      if (searchKeyword != null) {
        let searchKeywordText = $('.search-keyword');
        searchKeyword = searchKeyword.split(spaceKey).join(" ");
        searchKeywordText.text(searchKeyword);
        appendSearchResult();  // Try to append search result.
      }

      applyTheme();
    });
  }

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
   * Apply search result visual client.
   */
  function appendSearchResult() {
    if (searchRes == null) {  // Check if the data come in?
      console.log("Missing search result...");
      return;
    }

    let searchResDiv = $('#search-result-block');
    if (searchResDiv == null) {  // Check is the HTML page loaded?
      console.log("Page not loaded for search result...");
      return;
    }

    for (let index = 0; index < searchRes.length; ++index) {
      let pathObj = searchRes[index];

      // Remove extension from show path.
      let showPath = pathObj.path;
      showPath = showPath.replace(/.md/g, '');

      /* IMPORTANT: Apply conversion rule. */
      let urlPath = applyConversionRule(showPath);

      /* Here to design the HTML content for search result. */
      let resultHTML =
          '<div class="search-result-one">' +
          '<a href="?page=' + urlPath + '">' +
          showPath +
          '</a>' +
          '</div>';

      searchResDiv.append(resultHTML);
    }
  }

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

  /**
   * jQuery program entry.
   */
  function jQueryMain() {
    initPage();
  }
  jQueryMain();  // Execute the program entry.

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
