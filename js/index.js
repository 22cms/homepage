//Loads the settings object from localStorage

var localSettings = {
	"searchEngines" : [
		["Google", "https://www.google.com/search?q=<query>"],
		["Wikipedia", "https://en.wikipedia.org/w/index.php?search=<query>"],
		["Deezer", "https://www.deezer.com/search/<query>"],
	],
	"bookmarks" : [
		["YouTube", "https://www.youtube.com"],
		["Deezer", "https://www.deezer.com"],
		/*["Example Folder", "#DE0085", "folder-outline", [
				["Google", "https://www.google.com"],
				["Wikipedia", "https://en.wikipedia.org"],
			] 
		],Example Folder scheme, the code distinguish them via length (a bookmark's length is 2, while folders' is 5)*/
	],
	"showSettingsIcon" : true,
	"resizeSearchFont" : true,
	"switchEngineWithArrows" : true,
	"useFaviconIco" : true,
};

if (localStorage.getItem("localSettings")) localSettings = JSON.parse(localStorage.getItem("localSettings"));

//Search Engines. The First in the List is the default one

searchEngines = localSettings.searchEngines;

const engineSelectorScheme = '<img src="<URL>" id="<id>" class="search-engine" onerror="this.src=\'imgs/404.svg\'" nm="<arrayPosition>">'

var currentEngine = searchEngines[0];
var currentEngineNum = 0;
var URLMode = false;
var evalMode = false;
var removeMode = 0; //removeMode is deprecated

//Bookmarks. Alias links to some external website

bookmarks = localSettings.bookmarks;

const bookmarkLinkScheme = '<div id="<id>" class="bookmark-link centerbox" nm="<arrayPosition>"><div class="bookmark-circle centerbox"><img src="<URL>" class="bookmark-icon" onerror="this.src=\'imgs/404.svg\'"></div><p class="bookmark-title"><title></p></div>';
const folderScheme = '<div id="<id>" nm="<arrayPosition>" class="bookmark-link centerbox"><div class="bookmark-circle centerbox"><div class="centerbox" style="color: <color>; text-shadow: 0px 2px 6px <color>;"><span class="Micon folder-icon mdi-<icon>"></span></div></div><p class="bookmark-title"><title></p></div>'

const languageSelectScheme = '<option value="<key>"><emoji> <lang></option>'

//Declares the Searchbox and the tip behind it, also declares the Action Tip and the :root for CSS variables, and also the settings overlay objects
//Declares Search Engines, Bookmarks and Folder View containers 
//Declares the Settings Icon Button
//Declares the contextMenu element and variables related to it

const body = document.body;
const searchBox = document.getElementById("search-box");
const searchTip = document.getElementById("search-tip");
const searchAction = document.getElementById("searchbox-action");
var maxCharacters;

const searchEnginesContainer = document.getElementById("searchengines-container");
const bookmarksContainer = document.getElementById("bookmarks-container");

const folderContainer = document.getElementById("folder-container");
const folderContentContainer = document.getElementById("folder-content-container");
var currentFolderPos;
var currentFolder;

const settingsOverlay = document.getElementById("settings-overlay");
const settingsAddElementForm = document.getElementById("add-element-form");
const settingsLanguageSelect = document.getElementById("language-select");
const customColorPicker = document.getElementById("custom-color-picker");

const notifPopUp = document.getElementById("notif-popup");
const notifText = document.getElementById("notif-text");

const rootCSS = document.querySelector(":root");
const themeAdvisor = document.getElementById("theme-advisor");

const settingsIcon = document.getElementById("settings-icon");
const settingsShowIcon = document.getElementById("settings-show-icon");

const hideFolderButton = document.getElementById("hide-folder-button");

const newFolderOverlay = document.getElementById("newfolder-overlay");
const newFolderContainer = document.getElementById("newfolder-container");
const newFolderNameType = document.getElementById("folder-nametype");
const newFolderIconType =  document.getElementById("folder-icontype");
const existingFoldersContainer = document.getElementById("existingfolders-container");
var curBookmarkToFolder;
var curRandomColor;

