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
		"newSearchEngineError" : "The Search engine URL does not contain any &ltquery&gt tag. Check it the provided URL is correct.",
		"newBookmarkAdded" : "The new bookmark has been added",
		"searchEngineRemoved" : "The Search engine has been removed",
		"searchEngineRemoveError" : "You need at least 1 Search engine to let the site work properly.",
		"bookmarkRemoved" : "The bookmark has been removed",
		"goTo" : "Go to <name>",
		"exportNotif" : "Settings got exported succesfully, just copy this code and execute it where you want to restore them all.",
		"settingsIconHidden" : "To open the settings page, type .$settings() in the Search Bar",
		"settingsIconShown" : "The settings icon will be now shown again.",
	},
	"it" : {
		"languageName" : "Italiano",
		"languageEmoji" : "&#x1F1EE&#x1F1F9",
		
		"typeHere" : "Digita qui",
		"searchOn" : "Cerca su <engine>",
		"goToTheURL" : "Vai all'URL",
		"evalJSCode" : "Esegui il codice JS",
		"newSearchEngineAdded" : "Il nuovo motore di ricerca è stato aggiunto",
		"newSearchEngineError" : "L'URL del motore di ricerca che si è tentati di aggiungere non contiene nessun tag &ltquery&gt, controllare che l'URL sia stato digitato correttamente.",
		"newBookmarkAdded" : "Il nuovo segnalibro è stato aggiunto",
		"searchEngineRemoved" : "Il motore di ricerca è stato rimosso",
		"searchEngineRemoveError" : "Hai bisogno di almeno 1 motore di Ricera per far funzionare il sito correttamente",
		"bookmarkRemoved" : "Il segnalibro è stato rimosso",
		"goTo" : "Vai su <name>",
		"exportNotif" : "Le tue impostazioni sono state esportate, copia il codice che si trova nella barra di ricerca ed eseguilo dove vuoi per ripristinarle",
		"settingsIconHidden" : "Per aprire le impostazioni, digita .$settings() nella Barra di Ricerca",
		"settingsIconShown" : "L'icona delle impostazioni sarà mostrata di nuovo",
	},
	"nap" : {
		"languageName" : "Napulitano",
		"languageEmoji" : "&#x1F535",
		
		"typeHere" : "Scrive 'cca",
		"searchOn" : "Circa cu <engine>",
		"goToTheURL" : "Vaje a l'URL",
		"evalJSCode" : "Seguisce 'o cumanno JS",
		"newSearchEngineAdded" : "'O nuovo mutor 'e ricirca è stat' junto",
		"newSearchEngineError" : "L'URL 'ddo mutor 'e ricirca ch'è pruvate a mettere nun tene nisciun tag &ltquery&gt, cuntruolla si l'URL è statu scritto buone.",
		"newBookmarkAdded" : "'O nuovo signalibbro è stat' junto",
		"searchEngineRemoved" : "'O mutor 'e ricirca è state luato",
		"searchEngineRemoveError" : "T'è tené pe 'llu meno 'nu mutor 'e ricirca ppe fa funzionà 'o sito",
		"bookmarkRemoved" : "'O signalibbro è state luato",
		"goTo" : "Vaje 'ngopp 'a <name>",
		"exportNotif" : "'E preferenze toje anna state esportate, mietti 'stu codice e seguiscilo addò vuò tu ppe recuperà.",
		"settingsIconHidden" : "P'arapì 'a paggena 'dde preferenze, scrive .$settings() dinte 'a barra e ricirca",
		"settingsIconShown" : "L'icona 'dde preferenze mo vene mustrata",
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
