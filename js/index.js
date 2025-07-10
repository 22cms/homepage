//Loads the settings object from localStorage

var localSettings = {
	"searchEngines": [
		{
			'name': 'Google',
			'url': 'https://www.google.com/search?q=<query>',
			'customIcon': false
		},
		{
			'name': 'Wikipedia',
			'url': 'https://en.wikipedia.org/w/index.php?search=<query>',
			'customIcon': false
		},
		{
			'name': 'Deezer',
			'url': 'https://www.deezer.com/search/<query>',
			'customIcon': false
		}
	],
	"bookmarks": [
		{
			'name': 'YouTube',
			'type': 'url',
			'url': 'www.youtube.com',
		},
		{
			'name': 'Deezer',
			'type': 'url',
			'url': 'www.deezer.com',
		},

		{
			'name': 'Example Folder',
			'type': 'folder',
			'color': '#DE0085',
			'icon': 'folder-outline',
			'content': [
				{
					'name': 'Google',
					'type': 'url',
					'url': 'www.google.com',
				},
				{
					'name': 'Wikipedia',
					'type': 'url',
					'url': 'www.wikipedia.org',
				}
			],
		}
	],	
	"showSettingsIcon": true,
	"enableAnimations": true,
	"enableBlur": true,
	"resizeSearchFont": true,
	"switchEngineWithArrows": true,
	"useFaviconIco": false,
	"enableAltShortcut": true,
	"useOldReddit": false,
	"launchURLwhenClicked": true,
	"defaultSearchEngine": null,
};

if (localStorage.getItem("localSettings")) localSettings = JSON.parse(localStorage.getItem("localSettings"));

//Checks if localSettings still uses the old format, and redirects user to an upgrade page if it does.
//Also enables visual debug tools

if (Array.isArray(localSettings.searchEngines[0])) window.location.href = './upgrade.html';
if (localSettings.debug) document.querySelector("style").innerHTML = "* {outline: 1px solid red;}"

//Search Engines. The First in the List is the default one

const engineSelectorScheme = document.querySelector("#engine-selector-scheme");

var currentEngine = localSettings.searchEngines[0];
var currentEngineNum = 0;
var URLMode = false;
var evalMode = false;
var redditMode = false;
var removeMode = 0; //removeMode is deprecated

//Bookmarks. Alias links to some external website

const bookmarkLinkScheme = '<div id="<id>" class="bookmark-link centerbox" nm="<arrayPosition>"><div class="bookmark-circle centerbox"><img src="<URL>" class="bookmark-icon" onerror="this.src=\'imgs/404.svg\'"></div><p class="bookmark-title"><title></p></div>';
const folderScheme = '<div id="<id>" nm="<arrayPosition>" class="bookmark-link centerbox"><div class="bookmark-circle centerbox"><div class="centerbox" style="color: <color>; text-shadow: 0px 2px 6px <color>;"><span class="Micon folder-icon mdi-<icon>"></span></div></div><p class="bookmark-title"><title></p></div>'

//Other various HTML elements schemes
const languageSelectScheme = '<option value="<key>"><emoji> <lang></option>'
const altBadgeScheme = document.querySelector("#alt-badge-scheme")

//Declares the Searchbox and the tip behind it, also declares the Action Tip and the :root for CSS variables, and also the settings overlay objects
//Declares Search Engines, Bookmarks and Folder View containers 
//Declares the Settings Icon Button
//Declares the contextMenu element and variables related to it

const body = document.body;
const searchBox = document.querySelector("#search-box");
const searchTip = document.querySelector("#search-tip");
const searchAction = document.querySelector("#searchbox-action");
var maxCharacters;

const searchEnginesContainer = document.querySelector("#searchengines-container");
const bookmarksContainer = document.querySelector("#bookmarks-container");

const folderContainer = document.querySelector("#folder-container");
const folderContentContainer = document.querySelector("#folder-content-container");
var folder = {};

const settingsOverlay = document.querySelector("#settings-overlay");
const settingsAddElementForm = document.querySelector("#add-homepage-element-form");
const settingsLanguageSelect = document.querySelector("#language-select");
const customColorPicker = document.querySelector("#custom-color-picker");

const notifPopUp = document.querySelector("#notif-popup");
const notifText = document.querySelector("#notif-text");

const rootCSS = document.querySelector(":root");
const themeAdvisor = document.querySelector("#theme-advisor");

const settingsIcon = document.querySelector("#settings-icon");
const settingsShowIcon = document.querySelector("#settings-show-icon");

const hideFolderButton = document.querySelector("#hide-folder-button");

const newFolderOverlay = document.querySelector("#newfolder-overlay");
const newFolderContainer = document.querySelector("#newfolder-container");
const newFolderNameType = document.querySelector("#folder-nametype");
const newFolderIconType = document.querySelector("#folder-icontype");
const existingFoldersContainer = document.querySelector("#existingfolders-container");
var curBookmarkToFolder;
var curRandomColor;
var lastRandomColor

const contextMenu = document.querySelector("#context-menu");
const contextNewTab = document.querySelector("#context-newtab");
const contextDefault = document.querySelector("#context-default");
const contextNewFolder = document.querySelector("#context-newfolder");
var contextElemType;
var contextArrayPos;
var contextVisible;

var altIsDown;

const supportedFeatures =  getComputedStyle(document.documentElement).getPropertyValue('--supported-features').split(', ')


//On Load Function: Renders all the elements of the page (should probably be splitten)

