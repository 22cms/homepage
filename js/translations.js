//Translations
var translations = {
	"en" : {
		"languageName" : "English",
		"languageEmoji" : "&#x1F1EC&#x1F1E7",
		
		"typeHere" : "Type here",
		"searchOn" : "Search on <engine>",
		"goToTheURL" : "Go to the URL",
		"evalJSCode" : "Evaluate the JS Code",
		"newSearchEngineAdded" : "The new search engine has been added",
		"newSearchEngineError" : "The Search engine URL does not contain any <query> tag. Check it the provided URL is correct.",
		"newBookmarkAdded" : "The new bookmark has been added",
		"searchEngineRemoved" : "The Search engine has been removed",
		"searchEngineRemoveError" : "You need at least 1 Search engine to let the site work properly",
		"bookmarkRemoved" : "The bookmark has been removed",
		"goTo" : "Go to <name>"
	},
	"it" : {
		"languageName" : "Italiano",
		"languageEmoji" : "&#x1F1EE&#x1F1F9",
		
		"typeHere" : "Digita qui",
		"searchOn" : "Cerca su <engine>",
		"goToTheURL" : "Vai all'URL",
		"evalJSCode" : "Esegui il codice JS",
		"newSearchEngineAdded" : "Il nuovo motore di ricerca \u00E8 stato aggiunto",
		"newSearchEngineError" : "L'URL del motore di ricerca che si \u00E8 tentati di aggiungere non contiene nessun tag <query>, controllare che l'URL sia stato digitato correttamente.",
		"newBookmarkAdded" : "Il nuovo segnalibro \u00E8 stato aggiunto",
		"searchEngineRemoved" : "Il motore di ricerca \u00E8 stato rimosso",
		"searchEngineRemoveError" : "Hai bisogno di almeno 1 motore di Ricera per far funzionare il sito correttamente",
		"bookmarkRemoved" : "Il segnalibro \u00E8 stato rimosso",
		"goTo" : "Vai su <name>"
	},
	"nap" : {
		"languageName" : "Napulitano",
		"languageEmoji" : "&#x1F535",
		
		"typeHere" : "Scrive 'cca",
		"searchOn" : "Circa cu <engine>",
		"goToTheURL" : "Vaje a l'URL",
		"evalJSCode" : "Seguisce 'o cumanno JS",
		"newSearchEngineAdded" : "'O nuovo mutor 'e ricirca \u00E8 stat' junto",
		"newSearchEngineError" : "L'URL 'ddo mutor 'e ricirca ch'\u00E8 pruvate a mettere nun tene nisciun tag <query>, cuntruolla si l'URL è statu scritto buone.",
		"newBookmarkAdded" : "'O nuovo signalibbro \u00E8 stat' junto",
		"searchEngineRemoved" : "'O mutor 'e ricirca \u00E8 state luato",
		"searchEngineRemoveError" : "T'\u00E8 ten\u00E9 pe 'llu meno 'nu mutor 'e ricirca ppe fa funzionà 'o sito",
		"bookmarkRemoved" : "'O signalibbro \u00E8 state luato",
		"goTo" : "Vaje 'ngopp 'a <name>"
	},
}

//Applies all settings about languages
var curLang = translations["en"];
var curLangCode = "en";
var unbiasedLanguageCode = navigator.language.split("-")[0];
if (unbiasedLanguageCode in translations) {
	curLang = translations[unbiasedLanguageCode];
	curLangCode = unbiasedLanguageCode;
}

if (localStorage.getItem('curLang')) {
	curLang = translations[localStorage.getItem('curLang')];
	curLangCode = localStorage.getItem('curLang');
}

localStorage.setItem("curLang", curLangCode)