const contextMenu = document.getElementById("context-menu");
const contextNewTab = document.getElementById("context-newtab");
const contextDefault = document.getElementById("context-default");
const contextNewFolder = document.getElementById("context-newfolder");
var contextElemType;
var contextArrayPos;
var contextVisible;



//On Load Function: Renders all the elements of the page (should probably be splitten)

function renderElements() {
	//Deletes every pre-rendered element
	searchEnginesContainer.innerHTML = "";
	bookmarksContainer.innerHTML = "";
	settingsLanguageSelect.innerHTML = "";
	//If a custom color scheme is present in localSettings, load it in customColorPicker
	if (localSettings.customColorTheme) customColorPicker.value = localSettings.customColorTheme;
	//Generates every element, adds adds event listener for every one of them, sets the default search engine and starts hideTip()
	var i;
	for (i = 0; i < searchEngines.length; i++) {
		searchEnginesContainer.innerHTML += genSearchElement(i);
	}
	for (i = 0; i < bookmarks.length; i++) {
		if (bookmarks[i].length == 4)
			bookmarksContainer.innerHTML += genFolderElement(i);
		else bookmarksContainer.innerHTML += genBookmarkElement(i);
	}
	//Adds Event Listeners
	for (i = 0; i < searchEngines.length; i++) {
		id = "search-engine-" + i.toString();
		makeEngineListen(id);
	}
	for (i = 0; i < bookmarks.length; i++) {
		if (bookmarks[i].length == 4) {
			id = "folder-" + i.toString();
			makeFolderListen(id);
		}
		else {
			id = "bookmark-" + i.toString();
			makeBookmarkListen(id);
		}
	}
	
	document.getElementsByClassName("search-engine")[0].classList.add("in-use")
	currentEngine = searchEngines[0];
	hideTip();
	//Generates the Language Selector Entries
	for (i = 0; i < Object.keys(translations).length; i++) {
		settingsLanguageSelect.innerHTML += genLanguageElement(i)
	}
	settingsLanguageSelect.value = curLangCode;
	//Calculates the Screen size for font regulation
	maxCharacters = Math.floor(body.clientWidth / 64)
	maxCharacters += Math.floor(maxCharacters/8);
	//Hides the settings button if it's set to
	
	settingsIcon.classList.toggle("fHidden", !localSettings.showSettingsIcon);
	//Applies the custom color scheme if it's set to
	if (localSettings.customColorTheme) createCustomColorScheme(localSettings.customColorTheme);
	//Runs loadCheckboxes
	loadCheckboxes();
}

renderElements();

//Function: When the searchbox changes, if something is written in it, change the text behind it to "",else put it back to the original value.
// + asks to enable the URL Mode if the input is an URL
function hideTip() {
	searchBox.classList.remove("fHidden");
	searchBox.focus();
	regulateSearchFontSize(searchBox.value);
	
	searchTip.innerText = (!searchBox.value) ? curLang.typeHere : "";
	searchAction.innerText = curLang.searchOn.replace("<engine>", currentEngine[0]);
	
	if (validURL(searchBox.value)) { toggleURLMode(true); searchAction.innerText = curLang.goToTheURL }
	else if (validCommand(searchBox.value)) { toggleEvalMode(true); searchAction.innerText = curLang.evalJSCode }
	else { toggleURLMode(false), toggleEvalMode(false); };
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
}

//Function: Enables/Disabls the Eval Mode for the searchbox
function toggleEvalMode(toggle) {
	evalMode = toggle;
	
	searchBox.classList.toggle("searchbox-eval", toggle);
}

//Function: Goes to the URL specified, adding "https://" if needed
function goToURL(URL, newTab) { 
		if (!(URL.includes("://") || URL.includes("about:"))) URL = "https://" + URL;
		if (!newTab) window.location.href = URL;
		else window.open(URL, '_blank');
}

//Function: Goes to the URL of the clicked bookmark.
function goToBookmarkURL(element, newTab, isChild) {
	arrayPosition = parseInt(element.attributes.nm.value, 10);
	
	if (!removeMode) {
		curBookmarkSource = (isChild) ? currentFolder[3] : bookmarks;
		URL = curBookmarkSource[arrayPosition][1];
		goToURL(URL, newTab);
	}
	else {
		removeSpecBookmark(arrayPosition);
		removeMode = false;
	}
}