function renderElements() {
	//Helper Functions
	const cssToggler = (cssClass, option) => body.classList.toggle(cssClass, !localSettings[option])
	ls = localSettings;
	//Deletes every pre-rendered element
	searchEnginesContainer.innerHTML = "";
	bookmarksContainer.innerHTML = "";
	settingsLanguageSelect.innerHTML = "";
	//If a custom color scheme is present in localSettings, load it in customColorPicker
	if (ls.customColorTheme) customColorPicker.value = ls.customColorTheme;
	//Generates every element, adds adds event listener for every one of them, sets the default search engine and starts hideTip()
	var i;
	for (i = 0; i < ls.searchEngines.length; i++) {
		genSearchElement(searchEnginesContainer, i);
	}
	for (i = 0; i < ls.bookmarks.length; i++) {
		if (ls.bookmarks[i].type == 'folder')
			bookmarksContainer.innerHTML += genFolderElement(i);
		else if (ls.bookmarks[i].type == 'url') bookmarksContainer.innerHTML += genBookmarkElement(i);
	}
	//Adds Event Listeners
	for (i = 0; i < ls.bookmarks.length; i++) {
		if (ls.bookmarks[i].type == 'folder') {
			id = "folder-" + i.toString();
			makeFolderListen(id);
		}
		else if (ls.bookmarks[i].type == 'url') {
			id = "bookmark-" + i.toString();
			makeBookmarkListen(id);
		}
	}

	//Checks if the default search engine is different from the first one, and select that one in case
	inUseEngine = (ls.defaultSearchEngine != null && ls.defaultSearchEngine <= ls.searchEngines.length-1) ? ls.defaultSearchEngine : 0; 
	document.getElementsByClassName("search-link")[inUseEngine].classList.add("in-use");
	currentEngine = ls.searchEngines[inUseEngine];

	hideTip();
	//Generates the Language Selector Entries
	for (i = 0; i < Object.keys(translations).length; i++) {
		settingsLanguageSelect.innerHTML += genLanguageElement(i)
	}
	settingsLanguageSelect.value = curLangCode;
	//Calculates the Screen size for font regulation
	maxCharacters = Math.floor(body.clientWidth / 64)
	maxCharacters += Math.floor(maxCharacters / 8);
	//Hides the settings button if it's set to

	settingsIcon.classList.toggle("fHidden", !ls.showSettingsIcon);
	//Applies the custom color scheme if it's set to
	if (ls.customColorTheme) createCustomColorScheme(ls.customColorTheme);
	cssToggler('no-animations', 'enableAnimations');
	cssToggler('no-blur', 'enableBlur');
	//Runs loadCheckboxes
	loadCheckboxes();
}

try { renderElements() }
catch (error) {
	notify("<span style='color: red;'>"
		+ "There was a fatal error trying to render the main UI. Check your browser's console for more info" + "</span>");
	console.log(error);
}

//Function: When the searchbox changes, if something is written in it, change the text behind it to "",else put it back to the original value.
// + asks to enable the URL Mode if the input is an URL
function hideTip() {
	searchBox.classList.remove("fHidden");
	searchBox.focus();
	regulateSearchFontSize(searchBox.value);

	searchTip.innerText = (!searchBox.value) ? curLang.typeHere : "";
	searchAction.innerText = curLang.searchOn.replace("<engine>", currentEngine.name);

	if (validURL(searchBox.value)) { toggleURLMode(true); searchAction.innerText = curLang.goToTheURL }
	else if (validCommand(searchBox.value)) { toggleEvalMode(true); searchAction.innerText = curLang.evalJSCode }
	else if (validSubReddit(searchBox.value)) { toggleRedditMode(true); searchAction.innerText = curLang.goToSubReddit }
	else { toggleURLMode(false); toggleEvalMode(false); toggleRedditMode(false); };
}

//Function object: toggles various features inside settings
const settingsToggles = {
	'toggleAnimations' : (bool) => body.classList.toggle('no-animations', (bool != undefined) ? !bool : !localSettings.enableAnimations),
	'toggleBlur' : (bool) => body.classList.toggle('no-blur', (bool != undefined) ? !bool : !localSettings.enableBlur), 
}

//Function: Sets every checkbox element to the right value, accordingly to the how localSettings has been set to
function loadCheckboxes() {
	fixedElements = document.getElementsByClassName("settings-checkbox");
	var i;
	for (i = 0; i < fixedElements.length; i++) {
		varid = fixedElements[i].attributes.varid.value;
		fixedElements[i].checked = localSettings[varid]
	}
}

//Function: Enables/Disabls the URL Mode for the searchbox
function toggleURLMode(toggle) {
	URLMode = toggle;

	searchBox.classList.toggle("searchbox-url", toggle);
	if (localSettings.launchURLwhenClicked) searchBox.classList.toggle("searchbox-clickable", toggle);
}

//Function: Enables/Disabls the Reddit Mode for the searchbox
function toggleRedditMode(toggle) {
	redditMode = toggle;

	searchBox.classList.toggle("searchbox-url", toggle);
	if (localSettings.launchURLwhenClicked) searchBox.classList.toggle("searchbox-clickable", toggle);
}

//Function: Enables/Disabls the Eval Mode for the searchbox
function toggleEvalMode(toggle) {
	evalMode = toggle;

	searchBox.classList.toggle("searchbox-eval", toggle);
}

//Function: Goes to the URL specified, adding "https://" if needed
function goToURL(URL, newTab) {
	if (!URL.includes("://")) URL = "https://" + URL;
	if (!newTab) window.location.href = URL;
	else window.open(URL, '_blank');
}

//Function: Goes to the specified subreddit, following the settings' Old Mode toggle
function goToSubReddit(subreddit) {
	subredditFormat = (subreddit.slice(0, 2) == "r/") ? subreddit.slice(2) : subreddit;
	subDomain = localSettings.useOldReddit ? "old" : "www";
	goToURL(`https://${subDomain}.reddit.com/r/${subredditFormat}`);
}

