//Loads the settings object from localStorage
var localSettings = {};
if (localStorage.getItem("localSettings")) localSettings = JSON.parse(localStorage.getItem("localSettings"));

//Search Engines. The First in the List is the default one
var searchEngines = [
	["Google", "https://www.google.com/search?q=<query>"],
	["Wikipedia", "https://en.wikipedia.org/w/index.php?search=<query>"],
	["Deezer", "https://www.deezer.com/search/<query>"],
]
if (localStorage.searchEngines) searchEngines = localStorage.searchEngines;

const engineSelectorScheme = '<picture nm="<arrayPosition>" onmouseover="describeEngine(this)" onmouseleave="hideTip()" onclick="switchEngineTo(this, true)"> <source srcset="https://api.faviconkit.com/<URL>/64"> <img class="search-engine" src="imgs/404.svg"></picture>'

var currentEngine = searchEngines[0];
var currentEngineNum = 0;
var URLMode = false;
var evalMode = false;
var removeMode = 0;

//Bookmarks. Alias links to some external website
var bookmarks = [
	["YouTube", "https://www.youtube.com"],
	["Deezer", "https://www.deezer.com"],
]
if (localSettings.bookmarks) bookmarks = localSettings.bookmarks;

const bookmarkLinkScheme = '<div class="bookmark-link centerbox" nm="<arrayPosition>" onmouseover="describeURL(this)" onmouseleave="hideTip()" onclick="goToBookmarkURL(this)"><div class="bookmark-circle centerbox"><picture> <source srcset="https://api.faviconkit.com/<URL>/64"><img class="bookmark-icon" src="imgs/404.svg"></picture></div><p class="bookmark-title"><title></p></div>';

const languageSelectScheme = '<option value="<key>"><emoji> <lang></option>'

//Declares the Searchbox and the tip behind it, also declares the Action Tip and the :root for CSS variables, and also the settings overlay objects

const searchBox = document.getElementById("search-box");
const searchTip = document.getElementById("search-tip");
const searchAction = document.getElementById("searchbox-action");

const searchEnginesContainer = document.getElementById("searchengines-container");
const bookmarksContainer = document.getElementById("bookmarks-container");

const settingsOverlay = document.getElementById("settings-overlay");
const settingsAddElementForm = document.getElementById("add-element-form");
const settingsLanguageSelect = document.getElementById("language-select");

const notifPopUp = document.getElementById("notif-popup");
const notifText = document.getElementById("notif-text");

const rootCSS = document.querySelector(":root");
const themeAdvisor = document.getElementById("theme-advisor");

var maxCharacters;


//On Load Function: Renders all the right buttons for every search engine/bookmark

function renderElements() {
	searchEnginesContainer.innerHTML = "";
	bookmarksContainer.innerHTML = "";
	settingsLanguageSelect.innerHTML = "";
	
	var i;
	for (i = 0; i < searchEngines.length; i++) {
		searchEnginesContainer.innerHTML += genSearchElement(i);
	}
	for (i = 0; i < bookmarks.length; i++) {
		bookmarksContainer.innerHTML += genBookmarkElement(i);
	}
	document.getElementsByClassName("search-engine")[0].classList.add("in-use")
	currentEngine = searchEngines[0];
	hideTip();
	
	for (i = 0; i < Object.keys(translations).length; i++) {
		settingsLanguageSelect.innerHTML += genLanguageElement(i)
	}
	settingsLanguageSelect.value = curLangCode;
	
	maxCharacters = Math.floor(screen.width / 64)
	maxCharacters += Math.floor(maxCharacters/8);
}

renderElements();

//Function: When the searchbox changes, if something is written in it, change the text behind it to "",else put it back to the original value.
// + asks to enable the URL Mode if the input is an URL
function hideTip() {
	searchBox.classList.remove("fHidden");
	searchBox.focus();
	regulateSearchFontSize(searchBox.value);
	
	if (searchBox.value) searchTip.innerText = "";
	else searchTip.innerText = curLang.typeHere;
	searchAction.innerText = curLang.searchOn.replace("<engine>", currentEngine[0]);
	
	if (validURL(searchBox.value)) { toggleURLMode(true); searchAction.innerText = curLang.goToTheURL }
	else if (validCommand(searchBox.value)) { toggleEvalMode(true); searchAction.innerText = curLang.evalJSCode }
	else { toggleURLMode(false), toggleEvalMode(false); };
}

//Function: Enables/Disabls the URL Mode for the searchbox
function toggleURLMode(toggle) {
	URLMode = toggle;
	
	if (toggle) searchBox.classList.add("searchbox-url");
	else searchBox.classList.remove("searchbox-url");
}

//Function: Enables/Disabls the Eval Mode for the searchbox
function toggleEvalMode(toggle) {
	evalMode = toggle;
	
	if (toggle) searchBox.classList.add("searchbox-eval");
	else searchBox.classList.remove("searchbox-eval");
}

//Function: Goes to the URL specified, adding "https://" if needed
function goToURL(URL) { 
		if (!(URL.includes("http://") || URL.includes("https://"))) URL = "https://" + URL;
		window.location.href = URL;
}