//Listener: When the enter Key has ben pressed, search the sentence using the search engine which has been choosen, unless it's an URL or a command;
//If the up or down arrow keys have been pressed, switch the search engine to the next/previous one

document.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
		case 13:
			if (searchBox === document.activeElement & searchBox.value != "") {
				if (evalMode) searchAction.innerText = eval(searchBox.value.slice(2));
				else if (!URLMode) searchViaBox();
				else goToURL(searchBox.value);
			}
		break;
		case 38:
			if (localSettings.switchEngineWithArrows) {
				if (currentEngineNum == 0) switchEngineTo(searchEngines.length-1, false);
				else switchEngineTo(currentEngineNum-1, false);
			}
		break;
		case 40: 
			if (localSettings.switchEngineWithArrows) {
				if (currentEngineNum == searchEngines.length-1) switchEngineTo(0, false);
				else switchEngineTo(currentEngineNum+1, false);
			}
		break;
	};
});

//Function: Search using the current Search Engine 
function searchViaBox() {
	searchBoxText = searchBox.value;
	if (searchBoxText.charAt(0) == ".") searchBoxText = searchBoxText.substring(1)
	
	window.location.href = currentEngine[1].replace("<query>", encodeURIComponent(searchBoxText));
}


//Functions: Change the Search Engine to the Engine Specified, from the engine number or the element
function switchEngineTo(number, isFromElem) {
	
	if (!removeMode) {
		if (isFromElem) {
			var engine = parseInt(number.attributes.nm.value, 10);
			currentEngine = searchEngines[engine];
			currentEngineNum = engine;
			document.getElementsByClassName("in-use")[0].classList.remove("in-use");
			number.classList.add("in-use");
		}
		else {
			currentEngine = searchEngines[number];
			currentEngineNum = number;
			document.getElementsByClassName("in-use")[0].classList.remove("in-use");
			document.getElementsByClassName("search-engine")[number].classList.add("in-use");
			
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
	if ((strArray[0] != "" || str.includes("://")) && !str.includes(" ") && str.includes(".") && strArray[strArray.length-1] != "") result = true; 
	return result;
}

//Function: Checks if the sentence starts with ".$", in that case, it's a command.
function validCommand(str) {
	strIn2 = str.slice(0, 2);
	return (strIn2 == ".$")
} 

//Function: Makes a new Search engine Element
function genSearchElement(arrayPosition) {
	var engine = searchEngines[arrayPosition];
	var currentData = {
		"<URL>" : fetchFaviconFromAPI(engine[1].replace(/http(s|):\/\//g, "").split("/")[0]),
		"<id>" : 	`search-engine-${arrayPosition.toString()}`,
		"<arrayPosition>" : arrayPosition
	}
	
	var engineSelector = engineSelectorScheme;
	for(let k in currentData) {
        engineSelector = engineSelector.replace(new RegExp(k, 'g'), currentData[k]);
    }
	
	return engineSelector;
}

//Function: Makes a new Bookmark Element
function genBookmarkElement(arrayPosition, isChild) {
	var bookmark = (isChild) ? currentFolder[3][arrayPosition] : bookmarks[arrayPosition];
	var currentData = {
		"<URL>" : fetchFaviconFromAPI(bookmark[1].replace(/http(s|):\/\//g, "").split("/")[0]),
		"<title>" : bookmark[0],
		"<id>" : 	(isChild) ? `child-bookmark-${arrayPosition.toString()}` : `bookmark-${arrayPosition.toString()}`,
		"<arrayPosition>" : arrayPosition
	}
	
	var bookmarkSelector = bookmarkLinkScheme;
	for(let k in currentData) {
        bookmarkSelector = bookmarkSelector.replace(new RegExp(k, 'g'), currentData[k]);
    }
	
	return bookmarkSelector;
}

//Function: Makes a new Folder Element
function genFolderElement(arrayPosition, directElem, directId) {
	var current = (!directElem) ? bookmarks[arrayPosition] : directElem;
	var currentData = {
		"<id>" : (directId) ? directId : `folder-${arrayPosition.toString()}`,
		"<arrayPosition>" : arrayPosition,
		"<title>" : current[0],
		"<color>" : current[1],
		"<icon>" : current[2]
	}
	
	var folderSelector = folderScheme;
	for(let k in currentData) {
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
	
	elem.addEventListener("mouseenter", function(e){ 
		var origElem = e.srcElement || e.originalTarget; 
		describeURL(origElem);
	});
	elem.addEventListener("mouseleave", function(e){ 
		hideTip();
	});
	elem.addEventListener("click", function(e){
		var origElem = e.srcElement || e.originalTarget;
		goToBookmarkURL(origElem);
	});
	elem.addEventListener("contextmenu", function(e){ 
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, 1);
	});
	elem.addEventListener("auxclick", function(e){
		var origElem = e.srcElement || e.originalTarget;
		if(e.which == 2) goToBookmarkURL(origElem, true);
	});
}

function makeChildBookmarkListen(id) {
	elem = document.getElementById(id);
	
	elem.addEventListener("mouseenter", function(e){ 
		var origElem = e.srcElement || e.originalTarget; 
		describeURL(origElem, true);
	});
	elem.addEventListener("mouseleave", function(e){ 
		hideTip();
	});
	elem.addEventListener("click", function(e){
		var origElem = e.srcElement || e.originalTarget;
		goToBookmarkURL(origElem, false, true);
	});
	elem.addEventListener("contextmenu", function(e){ 
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, 2);
	});
	elem.addEventListener("auxclick", function(e){
		var origElem = e.srcElement || e.originalTarget;
		if(e.which == 2) goToBookmarkURL(origElem, true, true);
	});
}

function makeFolderListen(id) { 
	elem = document.getElementById(id);
	
	elem.addEventListener("mouseenter", function(e){ 
		var origElem = e.srcElement || e.originalTarget; 
		describeFolder(origElem);
	});
	elem.addEventListener("mouseleave", function(e){ 
		hideTip();
	});
	elem.addEventListener("click", function(e){
		var origElem = e.srcElement || e.originalTarget;
		showFolder(origElem);
	});
	elem.addEventListener("contextmenu", function(e){ 
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, 3);
	});
}

function makeEngineListen(id) {
	elem = document.getElementById(id);
	
	elem.addEventListener("mouseenter", function(e){ 
		var origElem = e.srcElement || e.originalTarget; 
		describeEngine(origElem);
	});
	elem.addEventListener("mouseleave", function(e){ 
		hideTip();
	});
	elem.addEventListener("click", function(e){
		var origElem = e.srcElement || e.originalTarget;
		switchEngineTo(origElem, true);
	});
	elem.addEventListener("contextmenu", function(e){ 
		e.preventDefault();
		var origElem = e.srcElement || e.originalTarget;
		elemContextMenu(e, origElem, false);
	});
}


//Function: Selects the right Favicon API and generates the URL
function fetchFaviconFromAPI(URL) {
	API = (localSettings.useFaviconIco) ? "https://<URL>/favicon.ico" : "https://api.faviconkit.com/<URL>/64";
	
	return API.replace("<URL>", URL)
}


//Functions: Adds a new Search engine or a new Bookmark to the Array and saves the list in the localStorage element
function addNewEngine(name, url) {
	if (url.includes("<query>")) {
		searchEngines.push([name, url])
	
		savePreferences();
		renderElements();
		notify(curLang.newSearchEngineAdded);
	}
	else notify("<span style='color: red;'>" + curLang.newSearchEngineError + "</span>")
}

function addNewBookmark(name, url) {
	bookmarks.push([name, url])
	
	savePreferences();
	renderElements();
	notify(curLang.newBookmarkAdded);
	}

//Functions: Removes the Search engine or the Bookmark from the Array and saves the list in the localStorage element
function removeSpecEngine(arrayPosition) {
	if (searchEngines.length > 1) {
		searchEngines.splice(arrayPosition, 1)
	
		savePreferences();
		renderElements();
		notify(curLang.searchEngineRemoved);
	}
	else notify(curLang.searchEngineRemoveError)
}

function removeSpecBookmark(arrayPosition, isChild) {
	workingArray = (isChild) ? currentFolder[3] : bookmarks;
	workingArray.splice(arrayPosition, 1)

	savePreferences();
	if (isChild) renderFolderElems();
	else renderElements();
	notify(curLang.bookmarkRemoved);
}


//Function: Saves the preferences in the browser localStorage

function savePreferences() {
	localSettings.searchEngines = searchEngines;
	localSettings.bookmarks = bookmarks;
	fixedElements = document.getElementsByClassName("settings-checkbox");
	for (var i = 0; i < fixedElements.length; i++) {
		varid = fixedElements[i].attributes.varid.value;
		localSettings[varid] = fixedElements[i].checked;
	}
	
	localStorage.setItem("localSettings", JSON.stringify(localSettings));
}

//Function: Shows the Bookmark/Search Engine/Folder infos when it is hovered
function describeURL(elem, isChild) {
	var arrayPosition = parseInt(elem.attributes.nm.value, 10);
	var curBookmarkSource = (isChild) ? currentFolder[3] : bookmarks;
	var elem = curBookmarkSource[arrayPosition];
	
	searchBox.classList.add("fHidden");
	searchAction.innerText = curLang.goTo.replace("<name>", elem[0]);
	searchTip.innerText = elem[1].replace(/http(s|):\/\//g, "");
	regulateSearchFontSize(searchTip.innerText);
}

function describeEngine(elem) {
	var arrayPosition = parseInt(elem.attributes.nm.value, 10);
	var name = searchEngines[arrayPosition][0];
	
	searchAction.innerText = curLang.searchOn.replace("<engine>", name);
}

function describeFolder(elem) {
	var arrayPosition = parseInt(elem.attributes.nm.value, 10);
	var elem = bookmarks[arrayPosition];
	
	searchBox.classList.add("fHidden");
	searchAction.innerText = curLang.openFolder.replace("<title>", elem[0]);
	searchTip.innerText = (elem[3].length) ? folderDescription(elem[3]) : curLang.emptyFolder;
	regulateSearchFontSize(searchTip.innerText);
}

//Function: makes a folder description
function folderDescription(array) {
	var result = "";
	for (var i = 0; i < array.length; i++) {
		result += array[i][0];
		if (i >= 3) {
			result += "...";
			break;
		}
		if (i != array.length-1) result += ", ";
	}
	
	return result
}


//Function: Regulates the font size accordingly to its length, if it exceeds a precise number of characterSet
var newCharSize;

function getThemeInfo() {
	newCharSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--searchtype-onecharsize').replace("px", ""), 10)
	maxCharacters = Math.floor(screen.width / newCharSize); //maxCharacters is calculated from the screen width itself
	maxCharacters += Math.floor(maxCharacters/8); //Gives some extra tolerance coz it's kinda cool
}
getThemeInfo();

function regulateSearchFontSize(baseElem) {
	if (localSettings.resizeSearchFont) {
		newFontSize = getComputedStyle(document.documentElement).getPropertyValue('--searchtype-sizeorig');
		fontSizeInt = parseInt(newFontSize.replace("px", ""), 10);
		if (baseElem.length > maxCharacters) {
			newFontSize = (fontSizeInt / 2 * (maxCharacters / baseElem.length) *2).toString() + "px"
		}
		
		rootCSS.style.setProperty ("--searchtype-size", newFontSize)
	}
}

//Function: Opens/Hides the settings page {
function settings() {
	settingsOverlay.classList.toggle("sHidden");
}

//Function: adds the new element which has just been made in the settings overlay

function addFormElem() {
	name = settingsAddElementForm.name.value;
	URL = settingsAddElementForm.url.value;
	type = settingsAddElementForm.elementType.value; 
	
	if (type == "searchEngine") addNewEngine(name, URL);
	if (type == "bookmark") addNewBookmark(name, URL);
	settings();
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
	var interval = setInterval(function() {
		counter++;
		if (counter == 5) {
			notifPopUp.classList.add("nHidden")
		}
	}, 1000);

}

//Function: Stringifies the localSettings JSON, makes it a command, and places it all in the searchBox,
//making a command that autorestores all personal settings.

function exportToSearchBox() {
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
	var advisorMessage = "You're Using the \"" + themeName + "\" Theme, <a href='index.html' class='searchbox-url'>Click here</a> to change it to the default one";
	
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
	const {normalizedX, normalizedY} = normalizePosition(x, y); 
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

  return {normalizedX, normalizedY};
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
	workingArray = (!contextElemType) ? searchEngines : (contextElemType != 2 || contextElemType == 3) ? bookmarks : currentFolder[3];
	
	element = workingArray[contextArrayPos];
	calcDirection = (direction) ? 1 : -1; 
	workingArray.splice(contextArrayPos, 1);
	workingArray.splice(contextArrayPos+calcDirection, 0, element);
	
	if (!contextElemType) searchEngines = workingArray;
	else if (contextElemType == 2) currentFolder[3] = workingArray;
	else bookmarks = workingArray;
	
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
	workingArray = searchEngines;
	
	element = workingArray[contextArrayPos];
	workingArray.splice(contextArrayPos, 1);
	workingArray.splice(0, 0, element);
	
	searchEngines = workingArray;
	
	renderElements();
	savePreferences();
	contextClose();
}

//Function: opens a new Tab from a bookmark

function contextTab() {
	goToURL(bookmarks[contextArrayPos][1], true);
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

function createCustomColorScheme(hexColor) {
	colorInRGB = hexToRgb(hexColor);
	
	colorBackground = [Math.floor(colorInRGB.r*25/189), Math.floor(colorInRGB.g*32/230), Math.floor(colorInRGB.b*34/251)];
	colorBackground = rgbToHex(colorBackground[0], colorBackground[1], colorBackground[2]);
	
	colorCircles = [Math.floor(colorInRGB.r*61/189), Math.floor(colorInRGB.g*76/230), Math.floor(colorInRGB.b*82/251)];
	colorCircles = rgbToHex(colorCircles[0], colorCircles[1], colorCircles[2]);
	
	if ((colorInRGB.r + colorInRGB.g + colorInRGB.b) > 160) {
		colorTip = hexColor + "60";
		colorAction = hexColor + "50";
		colorPrimary = hexColor;
	} else {
		colorTip = rgbToHex(colorInRGB.r + 40, colorInRGB.g + 40, colorInRGB.b + 40);
		colorAction = rgbToHex(colorInRGB.r + 30, colorInRGB.g + 30, colorInRGB.b + 30);
		colorPrimary = rgbToHex(correctRGB(colorInRGB.r), correctRGB(colorInRGB.g), correctRGB(colorInRGB.b));
	}
	
	rootCSS.style.setProperty ("--customize-primary", colorPrimary);
	rootCSS.style.setProperty ("--customize-background", colorBackground);
	rootCSS.style.setProperty ("--customize-circles", colorCircles);
	rootCSS.style.setProperty ("--customize-searchtip", colorTip);
	rootCSS.style.setProperty ("--customize-searchaction", colorAction);
	
	localSettings.customColorTheme = hexColor;
	savePreferences();
}

function correctRGB(colorValue) {
	if (colorValue < 128) colorValue = colorValue + 80;
	return colorValue
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

function rgbToHex(r, g, b) { debugLog(`rgbToHex; r, g and b are ${r}, ${g} and ${b}`)
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
	currentFolderPos = arrayPosition;
	currentFolder = bookmarks[arrayPosition];
	renderFolderElems();
	
	folderContainer.classList.remove("fHidden");
	bookmarksContainer.classList.add("fHidden");
}


function hideFolder() {
	folderContainer.classList.add("fHidden");
	bookmarksContainer.classList.remove("fHidden");
}

//Funtion: render all Bookmarks of the current folder
function renderFolderElems() {
	childBookmarks = currentFolder[3];
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
hideFolderButton.addEventListener("click", function(){ 
		hideFolder();
});
hideFolderButton.addEventListener("mouseenter", function(){ 
		searchAction.innerText = curLang.goBack;
});
hideFolderButton.addEventListener("mouseleave", function(){ 
		hideTip();
});



//Function: Shows/hides the new folder dialog, and sets the working folder to the given value
function newFolderDiag(arrayPos) { debugLog(`newFolderDiag; arrayPos is ${arrayPos}`)
	if (arrayPos != undefined) curBookmarkToFolder = arrayPos;
	renderNewFolderPreview();
	renderExistingFolders();
	
	newFolderOverlay.classList.toggle("sHidden");
}

//Function: Renders the Folder Preview
function renderNewFolderPreview() {
	curRandomColor = randomColor();
	var currentElement = [newFolderNameType.value, curRandomColor, newFolderIconType.value, null];
	
	newFolderContainer.innerHTML = genFolderElement(-1, currentElement);
	document.getElementById("folder--1").addEventListener("click", function(e){
		renderNewFolderPreview();
	});
}

//Function: Renders all the already existing folders and gives them an onclick listener
function renderExistingFolders() {
	var i;
	var thereAreFolders;
	//Checks if there are any folders
	for (i = 0; i < bookmarks.length; i++) {
		if (bookmarks[i].length == 4) thereAreFolders = true; 
	}
	//If there are folders, empty the existing folders container
	if (thereAreFolders) {
		existingFoldersContainer.innerHTML = "";
		//Generate all elements, with a negative ID
		for (i = 0; i < bookmarks.length; i++) {
			if (bookmarks[i].length == 4) { debugLog(`renderExistingFolders, loop 2; i is ${i}`)
				currentElement = [bookmarks[i][0], bookmarks[i][1], bookmarks[i][2], null];
				existingFoldersContainer.innerHTML += genFolderElement(i, currentElement, `existing-folder-${i.toString()}`);
			}
		}
		//Now add them a custom Listener, which moves the element in the folder
		for (i = 0; i < bookmarks.length; i++) { 
			if (bookmarks[i].length == 4) { 
				id = "existing-folder-" + i.toString(); debugLog(`renderExistingFolders, loop 3; id is ${id}`)
				makeExistingFolderListen(id);
			}
		}
	}
}

function makeExistingFolderListen(id) { debugLog(`makeExistingFolderListen; id is ${id}`)
	elem = document.getElementById(id);
	elem.addEventListener("click", function(e){
		var origElem = e.srcElement || e.originalTarget;
		moveIntoFolderFun(origElem); 
		notify(curLang.toFolder);
		newFolderDiag();
	});
	
}

//Function: randomly returns a primary color. 50% change of getting a predefined one, and 50% of getting a fully randomized one
const colorWheel = ["#ff1744", "#f50057", "#D500F9", "#651fff", "#3d5afe", "#2979ff",
	"#00b0ff", "#00e5ff", "#1de9b6", "#00e676", "#76ff03", "#c6ff00",
	"#ffea00", "#ffc400", "#ff9100", "#ff3d00"];
	
function randomColor() {
	random = Math.floor(Math.random() * (colorWheel.length - 0 + 1) + 0);
	
	if (random < colorWheel.length) return colorWheel[random]; 
	else {
		rr = Math.floor(Math.random() * (255 - 120 + 1) + 120); 
		gr = Math.floor(Math.random() * (255 - 120 + 1) + 120);
		br = Math.floor(Math.random() * (255 - 120 + 1) + 120); 
		return rgbToHex(rr, gr, br);
	}
}

//Function: deletes the current element and moves it into a folder instead
function moveIntoFolderFun(elem) { 
	var arrayPos = parseInt(elem.attributes.nm.value, 10); debugLog(`moveIntoFolderFun; arrayPos is ${arrayPos}`)
	var current = bookmarks[curBookmarkToFolder]; debugLog(`moveIntoFolderFun; bookmarks is ${JSON.stringify(bookmarks)}`)
	bookmarks[arrayPos][3].push(current);
	bookmarks.splice(curBookmarkToFolder, 1);
	savePreferences();
	renderElements();
}

//Function converts a bookmark into a folder, from the dialog too
function makeIntoFolder(arrayPos, name, icon) {
	folder = [name, curRandomColor, icon, [bookmarks[arrayPos]] ];
	bookmarks[arrayPos] = folder;
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