//Function: Goes to the URL of the clicked bookmark.
function goToBookmarkURL(element, newTab, isChild) {
	arrayPosition = parseInt(element.attributes.nm.value, 10);

	if (!removeMode) {
		curBookmarkSource = (isChild) ? folder.current.content : localSettings.bookmarks;
		URL = curBookmarkSource[arrayPosition].url;
		goToURL(URL, newTab);
	}
	else {
		removeSpecBookmark(arrayPosition);
		removeMode = false;
	}
}

//Listener: When the enter Key has ben pressed, search the sentence using the search engine which has been choosen, unless it's an URL or a command;
//If the up or down arrow keys have been pressed, switch the search engine to the next/previous one;
//If the CTRL button is un/pressed, toggle altBookMode

document.addEventListener("keydown", function (event) {
	switch (event.keyCode) {
		case 13:
			if (searchBox.value != "") {
				if (evalMode) searchAction.innerText = eval(searchBox.value.slice(2));
				else if (redditMode) goToSubReddit(searchBox.value);
				else if (!URLMode) searchViaBox();
				else goToURL(searchBox.value);
			}
			break;
		case 38:
			if (localSettings.switchEngineWithArrows) {
				event.preventDefault();
				if (currentEngineNum == 0) switchEngineTo(localSettings.searchEngines.length - 1, false);
				else switchEngineTo(currentEngineNum - 1, false);
			}
			break;
		case 40:
			if (localSettings.switchEngineWithArrows) {
				event.preventDefault();
				if (currentEngineNum == localSettings.searchEngines.length - 1) switchEngineTo(0, false);
				else switchEngineTo(currentEngineNum + 1, false);
			}
			break;
		case 18:
			if (localSettings.enableAltShortcut) {
				event.preventDefault();
				if (!event.repeat) altBookMode(true);
			}
			break;
		case 27:
			settings(false);
			newFolderDiag(undefined, false);
			if (folder.open) hideFolder();
			break;

		default:
			if (altIsDown) {
				if (!localSettings.numPadInstead && event.keyCode >= 49 && event.keyCode <= 57) {
					event.preventDefault();
					if (!folder.open) bookmarksContainer.children[event.keyCode - 49].click();
					else folderContentContainer.children[event.keyCode - 49].click();
				}
				else if (localSettings.numPadInstead && event.keyCode >= 97 && event.keyCode <= 105) {
					event.preventDefault();
					if (!folder.open) bookmarksContainer.children[event.keyCode - 97].click();
					else folderContentContainer.children[event.keyCode - 97].click();
				}
			}
			break;
	};
});
document.addEventListener("keyup", function (event) {
	switch (event.keyCode) {
		case 18:
			if (localSettings.enableAltShortcut) {
				event.preventDefault();
				altBookMode(false);
			}
			break;
	};
});

//Function: Exports dealing with the SearchBox element here for simplicity now that it has become kinda complicated
function dealWithSearchBoxClick() {
	if (localSettings.launchURLwhenClicked) {
		if (URLMode) goToURL(searchBox.value);
		else if (redditMode) goToSubReddit(searchBox.value)
	}
}

//Function: Search using the current Search Engine 
function searchViaBox() {
	searchBoxText = searchBox.value;
	if (searchBoxText.charAt(0) == ".") searchBoxText = searchBoxText.substring(1)
	searchURL = currentEngine.url.replace("<query>", encodeURIComponent(searchBoxText))

	goToURL(searchURL);
}


//Functions: Change the Search Engine to the Engine Specified, from the engine number or the element
function switchEngineTo(number, isFromElem) {

	if (!removeMode) {
		if (isFromElem) {
			var engine = parseInt(number.attributes.nm.value, 10);
			currentEngine = localSettings.searchEngines[engine];
			currentEngineNum = engine;
			document.getElementsByClassName("in-use")[0].classList.remove("in-use");
			number.classList.add("in-use");
		}
		else {
			currentEngine = localSettings.searchEngines[number];
			currentEngineNum = number;
			document.getElementsByClassName("in-use")[0].classList.remove("in-use");
			document.getElementsByClassName("search-link")[number].classList.add("in-use");

		}
		hideTip();
	}
	else {
		removeSpecEngine(engine);
		removeMode = false;
	}
}


//Function: Checks if the string is an URL
function validURL(str) {
	strArray = str.split(":")[0].split(".");
	var result = false;
	if ((strArray[0] != "" || str.includes("://")) && !str.includes(" ") && str.includes(".") && strArray[strArray.length - 1] != "") result = true;
	return result;
}

//Function: Checks if the sentence starts with ".$", in that case, it's a command.
function validCommand(str) {
	strIn2 = str.slice(0, 2);
	return (strIn2 == ".$")
}

//Function: Checks if the sentence starts with an "r/", in that case, it's a subreddit.
function validSubReddit(str) {
	strIn2 = str.slice(0, 2);
	return (strIn2 == "r/")
}