//Function: Goes to the URL of the clicked bookmark.
function goToBookmarkURL(element) {
	arrayPosition = parseInt(element.attributes.nm.value, 10);
	
	if (!removeMode) {
		URL = bookmarks[arrayPosition][1];
		goToURL(URL);
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
			if (evalMode) searchAction.innerHTML = eval(searchBox.value.slice(2));
			else if (!URLMode) window.location.href = currentEngine[1].replace("<query>", encodeURIComponent(searchBox.value));
			else goToURL(searchBox.value);
		break;
		case 38:
			if (currentEngineNum == 0) switchEngineTo(searchEngines.length-1, false);
			else switchEngineTo(currentEngineNum-1, false);
		break;
		case 40: 
			if (currentEngineNum == searchEngines.length-1) switchEngineTo(0, false);
			else switchEngineTo(currentEngineNum+1, false);
		break;
	};
});


//Functions: Change the Search Engine to the Engine Specified, from the engine number or
function switchEngineTo(number, isFromElem) {
	
	if (!removeMode) {
		if (isFromElem == true) {
			var engine = parseInt(number.attributes.nm.value, 10);
			currentEngine = searchEngines[engine];
			currentEngineNum = engine;
			document.getElementsByClassName("in-use")[0].classList.remove("in-use");
			number.children[1].classList.add("in-use");
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
  /* Disabled 'cause of performance issues + was stolen, made a way worse version instead: var pattern = new RegExp( /*'^(https?:\\/\\/)?'+ // protocol 
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator 
  return !!pattern.test(str); */
	strArray = str.split(":")[0].split(".");
	var result = false;
	if ((strArray[0].length != "") && (str.includes("://") || (strArray.length > 1 && strArray[strArray.length - 1].length > 0 && (strArray[strArray.length - 1].length != "")))) result = true;
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
	var URL = engine[1].replace("https://", "").replace("http://", "");
	URL = URL.split("/")[0];
	
	var engineSelector = engineSelectorScheme.replace("<arrayPosition>", arrayPosition);
	engineSelector = engineSelector.replace("<URL>", URL);
	
	return engineSelector;
}

//Function: Makes a new Bookmark Element
function genBookmarkElement(arrayPosition) {
	var bookmark = bookmarks[arrayPosition];
	var URL = bookmark[1].replace("https://", "").replace("http://", "");
	URL = URL.split("/")[0];
	var title = bookmark[0]
	
	var bookmarkSelector = bookmarkLinkScheme.replace("<arrayPosition>", arrayPosition);
	bookmarkSelector = bookmarkSelector.replace("<URL>", URL).replace("<title>", title);
	
	return bookmarkSelector;
}

//Function: Makes a new language Element
function genLanguageElement(keyNum) {
	var language = translations[Object.keys(translations)[keyNum]];
	var key = Object.keys(translations)[keyNum];
	
	var languageSelector = languageSelectScheme.replace("<key>", key);
	languageSelector = languageSelector.replace("<emoji>", language.languageEmoji).replace("<lang>", language.languageName);
	
	return languageSelector;
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

function removeSpecBookmark(arrayPosition) {
	bookmarks.splice(arrayPosition, 1)

	savePreferences();
	renderElements();
	notify(curLang.bookmarkRemoved);
}


//Function: Saves the preferences in the browser localStorage

function savePreferences() {
	localSettings.searchEngines = searchEngines;
	localSettings.bookmarks = bookmarks;
	localStorage.setItem("localSettings", JSON.stringify(localSettings));
}

//Function: Shows the Bookmark info when it is hovered
function describeURL(element) {
	var arrayPosition = parseInt(element.attributes.nm.value, 10);
	var URL = bookmarks[arrayPosition][1];
	var name = bookmarks[arrayPosition][0];
	
	searchBox.classList.add("fHidden");
	searchAction.innerText = curLang.goTo.replace("<name>", name);
	searchTip.innerText = URL.replace("https://", "").replace("http://", "");
	regulateSearchFontSize(searchTip.innerText);
}

//Function: Shows the Search Engine info when it is hovered
function describeEngine(element) {
	var arrayPosition = parseInt(element.attributes.nm.value, 10);
	var name = searchEngines[arrayPosition][0];
	
	searchAction.innerText = curLang.searchOn.replace("<engine>", name);;
	regulateSearchFontSize(searchTip.innerText);
}

//Function: Regulates the font size accordingly to its length, if it exceeds a precise number of characterSet
var newCharSize;
var maxCharacters;

function getThemeInfo() {
	newCharSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--searchtype-onecharsize').replace("px", ""), 10)
	maxCharacters = Math.floor(screen.width / newCharSize); //maxCharacters is calculated from the screen width itself
	maxCharacters += Math.floor(maxCharacters/8); //Gives some extra tolerance coz it's kinda cool
}
getThemeInfo();

function regulateSearchFontSize(baseElem) {
	newFontSize = getComputedStyle(document.documentElement).getPropertyValue('--searchtype-sizeorig');
	fontSizeInt = parseInt(newFontSize.replace("px", ""), 10);
	if (baseElem.length > maxCharacters) {
		newFontSize = (fontSizeInt / 2 * (maxCharacters / baseElem.length) *2).toString() + "px"
	}
	
	rootCSS.style.setProperty ("--searchtype-size", newFontSize)
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
	console.log(newLang)
	curLang = translations[newLang];
	curLangCode = newLang;
	
	renderElements();
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
	
	notify(curLang.exportNotif);
}


//On Load Function: if the New Theme is not in use, change the themeAdvisor message 

function notifyRightTheme() {
	var themeName = getComputedStyle(document.documentElement).getPropertyValue('--theme-name');
	var advisorMessage = "You're Using the \"" + themeName + "\" Theme, <a href='index.html' class='searchbox-url'>Click here</a> to change it to the default one";
	
	if (themeName != "Default") themeAdvisor.innerHTML = advisorMessage;
}

notifyRightTheme();