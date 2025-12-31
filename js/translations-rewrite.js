class TranslationManager {
    constructor() {
        this.translations = {
	"en" : {
		"languageName" : "English",
		"languageEmoji" : "&#x1F1EC&#x1F1E7",
		
		"typeHere" : "Type here",
		"searchOn" : "Search on <engine>",
		"goToTheURL" : "Go to the URL",
		"goToSubReddit" : "Go to the Subreddit",
		"evalJSCode" : "Evaluate the JS Code",
		"commandExecuted": "Command executed",
		"openFolder" : "Open <title>",
		"goBack" : "Go back",
		"openShortcut" : "Open the shortcut",
		"newSearchEngineAdded" : "The new search engine has been added",
		"newSearchEngineError" : "The Search engine URL does not contain any &ltquery&gt tag. Check it the provided URL is correct.",
		"newBookmarkAdded" : "The new bookmark has been added",
		"searchEngineRemoved" : "The Search engine has been removed",
		"searchEngineRemoveError" : "You need at least 1 Search engine to let the site work properly.",
		"bookmarkRemoved" : "The bookmark has been removed",
		"goTo" : "Go to <name>",
		"exportNotif" : "Settings got exported and copied to clipboard, just execute the copied code where you want to restore them all.",
		"settingsIconHidden" : "To open the settings page, type .$settings() in the Search Bar",
		"settingsIconShown" : "The settings icon will be now shown again.",
		
		
		"settings" : "Settings",
		"enginesAndBookmarks" : "Search Engines/Bookmarks",
		"addElem" : "Add",
		"addAsEngine" : "Add as a Search Engine",
		"addAsBookmark" : "Add as a Bookmark",
		"switchEngineWithArrows" : "Switch Search Engines using 🠕 and 🠗 arrow keys",
		"enableAltShortcut" : "Open bookmarks and folder using ALT plus any keyboard number",
		"numPadInstead" : "Use Num Pad instead of number keys",
		"langAndTheme" : "Languages and Theming",
		"showSettingsIcon" : "Show the Settings Icon on the top-right corner",
		"enableAnimations" : "Enable animations",
		"enableBlur" : "Enable blur",
		"launchURLwhenClicked" : "Go to the typed URL/Subreddit when left clicked",
		"resizeSearchFont" : "Resize the font size while typing (if supported from the theme)",
		"applyColorTheme" : "Apply a custom Color Theme",
		"resetAndImport" : "Reset and Import",
		"settingsExport" : "Export Settings",
		"settingsReset" : "Reset All Settings",
		"settingsClose" : "Close",
		"contextDefault" : "Make Default",
		"contextNewTab" : "Open in new Tab",
		"contextLeft" : "Move to the left",
		"contextRight" : "Move to the right",
		"contextDelete" : "Delete element",
		"mobileDisclaimerNote" : "Note",
		"mobileDisclaimerText" : "This website is not meant to be used on mobile devices. Most of the features will work just fine, but it won't resemble the best user experience scenario.",
		"useFaviconIco" : "Use favicon.ico instead of DuckDuckGo API",
		"useOldReddit" : "Go to old.reddit.com when going to a subreddit",
		"moveIntoFolder" : "Move in a Folder",
		"addNewFolder" : "Create a new Folder",
		"useExistingFolder" : "Move into an existing folder",
		"noOtherFolders" : "There aren't any folders.",
		"folderUndo" : "Cancel", 
		"materialIconsRedirect" : "You can find all supported icon codes on Material Design Icons' website",
		"toFolder" : "The bookmark has been put in a Folder", 
		"emptyFolder" : "Empty Folder",
	},
	"it" : {
		"languageName" : "Italiano",
		"languageEmoji" : "&#x1F1EE&#x1F1F9",
		
		"typeHere" : "Digita qui",
		"searchOn" : "Cerca su <engine>",
		"goToTheURL" : "Vai all'URL",
		"goToSubReddit" : "Vai sul Subreddit",
		"evalJSCode" : "Esegui il codice JS",
		"commandExecuted": "Comando eseguito",
		"openFolder" : "Apri <title>",
		"goBack" : "Vai indietro",
		"openShortcut" : "Apri la scorciatoia",
		"newSearchEngineAdded" : "Il nuovo motore di ricerca è stato aggiunto",
		"newSearchEngineError" : "L'URL del motore di ricerca che si è tentati di aggiungere non contiene nessun tag &ltquery&gt, controllare che l'URL sia stato digitato correttamente.",
		"newBookmarkAdded" : "Il nuovo segnalibro è stato aggiunto",
		"searchEngineRemoved" : "Il motore di ricerca è stato rimosso",
		"searchEngineRemoveError" : "Hai bisogno di almeno 1 motore di Ricera per far funzionare il sito correttamente",
		"bookmarkRemoved" : "Il segnalibro è stato rimosso",
		"goTo" : "Vai su <name>",
		"exportNotif" : "Le tue impostazioni sono state esportate e copiate negli appunti, esegui il codice appena copiato dove vuoi per ripristinarle",
		"settingsIconHidden" : "Per aprire le impostazioni, digita .$settings() nella Barra di Ricerca",
		"settingsIconShown" : "L'icona delle impostazioni sarà mostrata di nuovo",
	
		"settings" : "Impostazioni",
		"enginesAndBookmarks" : "Motori di Ricerca/Segnalibri",
		"addElem" : "Aggiungi",
		"addAsEngine" : "Aggiungi come Motore di Ricerca",
		"addAsBookmark" : "Aggiungi come Segnalibro",
		"switchEngineWithArrows" : "Cambia motore di ricerca con i tasti 🠕 e 🠗 della tastiera",
		"enableAltShortcut" : "Apri segnalibri e cartelle con ALT più un tasto numerico della tastiera",
		"numPadInstead" : "Usa il tastierino numerico al posto dei tasti numerici principali",
		"langAndTheme" : "Lingua e personalizzazione",
		"showSettingsIcon" : "Mostra l'icona delle Impostazioni nell'angolo nord-est",
		"enableAnimations" : "Abilita le animazioni",
		"enableBlur" : "Abilita effetti di sfocatura",
		"launchURLwhenClicked" : "Vai all'URL/Subreddit digitato quando si preme col mouse",
		"resizeSearchFont" : "Ridimensiona il testo mentre si sta scrivendo (se supportato dal tema)",
		"applyColorTheme" : "Applica un colore di base al Tema",
		"resetAndImport" : "Reset e Importazione",
		"settingsExport" : "Esporta Impostazioni",
		"settingsReset" : "Ripristina tutte le Impostazioni",
		"settingsClose" : "Chiudi",
		"contextDefault" : "Rendi predefinito",
		"contextNewTab" : "Apri in nuova scheda",
		"contextLeft" : "Sposta a sinistra",
		"contextRight" : "Sposta a destra",
		"contextDelete" : "Elimina elemento",
		"mobileDisclaimerNote" : "Nota",
		"mobileDisclaimerText" : "Questo sito non è stato pensato per essere utilizzato da mobile. 'Dovrebbe' funzionare tutto normalmente, ma non ti posso assicurare nulla.",
		"useFaviconIco" : "Usa favicon.ico al posto delle DuckDuckGo API",
		"useOldReddit" : "Usa old.reddit.com quando si va su un subreddit",
		"moveIntoFolder" : "Muovi in una cartella",
		"addNewFolder" : "Crea una nuova cartella",
		"useExistingFolder" : "Sposta in un'altra cartella",
		"noOtherFolders" : "Non hai creato cartelle.",
		"folderUndo" : "Annulla", 
		"materialIconsRedirect" : "Puoi trovare tutti i codici icona supportati sul sito Material Design Icons",
		"toFolder" : "Il segnalibro è stato spostato in una cartella",
		"emptyFolder" : "Cartella vuota",
	},
	
	"es": {
		"languageName": "Español",
		"languageEmoji": "&#x1F1EA&#x1F1F8",

		"typeHere": "Escribe aquí",
		"searchOn": "Buscar en <engine>",
		"goToTheURL": "Ir a URL",
		"goToSubReddit": "Ir a subreddit",
		"evalJSCode": "Evaluar código JS",
		"commandExecuted": "Comando ejecutado",
		"openFolder": "Abrir <title>",
		"goBack": "Atrás",
		"openShortcut": "Abrir atajo",
		"newSearchEngineAdded": "Nuevo motor de busqueda agregado",
		"newSearchEngineError": "La URL del motor de busqueda no contiene el tag &ltquery&gt. Verifica que la URL sea correcta.",
		"newBookmarkAdded": "Nuevo favorito agregado",
		"searchEngineRemoved": "Motor de busqueda eliminado",
		"searchEngineRemoveError": "Necesitas al menos un motor de busqueda para que este sitio funcione correctamente.",
		"bookmarkRemoved": "Favorito eliminado",
		"goTo": "Ir a <name>",
		"exportNotif": "La configuración ha sido exportada y copiada al portapapeles, ejecuta el código copiado donde lo desees restaurar.",
		"settingsIconHidden": "Para abrir la página de configuración, escribe .$settings() en la barra de busqueda.",
		"settingsIconShown": "El ícono de ajustes se mostrará de nuevo.",
		
		"settings": "Ajustes",
		"enginesAndBookmarks": "Motores de busqueda/Favoritos",
		"addElem": "Agregar",
		"addAsEngine": "Agregar como motor de busqueda",
		"addAsBookmark": "Agregar como favorito",
		"switchEngineWithArrows": "Cambia motores de busqueda usando las teclas flecha (🠕 y 🠗) ",
		"enableAltShortcut": "Abrir favoritos y carpetas usando ALT + cualquier número en el teclado",
		"numPadInstead": "Usar NumPad en lugar de teclas númericas",
		"langAndTheme": "Lenguajes y temas",
		"showSettingsIcon": "Mostrar ícono de ajustes en la esquina superior derecha",
		"enableAnimations": "Habilitar animaciones",
		"enableBlur" : "Habilitar efectos de desenfoque",
		"launchURLwhenClicked": "Ir a la URL/subreddit con click izquierdo",
		"resizeSearchFont": "Cambiar tamaño de la fuente mientras se escribe (si lo soporta el tema)",
		"applyColorTheme": "Aplicar color personalizado",
		"resetAndImport": "Reiniciar e importar",
		"settingsExport": "Exportar ajustes",
		"settingsReset": "Reiniciar todos los ajustes",
		"settingsClose": "Cerrar",
		"contextDefault": "Hacer predeterminado",
		"contextNewTab": "Abrir en nueva pestaña",
		"contextLeft": "Mover a la izquierda",
		"contextRight": "Mover a la derecha",
		"contextDelete": "Eliminar elemento",
		"mobileDisclaimerNote": "Nota",
		"mobileDisclaimerText": "Este sitio no está hecho para dispositivos móviles. La mayoría de funciones funcionan bien, pero la experiencia no será optima.",
		"useFaviconIco": "Usar favicon.ico en lugar del API de DuckDuckGo",
		"useOldReddit": "Utilizar old.reddit.com para subreddits",
		"moveIntoFolder": "Mover a la carpeta",
		"addNewFolder": "Crear nueva carpeta",
		"useExistingFolder": "Mover a carpeta existente",
		"noOtherFolders": "No hay ninguna carpeta.",
		"folderUndo": "Cancelar",
		"materialIconsRedirect": "Puedes encontrar los códigos de íconos soportados en el sitio web de 'Material Design Icons'",
		"toFolder": "Favorito movido a carpeta.",
		"emptyFolder": "Carpeta vacía",
	},

        };
        this.currentLang = 'en';
        this.init();
    }

    init() {
        const savedLang = localStorage.getItem('curLang');
        const browserLang = navigator.language.split("-")[0];

        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        } else if (this.translations[browserLang]) {
            this.currentLang = browserLang;
        }

        localStorage.setItem("curLang", this.currentLang);
    }

    getString(key, replacements = {}) {
        let str = this.translations[this.currentLang][key] || key;
        for (const [placeholder, value] of Object.entries(replacements)) {
            str = str.replace(placeholder, value);
        }
        return str;
    }

    translateDOM() {
        const elements = document.querySelectorAll('.translatable');
        elements.forEach(el => {
            const key = el.getAttribute('stringid');
            if (key) {
                el.innerHTML = this.getString(key);
            }
        });
    }

    getLanguages() {
        return Object.keys(this.translations).map(lang => ({
            code: lang,
            name: this.translations[lang].languageName,
            emoji: this.translations[lang].languageEmoji
        }));
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem("curLang", lang);
            this.translateDOM();
        }
    }
}