//Function: Makes a new Search engine Element
function genSearchElement(parent, arrayPosition) {
	cln = engineSelectorScheme.cloneNode(true);
	engine = localSettings.searchEngines[arrayPosition];
	currentElement = parent.appendChild(cln);

	currentElement.id = `search-engine-${arrayPosition.toString()}`;
	currentElement.lastChild.src = fetchFaviconFromAPI(engine.url.replace(/http(s|):\/\//g, "").split("/")[0]);
	currentElement.attributes.nm.value = arrayPosition.toString();

	makeEngineListen(cln);
}

//Function: Makes a new Bookmark Element
function genBookmarkElement(arrayPosition, isChild) {
	var bookmark = (isChild) ? folder.current.content[arrayPosition] : localSettings.bookmarks[arrayPosition];
	var currentData = {
		"<URL>": fetchFaviconFromAPI(bookmark.url.replace(/http(s|):\/\//g, "").split("/")[0]),
		"<title>": bookmark.name,
		"<id>": (isChild) ? `child-bookmark-${arrayPosition.toString()}` : `bookmark-${arrayPosition.toString()}`,
		"<arrayPosition>": arrayPosition
	}

	var bookmarkSelector = bookmarkLinkScheme;
	for (let k in currentData) {
		bookmarkSelector = bookmarkSelector.replace(new RegExp(k, 'g'), currentData[k]);
	}

	return bookmarkSelector;
}

//Function: Makes a new Folder Element
function genFolderElement(arrayPosition, directElem, directId) {
	var current = (!directElem) ? localSettings.bookmarks[arrayPosition] : directElem;
	var currentData = {
		"<id>": (directId) ? directId : `folder-${arrayPosition.toString()}`,
		"<arrayPosition>": arrayPosition,
		"<title>": current.name,
		"<color>": current.color,
		"<icon>": current.icon
	}

	var folderSelector = folderScheme;
	for (let k in currentData) {
		folderSelector = folderSelector.replace(new RegExp(k, 'g'), currentData[k]);
	}

	return folderSelector;
}

//Function: Makes a new language Element
function genLanguageElement(keyNum) {
	var language = translations[Object.keys(translations)[keyNum]];
	var key = Object.keys(translations)[keyNum];

	var languageSelector = languageSelectScheme.replace("<key>", key);
	languageSelector = languageSelector.replace("<emoji>", language.languageEmoji).replace("<lang>", language.languageName);

	return languageSelector;
}

//Functions: Adds the correct eventListeners for the specified Search Engine/Bookmark/Folder
function makeBookmarkListen(id) {
	elem = document.getElementById(id);

	elem.addEventListener("mouseenter", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		describeURL(origElem);
	});
	elem.addEventListener("mouseleave", function (e) {
		hideTip();
	});
	elem.addEventListener("click", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		goToBookmarkURL(origElem);
	});
	elem.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, 1);
	});
	elem.addEventListener("auxclick", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		if (e.which == 2) goToBookmarkURL(origElem, true);
	});
}

function makeChildBookmarkListen(id) {
	elem = document.getElementById(id);

	elem.addEventListener("mouseenter", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		describeURL(origElem, true);
	});
	elem.addEventListener("mouseleave", function (e) {
		hideTip();
	});
	elem.addEventListener("click", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		goToBookmarkURL(origElem, false, true);
	});
	elem.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, 2);
	});
	elem.addEventListener("auxclick", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		if (e.which == 2) goToBookmarkURL(origElem, true, true);
	});
}

function makeFolderListen(id) {
	elem = document.getElementById(id);

	elem.addEventListener("mouseenter", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		describeFolder(origElem);
	});
	elem.addEventListener("mouseleave", function (e) {
		hideTip();
	});
	elem.addEventListener("click", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		showFolder(origElem);
	});
	elem.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, 3);
	});
}

function makeEngineListen(elem) {
	elem.addEventListener("mouseenter", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		describeEngine(origElem);
	});
	elem.addEventListener("mouseleave", function (e) {
		hideTip();
	});
	elem.addEventListener("click", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		switchEngineTo(origElem, true);
	});
	elem.addEventListener("contextmenu", function (e) {
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, false);
	});
	elem.lastChild.onerror = function (e) {
		var origElem = e.srcElement || e.originalTarget;
		origElem.src = 'imgs/404.svg';
	};
}


//Function: Selects the right Favicon API and generates the URL
function fetchFaviconFromAPI(URL) {
	API = (localSettings.useFaviconIco) ? `https://${URL}/favicon.ico` : `https://icons.duckduckgo.com/ip2/${URL}.ico`;

	return API;
}


//Functions: Adds a new Search engine or a new Bookmark to the Array and saves the list in the localStorage element
function addNewEngine(name, url) {
	if (url.includes("<query>")) {
		localSettings.searchEngines.push({ 'name': name, 'url': url, 'customIcon': false })

		savePreferences();
		renderElements();
		notify(curLang.newSearchEngineAdded);
		return true
	}
	else {
		notify("<span style='color: red;'>" + curLang.newSearchEngineError + "</span>")
		return false
	}
}

function addNewBookmark(name, url) {
	localSettings.bookmarks.push({ 'name': name, 'type': "url", 'url': url })

	savePreferences();
	renderElements();
	notify(curLang.newBookmarkAdded);
}

//Functions: Removes the Search engine or the Bookmark from the Array and saves the list in the localStorage element
function removeSpecEngine(arrayPosition) {
	if (localSettings.searchEngines.length > 1) {
		localSettings.searchEngines.splice(arrayPosition, 1)

		savePreferences();
		renderElements();
		notify(curLang.searchEngineRemoved);
	}
	else notify(curLang.searchEngineRemoveError)
}

function removeSpecBookmark(arrayPosition, isChild) {
	workingArray = (isChild) ? folder.current.content : localSettings.bookmarks;
	workingArray.splice(arrayPosition, 1)

	savePreferences();
	if (isChild) renderFolderElems();
	else renderElements();
	notify(curLang.bookmarkRemoved);
}


//Function: Saves the preferences in the browser localStorage

function savePreferences() {
	debugLog("savePreferences() got triggered");
	fixedElements = document.querySelectorAll(".settings-checkbox");
	for (var i = 0; i < fixedElements.length; i++) {
		varid = fixedElements[i].attributes.varid.value;
		localSettings[varid] = fixedElements[i].checked;
	}

	localStorage.setItem("localSettings", JSON.stringify(localSettings));
}

//Function: Shows the Bookmark/Search Engine/Folder infos when it is hovered
function describeURL(elem, isChild) {
	var arrayPosition = parseInt(elem.attributes.nm.value, 10);
	var curBookmarkSource = (isChild) ? folder.current.content : localSettings.bookmarks;
	var elem = curBookmarkSource[arrayPosition];

	searchBox.classList.add("fHidden");
	searchAction.innerText = curLang.goTo.replace("<name>", elem.name);
	searchTip.innerText = elem.url.replace(/http(s|):\/\//g, "");
	regulateSearchFontSize(searchTip.innerText);
}

function describeEngine(elem) {
	var arrayPosition = parseInt(elem.attributes.nm.value, 10);
	var name = localSettings.searchEngines[arrayPosition].name;

	searchAction.innerText = curLang.searchOn.replace("<engine>", name);
}

function describeFolder(elem) {
	var arrayPosition = parseInt(elem.attributes.nm.value, 10);
	var elem = localSettings.bookmarks[arrayPosition];

	searchBox.classList.add("fHidden");
	searchAction.innerText = curLang.openFolder.replace("<title>", elem.name);
	searchTip.innerText = (elem.content.length) ? folderDescription(elem.content) : curLang.emptyFolder;
	regulateSearchFontSize(searchTip.innerText);
}

//Function: makes a folder description
function folderDescription(array) {
	var result = "";
	for (var i = 0; i < array.length; i++) {
		result += array[i].name;
		if (i >= 2) {
			result += "...";
			break;
		}
		if (i != array.length - 1) result += ", ";
	}

	return result
}


//Function: Regulates the font size accordingly to its length, if it exceeds a precise number of characterSet
var newCharSize;

function getThemeInfo() {
	newCharSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--searchtype-onecharsize').replace("px", ""), 10)
	maxCharacters = Math.floor(screen.width / newCharSize); //maxCharacters is calculated from the screen width itself
	maxCharacters += Math.floor(maxCharacters / 8); //Gives some extra tolerance coz it's kinda cool
}
getThemeInfo();

function regulateSearchFontSize(baseElem) {
	if (localSettings.resizeSearchFont & supportedFeatures.includes('type-resize')) {
		newFontSize = getComputedStyle(document.documentElement).getPropertyValue('--searchtype-sizeorig');
		fontSizeInt = parseInt(newFontSize.replace("px", ""), 10);
		if (baseElem.length > maxCharacters) {
			newFontSize = (fontSizeInt / 2 * (maxCharacters / baseElem.length) * 2).toString() + "px"
		}

		rootCSS.style.setProperty("--searchtype-size", newFontSize)
	}
}

//Function: Opens/Hides the settings page {
function settings(bool) {
	settingsOverlay.classList.toggle("sHidden", bool != undefined ? !bool : undefined);
}

//Function: adds the new element which has just been made in the settings overlay

function addFormElem() {
	name = settingsAddElementForm.name.value;
	URL = settingsAddElementForm.url.value;
	type = settingsAddElementForm.elementType.value;

	if (type == "searchEngine") {
		if (addNewEngine(name, URL)) settings()
	}
	else if (type == "bookmark") {
		addNewBookmark(name, URL);
		settings();
	}
}
//Function: changes the language to the specified one in the settings page
function changeLangTo() {
	var newLang = settingsLanguageSelect.value;
	debugLog(newLang)
	curLang = translations[newLang];
	curLangCode = newLang;

	renderElements();
	applyFixedTranslations();
	localStorage.setItem("curLang", curLangCode)
}


//Function Shows a notification with the specified text, after 5 seconds it'll hide automatically

function notify(text) {
	notifText.innerHTML = text;
	notifPopUp.classList.remove("nHidden");

	var counter = 0;
	var interval = setInterval(function () {
		counter++;
		if (counter == 5) {
			notifPopUp.classList.add("nHidden")
		}
	}, 1000);

}

//Function: Stringifies the localSettings JSON, makes it a command, and places it all in the searchBox,
//making a command that autorestores all personal settings.

function exportJSON() {
	var setString = JSON.stringify(localSettings);

	searchBox.value = ".$" + "localStorage.setItem('localSettings','" + setString + "');" + "localStorage.setItem('curLang','"
		+ curLangCode + "');" + "location.reload()";
	hideTip();

	searchBox.select();
	searchBox.setSelectionRange(0, 99999);
	document.execCommand("copy");

	notify(curLang.exportNotif);
}


//On Load Function: if the New Theme is not in use, change the themeAdvisor message 

function notifyRightTheme() {
	var themeName = getComputedStyle(document.documentElement).getPropertyValue('--theme-name');
	var advisorMessage = `You're Using the "${themeName}"  Theme, <a href='index.html' class='searchbox-url'>Click here</a> to change it to the default one`;

	if (themeName != "Default") themeAdvisor.innerHTML = advisorMessage;
}

notifyRightTheme();



//Functions: opens a context menu for the selected Search Engine/Bookmark and calculates the right coordinates to not go otside the screen

function elemContextMenu(event, elem, elemType) {
	contextVisible = true;
	contextElemType = elemType;
	contextArrayPos = parseInt(elem.attributes.nm.value, 10);


	contextNewTab.classList.toggle("fHidden", (!elemType || elemType == 3));
	contextDefault.classList.toggle("fHidden", elemType);
	contextNewFolder.classList.toggle("fHidden", elemType != 1);

	x = event.clientX;
	y = event.clientY;
	const { normalizedX, normalizedY } = normalizePosition(x, y);
	contextMenu.classList.remove("vHidden");
	contextMenu.style.left = `${normalizedX}px`;
	contextMenu.style.top = `${normalizedY}px`;
}

function normalizePosition(mouseX, mouseY) {
	outOfBoundsOnX = mouseX + contextMenu.clientWidth > body.clientWidth;
	outOfBoundsOnY = mouseY + contextMenu.clientHeight > body.clientHeight;

	normalizedX = mouseX;
	normalizedY = mouseY;

	if (outOfBoundsOnX) {
		normalizedX = body.clientWidth - contextMenu.clientWidth;
	}
	if (outOfBoundsOnY) {
		normalizedY = body.clientHeight - contextMenu.clientHeight;
	}

	return { normalizedX, normalizedY };
}

//Function: Closes the context menu

function contextClose() {
	contextVisible = false;
	contextMenu.classList.add("vHidden");
}

//Function: removes a generic element from the context menu

function contextRemoveElem() {
	if (!contextElemType) removeSpecEngine(contextArrayPos);
	else removeSpecBookmark(contextArrayPos, contextElemType == 2);

	contextClose();
}

//Function: moves a generic element to the left or to the right

function contextMove(direction) {
	workingArray = (!contextElemType) ? localSettings.searchEngines : (contextElemType != 2 || contextElemType == 3) ? localSettings.bookmarks : folder.current.content;

	element = workingArray[contextArrayPos];
	calcDirection = (direction) ? 1 : -1;
	workingArray.splice(contextArrayPos, 1);

	if (contextArrayPos + calcDirection != -1 && contextArrayPos + calcDirection != workingArray.length + 1)
		workingArray.splice(contextArrayPos + calcDirection, 0, element)
	else if (contextArrayPos + calcDirection == -1) workingArray.splice(workingArray.length, 0, element)
	else workingArray.unshift(element);

	if (!contextElemType) localSettings.searchEngines = workingArray;
	else if (contextElemType == 2) folder.current.content = workingArray;
	else localSettings.bookmarks = workingArray;

	if (contextElemType == 2) renderFolderElems();
	else renderElements();

	savePreferences();
	contextClose();
}

//Function: opens the make folder dialog refering to the current element
function contextFolderDiag() {
	newFolderDiag(contextArrayPos);
}

//Function: sets the choosen Search Engine as the default one (by making it the first one)

function contextMakeDefault() {
	localSettings.defaultSearchEngine = contextArrayPos;

	renderElements();
	switchEngineTo(localSettings.defaultSearchEngine, false)
	savePreferences();
	contextClose();
}

//Function: opens a new Tab from a bookmark

function contextTab() {
	console.log(contextElemType);
	workingArray = (contextElemType == 1) ? localSettings.bookmarks : folder.current.content;
	goToURL(workingArray[contextArrayPos].url, true);
	contextClose();
}

//Listener: when somewhere else is clicked, the context menu gets closed
body.addEventListener("click", (e) => {
	if (contextVisible) contextClose();
});


//Function: toggles the Settings Icon

function toggleSettingsButton() {
	if (settingsShowIcon.checked) {
		notify(curLang.settingsIconShown);
		settingsIcon.classList.remove("fHidden");
	}
	else {
		notify(curLang.settingsIconHidden.replace(".$settings()", "<span class='searchbox-eval'>.$settings()</span>"));
		settingsIcon.classList.add("fHidden");
	}
	savePreferences();
}



//Function: Applies a custom color scheme in a Telegram-like style, basing it on a given Hexadecimal color

function createCustomColorScheme(hexColor, save = false) {
	const rgb = hexToRgb(hexColor);
	const totalBrightness = rgb.r + rgb.g + rgb.b;

	const correctRGB = (value) => Math.max(0, Math.min(255, Math.floor(value)));
	const scaledHex = (r, g, b) => rgbToHex(correctRGB(r), correctRGB(g), correctRGB(b));
	const minIfNotZero = (component, min) => Math.max(component, (component != 0) ? min : 0);

	let colorPrimary, colorBackground, colorTip, colorAction, colorCircles, colorContext;

	if (totalBrightness > 90) {
		colorBackground = scaledHex(rgb.r * 0.13, rgb.g * 0.13, rgb.b * 0.13);

		if (totalBrightness > 200) {

			colorPrimary = hexColor;
			colorTip = hexColor + "60";
			colorAction = hexColor + "50";
			colorCircles = scaledHex(rgb.r * 0.33, rgb.g * 0.33, rgb.b * 0.33);
		} else {

			colorPrimary = scaledHex(minIfNotZero(rgb.r * 2, 50), minIfNotZero(rgb.g * 2, 50), minIfNotZero(rgb.b * 2, 50));
			colorTip = scaledHex(rgb.r + 90, rgb.g + 90, rgb.b + 90) + "A0";
			colorAction = scaledHex(rgb.r + 30, rgb.g + 30, rgb.b + 30);
			colorCircles = scaledHex(rgb.r + 20, rgb.g + 20, rgb.b + 20) + "A0";
		}

		colorContext = (totalBrightness > 380 || (rgb.g / 2 > rgb.r + rgb.b))
			? scaledHex(rgb.r * 0.7 - 10, rgb.g * 0.7 - 10, rgb.b * 0.7 - 10)
			: colorPrimary;

	} else {

		colorBackground = "#000000";
		colorPrimary = scaledHex(minIfNotZero(rgb.r * 4, 55), minIfNotZero(rgb.g * 4, 55), minIfNotZero(rgb.b * 4, 55));
		colorTip = scaledHex(minIfNotZero(rgb.r * 3.4, 40), minIfNotZero(rgb.g * 3.4, 40), minIfNotZero(rgb.b * 3.4, 40)) + "9A";
		colorAction = colorTip;
		colorCircles = scaledHex(minIfNotZero(rgb.r * 2.5, 40), minIfNotZero(rgb.g * 2.5, 40), minIfNotZero(rgb.b * 2.5, 40)) + "AF";
	
		colorContext = ((rgb.g * 4 > 200) || (rgb.g / 2 > rgb.r + rgb.b))
			? scaledHex(minIfNotZero(rgb.r * 4, 55), Math.min(rgb.g * 3, 200), minIfNotZero(rgb.b * 4, 55))
			: colorPrimary;
	}



	rootCSS.style.setProperty("--customize-primary", colorPrimary);
	rootCSS.style.setProperty("--customize-background", colorBackground);
	rootCSS.style.setProperty("--customize-circles", colorCircles);
	rootCSS.style.setProperty("--customize-searchtip", colorTip);
	rootCSS.style.setProperty("--customize-searchaction", colorAction);
	rootCSS.style.setProperty("--customize-context", colorContext);

	if (save) {
		localSettings.customColorTheme = hexColor;
		savePreferences();
	}
}


//Took from here: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	debugLog(`rgbToHex; r, g and b are ${r}, ${g} and ${b}`)
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//Function: disables the custom color theme

function disableCustomColorScheme() {
	localSettings.customColorTheme = false;
	savePreferences();
	location.reload()
}


//Functions show and hide the Folder View
function showFolder(elem) {
	arrayPosition = parseInt(elem.attributes.nm.value, 10);
	folder.currentPos = arrayPosition;
	folder.current = localSettings.bookmarks[arrayPosition];
	folder.open = true;
	renderFolderElems();

	hideFolderButton.children[0].children[0].style.color = folder.current[1]
	hideFolderButton.children[0].children[0].style.textShadow = folder.current[1] + " 0px 2px 6px";
	folderContainer.classList.remove("fHidden");
	bookmarksContainer.classList.add("fHidden");
	if (altIsDown) altBookMode(true);
}


function hideFolder() {
	folder = {};
	folderContainer.classList.add("fHidden");
	bookmarksContainer.classList.remove("fHidden");
}

//Funtion: render all Bookmarks of the current folder
function renderFolderElems() {
	childBookmarks = folder.current.content;
	folderContentContainer.innerHTML = "";

	var i;
	for (i = 0; i < childBookmarks.length; i++) {
		folderContentContainer.innerHTML += genBookmarkElement(i, true);
	}
	for (i = 0; i < childBookmarks.length; i++) {
		id = "child-bookmark-" + i.toString();
		makeChildBookmarkListen(id);
	}
}

//Listener: when Folder Back Arrow is clicked, hide the Folder Container
hideFolderButton.addEventListener("click", function () {
	hideFolder();
});
hideFolderButton.addEventListener("mouseenter", function () {
	searchAction.innerText = curLang.goBack;
});
hideFolderButton.addEventListener("mouseleave", function () {
	hideTip();
});



//Function: Shows/hides the new folder dialog, and sets the working folder to the given value
function newFolderDiag(arrayPos, force) {
	if (force || force == undefined) {
		debugLog(`newFolderDiag; arrayPos is ${arrayPos}`)
		if (arrayPos != undefined) curBookmarkToFolder = arrayPos;
		renderNewFolderPreview();
		renderExistingFolders();
	}	
	newFolderOverlay.classList.toggle("sHidden", force != undefined ? !force : undefined);
}

//Function: Renders the Folder Preview
function renderNewFolderPreview(nonRandom) {
	curRandomColor = randomColor(nonRandom, 360);
	var currentElement = { 'name': newFolderNameType.value, 'color': curRandomColor, 'icon': newFolderIconType.value, 'content': null };

	newFolderContainer.innerHTML = genFolderElement(-1, currentElement);
	document.querySelector("#folder--1").addEventListener("click", function (e) {
		renderNewFolderPreview();
	});
	document.querySelector("#folder--1").addEventListener("contextmenu", function (e) {
		e.preventDefault();
		renderNewFolderPreview(true);
	});
}

//Function: Renders all the already existing folders and gives them an onclick listener
function renderExistingFolders() {
	var i;
	var thereAreFolders;
	//Checks if there are any folders
	for (i = 0; i < localSettings.bookmarks.length; i++) {
		if (localSettings.bookmarks[i].type == 'folder') thereAreFolders = true;
	}
	//If there are folders, empty the existing folders container
	if (thereAreFolders) {
		existingFoldersContainer.innerHTML = "";
		//Generate all elements, with a negative ID
		for (i = 0; i < localSettings.bookmarks.length; i++) {
			if (localSettings.bookmarks[i].type == 'folder') {
				debugLog(`renderExistingFolders, loop 2; i is ${i}`)
				currentElement = localSettings.bookmarks[i];
				existingFoldersContainer.innerHTML += genFolderElement(i, currentElement, `existing-folder-${i.toString()}`);
			}
		}
		//Now add them a custom Listener, which moves the element in the folder
		for (i = 0; i < localSettings.bookmarks.length; i++) {
			if (localSettings.bookmarks[i].type == 'folder') {
				id = "existing-folder-" + i.toString(); debugLog(`renderExistingFolders, loop 3; id is ${id}`)
				makeExistingFolderListen(id);
			}
		}
	}
}

function makeExistingFolderListen(id) {
	debugLog(`makeExistingFolderListen; id is ${id}`)
	elem = document.getElementById(id);
	elem.addEventListener("click", function (e) {
		var origElem = e.srcElement || e.originalTarget;
		moveIntoFolderFun(origElem);
		notify(curLang.toFolder);
		newFolderDiag();
	});

}

//Function: randomly returns a primary color. 50% change of getting a predefined one, and 50% of getting a fully randomized one

function randomColor(nonRandom, minimum = 360) {
	const colorWheel = [[255, 23, 68], [245, 0, 87], [213, 0, 249], [101, 31, 255], [61, 90, 254], [41, 121, 255],
	[0, 176, 255], [0, 229, 255], [29, 233, 182], [0, 230, 118], [118, 255, 3],
	[198, 255, 0], [255, 234, 0], [255, 196, 0], [255, 145, 0], [255, 61, 0]]

	const randomComponent = () => Math.floor(Math.random() * 256);
	let newColor, rr, gr, br;

	minimum = (Math.max(0, Math.min(765, minimum)))
	nonRandom = (nonRandom) ? true : Math.round(Math.random())
	if (nonRandom) {
		let random = Math.floor(Math.random() * colorWheel.length);
		[rr, gr, br] = colorWheel[random];
		debugLog("Color Wheel Color picked")
	}
	else {
		rr = randomComponent();
		gr = randomComponent();
		br = randomComponent();
		debugLog("RNG Color picked")
	}

	let currentBrightness = rr + gr + br;
	if (currentBrightness < minimum) {
		let gammaCorrection = minimum - currentBrightness;
		const evenGammaDistribution = (channel) => (channel == 0) ? 0 : Math.floor((gammaCorrection * (channel / currentBrightness)));
		const roofCap = (value) => Math.min(value, 255)
		let components = [rr, gr, br]
		debugLog(`The minimum brightness of ${minimum} was not reached by RGB(${components.toString()}),`
			+ ` a gamma correction of ${gammaCorrection} will be applied`)

		componentCorrection = [
			evenGammaDistribution(rr), evenGammaDistribution(gr), evenGammaDistribution(br)
		]
		components = components.map((val, i) => roofCap(val + componentCorrection[i]));

		const correctionSum = componentCorrection.reduce((a, b) => a + b, 0);
		if (correctionSum < gammaCorrection) {
			let position = components.indexOf(Math.max(...components));
			components[position] = roofCap(components[position] + (gammaCorrection - correctionSum));
		}

		let newBrightness = () => components.reduce((a, b) => a + b, 0);
		debugLog(`Gamma-corrected result: RGB(${components.toString()}). New brightness: ${newBrightness()}`)
		while (newBrightness() < minimum) {
			components = components.map(v => roofCap(v + 1))
		}
		if (newBrightness() != minimum) components[components.indexOf(Math.min(...components))] += -1;
		debugLog(`Redistributed result: RGB(${components.toString()}). New brightness: ${newBrightness()}`)
		newColor = rgbToHex(roofCap(components[0]), roofCap(components[1]), roofCap(components[2]))
	}
	else newColor = rgbToHex(rr, gr, br);

	if (lastRandomColor != newColor) {
		lastRandomColor = newColor;
		return newColor;
	}
	else return randomColor(nonRandom, minimum);
}

//Function: deletes the current element and moves it into a folder instead
function moveIntoFolderFun(elem) {
	var arrayPos = parseInt(elem.attributes.nm.value, 10); debugLog(`moveIntoFolderFun; arrayPos is ${arrayPos}`)
	var current = localSettings.bookmarks[curBookmarkToFolder]; debugLog(`moveIntoFolderFun; localSettings.bookmarks is ${JSON.stringify(localSettings.bookmarks)}`)
	localSettings.bookmarks[arrayPos].content.push(current);
	localSettings.bookmarks.splice(curBookmarkToFolder, 1);
	savePreferences();
	renderElements();
}

//Function converts a bookmark into a folder, from the dialog too
function makeIntoFolder(arrayPos, name, icon) {
	folder = { 'name': name, 'type': 'folder', 'color': curRandomColor, 'icon': icon, 'content': [localSettings.bookmarks[arrayPos]] };
	localSettings.bookmarks[arrayPos] = folder;
	savePreferences();
	notify(curLang.toFolder);
	newFolderDiag();
	renderElements();
}

function makeIntoFolderDiag() {
	makeIntoFolder(curBookmarkToFolder, newFolderNameType.value, newFolderIconType.value)
}


//Debug functions: Logs something in the console if debug is enabled, toggles debug mode
function debugLog(string) {
	if (localSettings.debug) console.log(string)
}

function toggleDebug(bool) {
	toggle = (bool) ? bool : !localSettings.debug;
	localSettings.debug = toggle;
	savePreferences();
	location.reload();
}


//Function: Toggles altBookMode, which consents to open a bookmark/folder via CTRL + 0-9
function altBookMode(bool) {
	if (bool) {
		altIsDown = true;
		curContainer = (folder.open) ? folderContentContainer : bookmarksContainer;
		curArray = (folder.open) ? folder.current.content : localSettings.bookmarks;

		curContainer.classList.toggle("in-use", true);
		searchAction.innerText = curLang.openShortcut;

		var bookCircles = curContainer.getElementsByClassName("bookmark-circle");
		for (var i = 0; i < curArray.length; i++) {
			currentBook = bookCircles[i].getBoundingClientRect();
			if (9 > i) genAltBadge(curContainer, i + 1, currentBook.x + 27, currentBook.y - 7);
			else genAltBadge(curContainer, "emoticon-sad-outline", currentBook.x + 27, currentBook.y - 7, true);
		}
		if (folder.open) {
			hideFolderButton.classList.toggle("in-use", true);
			goBackPos = hideFolderButton.getElementsByClassName("bookmark-circle")[0].getBoundingClientRect();
			genAltBadge(curContainer, "keyboard-esc", goBackPos.x + 27, goBackPos.y - 7, true)
		}
	}
	else {
		altIsDown = false;
		bookmarksContainer.classList.toggle("in-use", false);
		folderContentContainer.classList.toggle("in-use", false);
		hideFolderButton.classList.toggle("in-use", false);
		hideTip();

		var aliveBadges = document.getElementsByClassName('alt-badge');
		while (aliveBadges[0]) {
			aliveBadges[0].parentNode.removeChild(aliveBadges[0]);
		}
	}
}
function genAltBadge(parent, value, x, y, mIcon) {
	cln = altBadgeScheme.cloneNode(true)
	currentBadge = parent.appendChild(cln);
	
	currentBadge.style.top = Math.round(y) + "px";
	currentBadge.style.left = Math.round(x) + "px";
	if (mIcon) currentBadge.lastChild.classList.add("Micon", "mdi-" + value);
	else currentBadge.lastChild.innerText = value;
}
