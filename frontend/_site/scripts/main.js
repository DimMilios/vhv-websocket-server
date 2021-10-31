//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Fri Jan  1 16:31:59 PST 2021
// Filename:       main.js
// Web Address:    https://verovio.humdrum.org/scripts/main.js
// Syntax:         JavaScript 1.8/ECMAScript 5/6
// vim:            ts=3
//
// Description:   Main javascript file for VHV interface.
//

// See _includes/vhv-scripts/main.js
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Fri Jan  1 18:07:00 PST 2021
// Filename:       _includes/vhv-scripts/main.js
// Web Address:    https://verovio.humdrum.org/scripts/main.js
// Syntax:         JavaScript 1.8/ECMAScript 5/6
// vim:            ts=3
//
// Description:   Main javascript file for VHV.
//

// Global variables for the VHV interface:
//
// _includes/vhv-scripts/global-variables.js
//
// This file is loaded from _includes/vhv-scripts/main.js and
// contains global variables used by VHV.
//

// CGI: lookup table of key/value pairs from URL parameters.
let CGI = {};

// OPTIONS: debugging parameter to see what options were used
// for the last call to the verovio toolkit.
let OPTIONS = {};

// PDFOPTIONS: debugging parameter to see what options were used
// for the last call to the verovio toolkit when creating PDF files.
let PDFOPTIONS = {};

// var turl = "https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/index.hmd";

// HMDINDEX: used to store a repertory index in the .hmd format.
let HMDINDEX = null;

// WKEY: window for displaying keyscape
WKEY = null;

let SCROLL_HASH = true;
let GOTOTOPOFNOTATION = false;

////////////////////////////////////////////////////////////
//
// Verovio variables
//

// vrvWorker: interface to the verovio toolkit via the worker interface.  The worker
// interface allows rendering of notation to be done in a separate thread from the
// user interface, allowing the user interface to be more responsive.  This variable
// is configured in the setup.js file.
let vrvWorker;

//////////////////////////////
//
// verovio-related options: Primarily set in menu system and used in humdrumToSvgOptions().
//

// SCALE: controls the size of the music notation using the verovio "scale" option.
let SCALE          = 40;

// SPACING_STAFF: Set the minimum distance in diatonic steps between staves of music.
let SPACING_STAFF  = 12;

// Need to add a variable SPACING_ADJUST_GROUP to add controls for spacing staff groups.

// SPACING_SYSTEM: Set the minimum distance in diatonc steps between systems of music.
// the verovio option justifyVertically may expand from this minimum distance, and
// musical elements extending outside of this range will also push the systems further
// apart.
let SPACING_SYSTEM = 18;

// LYRIC_SIZE: control the relative size of lyrics in the rendered notation.  Units
// are in terms of diatonic steps (1/2 of the space between staff lines).
let LYRIC_SIZE     = 4.5;

// FONT: controls the musical font used by verovio to render notation.  This is also
// the font variable used to generate PDF files.
let FONT           = "Leland";

// BREAKS: controls whether or not verovio should use system/page breaks
// encoded in the data or decide on its own line breaks.
//     false means use "auto" breaking method for verovio "breaks" option.
//     true means use "encoded" breaking method for verovio "breaks" option.
let BREAKS         = false;


///////////////////////////////////////////////////////////
//
// Repertory variables --

// ERASED_WORK_NAVIGATOR: HTML code for the navigator that can be restored
// if alt-e is pressed twice.
ERASED_WORK_NAVIGATOR = "";

// ERASED_FILEINFO: data structure containing the currently displyed
// work from a repertory.
ERASED_FILEINFO = {};

///////////////////////////////////////////////////////////
//
// Toolbar variables
//

let PAGED = false;

//////////////////////////////
//
// filter toolbar variables
//

let SEARCHFILTEROBJ = {};
let SEARCHFILTER    = "";
let GLOBALFILTER    = "";

let FILTERS = [
"autoaccid",
"autobeam",
"autostem",
"binroll",
"chantize",
"chooser",
"chord",
"cint",
"colorgroups",
"colortriads",
"composite",
"dissonant",
"double",
"esac2hum",
"extract",
"filter",
"fixps",
"flipper",
"gasparize",
"half",
"homorhythm",
"homorhythm2",
"hproof",
"humdiff",
"humsheet",
"humsort",
"imitation",
"kern2mens",
"kernview",
"mei2hum",
"melisma",
"mens2kern",
"metlev",
"modori",
"msearch",
"musedata2hum",
"musicxml2hum",
"myank",
"pccount",
"periodicity",
"phrase",
"pnum",
"recip",
"restfill",
"rid",
"ruthfix",
"satb2gs",
"scordatura",
"semitones",
"shed",
"sic",
"simat",
"slurcheck",
"spinetrace",
"strophe",
"tabber",
"tassoize",
"tie",
"timebase",
"transpose",
"tremolo",
"trillspell",
""
]
;


//////////////////////////////
//
// Music searching toolbar variables
//

let SEARCHCHORDDIRECTION = "chord -d";  // search top note
let BRIEFSEARCHVIEW      = "";  // Do not show only measures with search matches.

//////////////////////////////
//
// Spreadsheet toolbar variables -- These variables are used to interact
//    with Google spreadsheets from the spreadsheet toolbar:
//       https://doc.verovio.humdrum.org/interface/toolbar/spreadsheet
//    Two variables can be stored in the text box on the spreadsheet toolbar:
//       SPREADSHEETID       == The ID for the spreadsheet from its URL.
//       SPREADSHEETSCRIPTID == The ID for the macro that interfaces with the spreadsheet.
//    These two variables are persistent, and loaded from localStorage when
//    a session is started.
//

let SPREADSHEETSCRIPTID = "";
let SPREADSHEETID = "";

if (localStorage.SPREADSHEETSCRIPTID) {
	SPREADSHEETSCRIPTID = localStorage.SPREADSHEETSCRIPTID;
}
if (localStorage.SPREADSHEETID) {
	SPREADSHEETID = localStorage.SPREADSHEETID;
}



//////////////////////////////
//
// menu interaction variables:
//

let INPUT_FONT_SIZE = 1.0;   // used to set font-size in #input (1.0rem is the default);

let FILEINFO = {};


//////////////////////////////
//
// MuseData variables --
//

let MuseDataBuffer = "";


//////////////////////////////
//
// Ace editor variables -- These are variables to control the Ace editor
//    (https://ace.c9.io), which is the text editor used by VHV.
//

// EDITOR: main interface to the ace editor.  This variable is configured in the
// setup.js file.
let EDITOR;
let dummyEDITOR;

// EditorModes: list the various setup for colorizing and editing for each of the
// known data format.  The first index is set with the EditorMode variable, and the
// second index is set with the KeyboardMode variable.
let EditorModes = {
	humdrum: {
		vim: {
			theme: "ace/theme/humdrum_dark"
		},
		ace: {
			theme: "ace/theme/humdrum_light"
		}
	},
	xml: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	},
	musedata: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	},
	mime: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	}
};

// EditorMode: specifies what type of data is present in the text editor.
// Setting this will in turn control which colorizing rules to apply to the
// data.
// Values can be:
//     "humdrum"  for Humdrum data
//     "xml"      for XML data (MEI and MusicXML)
//     "musedata" for XML data (MEI and MusicXML)
//     "mime"     for mime-encoded data
let EditorMode = "humdrum";

// KeyboardMode: controls if plain ace editor keybindings are used or vim key bindings.
// Values can be:
//     "ace" for the pain text editing mode
//     "vim" for the vim editing mode
let KeyboardMode = "ace";

//var EditorTheme = "ace/theme/solarized_light";
let EditorLine = -1;
let TABSIZE = 12;
let DISPLAYTIME = 0;
let HIGHLIGHTQUERY = null;
let EDITINGID = null;
let SAVEFILENAME = "data.txt";
let SPACINGADJUSTMENT = 0.0;

// no timeout for slow delivery of verovio
window.basketSession.timeout = 1000000000;

let COUNTER = 0;

// used to highlight the current note at the location of the cursor.
let CursorNote;

// RestoreCursorNote: Used to go back to a highlighted note after a redraw.
// This is an ID string rather than an element.
let RestoreCursorNote;

// Increment BasketVersion when the verovio toolkit is updated, or
// the Midi player software or soundfont is updated.
let BasketVersion = 531;
// Basket is no longer working since verovio.js is now over 5MB (maximum for localStorage)
// console.log("VERSION", BasketVersion);

let Actiontime = 0;

let ERASED_DATA = "";

// see https://github.com/ajaxorg/ace/wiki/Embedding-API
// Use EditSession instead of BufferedHumdrumFile:
let BufferedHumdrumFile = "";
let Range = function() { console.log("Range is undefined"); }

let IDS   = [];
let ZOOM  = 0.4;
let PLAY  = false;
let PAUSE = false;


// State variables for interface:
let FirstInitialization = false;
let InputVisible        = true;
let LastInputWidth      = 0;
let VrvTitle            = true;
let OriginalClef        = false;
let UndoHide            = false;
let ApplyZoom           = false;
let ShowingIndex        = false;
let FreezeRendering     = false;



//////////////////////////////
//
// Key-code variables for cases in listeners.js:
//
// See also:
//    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
//    https://keycode.info
//    https://wangchujiang.com/hotkeys
//

// event:             .code           .keyCode   .key (US keyboard)
let AKey            = "KeyA";         // 65      "A", "a"
let BKey            = "KeyB";         // 66      "B", "b"
let CKey            = "KeyC";         // 67      "C", "c"
let DKey            = "KeyD";         // 68      "D", "d"
let EKey            = "KeyE";         // 69      "E", "e"
let FKey            = "KeyF";         // 70      "F", "f"
let GKey            = "KeyG";         // 71      "G", "g"
let HKey            = "KeyH";         // 72      "H", "h"
let IKey            = "KeyI";         // 73      "I", "i"
let JKey            = "KeyJ";         // 74      "J", "j"
let KKey            = "KeyK";         // 75      "K", "k"
let LKey            = "KeyL";         // 76      "L", "l"
let MKey            = "KeyM";         // 77      "M", "m"
let NKey            = "KeyN";         // 78      "N", "n"
let OKey            = "KeyO";         // 79      "O", "o"
let PKey            = "KeyP";         // 80      "P", "p"
let QKey            = "KeyQ";         // 81      "Q", "q"
let RKey            = "KeyR";         // 82      "R", "r"
let SKey            = "KeyS";         // 83      "S", "s"
let TKey            = "KeyT";         // 84      "T", "t"
let UKey            = "KeyU";         // 85      "U", "u"
let VKey            = "KeyV";         // 86      "V", "v"
let WKey            = "KeyW";         // 87      "W", "w"
let XKey            = "KeyX";         // 88      "X", "x"
let YKey            = "KeyY";         // 89      "Y", "y"
let ZKey            = "KeyZ";         // 90      "Z", "z"
let ZeroKey         = "Digit0";       // 48      "0", "("
let OneKey          = "Digit1";       // 49      "1", "@"
let TwoKey          = "Digit2";       // 50      "2", "@"
let ThreeKey        = "Digit3";       // 51      "3", "#"
let FourKey         = "Digit4";       // 52      "4", "$"
let FiveKey         = "Digit5";       // 53      "5", "%"
let SixKey          = "Digit6";       // 54      "6", "^"
let SevenKey        = "Digit7";       // 55      "7", "&"
let EightKey        = "Digit8";       // 56      "8", "*"
let NineKey         = "Digit9";       // 57      "9", "("
// Numpad keys: 0=96 .. 9=105

let BackKey         = "Backspace";    // 8       "Backspace"
let BackQuoteKey    = "Backquote";    // 192     "`", "~"
let BackSlashKey    = "Backslash";    // 220     "\\"
let CommaKey        = "Comma";        // 188     ",", "<"
let DeleteKey       = "Delete";       // 46      "Delete"
let DotKey          = "Period";       // 190     ".", ">"
let EnterKey        = "Enter";        // 13      "Enter"
let EscKey          = "Escape";       // 27      "Escape"
let MinusKey        = "Minus";        // 189     "-", "_"
let SemiColonKey    = "Semicolon";    // 186     ";", ":"
let SingleQuoteKey  = "Quote";        // 222     "'", "\""
let SlashKey        = "Slash";        // 191     "/"
let SpaceKey        = "Space"         // 32      " "
let TabKey          = "Tab";          // 9       "Tab"
let BracketLeftKey  = "BracketLeft";  // 219     "[", "{"
let BracketRightKey = "BracketRight"; // 221     "]", "}"
let EqualKey        = "Equal";        // 187     "=", "+"

let ControlLeftKey  = "ControlLeft";  // 17      "Control"   event.ctrl
let ControlRightKey = "ControlRight"; // 17      "Control"   event.ctrl
let ShiftLeftKey    = "ShiftLeft";    // 16      "Shift"     event.shift
let ShiftRightKey   = "ShiftRight";   // 16      "Shift"     event.shift

let LeftKey         = "ArrowLeft";    // 37      "ArrowLeft"
let UpKey           = "ArrowUp";      // 38      "ArrowUp"
let RightKey        = "ArrowRight";   // 39      "ArrowRight"
let DownKey         = "ArrowDown";    // 40      "ArrowDown"

let PgUpKey         = "PageUp";       // 33      "PageUp"
let PgDnKey         = "PageDown";     // 34      "PageDown"
let EndKey          = "End";          // 35      "End"
let HomeKey         = "Home";         // 36      "Home"

let F1Key           = "F1";           // 112     "F1"
let F2Key           = "F2";           // 113     "F2"
let F3Key           = "F3";           // 114     "F3"
let F4Key           = "F4";           // 115     "F4"
let F5Key           = "F5";           // 116     "F5"
let F6Key           = "F6";           // 117     "F6"
let F7Key           = "F7";           // 118     "F7"
let F8Key           = "F8";           // 119     "F8"
let F9Key           = "F9";           // 120     "F9"
let F10Key          = "F10";          // 121     "F10"
let F11Key          = "F11";          // 122     "F11"
let F12Key          = "F12";          // 123     "F12"
// etc. to F32Key





// Initialization functions:


//////////////////////////////
//
// downloadVerovioToolkit --
//

function downloadVerovioToolkit(use_worker) {
	vrvWorker = new vrvInterface(use_worker, initializeVerovioToolkit);
};



//////////////////////////////
//
// setupAceEditor --
//       https://en.wikipedia.org/wiki/Ace_(editor)
//
//  see: https://github.com/ajaxorg/ace/wiki/Embedding-API
//
// Folding:
//   https://cloud9-sdk.readme.io/docs/code-folding
//
// console.log("NUMBER OF LINES IN FILE", EDITOR.session.getLength());
//
// Keyboard Shortcuts:
//   https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts
//
// ACE Grammar editor:
// https://foo123.github.io/examples/ace-grammar
//

function setupAceEditor(idtag) {
	EDITOR = ace.edit(idtag);
	ace.config.set('modePath', "/scripts/ace");
	ace.config.set('workerPath', "/scripts/ace");
	ace.config.set('themePath', "/scripts/ace");
	EDITOR.getSession().setUseWorker(true);
	EDITOR.$blockScrolling = Infinity;
	EDITOR.setAutoScrollEditorIntoView(true);
	EDITOR.setBehavioursEnabled(false); // no auto-close of parentheses, quotes, etc.

	// EDITOR.cursorStyle: 'ace', // "ace"|"slim"|"smooth"|"wide"

	// See this webpage to turn of certain ace editor shortcuts:
	// https:github.com//ajaxorg/ace/blob/master/lib/ace/commands/default_commands.js

	// These eat alt-l and alt-shift-l keyboard shortcuts on linux:
	EDITOR.commands.removeCommand("fold", true);
	EDITOR.commands.removeCommand("unfold", true);

	// best themes:
	// kr_theme == black background, gray highlight, muted colorizing
	// solarized_dark == blue background, light blue hilight, relaxing colorizing
	// vibrant_ink == black background, gray highlight, nice colorizing
	// solarized_light == yellowish background, gray highlight, nice colorizing

	// EDITOR.setKeyboardHandler("ace/keyboard/vim");

	// keybinding = ace | vim | emacs | custom
	// fontsize   = 10px, etc
	// theme = "ace/theme/solarize_light"

	// EDITOR.getSession().setMode("ace/mode/javascript");

	setEditorModeAndKeyboard();

	EDITOR.getSession().setTabSize(TABSIZE);
	EDITOR.getSession().setUseSoftTabs(false);

	// Don't show line at 80 columns:
	EDITOR.setShowPrintMargin(false);

	Range = require("ace/range").Range;

	// EDITOR.getSession().selection.on("changeCursor", function(event)
	// 	{ highlightNoteInScore(event)});

	// Force the cursor to blink when blurred (unfocused):
	// EDITOR.renderer.$cursorLayer.showCursor();
	EDITOR.renderer.$cursorLayer.smoothBlinking = true;
	EDITOR.renderer.$cursorLayer.setBlinking(true);

	//EDITOR.commands.addCommand({
	//	name: 'saveFile',
	//	bindKey: {
	//			win: 'Alt-G',
	//			mac: 'Alt-G',
	//			sender: 'editor|cli'
	//		},
	//	exec: function(env, argc, request) {
	//		alert("HI!", env, argc, request);
	//	}
	//});

	var cursor = document.querySelector(".ace_content .ace_cursor-layer");
	if (cursor) {
		CURSOR_OBSERVER = new MutationObserver(customCursor);
		CURSOR_OBSERVER.observe(cursor, {attributes: true});
	}

	insertSplashMusic();

}



//////////////////////////////
//
// insertSplashMusic --
//

function insertSplashMusic() {
	var splashElement = document.querySelector("#input-splash");
	if (!splashElement) {
		return;
	}
	text = EDITOR.getValue();
	if (!text.match(/^\s*$/)) {
		return;
	}
	var splash = splashElement.textContent;
	setTextInEditor(splash);
}



//////////////////////////////
//
// Setup styling of blurred ace-editor cursor:
//

var CURSOR_OBSERVER;
var CURSOR_DISPLAY;

function customCursor() {
	activeElement = document.activeElement.nodeName;
	let cursor = EDITOR.renderer.$cursorLayer.cursor;
	let cursorstate = null;

	for (let i=0; i<cursor.classList.length; i++) {
		if (cursor.classList[i] == "blurred") {
			cursorstate = "blurred";
			break;
		}
		if (cursor.classList[i] == "focused") {
			cursorstate = "focused";
			break;
		}
	}
	if (activeElement === "TEXTAREA") {
		if (cursorstate != "focused") {
			if (!CURSOR_DISPLAY) {
				CURSOR_DISPLAY = true;
			}
			// console.log("FOCUSING CURSOR");
			cursor.classList.add("focused");
			cursor.classList.remove("blurred");
			EDITOR.renderer.$cursorLayer.setBlinking(true);
			EDITOR.renderer.$cursorLayer.showCursor();
		}
	} else if (CURSOR_DISPLAY) {
		if (cursorstate != "blurred") {
			// console.log("BLURRING CURSOR");
			cursor.classList.add("blurred");
			cursor.classList.remove("focused");
			EDITOR.renderer.$cursorLayer.showCursor();
			EDITOR.renderer.$cursorLayer.setBlinking(true);
		}

	}
}



//////////////////////////////
//
// setupSplitter --
//

function setupSplitter() {
	var splitter = document.querySelector("#splitter");
	if (!splitter) {
		return;
	}

	if (!Splitter.leftContent) {
		Splitter.leftContent = document.querySelector('#input');
	}
	if (!Splitter.splitContent) {
		Splitter.splitContent = document.querySelector('#splitter');
	}
	if (!this.rightContent) {
		Splitter.rightContent = document.querySelector('#output');
	}

	splitter.addEventListener('mousedown', function(event) {
		Splitter.mouseState    = 1;
		if (!Splitter.leftContent) {
			Splitter.leftContent   = document.querySelector('#input');
		}
		if (!Splitter.splitContent) {
			Splitter.splitContent  = document.querySelector('#splitter');
		}
		if (!Splitter.rightContent) {
			Splitter.rightContent  = document.querySelector('#output');
		}
		Splitter.setPositionX(event.pageX);
	});

	window.addEventListener('mouseup', function(event) {
		if (Splitter.mouseState != 0) {
			Splitter.mouseState = 0;
			EDITOR.resize();
			displayNotation();
		}
	});

	window.addEventListener('mousemove', function(event) {
		if (Splitter.mouseState) {
			var minXPos = Splitter.minXPos;
			if (event.pageX < minXPos){
				if (event.pageX < minXPos - 70){ //Adjust closing snap tolerance here
					Splitter.setPositionX(0);
					InputVisible = false;
				}
				return;
			}
			Splitter.setPositionX(event.pageX);
			InputVisible = true;
		}
	});
}



//////////////////////////////
//
// GetCgiParameters -- Returns an associative array containing the
//     page's URL's CGI parameters
//

function GetCgiParameters() {
	var url = window.location.search.substring(1);
	var output = {};
	var settings = url.split('&');
	for (var i=0; i<settings.length; i++) {
		var pair = settings[i].split('=');
		pair[0] = decodeURIComponent(pair[0]);
		pair[1] = decodeURIComponent(pair[1]);
		if (typeof output[pair[0]] === 'undefined') {
			output[pair[0]] = pair[1];
		} else if (typeof output[pair[0]] === 'string') {
			var arr = [ output[pair[0]], pair[1] ];
			output[pair[0]] = arr;
		} else {
			output[pair[0]].push(pair[1]);
		}
	}
	if (!output.mm || output.mm.match(/^\s*$/)) {
		if (output.m) {
			output.mm = output.m;
		}
	}

	// process aliases:

	if (!output.k && output.keys) {
		output.k = output.keys;
	} else if (output.k && !output.keys) {
		output.keys = output.k;
	}

	if (!output.t && output.text) {
		output.t = output.text;
	} else if (output.t && !output.text) {
		output.text = output.t;
	}

	if (!output.f && output.file) {
		output.f = output.file;
	} else if (output.f && !output.file) {
		output.file = output.f;
	}

	if (!output.F && output.filter) {
		output.F = output.filter;
	} else if (output.F && !output.filter) {
		output.filter = output.F;
	}

	if (!output.p && output.pitch) {
		output.p = output.pitch;
	} else if (output.p && !output.pitch) {
		output.pitch = output.p;
	}

	if (!output.r && output.rhythm) {
		outpuoutput.r = output.rhythm;
	} else if (output.r && !output.rhythm) {
		output.rhythm = output.r;
	}

	if (!output.i && output.interval) {
		output.i = output.interval;
	} else if (output.i && !output.interval) {
		output.interval = output.i;
	}

	// store the URL anchor as a output parameter
	let hash = location.hash.replace(/^#/, "");
	let matches;

	// store #m parameter
	matches = hash.match(/m(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_m = matches[1];
	}

	// store #mm parameter
	matches = hash.match(/mm(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_mm = matches[1];
	}

	// store #mh parameter
	matches = hash.match(/mh(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_mh = matches[1];
	}

	// store #mmh parameter
	matches = hash.match(/mmh(?![a-z])(\d+.*)/);
	if (matches) {
		output.hash_mmh = matches[1];
	}

	return output;
}





// Functions related to graphical editing:
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Mon Oct 31 14:42:33 PDT 2016
// Last Modified:  Tue Jan 31 04:12:38 PST 2017
// Filename:       editor.js
// Web Address:    https://verovio.humdrum.org/scripts/editor.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Processing key commands to edit music.
//

// InterfaceSingleNumber: digit typed on the keyboard before
// certain commands, suh as slurs, which indicates the number
// of notes to include under the slur.  Or "2" for double-flats/
// sharps, or for the transposing interval when changing pitch.
var InterfaceSingleNumber = 0;

//////////////////////////////
//
// processNotationKey -- Also consider whether MEI or Humdrum is
//    currently being displayed, but that would double the code...
//

function processNotationKey(key, element) {
	var id    = element.id;
	var matches;

	if (matches = id.match(/L(\d+)/)) {
		var line = parseInt(matches[1]);
	} else {
		return; // required
	}

	if (matches = id.match(/F(\d+)/)) {
		var field = parseInt(matches[1]);
	} else {
		return; // required
	}

	if (matches = id.match(/S(\d+)/)) {
		var subfield = parseInt(matches[1]);
	} else {
		subfield = null;
	}

	if (matches = id.match(/N(\d+)/)) {
		var number = parseInt(matches[1]);
	} else {
		number = 1;
	}

	if (matches = id.match(/^([a-z]+)-/)) {
		var name = matches[1];
	} else {
		return; // required
	}

	if ((line < 1) || (field < 1)) {
		return;
	}

	var line2 = 0;
	var field2 = 0;
	var subfield2 = 0;
	var number2 = 1;

	if (matches = id.match(/^[^-]+-[^-]+-.*L(\d+)/)) {
		line2 = parseInt(matches[1]);
	}
	if (matches = id.match(/^[^-]+-[^-]+-.*F(\d+)/)) {
		field2 = parseInt(matches[1]);
	}
	if (matches = id.match(/^[^-]+-[^-]+-.*S(\d+)/)) {
		subfield2 = parseInt(matches[1]);
	}
	if (matches = id.match(/^[^-]+-[^-]+-.*N(\d+)/)) {
		number2 = parseInt(matches[1]);
	}


	if (key === "esc") {
		MENU.hideContextualMenus();
		HIGHLIGHTQUERY = "";
		if (!element) {
			return;
		}
		var classes = element.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		element.setAttribute("class", outclass);
		CursorNote = "";
		return;
	}

	if (name === "note") {
		if (key === "y")       { toggleVisibility(id, line, field); }
		else if (key === "a")  { setStemAboveMarker(id, line, field); }
		else if (key === "b")  { setStemBelowMarker(id, line, field); }
		else if (key === "c")  { deleteStemMarker(id, line, field); }
		else if (key === "#")  { toggleSharp(id, line, field, subfield); }
		else if (key === "-")  { toggleFlat(id, line, field, subfield); }
		else if (key === "i")  { toggleEditorialAccidental(id, line, field, subfield); }
		else if (key === "n")  { toggleNatural(id, line, field, subfield); }
		else if (key === "m")  { toggleMordent("m", id, line, field, subfield); }
		else if (key === "M")  { toggleMordent("M", id, line, field, subfield); }
		else if (key === "w")  { toggleMordent("w", id, line, field, subfield); }
		else if (key === "W")  { toggleMordent("W", id, line, field, subfield); }
		else if (key === "X")  { toggleExplicitAccidental(id, line, field, subfield); }
		else if (key === "L")  { startNewBeam(element, line, field); }
		else if (key === "J")  { endNewBeam(element, line, field); }
		else if (key === "transpose-up-step")  { transposeNote(id, line, field, subfield, +1); }
		else if (key === "transpose-down-step")  { transposeNote(id, line, field, subfield, -1); }
		else if (key === "transpose-up-octave")  { transposeNote(id, line, field, subfield, +7); }
		else if (key === "transpose-down-octave")  { transposeNote(id, line, field, subfield, -7); }
		else if (key === "'")  { toggleStaccato(id, line, field); }
		else if (key === "^")  { toggleAccent(id, line, field); }
		else if (key === "^^") { toggleMarcato(id, line, field); }
		else if (key === "~")  { toggleTenuto(id, line, field); }
		else if (key === "s")  { addSlur(id, line, field); }
		else if (key === "q")  { toggleGraceNoteType(id, line, field); }
		else if (key === "p")  { console.log("p pressed");  togglePedalStart(id, line, field); }
		else if (key === "P")  { togglePedalEnd(id, line, field); }
		else if (key === "t")  { toggleMinorTrill(id, line, field); }
		else if (key === "T")  { toggleMajorTrill(id, line, field); }
		else if (key === "`")  { toggleStaccatissimo(id, line, field); }
		else if (key === ";")  { toggleFermata(id, line, field); }
		else if (key === ":")  { toggleArpeggio(id, line, field); }
		else if (key === "1")  { InterfaceSingleNumber = 1; }
		else if (key === "2")  { InterfaceSingleNumber = 2; }
		else if (key === "3")  { InterfaceSingleNumber = 3; }
		else if (key === "4")  { InterfaceSingleNumber = 4; }
		else if (key === "5")  { InterfaceSingleNumber = 5; }
		else if (key === "6")  { InterfaceSingleNumber = 6; }
		else if (key === "7")  { InterfaceSingleNumber = 7; }
		else if (key === "8")  { InterfaceSingleNumber = 8; }
		else if (key === "9")  { InterfaceSingleNumber = 9; }
		else if (key === "@")  { toggleMarkedNote(id, line, field, subfield); }
	} else if (name === "rest") {
		if (key === "y")       { toggleVisibility(id, line, field); }
		else if (key === ";")  { toggleFermata(id, line, field); }
		else if (key === "L")  { startNewBeam(element, line, field); }
		else if (key === "J")  { endNewBeam(element, line, field); }
	} else if (name === "dynam") {
		if (key === "a")       { setDynamAboveMarker(id, line, field, number); }
		else if (key === "b")  { setDynamBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteDynamDirectionMarker(id, line, field, number); }
	} else if (name === "hairpin") {
		if (key === "a")       { setHairpinAboveMarker(id, line, field, number); }
		else if (key === "b")  { setHairpinBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteHairpinDirectionMarker(id, line, field, number); }
	} else if (name === "slur") {
		if (key === "a")       { setSlurAboveMarker(id, line, field, number); }
		else if (key === "b")  { setSlurBelowMarker(id, line, field, number); }
		else if (key === "c")  { deleteSlurDirectionMarker(id, line, field, number); }
		else if (key === "D")  { deleteSlur(id, line, field, number, line2, field2, number2); }
		else if (key === "delete") { deleteSlur(id, line, field, number, line2, field2, number2); }
		else if (key === "f")  { flipSlurDirection(id, line, field, number); }
		else if (key === "leftEndMoveBack")     { leftEndMoveBack(id, line, field, number, line2, field2, number2); }
		else if (key === "leftEndMoveForward")  { leftEndMoveForward(id, line, field, number, line2, field2, number2); }
		else if (key === "rightEndMoveForward") { rightEndMoveForward(id, line, field, number, line2, field2, number2); }
		else if (key === "rightEndMoveBack")    { rightEndMoveBack(id, line, field, number, line2, field2, number2); }
		else if (key === "1")  { InterfaceSingleNumber = 1; }
		else if (key === "2")  { InterfaceSingleNumber = 2; }
		else if (key === "3")  { InterfaceSingleNumber = 3; }
		else if (key === "4")  { InterfaceSingleNumber = 4; }
		else if (key === "5")  { InterfaceSingleNumber = 5; }
		else if (key === "6")  { InterfaceSingleNumber = 6; }
		else if (key === "7")  { InterfaceSingleNumber = 7; }
		else if (key === "8")  { InterfaceSingleNumber = 8; }
		else if (key === "9")  { InterfaceSingleNumber = 9; }
	} else if (name === "tie") {
		// need to fix tie functions to deal with chord notes (subfield values):
		if (key === "a") { setTieAboveMarker(id, line, field, subfield); }
		else if (key === "b")  { setTieBelowMarker(id, line, field, subfield); }
		else if (key === "c")  { deleteTieDirectionMarker(id, line, field, subfield); }
		else if (key === "f")  { flipTieDirection(id, line, field, subfield); }
	} else if (name === "beam") {
		if (key === "a")       { setBeamAboveMarker(id, line, field); }
		else if (key === "b")  { setBeamBelowMarker(id, line, field); }
		else if (key === "c")  { deleteBeamDirectionMarker(id, line, field); }
		else if (key === "f")  { flipBeamDirection(id, line, field); }
	}
}


///////////////////////////////////////////////////////////////////////////
//
// Beam editing --
//


//////////////////////////////
//
// setBeamAboveMarker --
//

function setBeamAboveMarker(id, line, field) {
	// console.log("SET BEAM ABOVE", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += above;
		newtoken += matches[4];
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// setBeamBelowMarker --
//

function setBeamBelowMarker(id, line, field) {
	// console.log("SET BEAM BELOW", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += below;
		newtoken += matches[4];
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteBeamDirectionMarker --
//

function deleteBeamDirectionMarker(id, line, field) {
	// console.log("REMOVE BEAM DIRECTION", token, line, field, id);
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^LJKk]*)([LJKk]+)([" + above + below + "]*)([^LJKk]*)");
	var matches = re.exec(token);
	if (!matches) {
		return;
	} else {
		var newtoken = matches[1];
		newtoken += matches[2];
		newtoken += matches[4];
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}


///////////////////////////////////////////////////////////////////////////
//
// Dynamics editing --
//

//////////////////////////////
//
// setDynamAboveMarker -- Move dynamic above staff.
//

function setDynamAboveMarker(id, line, field, number) {
	setAboveMarker(id, line, field, number, "DY");
}



//////////////////////////////
//
// setDynamBelowMarker -- Move dynamic below staff.
//

function setDynamBelowMarker(id, line, field, number) {
	setBelowMarker(id, line, field, number, "DY");
}



//////////////////////////////
//
// deleteDynamDirectionMarker -- Remove layout code for dynamic positioning.
//

function deleteDynamDirectionMarker(id, line, field, number) {
	deleteDirectionMarker(id, line, field, number, "DY");
}


///////////////////////////////////////////////////////////////////////////
//
// Hairpin layout paramters --
//

//////////////////////////////
//
// setHairpinAboveMarker -- Set to HP layout code later
//

function setHairpinAboveMarker(id, line, field, number) {
	setAboveMarker(id, line, field, number, "HP");
}



//////////////////////////////
//
// setHairpinBelowMarker --
//

function setHairpinBelowMarker(id, line, field, number) {
	setBelowMarker(id, line, field, number, "HP");
}



//////////////////////////////
//
// deleteHairpinDirectionMarker -- remove layout code for hairpins.
//

function deleteHairpinDirectionMarker(id, line, field, number) {
	deleteDirectionMarker(id, line, field, number, "HP");
}


///////////////////////////////////////////////////////////////////////////
//
// Generic Layout functions --
//

//////////////////////////////
//
// setAboveMarker -- Add layut code for above parameter.
//

function setAboveMarker(id, line, field, number, category) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	var editQ = false;
	var lastline = line - 1;
	var ptoken = getEditorContents(lastline, field);
	var idlineadj = 0;
	if (!ptoken.match(/^!LO/)) {
		createEmptyLine(line);
		idlineadj = 1;
		line += 1;
		lastline = line - 1;
		ptoken = "!";
		editQ = true;
	}

	if (ptoken.match(/^!LO/)) {
		if (ptoken.match(/:b(?=:|=|$)/)) {
			// Change to :a (not very elegant if there is a parameter starting with "b":
			ptoken = ptoken.replace(/:b(?=:|=|$)/, ":a");
			editQ = true;
		} else if (ptoken.match(/:a(:|=|$)/)) {
			// Do nothing
		} else {
			// Assuming no other parameters, but may be clobbering something.
			// (so fix later):
			ptoken = "!LO:" + category + ":a"
			editQ = true;
		}
	} else if (ptoken == "!") {
		ptoken = "!LO:" + category + ":a";
		editQ = true;
	} else {
		console.log("ERROR TOGGLING ABOVE DIRECTION");
	}

	if (idlineadj != 0) {
		id = id.replace("L"  + (line-1), "L" + (line + idlineadj - 1));
	}

	if (editQ) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(lastline, field, ptoken, id);
	}
}



//////////////////////////////
//
// setBelowMarker -- Add layout code for below parameter.
//

function setBelowMarker(id, line, field, number, category) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	var editQ = false;
	var lastline = line - 1;
	var ptoken = getEditorContents(lastline, field);
	var idlineadj = 0;
	if (!ptoken.match(/^!LO/)) {
		createEmptyLine(line);
		idlineadj = 1;
		line += 1;
		lastline = line - 1;
		ptoken = "!";
		editQ = true;
	}

	if (ptoken.match(/^!LO/)) {
		if (ptoken.match(/:a(?=:|=|$)/)) {
			// Change to :b (not very elegant if there is a parameter starting with "b":
			ptoken = ptoken.replace(/:a(?=:|=|$)/, ":b");
			editQ = true;
		} else if (ptoken.match(/:b(:|=|$)/)) {
			// Do nothing
		} else {
			// Assuming no other parameters, but may be clobbering something.
			// (so fix later):
			ptoken = "!LO:" + category + ":b"
			editQ = true;
		}
	} else if (ptoken == "!") {
		ptoken = "!LO:" + category + ":b";
		editQ = true;
	} else {
		console.log("ERROR TOGGLING ABOVE DIRECTION");
	}

	if (idlineadj != 0) {
		id = id.replace("L" + (line - 1), "L" *+ (line + idlineadj - 1));
	}

	if (editQ) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(lastline, field, ptoken, id);
	}
}



//////////////////////////////
//
// deleteDirectionMarker -- remove layout code for hairpins.
//

function deleteDirectionMarker(id, line, field, number, category) {
	line = parseInt(line);
	var token = getEditorContents(line-1, field);
	if (token[0] !== "!") {
		// don't know what to do.
		return;
	}
	var editQ = false;
	var re = new RegExp("^!LO:" + category + ":");
	if (token.match(re)) {
		token = "!";
		editQ = true;
	} else {
		// don't know what to do
		return;
	}
	if (!editQ) {
		return;
	}

	setEditorContents(line-1, field, token, id, true);

	var text = EDITOR.session.getLine(line-2);
	if (text.match(/^[!\t]+$/)) {
		// remove line
		var range = new Range(line-2, 0, line-1, 0);

		EDITOR.session.remove(range);

		RestoreCursorNote = id.replace("L" + (line), "L" + (line - 1));
		displayNotation();
		highlightIdInEditor(RestoreCursorNote);
	}
}



//////////////////////////////
//
// createEmptyLine -- Create a null local comment line.  See addNullLine()
//    which can probably replace this function.
//

function createEmptyLine(line) {
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	var text = EDITOR.session.getLine(line - 1);
	var output = "";
	if (text[0] == '\t') {
		output += '\t';
	} else {
		output += '!';
	}
	var i;
	for (i=1; i<text.length; i++) {
		if (text[i] == '\t') {
			output += '\t';
		} else if ((text[i] != '\t') && (text[i-1] == '\t')) {
			output += '!';
		}
	}
	output += "\n" + text;

	var range = new Range(line-1, 0, line-1, text.length);
	EDITOR.session.replace(range, output);

	// don't redraw the data
	FreezeRendering = freezeBackup;
}



///////////////////////////////////////////////////////////////////////////
//
// Slur editing --
//


//////////////////////////////
//
// setSlurAboveMarker --
//

function setSlurAboveMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	// console.log("TOGGLE SLUR ABOVE", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == above) {
			counter++;
			continue;
		} else if (token[i+1] == below) {
			newtoken += above;
			i++;
			counter++;
			continue;
		} else {
			newtoken += above;
			counter++;
			continue;
		}
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

}



//////////////////////////////
//
// setSlurBelowMarker --
//

function setSlurBelowMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		// nothing to do, just a null data token
		return;
	}
	var token = getEditorContents(line, field);
	// console.log("TOGGLE SLUR BELOW", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == below) {
			counter++;
			continue;
		} else if (token[i+1] == above) {
			newtoken += below;
			i++;
			counter++;
			continue;
		} else {
			newtoken += below;
			counter++;
			continue;
		}
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteSlurDirectionMarker --
//

function deleteSlurDirectionMarker(id, line, field, number) {
	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	//console.log("DELETE SLUR DIRECTION", token, line, field, number, id);

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var counter = 0;
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		newtoken += token[i];
		if (counter != number) {
			continue;
		}
		if (token[i+1] == below) {
			i++;
			counter++;
			continue;
		} else if (token[i+1] == above) {
			i++;
			counter++;
			continue;
		} else {
			counter++;
			continue;
		}
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// leftEndMoveBack -- Only woks in regions where spines don't split or merge.
//

function leftEndMoveBack(id, line, field, number, line2, field2, number2) {
	console.log("LEFT END MOVE BACK");
	var token1 = getEditorContents(line, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = line - 2; // -1 for 0-index and -1 for line after
	var counter = 0;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i > 0) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i--;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i--;
			continue;
		}
		break;
	}

	console.log("LEFTENDMOVEBACK NEW", token1, line, field, number, token2, i+1, id);

	if (i <= 0) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurstart = deleteSlurStart(id, line, field, number);
	if (slurstart !== "") {
		addSlurStart(id, i+1, field, slurstart);
	}
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// addSlur -- add a slur to a note, which goes to the next note in the field.
//

function addSlur(id, line, field) {
	var token = getEditorContents(line, field);
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	addSlurStart(id, line, field, '(');

	var i = parseInt(line); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();

	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i++;
			continue;
		}
		break;
	}

	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur begin
		return;
	}

	addSlurEnd(id, i+1, field, ')');
	var newid = id.replace(/^note-/, "slur-");
	// FIX N number here later:
	var ending = "-L" + (i+1) + "F" + field + "N" + 1;
	newid += ending;
	FreezeRendering = freezeBackup;
	if (!FreezeRendering) {
		displayNotation(null, null, newid);
	}
	InterfaceSingleNumber = 0;

	// for some reason the highlighting is lost on the note,
	// so add it back:
	// wait for worker to finish redrawing?
	setTimeout(function() {
		var element = document.querySelector("svg g#" + id);
		if (element) {
			var classname = element.getAttribute("class");
			if (!classname.match(/\bhighlight\b/)) {
				classname += " highlight";
				element.setAttribute("class", classname);
			}
			CursorNote = element;
		}
	}, 300);

}



//////////////////////////////
//
// addSlurStart --
//

function addSlurStart(id, line, field, slurstart) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	for (var i=token.length-1; i>=0; i--) {
		if (token[i] == '(') {
			// need to insert new slur after last one
			newtoken = token.substring(0, i+1);
			newtoken += slurstart;
			newtoken += token.substring(i+1);
			break;
		}
	}

	if (newtoken === "") {
		newtoken = slurstart + token;
	}

	var pcount = 0;
	for (i=0; i<newtoken.length; i++) {
		if (newtoken[i] == '(') {
			pcount++;
		}
	}

	var newid = id.replace(/L\d+/, "L" + line);
	newid = newid.replace(/F\d+/, "F" + field);
	newid = newid.replace(/N\d+/, "N" + pcount);
	// console.log("OLDTOKEN2", token, "NEWTOKEN2", newtoken);
	// console.log("OLDID", id, "NEWID", newid);
	if (newtoken !== token) {
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		setEditorContents(line, field, newtoken, newid);
	}
}



//////////////////////////////
//
// addSlurEnd --
//

function addSlurEnd(id, line, field, slurend) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			// need to insert new slur before first one
			newtoken = token.substring(0, i+1);
			newtoken += slurend;
			newtoken += token.substring(i+1);
		}
	}

	if (newtoken === "") {
		newtoken = token + slurend;
	}

	var pcount = 0;
	for (i=0; i<newtoken.length; i++) {
		if (newtoken[i] == '(') {
			pcount++;
		}
	}

	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteSlurStart --
//

function deleteSlurStart(id, line, field, number) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	var counter = 0;
	var output = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == '(') {
			counter++;
		}
		if (counter != number) {
			newtoken += token[i];
			continue;
		}
		output += token[i];
		if (token[i+1] == '>') {
			output += '>';
			i++;
		} else if (token[i+1] == '<') {
			output += '<';
			i++;
		}
		counter++;
	}

	// console.log("OLDTOKEN1", token, "NEWTOKEN1", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

	return output;
}



//////////////////////////////
//
// deleteSlurEnd --
//

function deleteSlurEnd(id, line, field, number) {
	var token = getEditorContents(line, field);
	var newtoken = "";
	var counter = 0;
	var output = "";
	for (var i=0; i<token.length; i++) {
		if (token[i] == ')') {
			counter++;
			output = ')';
		}
		if (counter == number) {
			counter++;
			continue;
		}
		newtoken += token[i];
	}

	// console.log("OLDTOKEN1", token, "NEWTOKEN1", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

	return output;
}


//////////////////////////////
//
// deleteSlur --
//

function deleteSlur(id, line, field, number, line2, field2, number2) {
	// console.log("DELETING SLUR");
	var freezeBackup = FreezeRendering;
	deleteSlurStart(id, line, field, number);
	deleteSlurEnd(id, line2, field2, number2);
	FreezeRendering = freezeBackup;
	RestoreCursorNote = null;
	HIGHLIGHTQUERY = null;
	if (!FreezeRendering) {
		displayNotation();
	}
}




//////////////////////////////
//
// leftEndMoveForward --
//

function leftEndMoveForward(id, line, field, number, line2, field2, number2) {
	console.log("LEFT END MOVE FORWARD");
	var token1 = getEditorContents(line, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}

	var i = parseInt(line); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i++;
			continue;
		}
		break;
	}

	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 >= line2) {
		// do not pass slur end
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurstart = deleteSlurStart(id, line, field, number);
	if (slurstart !== "") {
		addSlurStart(id, i+1, field, slurstart);
	}
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// rightEndMoveForward --
//

function rightEndMoveForward(id, line, field, number, line2, field2, number2) {
	// console.log("RIGHT END MOVE FORWARD");
	var token1 = getEditorContents(line2, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = parseInt(line2); // -1 for 0-index and +1 for line after
	var counter = 0;
	var size = EDITOR.session.getLength();

	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i < size) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i++;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i++;
			continue;
		}
		break;
	}

	if (i >= size) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur start
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurend = deleteSlurEnd(id, line2, field2, number2);
	if (slurend !== "") {
		addSlurEnd(id, i+1, field, slurend);
	}
	// need to remove "N" if "N1" (in verovio)
	var newend = "L" + (i+1) + "F" + field2 + "N" + number2;
	var newid = id.replace(/-[^-]+$/, "-" + newend);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// rightEndMoveBack --
//

function rightEndMoveBack(id, line, field, number, line2, field2, number2) {
	// console.log("RIGHT END MOVE BACKWARD");
	var token1 = getEditorContents(line2, field);
	if (parseInt(line) >= parseInt(line2)) {
		return;
	}
	var i = parseInt(line2) - 2; // -1 for 0-index and -1 for line after
	var counter = 0;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	while (i >= 0) {
		var text = EDITOR.session.getLine(i);
		if (text.match(/^\*/) || text.match(/^=/) || text.match(/^!/) || (text === "")) {
			i--;
			continue;
		}
		var token2 = getEditorContents(i+1, field);
		if (token2.match(/[A-G]/i)) {
			counter++;
		}
		if (counter != target) {
			i--;
			continue;
		}
		break;
	}

	if (i <= 0) {
		// no note to attach to
		return;
	}
	if ((text[0] == '*') || (text[0] == '!') || (text === "")) {
		// no note to attach to
		return;
	}
	if (i+1 <= line) {
		// do not pass slur start
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var slurend = deleteSlurEnd(id, line2, field2, number2);
	if (slurend !== "") {
		addSlurEnd(id, i+1, field, slurend);
	}
	// need to remove "N" if "N1" (in verovio)
	var newend = "L" + (i+1) + "F" + field2 + "N" + number2;
	var newid = id.replace(/-[^-]+$/, "-" + newend);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
	FreezeRendering = freezeBackup;
	displayNotation();

	InterfaceSingleNumber = 0;
}



///////////////////////////////////////////////////////////////////////////
//
// Tie editing --
//


//////////////////////////////
//
// setTieAboveMarker --
//

function setTieAboveMarker(id, line, field, subfield) {
	console.log("TIE ABOVE", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no tie allowed
		return;
	}

	var newtoken = "";
	var matches;

	if (!(token.match(/[[]/) || token.match("_"))) {
		// no tie start
		return;
	}

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^_[]*)([_[]+)([" + above + below + "]*)([^_[]*)");
	if (matches = re.exec(token)) {
		newtoken = matches[1] + matches[2] + above + matches[4];
	} else {
		newtoken = token;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}




//////////////////////////////
//
// setTieBelowMarker --
//

function setTieBelowMarker(id, line, field, subfield) {
	console.log("TIE BELOW", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no tie allowed
		return;
	}

	var newtoken = "";
	var matches;

	if (!(token.match(/[[]/) || token.match("_"))) {
		// no tie start
		return;
	}

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^_[]*)([_[]+)([" + above + below + "]*)([^_[]*)");
	if (matches = re.exec(token)) {
		newtoken = matches[1] + matches[2] + below + matches[4];
	} else {
		newtoken = token;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteTieDirectionMarker --
//

function deleteTieDirectionMarker(id, line, field, subfield) {
	console.log("TIE DIRECTION REMOVE", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no tie allowed
		return;
	}

	var newtoken = "";
	var matches;

	if (!(token.match(/[[]/) || token.match("_"))) {
		// no tie start
		return;
	}

	var directions = insertDirectionRdfs();
	var above = directions[0];
	var below = directions[1];
	var re = new RegExp("([^_[]*)([_[]+)([" + above + below + "]*)([^_[]*)");
	if (matches = re.exec(token)) {
		newtoken = matches[1] + matches[2] + matches[4];
	} else {
		newtoken = token;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



///////////////////////////////////////////////////////////////////////////
//
// Stem editing --
//



//////////////////////////////
//
// setStemAboveMarker --
//

function setStemAboveMarker(id, line, field) {
	console.log("STEM ABOVE", line, field, id);
	var token = getEditorContents(line, field);

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var matches;
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (matches = subtokens[i].match(/([^\\\\\\\/]*)([\\\\\\\/]+)([^\\\\\\\/]*)/)) {
			subtokens[i] = matches[1] + "/" + matches[3];
		} else if (matches = subtokens[i].match(/([^A-Ga-g#XxYyTt:'~oOS$MmWw\^<>n-]*)([A-Ga-g#Xx<>yYnTt:'~oOS$MmWw\^-]+)(.*)/)) {
			subtokens[i] = matches[1] + matches[2] + "/" + matches[3];
		}
	}

	var newtoken = subtokens.join(" ");

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// setStemBelowMarker --
//

function setStemBelowMarker(id, line, field) {
	console.log("STEM BELOW", line, field, id);
	var token = getEditorContents(line, field);
	console.log("TOKEN EXTRACTED IS", token);

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var matches;
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (matches = subtokens[i].match(/([^\\\/]*)([\\\\\\\/]+)([^\\\\\\\/]*)/)) {
			subtokens[i] = matches[1] + "\\" + matches[3];
		} else if (matches = subtokens[i].match(/([^A-Ga-g#XxYyTt:'~oOS$MmWw\^<>n-]*)([A-Ga-g#Xx<>yYnTt:'~oOS$MmWw\^-]+)(.*)/)) {
			subtokens[i] = matches[1] + matches[2] + "\\" + matches[3];
		}
	}

	var newtoken = subtokens.join(" ");

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// deleteStemMarker --
//

function deleteStemMarker(id, line, field) {
	console.log("REMOVE STEMS", line, field, id);
	var token = getEditorContents(line, field);

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken = token.replace(/[\\\/]/g, "");

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}


///////////////////////////////////////////////////////////////////////////
//
// Transposing --
//


//////////////////////////////
//
// tranposeUp --
//

function transposeNote(id, line, field, subfield, amount)  {
	// console.log("TRANSPOSE Note", line, field, subfield, id);
	console.log("TRANSPOSE Note", {line, column: field, subfield, noteId:id});
	var token = getEditorContents(line, field);

	amount = parseInt(amount);
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}

	if (target > 1) {
		if (amount > 0) {
			amount = target - 1;
		} else {
			amount = -target + 1;
		}
		InterfaceSingleNumber = 0;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;
	var matches;
	if (matches = token.match(/([^a-gA-G]*)([a-gA-G]+)([^a-gA-G]*)/)) {
		newtoken = matches[1];
		newtoken += transposeDiatonic(matches[2], amount);
		newtoken += matches[3];

	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);

		// let shouldUpdate = window.confirm('Include value?');
		// if (shouldUpdate) {
		// 	// Add true as last parameter to prevent from rendering change to SVG
		// 	setEditorContents(line, field, newtoken, id);
		// }
	}
}

// function transposeNote(id, line, field, subfield, amount)  {
// 	// console.log("TRANSPOSE Note", line, field, subfield, id);
// 	console.log("TRANSPOSE Note", {line, column: field, subfield, noteId:id});
// 	var token = getEditorContents(line, field);

// 	amount = parseInt(amount);
// 	var target = InterfaceSingleNumber;
// 	if (!target) {
// 		target = 1;
// 	}

// 	if (target > 1) {
// 		if (amount > 0) {
// 			amount = target - 1;
// 		} else {
// 			amount = -target + 1;
// 		}
// 		InterfaceSingleNumber = 0;
// 	}

// 	if (subfield) {
// 		var subtokens = token.split(" ");
// 		token = subtokens[subfield-1];
// 	}

// 	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
// 		return;
// 	}
// 	if (token.match("r")) {
// 		// rest, which does not need/have a natural
// 		return;
// 	}

// 	var newtoken;
// 	var matches;
// 	if (matches = token.match(/([^a-gA-G]*)([a-gA-G]+)([^a-gA-G]*)/)) {
// 		newtoken = matches[1];
// 		newtoken += transposeDiatonic(matches[2], amount);
// 		newtoken += matches[3];

// 	}

// 	if (subfield) {
// 		subtokens[subfield-1] = newtoken;
// 		newtoken = subtokens.join(" ");
// 	}

// 	console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
// 	if (newtoken !== token) {
// 		RestoreCursorNote = id;
// 		HIGHLIGHTQUERY = id;
// 		setEditorContents(line, field, newtoken, id);
// 	}
// }



///////////////////////////////////////////////////////////////////////////
//
// Accidental editing --
//



//////////////////////////////
//
// toggleEditorialAccidental --
//

function toggleEditorialAccidental(id, line, field, subfield) {
	console.log("TOGGLE EDITORIAL ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have an accidental
		return;
	}

	var editchar = insertEditorialAccidentalRdf();
	var newtoken;
	var matches;

	var re = new RegExp(editchar);
	if (re.exec(token)) {
		newtoken = token.replace(new RegExp(editchar, "g"), "");
	} else if (token.match(/[-#n]/)) {
		// add editorial accidental
		matches = token.match(/(.*[a-gA-Gn#xXyY-]+)(.*)/);
		newtoken = matches[1] + editchar + matches[2];
	} else {
		// add a natural and an editorial accidental
		matches = token.match(/(.*[a-gA-GxXyY]+)(.*)/);
		newtoken = matches[1] + "n" + editchar + matches[2];
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleSharp -- show or hide a sharp or double sharp on a note.
//

function toggleSharp(id, line, field, subfield) {
	// console.log("TOGGLE NATURAL ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;


	if (InterfaceSingleNumber == 2) {
		if (!token.match("##")) {
			// add double sharp
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/,
					function(str,p1) { return p1 ? p1 + "##" : str});
		} else {
			// remove double-sharp
			newtoken = token.replace(/#+i?/, "");
		}
		InterfaceSingleNumber = 0;
	} else {
		if (token.match("##") || !token.match("#")) {
			// add sharp
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/,
					function(str,p1) { return p1 ? p1 + "#" : str});
		} else {
			// remove sharp
			newtoken = token.replace(/#+i?/, "");
		}
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleFlat -- Show or hide a flat or double flat on a note.
//

function toggleFlat(id, line, field, subfield) {
	// console.log("TOGGLE FLAT ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;
	if (InterfaceSingleNumber == 2) {
		if (!token.match("--")) {
			// add flat
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/,
					function(str,p1) { return p1 ? p1 + "--" : str});
		} else {
			// remove flat
			newtoken = token.replace(/-+i?/, "");
		}
		InterfaceSingleNumber = 0;
	} else {
		if (token.match("--") || !token.match("-")) {
			// add flat
			newtoken = token.replace(/[#n-]+/, "");
			newtoken = newtoken.replace(/([a-gA-G]+)/,
					function(str,p1) { return p1 ? p1 + "-" : str});
		} else {
			// remove flat
			newtoken = token.replace(/-+i?/, "");
		}
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleNatural --
//

function toggleNatural(id, line, field, subfield) {
	console.log("TOGGLE NATURAL ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have a natural
		return;
	}

	var newtoken;
	if (!token.match("n")) {
		// add natural
		newtoken = token.replace(/[#n-]+/, "");
		newtoken = newtoken.replace(/([a-gA-G]+)/,
				function(str,p1) { return p1 ? p1 + "n" : str});
	} else {
		// remove natural
		newtoken = token.replace(/n+i?/, "");
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleExplicitAccidental --
//

function toggleExplicitAccidental(id, line, field, subfield) {
	console.log("TOGGLE EXPLICIT ACCIDENTAL", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, so no accidental
		return;
	}

	var newtoken;
	var matches;

	if (token.match(/n/)) {
		// remove cautionary natural
		newtoken = token.replace(/n/g, "");
	} else if (matches = token.match(/([^#-]*)([#-]+)(X?)([^#-]*)/)) {
		// add or remove "X" from sharp/flats
		if (matches[3] === "X") {
			// remove cautionary accidental
			newtoken = matches[1] + matches[2] + matches[4];
		} else {
			// add cautionary accidental
			newtoken = matches[1] + matches[2] + "X" + matches[4];
		}
	} else {
		// add a natural sign
		if (matches = token.match(/([^A-G]*)([A-G]+)([^A-G]*)/i)) {
			newtoken = matches[1] + matches[2] + "n" + matches[3];
		}
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}

}



//////////////////////////////
//
// toggleStaccato --
//

function toggleStaccato(id, line, field) {
	var counter = 0;
	var maxline = EDITOR.session.getLength();
	var i = line;
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	while ((line < maxline) && (counter < target)) {
		var token = getEditorContents(line, field);
		if (token.match(/^\*/) || token.match(/^=/) || token.match(/^!/) || (token === "")) {
			line++;
			continue;
		}
		if (token === ".") {
			// nothing to do, just a null data token
			line++;
			continue;
		}
		if (token.match("r")) {
			// not a note
			line++;
			continue;
		}
		if (!token.match("'")) {
			// add staccato
			token = token.replace(/'+/, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/g,
					function(str,p1) { return p1 ? p1 + "'" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove staccato
			token = token.replace(/'[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		}
	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



//////////////////////////////
//
// toggleAccent --
//

function toggleAccent(id, line, field) {
	var counter = 0;
	var maxline = EDITOR.session.getLength();
	var i = line;
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	while ((line < maxline) && (counter < target)) {
		var token = getEditorContents(line, field);
		if (token.match(/^\*/) || token.match(/^=/) || token.match(/^!/) || (token === "")) {
			line++;
			continue;
		}
		if (token === ".") {
			// nothing to do, just a null data token
			line++;
			continue;
		}
		if (token.match("r")) {
			// not a note
			line++;
			continue;
		}

		if (!token.match(/\^+/)) {
			// add accent
			token = token.replace(/\^+/, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
					function(str,p1) { return p1 ? p1 + "^" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove accent
			token = token.replace(/\^+[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		}

	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



//////////////////////////////
//
// toggleMarcato --
//

function toggleMarcato(id, line, field) {
	var counter = 0;
	var maxline = EDITOR.session.getLength();
	var i = line;
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	while ((line < maxline) && (counter < target)) {
		var token = getEditorContents(line, field);
		if (token.match(/^\*/) || token.match(/^=/) || token.match(/^!/) || (token === "")) {
			line++;
			continue;
		}
		if (token === ".") {
			// nothing to do, just a null data token
			line++;
			continue;
		}
		if (token.match("r")) {
			// not a note
			line++;
			continue;
		}

		if (!token.match(/\^+/)) {
			// add marcato
			token = token.replace(/\^+/, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
					function(str,p1) { return p1 ? p1 + "^^" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove marcato
			token = token.replace(/\^+[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		}

	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



//////////////////////////////
//
// toggleTenuto --
//

function toggleTenuto(id, line, field) {
	var counter = 0;
	var maxline = EDITOR.session.getLength();
	var i = line;
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	while ((line < maxline) && (counter < target)) {
		var token = getEditorContents(line, field);
		if (token.match(/^\*/) || token.match(/^=/) || token.match(/^!/) || (token === "")) {
			line++;
			continue;
		}
		if (token === ".") {
			// nothing to do, just a null data token
			line++;
			continue;
		}
		if (token.match("r")) {
			// not a note
			line++;
			continue;
		}

		if (!token.match(/~/)) {
			// add marcato
			token = token.replace(/~+/g, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
					function(str,p1) { return p1 ? p1 + "~" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove marcato
			token = token.replace(/~[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			setEditorContents(line, field, token, id);
			counter++;
		}

	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



//////////////////////////////
//
// toggleStaccatissimo --
//

function toggleStaccatissimo(id, line, field) {
	var counter = 0;
	var maxline = EDITOR.session.getLength();
	var i = line;
	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	while ((line < maxline) && (counter < target)) {
		var token = getEditorContents(line, field);
		if (token.match(/^\*/) || token.match(/^=/) || token.match(/^!/) || (token === "")) {
			line++;
			continue;
		}
		if (token === ".") {
			// nothing to do, just a null data token
			line++;
			continue;
		}
		if (token.match("r")) {
			// not a note
			line++;
			continue;
		}

		if (!token.match(/`/)) {
			// add marcato
			token = token.replace(/`/g, "");
			token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
					function(str,p1) { return p1 ? p1 + "`" : str});
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		} else {
			// remove marcato
			token = token.replace(/`[<>]*/g, "");
			RestoreCursorNote = id;
			setEditorContents(line, field, token, id);
			counter++;
			line++;
		}

	}
	InterfaceSingleNumber = 0;
	FreezeRendering = freezeBackup;
	displayNotation();
}



//////////////////////////////
//
// toggleGraceNoteType --
//

function toggleGraceNoteType(id, line, field) {
	var token = getEditorContents(line, field);
	var subtokens = token.split(" ");
	for (var i=0; i<subtokens.length; i++) {
		if (subtokens[i].match("qq")) {
			subtokens[i] = subtokens[i].replace(/qq/g, "q");
		} else if (subtokens[i].match("q")) {
			subtokens[i] = subtokens[i].replace(/q/g, "qq");
		}
	}
	var newtoken = subtokens.join(" ");

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}




//////////////////////////////
//
// toggleMinorTrill --
//

function toggleMinorTrill(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/T/i)) {
		// add trill
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
				function(str,p1) { return p1 ? p1 + "t" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else if (token.match(/T/)) {
		// change to major-second trill
		token = token.replace(/T/g, "t");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove trill
		token = token.replace(/T[<>]*/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleMordent --
//

function toggleMordent(mtype, id, line, field, subfield) {
	console.log("TOGGLE MORDENT", token, line, field, subfield, id);

	var token = getEditorContents(line, field);
	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}
	if (token.match("r")) {
		// reset, so no mordent allowed
		return;
	}

	var newtoken = "";
	var matches;
	var matches = token.match(/[MmWw]/);
	var hasmordent = false;
	if (matches) {
		hasmordent = true;
	}
	var hascurrentmordent = false;
	if (hasmordent) {
		var re2 = new RegExp(mtype);
		if (re2.exec(token)) {
			hascurrentmordent = true;
		}
	}

	if (hascurrentmordent) {
		// remove existing mordent
		newtoken = token.replace(/[MmWw][<>]*/g, "");
	} else if (hasmordent) {
		// change the current mordent to the new one
		newtoken = token.replace(/[MmWw]/g, mtype);
	} else {
		// add the given mordent
		newtoken = token + mtype;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	// console.log("OLDTOKEN", token, "NEWTOKEN", newtoken);
	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// toggleLigatureStart --
//

function toggleLigatureStart(id, line, field) {
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*lig/)) {
			// if there is an lig line don't add one
			addline = false;
	}
	if (!addline) {
		// Already a line with one or more *lig exists.  Toggle *lig on/off
		// for given field and delete line if only contains * tokens.
		let oldline = EDITOR.session.getLine(line);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		if (fields[field-1] === "*") {
			fields[field-1] = "*lig";
		} else {
			fields[field-1] = "*";
		}
		let newline = fields.join("\t");
		if (newline.match(/^[*\t]+$/)) {
			// blank line so delete it
			console.log("DELETING BLANK LINE");
			EDITOR.session.replace(new Range(line-2, 0, line-1, 0), "");
			newid = id.replace(/L\d+/, "L" + (line-1));
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		} else {
			// update line
			console.log("UPDATING LINE:", newline);
			newline += "\n";
			EDITOR.session.replace(new Range(line, 0, line+1, 0), newline);
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		}
	} else {
		// Add an *lig on a line after the selected line at the given field.
		let oldline = EDITOR.session.getLine(line-1);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		let fieldcount = fields.length;
		let newline = "";
		for (let i=0; i<fieldcount; i++) {
			newline += "*";
			if (i == field - 1) {
				newline += "lig";
			}
			if (i < fieldcount - 1) {
				newline += "\t";
			}
		}
		newline += "\n";
		EDITOR.session.insert({row:line-1, column:0}, newline);
		newid = id.replace(/L\d+/, "L" + (line+1));
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
	}
}



//////////////////////////////
//
// toggleColorationStart --
//

function toggleColorationStart(id, line, field) {
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*col/)) {
			// if there is an col line don't add one
			addline = false;
	}
	if (!addline) {
		// Already a line with one or more *col exists.  Toggle *col on/off
		// for given field and delete line if only contains * tokens.
		let oldline = EDITOR.session.getLine(line);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		if (fields[field-1] === "*") {
			fields[field-1] = "*col";
		} else {
			fields[field-1] = "*";
		}
		let newline = fields.join("\t");
		if (newline.match(/^[*\t]+$/)) {
			// blank line so delete it
			console.log("DELETING BLANK LINE");
			EDITOR.session.replace(new Range(line-2, 0, line-1, 0), "");
			newid = id.replace(/L\d+/, "L" + (line-1));
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		} else {
			// update line
			console.log("UPDATING LINE:", newline);
			newline += "\n";
			EDITOR.session.replace(new Range(line, 0, line+1, 0), newline);
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		}
	} else {
		// Add an *col on a line after the selected line at the given field.
		let oldline = EDITOR.session.getLine(line-1);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		let fieldcount = fields.length;
		let newline = "";
		for (let i=0; i<fieldcount; i++) {
			newline += "*";
			if (i == field - 1) {
				newline += "col";
			}
			if (i < fieldcount - 1) {
				newline += "\t";
			}
		}
		newline += "\n";
		EDITOR.session.insert({row:line-1, column:0}, newline);
		newid = id.replace(/L\d+/, "L" + (line+1));
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
	}
}



//////////////////////////////
//
// togglePedalStart -- Inserting before LO:TX is a problem
//
// InterfaceSingleNumber == 4 => *Xlig toggle instead of *Xped
// InterfaceSingleNumber == 5 => *Xcol toggle instead of *Xped
//

function togglePedalStart(id, line, field) {
	if (InterfaceSingleNumber == 4) {
		toggleLigatureStart(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	} else if (InterfaceSingleNumber == 5) {
		toggleColorationStart(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	}

	var text = EDITOR.session.getLine(line-1);
	if (text.match(/^!/)) {
		return;
	}
	if (text.match(/^\*/)) {
		return;
	}
	var addline = true;
	var ptext = EDITOR.session.getLine(line-2);
	if (ptext.match(/^\*/) && ptext.match(/\*ped/)) {
			addline = false;
	}
	var newid;
	if (!addline) {
		// delete existing pedal line
		console.log("DELETING PEDAL START");
		EDITOR.session.replace(new Range(line-2, 0, line-1, 0), "");
		newid = id.replace(/L\d+/, "L" + (line-1));
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		return;
	}

	// inserting in the first column, but should more
	// correctly be the first **kern dataspine...
	var newline = createNullLine("*", text);
	newline = newline.replace(/^(\t*)\*(\t*)/, "$1*ped$2");
	EDITOR.session.insert({row:line-1, column:0}, newline);
	newid = id.replace(/L\d+/, "L" + (line+1));
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;
}


//////////////////////////////
//
// toggleColorationEnd --
//

function toggleColorationEnd(id, line, field) {
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*Xcol/)) {
			// if there is an Xcol line don't add one
			addline = false;
	}
	if (!addline) {
		// Already a line with one or more *Xcol exists.  Toggle *Xcol on/off
		// for given field and delete line if only contains * tokens.
		let oldline = EDITOR.session.getLine(line);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		if (fields[field-1] === "*") {
			fields[field-1] = "*Xcol";
		} else {
			fields[field-1] = "*";
		}
		let newline = fields.join("\t");
		if (newline.match(/^[*\t]+$/)) {
			// blank line so delete it
			console.log("DELETING BLANK LINE");
			EDITOR.session.replace(new Range(line, 0, line+1, 0), "");
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		} else {
			// update line
			console.log("UPDATING LINE:", newline);
			newline += "\n";
			EDITOR.session.replace(new Range(line, 0, line+1, 0), newline);
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		}
	} else {
		// Add an *Xcol on a line after the selected line at the given field.
		let oldline = EDITOR.session.getLine(line-1);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		let fieldcount = fields.length;
		let newline = "";
		for (let i=0; i<fieldcount; i++) {
			newline += "*";
			if (i == field - 1) {
				newline += "Xcol";
			}
			if (i < fieldcount - 1) {
				newline += "\t";
			}
		}
		newline += "\n";
		EDITOR.session.replace(new Range(line, 0, line, 0), newline);
		var newid = id;
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
	}
}



//////////////////////////////
//
// toggleLigatureEnd --
//

function toggleLigatureEnd(id, line, field) {
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*Xlig/)) {
			// if there is an Xlig line don't add one
			addline = false;
	}
	if (!addline) {
		// Already a line with one or more *Xlig exists.  Toggle *Xlig on/off
		// for given field and delete line if only contains * tokens.
		let oldline = EDITOR.session.getLine(line);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		if (fields[field-1] === "*") {
			fields[field-1] = "*Xlig";
		} else {
			fields[field-1] = "*";
		}
		let newline = fields.join("\t");
		if (newline.match(/^[*\t]+$/)) {
			// blank line so delete it
			console.log("DELETING BLANK LINE");
			EDITOR.session.replace(new Range(line, 0, line+1, 0), "");
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		} else {
			// update line
			console.log("UPDATING LINE:", newline);
			newline += "\n";
			EDITOR.session.replace(new Range(line, 0, line+1, 0), newline);
			var newid = id;
			RestoreCursorNote = newid;
			HIGHLIGHTQUERY = newid;
		}
	} else {
		// Add an *Xlig on a line after the selected line at the given field.
		let oldline = EDITOR.session.getLine(line-1);
		oldline = oldline.replace(/\t+$/, "").replace(/^\t+/, "");
		let fields = oldline.split(/\t+/)
		let fieldcount = fields.length;
		let newline = "";
		for (let i=0; i<fieldcount; i++) {
			newline += "*";
			if (i == field - 1) {
				newline += "Xlig";
			}
			if (i < fieldcount - 1) {
				newline += "\t";
			}
		}
		newline += "\n";
		EDITOR.session.replace(new Range(line, 0, line, 0), newline);
		var newid = id;
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
	}
}



//////////////////////////////
//
// togglePedalEnd --
// 
// InterfaceSingleNumber == 4 => *Xlig toggle instead of *Xped
// InterfaceSingleNumber == 5 => *Xcol toggle instead of *Xped
//

function togglePedalEnd(id, line, field) {
	if (InterfaceSingleNumber == 4) {
		toggleLigatureEnd(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	} else if (InterfaceSingleNumber == 5) {
		toggleColorationEnd(id, line, field);
		InterfaceSingleNumber = 0;
		return;
	}

	var text = EDITOR.session.getLine(line-1);
	if (text.match(/^!/)) {
		return;
	}
	if (text.match(/^\*/)) {
		return;
	}
	var addline = true;
	var ptext = EDITOR.session.getLine(line);
	if (ptext.match(/^\*/) && ptext.match(/\*Xped/)) {
			addline = false;
	}
	var newid;
	if (!addline) {
		// delete existing pedal line
		// console.log("DELETING PEDAL END");
		EDITOR.session.replace(new Range(line, 0, line+1, 0), "");
		newid = id;
		RestoreCursorNote = newid;
		HIGHLIGHTQUERY = newid;
		return;
	}

	var freezeBackup = FreezeRendering;
	FreezeRendering = true;
	var newline = createNullLine("*", text);
	newline = newline.replace(/^(\t*)\*(\t*)/, "$1*Xped$2");
	EDITOR.session.replace(new Range(line, 0, line, 0), newline);
	newid = id;
  	console.log("OLDID", id, "NEWID", newid);
	RestoreCursorNote = newid;
	HIGHLIGHTQUERY = newid;

	FreezeRendering = freezeBackup;
	displayNotation();

}



//////////////////////////////
//
// toggleMajorTrill --
//

function toggleMajorTrill(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/T/i)) {
		// add trill
		token = token.replace(/T/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/,
				function(str,p1) { return p1 ? p1 + "T" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else if (token.match(/t/)) {
		// switch to major second trill
		token = token.replace(/t/g, "T");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove trill
		token = token.replace(/T[<>]*/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleArpeggio --
//

function toggleArpeggio(id, line, field) {
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (token.match("r")) {
		// not a note
		return;
	}
	if (!token.match(/:/i)) {
		// add arpeggio
		token = token.replace(/:/gi, "");
		token = token.replace(/([a-gA-G]+[-#nXxYy<>]*)/g,
				function(str,p1) { return p1 ? p1 + ":" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove arpeggio
		token = token.replace(/:/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleFermata --
//

function toggleFermata(id, line, field) {
	console.log("TOGGLING FERMATA");
	var token = getEditorContents(line, field);
	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}
	if (!token.match(/;/i)) {
		// add marcato
		token = token.replace(/;/gi, "");
		token = token.replace(/([ra-gA-G]+[-#nXxYy<>]*)/,
				function(str,p1) { return p1 ? p1 + ";" : str});
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// remove marcato
		token = token.replace(/;[<>]*/gi, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



//////////////////////////////
//
// toggleVisibility -- Still have to think about chords.
//

function toggleVisibility(id, line, field) {
	var token = getEditorContents(line, field);

	if (token === ".") {
		// nothing to do, just a null data token
		return;
	}

	if (token.match(/yy/)) {
		// token is invisible, so make it visible again.
		token = token.replace(/yy/, "");
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	} else {
		// make token invisible (deal with chords later)
		token = token + "yy";
		RestoreCursorNote = id;
		setEditorContents(line, field, token, id);
	}
}



/////////////////////////////
//
// setEditorContents --
//

function setEditorContents(line, field, token, id, dontredraw) {
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	console.log('setEditorContents args:', {line, field, token, id, dontredraw})

	var i;
	var linecontent = EDITOR.session.getLine(line-1);
	var range = new Range(line-1, 0, line-1, linecontent.length);

	var components = linecontent.split(/\t+/);
	components[field-1] = token;
	
	// count tabs between fields
	var tabs = [];
	for (i=0; i<components.length + 1; i++) {
		tabs[i] = "";
	}
	var pos = 0;
	if (linecontent[0] != '\t') {
		pos++;
	}
	for (i=1; i<linecontent.length; i++) {
		if (linecontent[i] == '\t') {
			tabs[pos] += '\t';
		} else if ((linecontent[i] != '\t') && (linecontent[i-1] == '\t')) {
			pos++;
		}
	}

	var newlinecontent = "";
	for (i=0; i<tabs.length; i++) {
		newlinecontent += tabs[i];
		if (components[i]) {
			newlinecontent += components[i];
		}
	}

	// newlinecontent = components.join("\t");

	var column = 0;
	for (i=0; i<field-1; i++) {
		column += components[i].length;
		column += tabs[i].length;
	}
	EDITINGID = id;

	EDITOR.session.replace(range, newlinecontent);
	EDITOR.gotoLine(line, column+1);

	RestoreCursorNote = id;
	FreezeRendering = freezeBackup;
	if (!dontredraw) {
		displayNotation();
	}
}



//////////////////////////////
//
// getEditorContents -- Allow subtokens perhaps.
//

function getEditorContents(line, field) {
	var token = "";

	var linecontent = EDITOR.session.getLine(line-1);

	var col = 0;
	if (field > 1) {
		var tabcount = 0;
		for (i=0; i<linecontent.length; i++) {
			col++;
			if (linecontent[i] == '\t') {
				if ((i > 0) && (linecontent[i-1] != '\t')) {
					tabcount++;
				}
			}
			if (tabcount == field - 1) {
				break;
			}
		}
	}
	for (var c=col; c<linecontent.length; c++) {
		if (linecontent[c] == '\t') {
			break;
		}
		if (linecontent[c] == undefined) {
			console.log("undefined index", c);
			break;
		}
		token += linecontent[c];
	}

	return token;
}



//////////////////////////////
//
// toggleMarkedNote --
//

function toggleMarkedNote(id, line, field, subfield) {
	console.log("TOGGLE MARKED NOTE ", line, field, subfield, id);
	var token = getEditorContents(line, field);

	if (subfield) {
		var subtokens = token.split(" ");
		token = subtokens[subfield-1];
	}

	if ((token === ".") || (token[0] == "!") || (token[0] == "*")) {
		return;
	}
	if (token.match("r")) {
		// rest, which does not need/have an accidental
		return;
	}

	var editchar = insertMarkedNoteRdf();
	var newtoken;
	var matches;

	var re = new RegExp(editchar);
	if (re.exec(token)) {
		// remove mark
		newtoken = token.replace(new RegExp(editchar, "g"), "");
	} else {
		// add a natural and an editorial accidental
		newtoken = token + editchar;
	}

	if (subfield) {
		subtokens[subfield-1] = newtoken;
		newtoken = subtokens.join(" ");
	}

	if (newtoken !== token) {
		RestoreCursorNote = id;
		HIGHLIGHTQUERY = id;
		setEditorContents(line, field, newtoken, id);
	}
}



//////////////////////////////
//
// addLocalCommentLineAboveCurrentPosition -- Add a local comment
//   line above the current line. Cursor keeps its position on the
//   original line.
//

function addLocalCommentLineAboveCurrentPosition() {
	addNullLine("!", "**blank");
}



//////////////////////////////
//
// addInterpretationLineAboveCurrentPosition -- Add an interpretation
//   line above the current line. Cursor keeps its position on the
//   original line.
//

function addInterpretationLineAboveCurrentPosition() {
	addNullLine("*", "**blank");
}



//////////////////////////////
//
// addDataLineAboveCurrentPosition -- Add an empty data line
//   above the current line. Cursor keeps its position on the
//   original line.
//

function addDataLineAboveCurrentPosition() {
	addNullLine(".", "**dynam");
}



//////////////////////////////
//
// addBarlineAboveCurrentPosition -- Add barline above the current
//   line. Cursor keeps its position on the original line.
//

function addBarlineAboveCurrentPosition() {
	addNullLine("=", "**blank");
}


//////////////////////////////
//
// createNullLine --
//

function createNullLine(token, textline) {
	var newline = "";
	if (textline[0] == '\t') {
		newline += '\t';
	} else {
		newline += token;
	}
	var i;
	for (i=1; i<textline.length; i++) {
		if (textline[i] == '\t') {
			newline += '\t';
		} else if ((textline[i] != '\t') && (textline[i-1] == '\t')) {
			newline += token;
		}
	}
	newline += "\n";
	return newline;
}



//////////////////////////////
//
// addNullLine -- Add a line of tokens based on how many tokens
//    the given line has.  However, if the current line is an
//    exclusive interpretation, then instead add a **dynam column
//    on the right side of the cursor's column.
//

function addNullLine(token, exinterp, row) {
	if (!token) {
		token = ".";
	}
	if (!exinterp) {
		exinterp = "**blank";
	}
	if (!row) {
		var location = EDITOR.getCursorPosition();
		row = location.row;
	}
	var currentline = EDITOR.session.getLine(row);
	if (currentline.match(/^!!/)) {
		// don't know how many spines to add
		return;
	}
	if (currentline.match(/^$/)) {
		// empty line: don't know how many spines to add
		return;
	}
	if (currentline.match(/^\*\*/)) {
		// can't add spines before exclusive interpretation
		// so instead add a **dynam spine on the right of the
		// cursor's current column.
		addSpineToRight(exinterp, currentline, location);
		return;
	}

	var newline = createNullLine(token, currentline);
	EDITOR.session.insert({row:row, column:0}, newline);
}



//////////////////////////////
//
// addSpineToRight --  Add an extra spine to the immediate
//    right of a given spine (must be done at an exinterp line).
//

function addSpineToRight(exinterp, currentline, location) {
	console.log("EXINTERP", exinterp, "CURRENTLINE", currentline, "LOCATION", location);
	var column = location.column;

	// calculate spine number at current location
	var scount = 0;
	var i;
	var state = 0;
	for (i=0; i<location.column + 1; i++) {
		if (currentline[i] == '\t') {
			if (state == 1) {
				state = 0;
			}
		} else {
			if (state == 0) {
				state = 1;
				scount++;
			}
		}
	}

	// count the total number of spines:
	var tcount = 0;
	state = 0;
	for (i=0; i<currentline.length; i++) {
		if (currentline[i] == '\t') {
			if (state == 1) {
				state = 0;
			}
		} else {
			if (state == 0) {
				state = 1;
				tcount++;
			}
		}
	}

	console.log("   SPINE NUMBER IS ", scount, "TOTAL", tcount);
	var filter = "extract -s ";
	if (scount == 1) {
		if (tcount == 1) {
			filter += "1,0";
		} else if (tcount == 2) {
			filter += "1,0,2";
		} else {
			filter += "1,0,2-$";
		}
	} else {
		filter += "1-" + scount + ",0";
		if (scount == tcount) {
			// do nothing
		} else if (scount + 1 == tcount) {
			filter += "," + tcount;
		} else {
			filter += "," + (scount+1) + "-$";
		}
	}
	if (exinterp !== "**blank") {
		filter += " -n " + exinterp;
	}
	MENU.applyFilter(filter);
}



//////////////////////////////
//
// getBeamParent -- Return the first element containing an id starting
//   with "beam-" in the ancestors of the given element.
//

function getBeamParent(element) {
	var current = element.parentNode;
	while (current) {
		if (current.id.match(/^beam-/)) {
			return current;
		}
		current = current.parentNode;
	}
	return undefined;
}



//////////////////////////////
//
// getBeamChild -- Return the direct child of a beam which contains this element.
//

function getBeamChild(element) {
	var current = element;
	while (current) {
		if (current.parentNode && current.parentNode.id.match(/^beam-/)) {
			return current;
		}
		current = current.parentNode;
	}
	return undefined;
}



//////////////////////////////
//
// startNewBeam -- L: Splitting a beam into two pieces, with the current note
//    starting a new beam, and the previous note ending the old beam.
//

function startNewBeam(element, line, field) {
	var parent = getBeamParent(element);
	var newelement = getBeamChild(element);
	if (!parent) {
		return;
	}
	var pid = parent.id;
	if (!pid.match(/^beam/)) {
		return;
	}
	var selector = "#" + pid + " > g[id^='note']";
	selector += ", #" + pid + " > g[id^='rest']";
	selector += ", #" + pid + " > g[id^='chord']";
	var children = parent.querySelectorAll(selector);
	var targeti = -1;
	for (var i=0; i<children.length; i++) {
		if (children[i] === newelement) {
			targeti = i;
			break;
		}
	}
	if (targeti <= 0) {
		// no need to start a new beam
		return;
	}

	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	if (targeti == 1) {
		// remove the beam on the first note of the original beam group
		// and add a beam start on this note unless it is at the end
		// of the original beam group.
		removeBeamInfo(children[0]);
		if (children.length == 2) {
			removeBeamInfo(children[1]);
		} else {
			addBeamStart(children[targeti]);
		}
	} else if (targeti < children.length - 1) {
		addBeamStart(children[targeti]);
		addBeamEnd(children[targeti-1]);
	} else {
		// remove the last note from the beam group
		addBeamEnd(children[targeti-1]);
		removeBeamInfo(children[targeti]);
	}

	EDITINGID = element.id;
	RestoreCursorNote = element.id;

	FreezeRendering = freezeBackup;
	if (!FreezeRendering) {
		displayNotation();
	}
	turnOffAllHighlights();
	highlightIdInEditor(EDITINGID);
}



//////////////////////////////
//
// endNewBeam -- J: Splitting a beam into two pieces, with the current note
//    ending the old beam, and the current note starting a new beam.
//

function endNewBeam(element, line, field) {
	var parent = getBeamParent(element);
	var newelement = getBeamChild(element);
	if (!parent) {
		return;
	}
	var pid = parent.id;
	if (!pid.match(/^beam/)) {
		return;
	}
	var selector = "#" + pid + " > g[id^='note']";
	selector += ", #" + pid + " > g[id^='rest']";
	selector += ", #" + pid + " > g[id^='chord']";
	var children = parent.querySelectorAll(selector);
	var targeti = -1;
	for (var i=0; i<children.length; i++) {
		if (children[i] === newelement) {
			targeti = i;
			break;
		}
	}
	if (targeti < 0) {
		return;
	}
	if (children.length == 1) {
		// strange: nothing to do
		return;
	}
	if (targeti == children.length - 1) {
		// already at the end of a beam, so nothing to do
		return;
	}

	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}

	if (targeti == 0) {
		// remove the beam info from the 0th element and add to 1st
		removeBeamInfo(children[0]);
		addBeamStart(children[targeti+1]);
	} else if (targeti == children.length - 2) {
		// end current beam, and make next note out of a beam
		removeBeamInfo(children[targeti+1]);
		addBeamEnd(children[targeti]);
	} else {
		addBeamEnd(children[targeti]);
		addBeamStart(children[targeti+1]);
	}
	EDITINGID = element.id;
	RestoreCursorNote = element.id;

	FreezeRendering = freezeBackup;
	if (!FreezeRendering) {
		displayNotation();
	}
	turnOffAllHighlights();
	highlightIdInEditor(EDITINGID);
}



//////////////////////////////
//
// removeBeamInfo -- remove [JLKk] characters from given line and field taken
//     from ID of input element.
//

function removeBeamInfo(element) {
	if (!element) {
		return;
	}
	var id = element.id;
	var matches = id.match(/[^-]+-.*L(\d+).*F(\d+)/);
	if (!matches) {
		return;
	}
	var line = parseInt(matches[1]);
	var field = parseInt(matches[2]);
	var token = getEditorContents(line, field).replace(/[LJKk]+[<>]?/g, "");
	setEditorContents(line, field, token, id, true);
}



//////////////////////////////
//
// addBeamStart -- remove [JLKk] characters from given line and field taken
//     from ID of input element and place a "L" at the end of the token.
//

function addBeamStart(element) {
	if (!element) {
		return;
	}
	var id = element.id;
	var matches = id.match(/[^-]+-.*L(\d+).*F(\d+)/);
	if (!matches) {
		return;
	}
	var line = parseInt(matches[1]);
	var field = parseInt(matches[2]);
	var token = getEditorContents(line, field).replace(/[LJKk]+[<>]?/g, "");
	token += 'L';
	setEditorContents(line, field, token, id, true);
}



//////////////////////////////
//
// addBeamEnd -- remove [JLKk] characters from given line and field taken
//     from ID of input element and place a "J" at the end of the token.
//

function addBeamEnd(element) {
	if (!element) {
		return;
	}
	var id = element.id;
	var matches = id.match(/[^-]+-.*L(\d+).*F(\d+)/);
	if (!matches) {
		return;
	}
	var line = parseInt(matches[1]);
	var field = parseInt(matches[2]);
	var token = getEditorContents(line, field).replace(/[LJKk]+[<>]?/g, "");
	token += 'J';
	setEditorContents(line, field, token, id, true);
}





// Functions related to sound playback:
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Fri Jun 23 08:11:13 CEST 2017
// Last Modified:  Fri Jun 23 08:11:16 CEST 2017
// Filename:       _includes/vhv-scripts/timemap.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Timemap processing code for VHV.
//


var TIMEMAP = [];
var LAST_TIMEMAP_INDEX = -1;
var LAST_TIME = -1;
var LOOKAHEAD = 20;  // 20 milliseconds
var INCREMENT = 20;  // 20 milliseconds
var REFRESH;

//////////////////////////////
//
// getTimemap --
//

function getTimemap() {
	try {
		var map = vrvToolkit.renderToTimemap();
		var data;
		// verovio 2.0.0 switches from string output to parsed JSON object for .renderToTimemap()
		if (typeof map === "string" || map instanceof String) {
			data = JSON.parse(map);
		} else {
			data = map;
		}
		TIMEMAP = data;
		console.log(TIMEMAP);
	} catch(err) {
		console.log("Error extracting timemap");
	}
}

//////////////////////////////
//
// InitializeTimemap --
//

function InitializeTimemap() {
	if (typeof REFRESH === "undefined") {
		return;
	}
	INCREMENT = 20;
	REFRESH = setInterval(function() {
		if (AUDIO && AUDIO.paused) {
			clearInterval(REFRESH);
			return;
		}
		if (!AUDIO) {
			clearInterval(REFRESH);
			return;
		}
		var currenttime = AUDIO.currentTime;
		CheckTimeMap(TIMEMAP[ID], QEVENTS, currenttime, increment/1000.0 * 2);
	}, INCREMENT);
}


//////////////////////////////
//
// CheckTimeMap --
//

function CheckTimeMap(timemap, events, currenttime, lookahead) {
	var target = null;
	var diff;
	for (var i=0; i<timemap.length; i++) {
		if (Math.abs(timemap[i].tstamp - currenttime) < lookahead) {
			target = timemap[i];
		}
	}

	if (!target) {
		return;
	}

	if (target.tstamp == LASTTIME) {
		return;
	}
	LASTTIME = target.tstamp;
	// console.log("TIMEENTRY", target);
	CheckEventMap(target.qstamp, events);
}



//////////////////////////////
//
// CheckEventMap --
//

function CheckEventMap(etime, events) {
	for (var i=0; i<events.length; i++) {
		if (Math.abs(etime - events[i].qstamp) < 0.01) {
			ProcessNoteEvents(events[i]);
		}
	}
}



//////////////////////////////
//
// ProcessNoteEvents --
//

function ProcessNoteEvents(event) {
	var ons = event.on;
	var offs = event.off;
	var i;

	for (i=0; i<ons.length; i++) {
		// ons[i].style.stroke = "red";
		// ons[i].style.fill = "red";
		// have to re-find on page in case the image has changed:
		var xon = document.querySelector("#" + ons[i].id);
		xon.style.fill = "red";
	}

	for (i=0; i<offs.length; i++) {
		// have to re-find on page in case the image has changed:
		var xoff = document.querySelector("#" + offs[i].id);
		xoff.style.fill = "";
	}
}



//////////////////////////////
//
// TurnOffAllNotes --
//

function TurnOffAllNotes() {
	var list = document.querySelectorAll("svg g[id^='note-']");
	for (var i=0; i<list.length; i++) {
		list[i].style.fill = "";
	}
}





// Functions related to repertory indexes:
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Thu Jun 21 16:07:56 PDT 2018
// Last Modified:  Thu Jun 21 16:08:01 PDT 2018
// Filename:       hmdindex.js
// Web Address:    https://verovio.humdrum.org/scripts/hmdindex.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:    Parse an index.hmd file giving the contents of a repertory.
//


//////////////////////////////
//
// HMDIndex constructor -- Creat an HMDIndex object.
//

function HMDIndex(contents) {
	this.clear();
	this.parse(contents);
	return this;
}



//////////////////////////////
//
// HMDIndex.prototype.clear -- Clear the old contents of the index
//

HMDIndex.prototype.clear = function() {
	// parameters == list of key/value pairs extracted from
	// Humdrum reference records in the input Humdurm data.
	this.parameters   = {};

	// items == list of files, groups, or dummy/dummy-vhv lines stored
	// on data lines in the input Humdrum data.  These are
	// sorted by the sortkey field after loading the data.
	this.items        = [];

	// groupedItems == database of sortkey values for entries
	// that are in groups (movements of a larger work).
	this.groupedItems = {};

	// sortIndex == database of entries indexed by sortkey value.
	this.sortIndex    = {};
};



//////////////////////////////
//
// HMDIndex.prototype.setParameter -- Set a parameter.
//

HMDIndex.prototype.setParameter = function(key, value) {
	this.parameters[key] = value;
};



//////////////////////////////
//
// HMDIndex.prototype.getParameter -- Get a parameter.
//

HMDIndex.prototype.getParameter = function(key) {
	return this.parameters[key];
};



//////////////////////////////
//
// HMDIndex.prototype.parse -- Parse the contents of a Humdrum
//     file containing and index of works and store them in the
//     object.
//

HMDIndex.prototype.parse = function(contents) {
	this.clear();
	var exfound          = 0;
	var index = {};
	var lines = contents.match(/[^\r\n]+/g);
	if (lines.length == 1) {
		if (lines[0].match(/^https?:\/\//)) {
			return this.parseURL(lines[0]);
		}
	}
	var entry;
	for (var i = 0; i<lines.length; i++) {
		var line = lines[i];
		if (line.match(/^\s*$/)) {
			continue;
		}
		var matches = line.match(/^!!!([^!:\s]+)\s*:\s*(.*)\s*$/);
		if (matches) {
			this.setParameter(matches[1], matches[2]);
			continue;
		}
		if (line.match(/^!/)) {
			// local or global comment
			continue;
		}
		if (line.match(/^\*\*/)) {
			exfound = 1;
			var fields = line.split(/\t+/);
			for (var j = 0; j<fields.length; j++) {
				var ematch = fields[j].match(/^\*\*(.*)/);
				if (ematch) {
					index[ematch[1]] = j;
				}
			}
		}
		if (!exfound) {
			continue;
		}
		if (line.match(/^\*/)) {
			continue;
		}
		var data = line.split(/\t+/);
		if (data.length < 1) {
			// not enough data fields so ignore the entry
			// there must be at least the filename specified.
			continue;
		}
		var filename = "";
		var sortkey = "";
		var available = "";
		var pdfname = "";
		var description = "";
		if (data[index["file"]]) {
			filename = data[index["file"]];
		}
		if (data[index["sort"]]) {
			sortkey = data[index["sort"]];
		}
		if (data[index["available"]]) {
			available = data[index["available"]];

		}
		if (data[index["pdf"]]) {
			pdfname = data[index["pdf"]];
		}
		if (data[index["description"]]) {
			description = cleanTitle(data[index["description"]]);
		}

		this.addEntry({filename:filename,
				sortkey:sortkey,
				available:available,
				pdfname:pdfname,
				description:description});
	}

	this.sortEntries();

	return this;
};


//////////////////////////////
//
// HMDIndex.prototype.sortEntries --
//

HMDIndex.prototype.sortEntries = function() {
	this.items.sort(function(a, b) {
		if (a.sortkey < b.sortkey) {
			return -1;
		} else if (a.sortkey > b.sortkey) {
			return 1;
		} else {
			return 0;
		}
	});
};



//////////////////////////////
//
// HMDIndex.prototype.parseURL --
//

HMDIndex.prototype.parseURL = function(url) {
	var that = this;
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) {
			that.parse(request.responseText);
		} else {
			reject("ERROR:", request.status);
		}
	}
	request.send();
};



//////////////////////////////
//
// HMDIndex.prototpye.addEntry --
//

HMDIndex.prototype.addEntry = function(object) {
	var filename    = object.filename;
	var sortkey     = object.sortkey;
	var available   = object.available;
	var pdfname     = object.pdfname;
	var description = cleanTitle(object.description);

	var matches;

	if ((!filename) || filename === ".") {
		// require filename at a minimum
		return;
	}
	if ((!available) || available === ".") {
		available = "Y";
	}
	if ((available !== "Y") && (available !== "N")) {
		if (available.match(/y/i)) {
			available = "Y";
		} else {
			available = "N";
		}
	}
	if (!available) {
		available = "Y";
	}
	if ((!sortkey) || (sortkey === ".")) {
		sortkey = filename;
	}
	if ((!pdfname) || (pdfname === ".")) {
		pdfname = "";
	}
	if ((!description) || (description === ".")) {
		description = filename;
	}

	// split the filename into directory, basename, and extension:
	var directory = "";
	var basename = "";
	var extension = "";

	var obj = {
			sortkey:     sortkey,
			description: description,
			pdfname:     pdfname
	};
		
	// THERE IS ALSO filename === "DUMMY" to implement.
	if (filename.match(/^@/)) {
		// this is a group, not a filename.  The group is a list
		// of sortkeys of the items that form the group.
		obj.group = filename.replace(/^@/, "").split(":");
		for (var i=0; i<obj.group.length; i++) {
			this.groupedItems[obj.group[i]] = true;
		}
	} else {
		matches = filename.match(/(.*)\//);
		if (matches) {
			directory = matches[1];
		}
		matches = filename.match(/([^\/]+?)(\.[^\/.]*)?$/);
		if (matches) {
			extension = matches[2];
			basename = matches[1];
		} else {
			matches = filename.match(/([^\/]+)$/);
			if (matches) {
				basename = matches[1];
			}
		}
		obj.available = available;
		obj.file = {
			fullname:    filename,
			extension:   extension,
			directory:   directory,
			basename:    basename
		}
	}

	this.items.push(obj);
	this.sortIndex[sortkey] = obj;
}


//////////////////////////////
//
// HMDIndex.prototype.generateHTML --
//

HMDIndex.prototype.generatHtml = HMDIndex.prototype.generateHTML;

HMDIndex.prototype.generateHTML = function() {
console.log("OBJECT HMD", this);

	var urlbase = "";
	if (this.parameters) {
		urlbase = this.parameters.github;
	}

	var output = "";
	output += "<table class='index-list'>\n";

	for (var i=0; i<this.items.length; i++) {
		var skey = this.items[i].sortkey;
		if (this.groupedItems[skey] === true) {
			continue;
		}
		if (this.items[i].file) {
			output += this.generateFileHTML(this.items[i]);
		} else if (this.items[i].group) {
			output += this.generateGroupHTML(this.items[i]);
		}
		// print DUMMY item
	}

	output += "</table>\n";

	return output;
}



//////////////////////////////
//
// HMDIndex.prototype.cleanTitle --
//

HMDIndex.prototype.cleanTitle = function(text) {
	return cleanRepertoryEntryText(text);
}



//////////////////////////////
//
// HMDIndex.prototype.generateFileHTML --
//

HMDIndex.prototype.generateFileHTML = function(entry, indent) {
	var output = "";
	output += "<tr>";
	output += "<td>";

	var description = cleanTitle(entry.description);
	var matches = description.match(/(.*)<link>(.*?)<\/link>(.*)/);
	var prefix = "";
	var postfix = "";
	if (matches) {
		prefix = matches[1];
		postfix = matches[3];
		description = matches[2];
	}
	if (description.match(/^\s*$/)) {
		description = entry.file.basename;
	}
	
	if (indent) {
		output += "<span class='indenter'></span>";
	}
	output += prefix;
	output += "<span class='ilink'";
	output += " onclick='displayWork(\"";
	output += this.parameters.githubbase;
	output += '/';
	output += entry.file.fullname;
	output += '");';
	output += "'>";
	output += description;
	output += "</span>";
	output += postfix;

	output += "</td>";
	output += "</tr>\n";

	return output;
}



//////////////////////////////
//
// HMDIndex.prototype.generateGroupHTML --
//

HMDIndex.prototype.generateGroupHTML = function(entry) {
	var output = "";
	// output += "<div class='group'>\n";
	output += "<tr><td class='igroup'>\n";
	output += cleanTitle(entry.description);
	output += "</td></tr>\n";
	var indent = 1;
	for (var i=0; i<entry.group.length; i++) {
		var fileentry = this.sortIndex[entry.group[i]];
		output += this.generateFileHTML(fileentry, indent);
	}
	// output += "</div>\n";
	return output;
};





// Functions related to filtering and also related
// to the filter toolbar:
//
// Filter-related functions that are included in main.js
//


//////////////////////////////
//
// compileFilters -- Save contents of input#filter to GLOBALFILTER,
//     then get compiled data returned from verovio.  This will also
//     compile any filters emebedded in the data along with the global
//     filter.  Any active searches will also be compiled (which will add
//     marks to matches notes in the score.  Turns off filter icon in toolbar
//     if it is active, but keep the filter in input#filter.
//

function compileFilters() {
	let target = document.querySelector("input#filter");
	let results = validateFilter(target, "Enter");
	if (!results.status) {
		event.target.classList.add("invalid");
		alert(`Error: unknown filter ${results.filter}`);
		return;
	} else {
		event.target.classList.remove("invalid");
	}

	let xml = dataIsXml();
	if (xml) {
		// Could be done later in certain cases.
		alert("Cannot apply filters to XML data");
		return;
	}

	if (GLOBALFILTER) {
		showCompiledFilterData("!!!Xfilter: " + GLOBALFILTER);
	} else {
		showCompiledFilterData();
	}
}



//////////////////////////////
//
// showCompiledFilterData -- Run the Humdrum data through the vrvToolkit
//      to extract the output from tool filtering.  The is run from the
//      alt-c keyboard shortcut.  The filter toolbar calls this fromt
//

function showCompiledFilterData(deleteline) {
	let text = getTextFromEditorWithGlobalFilter();
	let options = humdrumToSvgOptions();
	vrvWorker.filterData(options, text, "humdrum")
	.then(function(newdata) {
		newdata = newdata.replace(/\s+$/m, "");
		setTextInEditor(newdata);
		deactivateFilterInToolbar();
		removeLastLineInTextEditorIfMatches(deleteline);
	});
}



//////////////////////////////
//
// applyGlobalFilter --  Save contents of input#filter to GLOBALFILTER,
//    and then apply notation.  After apllying the global filter,
//    activate the filter icon in the filter toolbar.
//

function applyGlobalFilter() {
	let target = document.querySelector("input#filter");
	let results = validateFilter(target, "Enter");
	if (!results.status) {
		target.classList.add("invalid");
		alert(`Error: unknown filter ${results.filter}`);
		return;
	} else {
		target.classList.remove("invalid");
	}

	let xml = dataIsXml();
	if (xml) {
		// Could be done later in certain cases.
		alert("Cannot apply filters to XML data");
		return;
	}

	var ficon = document.querySelector(".filter-icon");
	if (!ficon) {
		console.log("SOMETHING STRANGE HAPPENED: missing filter icon");
		return;
	}

	if (ficon.classList.contains("active")) {
		// The filter is already active, so deactivate it.
		ficon.classList.remove("active");
		GLOBALFILTER = "";
		displayNotation();
		return;
	}

	var efilter = document.querySelector("input#filter");
	if (!efilter) {
		console.log("CANNOT FIND FILTER");
		return;
	}

	var ftext = efilter.value;
	if (ftext.match(/^\s*$/)) {
		// nothing to do.
		return;
	}
	GLOBALFILTER = ftext;
	displayNotation();
	ficon.classList.add("active");
	showFilterLinkIcon();
}



//////////////////////////////
//
// showSpreadsheetHelp --
//

function showSpreadsheetHelp() {
	var url = "https://doc.verovio.humdrum.org/interface/toolbar/spreadsheet";
	var help = window.open(url, "documentation");
	help.focus();
}



//////////////////////////////
//
// detachGlobalFilter --
//

function detachGlobalFilter() {
	var ficon = document.querySelector(".filter-icon");
	if (ficon) {
		ficon.classList.remove("active");
		if (GLOBALFILTER) {
			GLOBALFILTER = "";
		}
	}
}



//////////////////////////////
//
// showFilterLinkIcon -- Show the filter link icon.
//

function showFilterLinkIcon() {
	if (!FILEINFO) {
		// console.log("NO REPERTORY FILE TO WORK WITH");
		return;
	}
	if (!FILEINFO.location) {
		// console.log("NO LOCATION FOR REPERTORY FILE");
		return;
	}
	if (!FILEINFO.file) {
		// console.log("NO FILENAME FOR REPERTORY FILE");
		return;
	}
	var element = document.querySelector("#filter-link");
	if (element) {
		element.style.display = "inline-block";
	}
}



//////////////////////////////
//
// copyFilterUrl -- Copy URL with filter if there is a repertory work
//    present in the text editor (although it will not be checked for any
//    possible modifications).  This function gets the GLOBALFILTER parameter
//    and adds it in the "filter" URL parameter.  A repertory work is
//    identify if the FILEINFO object is defined and not empty, and
//    FILEINFO.location and FILEINFO.file are present and non-empty.
//

function copyFilterUrl() {
	if (!GLOBALFILTER) {
		console.log("GLOBALFILTER IS EMPTY:", GLOBALFILTER);
		copyToClipboard("");
		return;
	}

	if (!FILEINFO) {
		console.log("NO REPERTORY FILE TO WORK WITH");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.location) {
		console.log("NO LOCATION FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.file) {
		console.log("NO FILENAME FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}

	// Assuming data is accessed through https://, may
	// need to be adjusted if through http://
	var link = "https://verovio.humdrum.org/?file=";
	var file = FILEINFO.location
	file += "/";
	file += FILEINFO.file;
	link += encodeURIComponent(file);
	link += "&filter=";
	link += encodeURIComponent(GLOBALFILTER);
	link = link.replace(/%2f/gi, "/");
	copyToClipboard(link);
}



//////////////////////////////
//
// checkForFilterActivate -- Monitor filter input area for an entry key.
//     If detected then activate the filter.
//

function checkForFilterActivate(event) {
	let results = validateFilter(event, event.key);
	if (!results.status) {
		event.target.classList.add("invalid");
		if (event.key === "Enter") {
			alert(`Error: unknown filter ${results.filter}`);
		}
		return;
	} else {
		event.target.classList.remove("invalid");
	}

	if (event.shiftKey && event.key === "Enter") {
		compileFilters();
	} else if (event.key === "Enter") {
		applyGlobalFilter();
	}
}



//////////////////////////////
//
// validateFilter --
//

function validateFilter(event, key) {
	let target;
	if (event && (typeof event.target !== "undefined")) {
		target = event.target;
	} else if (!event) {
		target = document.querySelector("input#filter");
	} else {
		target = event;
	}
	if (!target) {
		return {status:0, filter: "missing target"};
	}
	if (target.nodeName !== "INPUT") {
		return {status:0, filter: "missing input target"};
	}
	let value = target.value;
	console.log("VALUE", value);

	let checkend = 0;
	if (key == "Enter") {
		checkend = 1;
	}

	if (!checkend) {
		value = value.replace(/[a-zA-Z0-9_-]+$/, "");
	}
	let values = value.split(/\s*[|]+\s*/);
	console.log("VALUES", values);

	let filterindex = {};
	for (let i=0; i<FILTERS.length; i++) {
		if (!FILTERS[i]) {
			continue;
		}
		filterindex[FILTERS[i]] = 1;
	}

	for (let i=0; i<values.length; i++) {
		if (!values[i]) {
			continue;
		}
		var term = values[i].replace(/^\s+/, "").replace(/\s.*/, "");
		if (!term) {
			continue;
		}
		if (!filterindex[term]) {
			return {status:0, filter:term};
		}
	}
	return {status:1, filter:""};
}



//////////////////////////////
//
// showFilterHelp --
//

function showFilterHelp() {
	let filterindex = {};
	for (let i=0; i<FILTERS.length; i++) {
		if (!FILTERS[i]) {
			continue;
		}
		filterindex[FILTERS[i]] = 1;
	}

	let felement = document.querySelector("input#filter");
	let ftext = "";
	let command = "";
	if (felement) {
		ftext = felement.value;
		fstart = felement.selectionStart;
		ftext = getPipedRegion(ftext, fstart);
		let matches = ftext.match(/^\s*([a-zA-Z0-9_-]+)/);
		if (matches) {
			if (filterindex[matches[1]]) {
				command = matches[1];
			}
		}
	}

	let url = "https://doc.verovio.humdrum.org/filter";
	if (command) {
		url += "/" + command;
	}

	let help = window.open(url, "documentation");
	help.focus();
}



//////////////////////////////
//
// getPipedRegion --
//

function getPipedRegion(ftext, fstart) {
	if (!ftext) {
		return "";
	}
	let pstart = -1;
	let pend = -1;
	for (let i=fstart; i>=0; i--) {
		if (ftext.charAt(i) === "|") {
			pstart = i+1;
			break;
		}
	}
	let text = ftext;
	if (pstart >= 0) {
		text = text.substring(pstart);
	}
	text = text.replace(/\|.*/, "");
	return text;
}



//////////////////////////////
//
// deactivateFilterInToolbar -- If the filter toolbar has an active filter,
//     then stop it.  This means to turn of the filter icon highlight
//     and clear the contents of the GLOBALFILTER variable.
//

function deactivateFilterInToolbar() {
	hideFilterLinkIcon();
	updateFilterState();
}



//////////////////////////////
//
// updateFilterState --  Deactivate the filter if changed.
//    Need to press the button to reapply.
//

function updateFilterState() {
	var ficon = document.querySelector(".filter-icon");
	if (ficon) {
		ficon.classList.remove("active");
		if (GLOBALFILTER) {
			GLOBALFILTER = "";
			displayNotation();
		}
		hideFilterLinkIcon();
	}
}



//////////////////////////////
//
// hideFilterLinkIcon -- Make sure that the filter link icon is hidden.
//

function hideFilterLinkIcon() {
	var element = document.querySelector("#filter-link");
	if (element) {
		element.style.display = "none";
	}
	// also deactivate the filter in the toolbar
	detachGlobalFilter();
}





// Functions for to Google spreadsheet interaction
// and also related to spreadsheet toolbar:


//////////////////////////////
//
// downloadDataFromSpreadsheet --
//

function downloadDataFromSpreadsheet(event) {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var id = getSpreadsheetScriptId(selement.value);
	if (!id) {
		return;
	}
	showSpreadsheetIconState();
	setTimeout(function () {
		document.body.classList.add("waiting");
	}, 0);

	var url = "https://script.google.com/macros/s/" + id + "/exec";
	var request = new XMLHttpRequest;
	request.open("GET", url);
	var shiftkey = event.shiftKey;
	request.addEventListener("load", function (event) {
		storeSpreadsheetDataInEditor(request.responseText, shiftkey);
		setTimeout(function () {
			document.body.classList.remove("waiting");
		}, 10);
	});
	request.send();
}



function storeSpreadsheetDataInEditor(data, shiftkey) {
	// first check to see if the current contents has any double tabs,
	// and if not, collapse tabs in data.
	var contents = getTextFromEditor();
	if (!contents.match(/\t\t/)) {
		// collapse tabs
		if (shiftkey) {
			storeSpreadsheetDataInEditor2(data);
		} else {
			MENU.applyFilter("tabber -r", data, storeSpreadsheetDataInEditor2);
		}
	} else {
		// preserve presumed expanded tab data.
		setTextInEditor(data);
	}
}

function storeSpreadsheetDataInEditor2(data) {
	setTextInEditor(data);
}



//////////////////////////////
//
// uploadDataToSpreadsheet --
//

function uploadDataToSpreadsheet(event) {
	setTimeout(function () {
		document.body.classList.add("waiting");
	}, 0);
	if (event.shiftKey) {
		// upload without passing through tabber filter.
		uploadDataToSpreadsheet2(getTextFromEditor());
	} else {
		MENU.applyFilter("tabber", getTextFromEditor(), uploadDataToSpreadsheet2);
	}
}

function uploadDataToSpreadsheet2(data) {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var id = getSpreadsheetScriptId(selement.value);
	if (!id) {
		return;
	}
	showSpreadsheetIconState();
	var url = "https://script.google.com/macros/s/" + id + "/exec";
	var request = new XMLHttpRequest;
	var formdata = new FormData();
	formdata.append("humdrum", data);
	request.open("POST", url);
	request.send(formdata);
	request.addEventListener("load", function (event) {
		setTimeout(function () {
			document.body.classList.remove("waiting");
		}, 10);
	});
}



//////////////////////////////
//
// showSpreadsheetIconState --
//

function showSpreadsheetIconState() {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var scriptid = getSpreadsheetScriptId(selement.value);
	var sheetid = getSpreadsheetId(selement.value);

	SPREADSHEETSCRIPTID = scriptid;
	SPREADSHEETID = sheetid;
	localStorage.SPREADSHEETSCRIPTID = scriptid;
	localStorage.SPREADSHEETID = sheetid;

	var sheetelement = document.querySelector("#sheetid");
	if (!sheetelement) {
		return;
	}
	if (!sheetid) {
		sheetelement.style.display = "none";
	} else {
		sheetelement.style.display = "inline-block";
	}
}



//////////////////////////////
//
// getSpreadsheetScriptId -- Extract ID from URL if present and also
//    store ID in localStorage for use in a later session.
//

function getSpreadsheetScriptId(value) {
	var matches = value.match(/([^\/]+)\/exec/);
	if (matches) {
		value = matches[1];
	}
	if (value.match(/^\s*$/)) {
		value = "";
	}
	matches = value.match(/^\s*([^|\s]*)/);
	if (matches) {
		value = matches[1];
	}
	SPREADSHEETSCRIPTID = value;
	localStorage.SPREADSHEETSCRIPTID = SPREADSHEETSCRIPTID;
	return value;
}



//////////////////////////////
//
// getSpreadsheetId -- A spreadsheed ID may be added
//   after a | character in the spreadsheet script ID box.
//

function getSpreadsheetId(value) {
	var matches = value.match(/([^\/]+)\/exec/);
	if (matches) {
		value = matches[1];
	}
	if (value.match(/^\s*$/)) {
		value = "";
	}
	matches = value.match(/^\s*(.*)[|\s]+(.*)\s*$/);
	if (matches) {
		value = matches[2];
	}
	SPREADSHEETID = value;
	localStorage.SPREADSHEETID = SPREADSHEETID;
	return value;
}



//////////////////////////////
//
// fillSpreadsheetId -- This is run after creating the toolbar.
//    The spreasdsheet information from localStorage is inserted
//    into the Spreadsheet script ID box.
//

function fillSpreadsheetId() {
	var value = "";
	if (SPREADSHEETSCRIPTID) {
		value = SPREADSHEETSCRIPTID;
	}
	if (SPREADSHEETID) {
		value += "|" + SPREADSHEETID;
	}
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	selement.value = value;
	showSpreadsheetIconState();
}



//////////////////////////////
//
// openSpreadsheet --
//

function openSpreadsheet() {
	var selement = document.querySelector("#scriptid");
	if (!selement) {
		return;
	}
	var id = getSpreadsheetId(selement.value);
	if (!id) {
		if (SPREADSHEETID) {
			id = SPREADSHEETID;
		}
	}
	if (!id) {
		return;
	}
	var url = "https://docs.google.com/spreadsheets/d/";
	url += id;
	window.open(url, "spreasheet");
}


// Functions for musical searching, and also
// related to search toolbar:
//
// Search-related functions that are included in main.js
//


//////////////////////////////
//
// hideSearchLinkIcon -- Make sure that the search link icon is hidden.
//

function hideSearchLinkIcon() {
	var element = document.querySelector("#search-link");
	if (element) {
		element.style.display = "none";
	}
}



//////////////////////////////
//
// showSearchLinkIcon -- Show the search link icon.
//

function showSearchLinkIcon() {
	if (!FILEINFO) {
		// console.log("NO REPERTORY FILE TO WORK WITH");
		return;
	}
	if (!FILEINFO.location) {
		// console.log("NO LOCATION FOR REPERTORY FILE");
		return;
	}
	if (!FILEINFO.file) {
		// console.log("NO FILENAME FOR REPERTORY FILE");
		return;
	}
	var element = document.querySelector("#search-link");
	if (element) {
		element.style.display = "inline-block";
	}
}



//////////////////////////////
//
// copySearchUrl -- Copy URL with search if there is a repertory work
//    present in the text editor (although it will not be checked for any
//    possible modifications).  This function gets the SEARCHFILTEROBJ parameter
//    and adds it to URL parameters.  A repertory work is
//    identify if the FILEINFO object is defined and not empty, and
//    FILEINFO.location and FILEINFO.file are present and non-empty.
//
// SEARCHFILTEROBJ.pitch    = p parameter
// SEARCHFILTEROBJ.interval = i parameter
// SEARCHFILTEROBJ.rhythm   = r parameter
//

function copySearchUrl() {
	if (!SEARCHFILTEROBJ) {
		console.log("SEARCHFILTEROBJ IS EMPTY:", SEARCHFILTEROBJ);
		copyToClipboard("");
		return;
	}
	if (!FILEINFO) {
		console.log("NO REPERTORY FILE TO WORK WITH");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.location) {
		console.log("NO LOCATION FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}
	if (!FILEINFO.file) {
		console.log("NO FILENAME FOR REPERTORY FILE");
		copyToClipboard("");
		return;
	}
	var pitch    = SEARCHFILTEROBJ.pitch    || "";
	var interval = SEARCHFILTEROBJ.interval || "";
	var rhythm   = SEARCHFILTEROBJ.rhythm   || "";
	if (!pitch && !interval && !rhythm) {
		console.log("NO SEARCH PRESENT pitch:", pitch, "rhythm:", rhythm, "interval:", interval);
		copyToClipboard("");
		return;
	}

	// Assuming data is accessed through https://, may
	// need to be adjusted if through http://
	var link = "https://verovio.humdrum.org/?file=";
	var file = FILEINFO.location
	file += "/";
	file += FILEINFO.file;
	link += encodeURIComponent(file);
	if (pitch) {
		link += "&p=" + encodeURIComponent(pitch);
	}
	if (interval) {
		link += "&i=" + encodeURIComponent(interval);
	}
	if (rhythm) {
		link += "&r=" + encodeURIComponent(rhythm);
	}
	link = link.replace(/%2f/gi, "/");
	console.log("COPYING SEARCH URL", link, "TO CLIPBOARD");
	copyToClipboard(link);
}



//////////////////////////////
//
// clearMatchInfo -- if there is no queries in the search toolbar,
//    then clear any old search results.
//

function clearMatchInfo() {
	var esearch = document.querySelector("#search-results");
	if (!esearch) {
		return;
	}
	esearch.innerHTML = "Search";
	hideSearchLinkIcon();
}



//////////////////////////////
//
// showSearchHelp --
//

function showSearchHelp() {
	var help = window.open("https://doc.verovio.humdrum.org/interface/search", "documentation");
	help.focus();
}



//////////////////////////////
//
// doMusicSearch --
//

function doMusicSearch() {
	var esearch   = document.querySelector("#search-group");
	if (!esearch) {
		return;
	}
	var epitch    = esearch.querySelector("#search-pitch");
	var einterval = esearch.querySelector("#search-interval");
	var erhythm   = esearch.querySelector("#search-rhythm");

	var pitch = epitch.value.replace(/["']/g, "");;
	var interval = einterval.value.replace(/["']/g, "");;
	var rhythm = erhythm.value.replace(/["']/g, "");;
	PQUERY = pitch;
	RQUERY = rhythm;
	IQUERY = interval;

	if (pitch.match(/^\s*$/) && interval.match(/^\s*$/) && rhythm.match(/^\s*$/)) {
		if (SEARCHFILTER) {
			clearMatchInfo();
			SEARCHFILTER = "";
			SEARCHFILTEROBJ = {};
			displayNotation();
			hideSearchLinkIcon();
		} else {
			// no previous search filter, so do not do anything
		}
		return;
	}

	SEARCHFILTEROBJ = {
		pitch: pitch,
		interval: interval,
		rhythm: rhythm
	};
	SEARCHFILTER = buildSearchQueryFilter(SEARCHFILTEROBJ);
	showSearchLinkIcon();

	displayNotation();
}

function buildSearchQueryFilter(parameters) {
	var output = "";

	var pitch    = parameters.pitch    || "";
	var interval = parameters.interval || "";
	var rhythm   = parameters.rhythm   || "";

	if (pitch.match(/^\s*bach\s*$/i)) {
		// Special search for the pitch sequence BACH.
		// H means B-natural in German, B means B-flat
		// The pitch search normally searches diatonically,
		// so also give the natural qualifications for
		// A and C (An and Cn for A-natural and C-natural).
		pitch = "b-ancnbn";
	}

	// var output = "!!!filter: msearch";
	var output = "msearch";
	if (!pitch.match(/^\s*$/)) {
		output += " -p '" + pitch + "'";
	}
	if (!interval.match(/^\s*$/)) {
		output += " -i '" + interval + "'";
	}
	if (!rhythm.match(/^\s*$/)) {
		output += " -r '" + rhythm + "'";
	}
	return output;
}



//////////////////////////////
//
// toggleChordSearchDirection --
//

function toggleChordSearchDirection() {
	var helement = document.querySelector("#search-chord");
	if (!helement) {
		console.log("CANNOT FIND HAND ICONS");
		return;
	}
	var output = "";
	if (SEARCHCHORDDIRECTION === "chord -d") {
		SEARCHCHORDDIRECTION = "chord -u";
		output = '<div title="Melodically searching lowest note of chord" class="nav-icon fa fa-hand-o-down"></div>';
	} else{
		SEARCHCHORDDIRECTION = "chord -d";
		output = '<div title="Melodically searching highest note of chord" class="nav-icon fa fa-hand-o-up"></div>';
	}
	helement.innerHTML = output;
	displayNotation();
}



//////////////////////////////
//
// toggleSearchView --
//

function toggleSearchView() {
	var selement = document.querySelector("#search-zoom");
	if (!selement) {
		console.log("CANNOT FIND SEARCH VIEW ICON");
		return;
	}
	var output = "";
	if (BRIEFSEARCHVIEW) {
		BRIEFSEARCHVIEW = "";
		output = '<div title="Show only measures with matches" class="nav-icon fa fa-search-minus"></div>';
	} else {
		BRIEFSEARCHVIEW = "myank -d --marks";
		output = '<div title="Show entire score with matches" class="nav-icon fa fa-search-plus"></div>';
	}
	selement.innerHTML = output;
	displayNotation();
}


// Functions related to the toolbar:



//////////////////////////////
//
// toggleNavigationToolbar --
//

function toggleNavigationToolbar() {
	var element = document.querySelector("#toolbar");
	if (!element) {
		return;
	}
	var state = element.style.display;
	if (state !== "none") {
		element.style.display = "none";
	} else {
		element.style.display = "flex";
	}
}



//////////////////////////////
//
// gotoToolbarMenu -- show a particular toolbar menu:
//

function gotoToolbarMenu(number) {
	var id = "toolbar-" + number;
	var etoolbar = document.querySelector("#toolbar");
	var elements = toolbar.querySelectorAll("[id^=toolbar-]");
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}
	LASTTOOLBAR = number;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}




//////////////////////////////
//
// gotoNextToolbar -- go to the next toolbar.  number is the current
//    toolbar (indexed from 1).  If the event has shiftKey then go
//    to the previous toolbar.
//

function gotoNextToolbarDelta() {
	var elements = document.querySelectorAll("[id^=toolbar-]");
	var i;
	var nextNumber = 0;
	for (i=0; i<elements.length; i++) {
		if (elements[i].style.display === "block") {
			nextNumber = i + 1;
			break;
		}
	}
	nextNumber++;
	if (nextNumber > elements.length) {
		nextNumber = 1;
	}
	var id = "toolbar-" + nextNumber;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}
	LASTTOOLBAR = nextNumber;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}

function gotoPrevToolbarDelta() {
	var elements = document.querySelectorAll("[id^=toolbar-]");
	var i;
	var nextNumber = elements.length;
	for (i=0; i<elements.length; i++) {
		if (elements[i].style.display === "block") {
			nextNumber = i;
			break;
		}
	}
	if (nextNumber < 1) {
		nextNumber = elements.length;
	}
	var id = "toolbar-" + nextNumber;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}
	LASTTOOLBAR = nextNumber;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}




function gotoNextToolbar(number, event) {
	var elements = document.querySelectorAll("[id^=toolbar-]");
	var newnum;
	if (event) {
		if (event.shiftKey) {
			if (event.altKey) {
				newnum = 1;
			} else {
				newnum = number - 1;
			}
		} else if (event.altKey) {
			newnum = 1;
		} else {
			newnum = number + 1;
		}
	} else {
		newnum = number + 1;
	}
	if (newnum < 1) {
		newnum = elements.length;
	} else if (newnum > elements.length) {
		newnum = 1;
	}

	var id = "toolbar-" + newnum;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].id === id) {
			elements[i].style.display = "block";
		} else {
			elements[i].style.display = "none";
		}
	}

	LASTTOOLBAR = newnum;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}

//////////////////////////////
//
// chooseToolbarMenu --
//    (presuming that the toolbars are in numeric order)
//

function chooseToolbarMenu(menunum) {
	if (menunum === "main")   { menunum = 1; }
	if (menunum === "save")   { menunum = 2; }
	if (menunum === "load")   { menunum = 3; }
	if (menunum === "search") { menunum = 4; }
	if (menunum === "filter") { menunum = 5; }
	if (!menunum) {
		menunum = InterfaceSingleNumber;
		InterfaceSingleNumber = 0;
	}

	var elements = document.querySelectorAll("[id^=toolbar-]");
	var eactive;
	var activeindex = -1;
	for (var i=0; i<elements.length; i++) {
		if (elements[i].style.display === "block") {
			activeindex = i;
			break;
		} else if (!elements[i].style.display) {
			activeindex = i;
			break;
		}
	}

	var nextindex = -1;
	if (menunum > 0) {
		// a specific toolbar menu is desired
		nextindex = menunum - 1;
		if (nextindex >= elements.length) {
			nextindex = elements.length - 1;
		}
	} else {
		nextindex = activeindex + 1;
		if (nextindex >= elements.length) {
			nextindex = 0;
		}
	}

	elements[activeindex].style.display = "none";
	elements[nextindex].style.display   = "block";

	LASTTOOLBAR = nextindex + 1;
	localStorage.LASTTOOLBAR = LASTTOOLBAR;
}



//////////////////////////////
//
// toggleMenuAndToolbarDisplay --  alt-shift-E shortcut
//
// #menubar.style.display = "none" if not visible
// #menubar.style.display = "block" if visible
//
// #input.style.top: 64px if visible
//	#input.style.top  30px if not visible
//
// #output.style.top: 64px if visible
//	#output.style.top  30px if not visible
//

function toggleMenuAndToolbarDisplay() {
	var melement = document.querySelector("#menubar");
	if (!melement) {
		return;
	}
	var ielement = document.querySelector("#input");
	var oelement = document.querySelector("#output");
	var selement = document.querySelector("#splitter");

	if (melement.style.display != "none") {
		// hide display of menu and toolbar
		ielement.style.top = "30px";
		oelement.style.top = "30px";
		melement.style.display = "none";
		selement.style.top = "30px";

	} else {
		// show menu and toolbar
		ielement.style.top = "64px";
		oelement.style.top = "64px";
		selement.style.top = "64px";
		melement.style.display = "block";
	}
}



//////////////////////////////
//
// toggleMenuDisplay --
//

function toggleMenuDisplay() {
	var element = document.querySelector("ul.navbar-nav");
	if (!element) {
		return;
	}
	var fontsize = element.style["font-size"];
	if (fontsize === "" || fontsize === "17px") {
		element.style["font-size"] = "0px";
	} else {
		element.style["font-size"] = "17px";
	}
}



//////////////////////////////
//
// showToolbarHelp --
//

function showToolbarHelp() {
	var help = window.open("https://doc.verovio.humdrum.org/interface/toolbar", "documentation");
	help.focus();
}



//////////////////////////////
//
// matchToolbarVisibilityIconToState -- Needed as a separate function
//     since the menu is created after the k=y URL parameter is set.
//

function matchToolbarVisibilityIconToState() {
	var velement = document.querySelector("#text-visibility-icon");
	var output;
	if (velement) {
		if (InputVisible) {
			output = "<div title='Hide text editor (alt-y)' class='nav-icon fas fa-eye'></div>";
		} else {
			output = "<div title='Show text editor (alt-y)' class='nav-icon fas fa-eye-slash'></div>";
		}
		velement.innerHTML = output;
	}

	var texticons = document.querySelectorAll(".text-only");
	var i;
	if (InputVisible) {
		for (i=0; i<texticons.length; i++) {
			texticons[i].style.display = "inline-block";
		}
	} else {
		for (i=0; i<texticons.length; i++) {
			texticons[i].style.display = "none";
		}
	}
}



///////////////////////////////
//
// toggleLineBreaks --
//

function toggleLineBreaks() {
	BREAKS = !BREAKS;
	var element = document.querySelector("#line-break-icon");
	if (!element) {
		console.log("Warning: cannot find line-break icon");
		return;
	}
	var output = "";
	if (BREAKS) {
		output += '<span title="Automatic line breaks" class="nav-icon fas fa-align-justify"></span>';
	} else {
		output += '<span title="Use embedded line breaks (if any)" class="nav-icon fas fa-align-center"></span>';
	}
	element.innerHTML = output;

	displayNotation();
}


// Functions related to saving files:




//////////////////////////////
//
// saveEditorContents -- Save the editor contents to a file on the local disk.
//   Saves in UTF-8 format.
//

function saveEditorContents() {
	var filebase = getFilenameBase();
	if (!filebase) {
		filebase = "data";
	}
	var filename = filebase;
	var extension = getFilenameExtension();
	if (extension) {
		filename += "." + extension;
	}
	var size = EDITOR.session.getLength();
	var matches;
	var line;

	var text = getTextFromEditor();
	// var blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
	var blob = new Blob([text], {type: 'text/plain'});
	saveAs(blob, filename);
}


// Functions related to loading files:


//////////////////////////////
//
// loadKernScoresFile --
//

function loadKernScoresFile(obj, force) {
	var file        = obj.file;
	var measures    = obj.measures;
	var page        = obj.page;
	var getnext     = obj.next;
	var getprevious = obj.previous;

	file = applyUrlAliases(file);

	if (measures) {
		var getnext     = false;
		var getprevious = false;
	}

	COUNTER++;
	if (COUNTER > 10000) {
		console.log("RECURSION TOO LARGE", file);
		return;
	}

	var url = "";
	var key = "";
	var ret;

	if (file) {
		if (file.match(/^https?:/)) {
			url = file;
			key = file;
		} else if (file.match(/^bb:/)) {
			ret = getBitbucketUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else if (file.match(/^bitbucket:/)) {
			ret = getBitbucketUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else if (file.match(/^github:/)) {
			ret = getGithubUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.key;
			}
		} else {
			ret = kernScoresUrl(file, measures);
			if (ret) {
				url = ret.url;
				key = ret.url;
			}
		}
	} else if (obj.tasso) {
		ret = getTassoUrl(obj.tasso, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.bb) {
		ret = getBitbucketUrl(obj.bb, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.github) {
		ret = getGithubUrl(obj.bb, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	} else if (obj.bitbucket) {
		ret = getBitbucketUrl(obj.bitbucket, measures);
		if (ret) {
			url = ret.url;
			key = ret.key;
		}
	}

	if (!key) {
		key = "DATA";
		// return;
	}

	var requires = getRequires(url, key);

	var keys = commaDuplicate(key);

	if (force) {
		for (var i=0; i<keys.length; i++) {
			basketSession.remove(key[i]);
			console.log("removed ", key[i]);
		}
	}

	redrawInputArea();

	var expire = 142;

	var jinfo;

	var info = basketSession.get(keys[0]);
	// var info = null;
	// console.log("INFO", info)

	if (obj && obj.file && (obj.file.match(/musedata/))) {
		// console.log("Going to download", key);
		basketSession.require(...requires).then(function() {
			var infos = [];
			for (var j=0; j<keys.length; j++) {
				infos[j] = basketSession.get(keys[j]);
			}
			var data = "";
			var filenames = commaDuplicate(key);
			for (j=0; j<infos.length; j++) {
				// print file header
				data += "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n";
				//mm = key.match(/([^\/]+)\/([^\/]+)\s*$/);
				//if (mm) {
				//	// filename = mm[1] + "/" + base;
				//	filename = filenames[j];
				//} else {
				//	filename = "unknown";
				//}
				filename = infos[j].url;
				data += "@filename==" + filename + "\n";
				data += "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n";
				var oinfo = infos[j];
				data += oinfo.data;
				data += "/eof\n";
			}
			data += "//\n"; // end-of-transmission marker for MuseData stage2 multipart file.
			displayScoreTextInEditor(data, vrvWorker.page);

			if (infos.length > 1) {
				// console.log("GOING TO ADD MULTIPLE FILES TO EDITOR", infos);
			} else if (infos.length == 1) {
				info = basketSession.get(key);
				console.log("INFO = ", info);
				if (info) {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							try {
								var textdata = atob(jinfo.content);
							} catch (err) {
								// text is not MIME encoding.
							}
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							try {
								displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
							} catch (err) {
								displayScoreTextInEditor(jinfo.content, vrvWorker.page);
							}
						}
						if (getnext) {
							processInfo(jinfo, obj, false, false);
						}
					} catch(err) {
						console.log("Error downloading", key, "Error:", err);
						displayScoreTextInEditor(info.data, vrvWorker.page);
						if (CGI.k.match(/c/)) {
							CGI.k = CGI.k.replace(/c/, "");
							compileFilters();
						}
					}
				} else {
					console.log("Error retrieving", key);
				}
				redrawInputArea();
			}
		}, function() {
			console.log("Error retrieving", key);
		});
	} else if (!info) {
		console.log("Going to download", key);
		basketSession.require(
			{	url: url,
				key: key,
				expire: expire,
				execute: false
			}
		).then(function() {
			info = basketSession.get(key);
			if (info) {
				if (info.url.match(/\/index.hmd$/)) {
					HMDINDEX = new HMDIndex(info.data);
					HMDINDEX.parameters.githubbase = file;
					displayHmdIndexFinally(HMDINDEX, url);
				} else {
					try {
						jinfo = JSON.parse(info.data);
						if (force) {
							var textdata = atob(jinfo.content);
							if (textdata.match(/^\s*$/)) {
								textdata = "!!!ONB: No data content\n";
							}
							displayScoreTextInEditor(atob(jinfo.content), vrvWorker.page);
						}
						if (getnext) {
							processInfo(jinfo, obj, false, false);
						}
					} catch(err) {
						console.log("Error downloading", key, "Error:", err);
						displayScoreTextInEditor(info.data, vrvWorker.page);
						if (CGI.k.match(/c/)) {
							CGI.k = CGI.k.replace(/c/, "");
							compileFilters();
						}
					}
				}
			} else {
				console.log("Error1 retrieving", key);
			}
			redrawInputArea();
		}, function() {
			console.log("Error2 retrieving", key);
		});
	} else {
		try {
			jinfo = JSON.parse(info.data);
			if (getnext) {
				processInfo(jinfo, obj, false, false);
			}
		} catch(err) {
			displayScoreTextInEditor(info.data, vrvWorker.page);
			if (CGI.k && CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				compileFilters();
			}
			redrawInputArea();
		}
	}
}



//////////////////////////////
//
// getTassoUrl --
//

function getTassoUrl(file, measures) {
	var filename = file.replace(/\.krn$/, "");;

	var url = "https://josquin.stanford.edu/cgi-bin/tasso?&file=" + filename;
	url += "&a=humdrum";

	var key = filename;
	if (measures) {
		url += "&mm=" + measures;
		key += "&mm=" + measures;
	}

	return {url: url, key: key};
}


//////////////////////////////
//
// getGithubUrl --
//
// http://verovio.humdrum.org/?file=github:polyrhythm-project/rds-scores
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getGithubUrl(file, measures) {
	file = file.replace(/^github:\/*/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://raw.githubusercontent.com/";
	matches = file.match("^\/*([^\/]+)\/([^\/]+)\/?(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/master/";
	if (!pathandfile) {
		url += "index.hmd";
	} else {
		url += pathandfile;
	}

	var key = pathandfile;

	var obj = {url: url, key: key};
	return obj;
}


//////////////////////////////
//
// getBitbucketUrl --
//
// http://verovio.humdrum.org/?file=bitbucket:musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
// https://bitbucket.org/musedata/beethoven/raw/master/bhl/qrtet/op18no5/stage2/01/03
//

function getBitbucketUrl(file, measures) {
	file = file.replace(/^(bb|bitbucket):/, "");

	var username = "";
	var repository = "";
	var pathandfile = "";
	var url = "";

	url = "https://bitbucket.org/";
	matches = file.match("^\/?([^\/]+)\/([^\/]+)\/(.*)");
	if (matches) {
		username    = matches[1];
		repository  = matches[2];
		pathandfile = matches[3];
	}
	url += username;
	url += "/";
	url += repository;
	url += "/raw/master/";
	url += pathandfile;

	var key = pathandfile;

	return {url: url, key: key};
}



//////////////////////////////
//
// kernScoresUrl -- convert kernscores location into URL.
//

function kernScoresUrl(file, measures) {
	var location;
	var filename;
	var user = "" ;
	var repository = "";
	var matches;
	var jrp = false;
	var github = false;
	var nifc = false;

	if (matches = file.match(/^(j|jrp):\/?\/?(.*)/)) {
		jrp = true;
		file = matches[2];
	} else if (matches = file.match(/^(g|gh|github):\/?\/?([^\/]+)\/([^\/]+)\/(.+)/)) {
		github = true;
		user = matches[2];
		repository = matches[3];
		file = matches[4];
	} else if (matches = file.match(/^nifc:\/?\/?(?:krn)?(.*)/i)) {
		nifc = true;
		file = matches[1];
	}

	if (jrp) {
		filename = file;
		location = "";
	} else if (github) {
		filename = file;
	} else if (nifc) {
		filename = file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
	}

	if ((!filename) || !filename.match(/\.[a-z][a-z][a-z]$/)) {
		if (!jrp) {
			loadIndexFile(file);
			return;
		}
	}

	if (filename.match(/^\s*$/)) {
		if (!jrp) {
			loadIndexFile(file);
			return;
		}
	}

	var url;
	if (jrp) {
		url = "https://josquin.stanford.edu/cgi-bin/jrp?id=" + filename;
		url += "&a=humdrum";
	} else if (nifc) {
		url = "https://humdrum.nifc.pl/krn/" + filename;
	} else if (github) {
		url = "https://raw.githubusercontent.com/" + user + "/" + repository + "/master/" + filename;
	} else {
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		url += "&format=info-json";
	}

	var key = "";
	if (!github) {
		key = location + "/" + filename;
		if (measures) {
			url += "&mm=" + measures;
			key += "&mm=" + measures;
		}
	}

	return {url: url, key: key};
}



//////////////////////////////
//
// downloadKernScoresFile --
//

function downloadKernScoresFile(file, measures, page) {
	var location;
	var filename;
	var matches;
	var jrp = false;
	var bitbucket = false;
	var github = false;
	var nifc = false;

	matches = file.match(/^jrp:(.*)/i);
	if (matches) {
		jrp = true;
		file = matches[1];
	} else {
		matches = file.match(/^(?:bitbucket|bb):(.*)/i);
		if (matches) {
			bitbucket = true;
			file = matches[1];
		} else {
			matches = file.match(/^(?:github|gh):(.*)/i);
			if (matches) {
				bitbucket = true;
				file = matches[1];
			} else {
				matches = file.match(/^nifc:(.*)/i);
				if (matches) {
					nifc = true;
					file = matches[1];
				}
			}
		}
	}

	var url;
	if (jrp) {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://josquin.stanford.edu/data?id=" + location;
		url += "&a=humdrum";
	} else if (nifc) {
		file = file.replace(/^\/+/, "");
		url = "https://humdrum.nifc.pl/krn/" + file;
	} else {
		if (matches = file.match(/(.*)\/([^\/]+)/)) {
			location = matches[1];
			filename = matches[2];
		}
		url = "https://kern.humdrum.org/data?l=" + location + "&file=" + filename;
		if (measures) {
			url += "&mm=" + measures;
		}
	}

	if (filename) {
		SAVEFILENAME = filename;
		console.log("SAVEFILENAME - ", SAVEFILENAME);
	}

	if (bitbucket && url.match(/,/)) {
		downloadMultipleFiles(url);
		return;
	}

	console.log("DATA URL", url);
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			// console.log("DATA", request.responseText);
			//var inputarea = document.querySelector("#input");
			//console.log("Current file:", file);
			//inputarea.value = request.response;

			// https://ace.c9.io/#nav=api&api=editor
			replaceEditorContentWithHumdrumFile(request.response, page);
			if (CGI.k.match(/c/)) {
				CGI.k = CGI.k.replace(/c/, "");
				compileFilters();
			}
		}

	});
	request.send();
}



/////////////////////////////
//
// downloadMultipleFiles -- Currently assumes to be MuseData.
//

function downloadMultipleFiles(url) {
	console.log("DOWNLOADING MULTIPLE FILES", url);
}



///////////////////////////////
//
// loadHmdIndexFile --
//

function loadHmdIndexFile(location) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			HMDINDEX = new HMDIndex(info.data);
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayHmdIndexFinally(HMDINDEX, location);
		}
	});
	request.send();
}



///////////////////////////////
//
// loadIndexFile --
//

function loadIndexFile(location) {
	if (location.match(/index.hmd$/)) {
		loadHmdIndexFile(location);
		return;
	}
	var url = "https://kern.humdrum.org/data?l=" + location;
	url += "&format=index";

	console.log("Loading index", url);

	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status == 200) {
			var INDEX = request.responseText;
			// console.log("INDEX= ", INDEX);
			$('html').css('cursor', 'auto');
			displayIndexFinally(INDEX, location);
		}
	});
	request.send();
}



//////////////////////////////
//
// displayIndexFinally --
//

function displayIndexFinally(index, location) {
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
	}

	var matches;
	var lines = index.split(/\r?\n/);
	var i;
	var newlines = [];
	var data;
	for (i=0; i<lines.length; i++) {
		if (lines[i].match(/^\s*$/)) {
			continue;
		}
		data = lines[i].split(/\t+/);
		if (data.length >= 3) {
			if (matches = data[1].match(/(.*)HIDE$/)) {
				// data[1] = matches[1];
				data[2] = data[2].replace(/<hlstart>/g, "");
				data[2] = data[2].replace(/<hlend>/g, "");
			}
			newline = data[1] + "\t" + data[0] + "\t" + data[2];
			newlines.push(newline);
		}
	}
	newlines.sort();
	var items = [];
	for (i=0; i<newlines.length; i++) {
		data = newlines[i].split(/\t+/);
		var entry = {};
		entry.sorter = data[0];
		entry.filename = data[1];
		entry.text = cleanRepertoryEntryText(data[2]);
		items.push(entry);
	}

	var indents = {};

	var final = "<table class='index-list'>";
	for (i=0; i<items.length; i++) {
		if (items[i].text.match(/^All /)) {
			continue;
		}
		items[i].text = items[i].text.replace(/\[?<a[^>]*wikipedia[^<]*.*?<\/a>\]?/gi, "");

		final += "<tr><td>"

		if (indents[items[i].sorter]) {
			final += "<span class='indenter'></span>";
		} else if (indents[items[i].sorter.replace(/HIDE$/, "")]) {
			final += "<span class='indenter'></span>";
		}

		if (items[i].filename.match(/^@/)) {
			items[i].text.replace(/<not>.*?<\/not>/g, "");
			final += items[i].text;
			var xtext = items[i].filename;
			xtext = xtext.replace(/^@/, "");
			var tindent = xtext.split(/:/);
			indents = {};
			for (var j=0; j<tindent.length; j++) {
				indents[tindent[j]] = "true";
			}
		} else if (items[i].sorter.match(/HIDE$/)) {
			var spantext = "";
			spantext += location;
			spantext += "/" + items[i].filename;
			spantext += "');\">";
			items[i].text = items[i].text.replace(/<hlstart>/, spantext);
			final += items[i].text;
		} else if (!items[i].text.match(/hlstart/)) {
			final += "<span class='ilink' onclick=\"displayWork('";
			final += location;
			final += "/" + items[i].filename;
			final += "');\">";
			final += items[i].text;
			final += "</span>";
		} else {
			var spantext = "";
			spantext += "<span class='ilink' onclick=\"displayWork('";
			spantext += location;
			spantext += "/" + items[i].filename;
			spantext += "');\">";
			items[i].text = items[i].text.replace(/<hlstart>/, spantext);
			if (items[i].text.match(/<hlend>/)) {
				items[i].text = items[i].text.replace(/<hlend>/, "</span>");
			} else {
				items[i].text += "</span>";
			}
			final += items[i].text;
		}
		final += "</td></tr>"
	}
	final += "</table>";
	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = final;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}



//////////////////////////////
//
// cleanRepertoryEntryText --
//

function cleanRepertoryEntryText(text) {
	text = text.replace(/-sharp/g, "&sharp;").replace(/-flat/g, "&flat;");
	text = text.replace(/<not>.*?<\/not>/g, "");
	let matches = text.match(/@\{link:([^}]+)\}/);
	if (matches) {
		let link = matches[1];
		let replacement = "";
		if (link.match(/https?:\/\/.*wikipedia/)) {
			replacement += '<a target="_blank" href="' + link + '">';
			replacement += '<span style="float:right; font-size:60%" class="fa-stack fa-1x">\n';
			replacement += '<i class="fas fa-square fa-stack-2x"></i>\n';
			replacement += '<i class="fab fa-wikipedia-w fa-stack-1x fa-inverse"></i>\n';
			replacement += '</span>\n';
			replacement += '</a>\n';
			text = text.replace(/@\{link:[^}]+\}/, replacement);
		}
	}
	return text;
}



//////////////////////////////
//
// displayHmdIndexFinally --
//

function displayHmdIndexFinally(hmdindex, source) {
	if (!hmdindex.parameters.hmdindexurl) {
		hmdindex.parameters.hmdindexurl = source;
	}
	if (hmdindex.parameters.hmdindexurl && !hmdindex.parameters.baseurl) {
		var baseurl = hmdindex.parameters.hmdindexurl.replace(/\/index.hmd$/, "");
		hmdindex.parameters.baseurl = baseurl;
	}
	ShowingIndex = true;

	IndexSupressOfInput = true;
	if (InputVisible == true) {
		UndoHide = true;
		ApplyZoom = true;
		// hideInputArea(true);
	}

	var indexelem = document.querySelector("#index");
	indexelem.innerHTML = hmdindex.generateHTML();;
	indexelem.style.visibility = "visible";
	indexelem.style.display = "block";
}



//////////////////////////////
//
// applyUrlAliases --
//
//

function applyUrlAliases(file) {
	if (!file) {
		return file;
	}
	var matches;

	// Github web interface URL:
	//    https://github.com/josquin-research-project/Ock/blob/master/Ock2002-Ave_Maria.krn
	// Maps to the raw data associated with that page:
	//    https://raw.githubusercontent.com/josquin-research-project/Ock/master/Ock2002-Ave_Maria.krn
	matches = file.match(/https:\/\/github.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/);
	if (matches) {
		var user = matches[1];
		var repertory = matches[2];
		var commit = matches[3];
		var path = matches[4];
		file = "https://raw.githubusercontent.com/" + user + "/" + repertory + "/";
		file += commit + "/" + path;
	}

	return file;
}



//////////////////////////////
//
// getRequires -- Convert a comma-construct for URL into a list of files to download.
//

function getRequires(url, key) {
	var expire = 172;
	var listing;
	if (!key.match(/,/)) {
		listing = [{
			url: url,
			key: key,
			expire: expire,
			execute: false
		}];
		return listing;
	}

	// Input represents multiple files, such as
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03,04
	// should expand to two files:
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/03
	// https://verovio.humdrum.org?bb=musedata/beethoven/bhl/qrtet/op18no5/stage2/01/04

	var urls = commaDuplicate(url);
	var keys = commaDuplicate(key);

	listing = [];
	for (var i=0; i<urls.length; i++) {
		listing.push({
			url: urls[i],
			key: keys[i],
			expire: expire,
			execute: false
		});
	}
	return listing;
}



//////////////////////////////
//
// commaDuplicate --
//

function commaDuplicate(value) {
	var pieces = value.split(/\s*,\s*/);
	var first = pieces[0];
	var matches = first.match(/^(.*\/)([^\/]+)/);
	if (!matches) {
		return value;
	}
	var base = matches[1];
	pieces[0] = matches[2];
	var output = [];
	for (var i=0; i<pieces.length; i++) {
		output.push(base + pieces[i]);
	}
	return output;;
}



//////////////////////////////
//
// processInfo --
//

function processInfo(info, obj, nextwork, prevwork) {
	var score;
	if (info) {
		FILEINFO = info;
		// score = atob(info.content);
		score = Base64.decode(info.content);
		// console.log("Score unpacked");
	} else {
		console.log("Impossible error for", infojson);
		return;
	}

	var matches;
	if (obj && obj.file && (matches = obj.file.match(/([^\/]+)$/))) {
		SAVEFILENAME = matches[1];
	}

	// var inputarea = document.querySelector("#input");
	// inputarea.value = score;
	displayScoreTextInEditor(score, vrvWorker.page);

	obj.next = false;
	obj.previous = false;

	if (!obj) {
		return;
	}

	if (info["next-work"]) {
		obj.file = info["next-work"];
		loadKernScoresFile(obj)
	}
	if (info["previous-work"]) {
		obj.file = info["previous-work"];
		loadKernScoresFile(obj)
	}
}


// Functions related to the menu
// (see also _includes/menu):


//////////////////////////////
//
// buildPdfIconListInMenu -- Read !!!URL-pdf: reference records and
//    create icons for each one at the top right of the VHV window.
//    If there are no embedded URLs, then display the one from index.hmd
//    if there is a PDF available from kernScores.
//

function buildPdfIconListInMenu() {
	var container = document.querySelector("#pdf-urls");
	if (!container) {
		return;
	}

	var urllist = getPdfUrlList();

	var output = "";
	if (urllist.length > 0) {
		for (var i=0; i<urllist.length; i++) {
			output += makePdfIcon(urllist[i].url, urllist[i].title);
		}
	} else {
		if (FILEINFO && FILEINFO["has-pdf"] && (FILEINFO["has-pdf"] === "true")) {
			var url = "https://kern.humdrum.org/data?l=" + FILEINFO["location"];
			url += "&file=" + FILEINFO["file"];
			url += "&format=pdf&#view=FitH";
			output += makePdfIcon(url, "Source edition");
		}
	}

	container.innerHTML = output;
}



//////////////////////////////
//
// makePdfIcon --
//

function makePdfIcon(url, title) {
	title = title.replace(/"/g, "'");
	var output = "<div title=\"" + title + "\" ";
	output += "style='margin-left:10px !important; margin-right:0px !important; font-size:100%' ";
	output += "onclick='openPdfAtBottomThirdOfScreen(\"" + url + "\")' ";
	output += "class='nav-icon fas fa-file-pdf-o'></div>";
	return output;
}


// General functions, mostly for text
// processing:



//////////////////////////////
//
// getFilenameBase --
//

function getFilenameBase(text) {
	if (!text) {
		text = getTextFromEditor();
	}
	if (!text) {
		return "";
	}
	var matches = text.match(/^!!!!SEGMENT:\s*([^\s'"!*]+)/);
	var output;
	if (matches) {
		output = matches[1];
		output = output.replace(/.*\//, "").replace(/\..*?$/, "");
		if (output.length > 0) {
			return output;
		}
	}
	// In the data was loaded from a repertory file, then use that
	// file as the filename base.
	if (FILEINFO) {
		if (FILEINFO.file) {
			output = FILEINFO.file;
			output = output.replace(/.*\//, "").replace(/\..*?$/, "");
			if (output.length > 0) {
				return output;
			}
		}
	}
	return "data";
}



//////////////////////////////
//
// getFilenameExtension --
//

function getFilenameExtension(text) {
	if (!text) {
		text = getTextFromEditorRaw();
	}
	if (!text) {
		return "txt";
	}
	var beginning = text.substring(0, 1000).replace(/^\s+/, "");
	if (beginning.match(/<meiHead/)) {
		return "mei";
	}
	if (beginning.match(/<score-(part|time)wise/)) {
		return "musicxml";
	}
	if (beginning.match(/<opus/)) {
		return "musicxml";
	}
	if (beginning.match(/^[A-Za-z0-9+\/\s]+$/)) {
		return "mime";
	}

	var matches;
	var ext;
	var fullname;
	if (beginning.match(/^[!*]/)) {
		// Humdrum file.
		matches = beginning.match(/^!!!!SEGMENT:\s*([^\s'"!*]+)/);
		if (matches) {
			fullname = matches[1];
			if (fullname.match(/\./)) {
				ext = fullname.replace(/.*\./, "");
				if (ext && (ext.length > 0)) {
					return ext;
				}
			}
		}
		if (FILEINFO) {
			if (FILEINFO.file) {
				fullname = FILEINFO.file.replace(/.*\//, "");
				ext = fullname.replace(/.*\./, "");
				if (ext && (ext.length > 0)) {
					return ext;
				}
			}
		}
		return "krn";
	}

	if (beginning.match(/group memberships:/i)) {
		// MuseData
		return ".msd";
	}

	return "txt";
}



//////////////////////////////
//
// dataIsHumdrum -- Returns true if the input text (or text from
//    the editor if no text given as input) is Humdrum data or not.
//

function dataIsHumdrum(data) {
	if (!data) {
		data = getTextFromEditor();
	}
	if (data.match(/^\s*[!*]/)) {
		return true;
	} else {
		return false;
	}
}



//////////////////////////////
//
// dataIsXml -- Returns true if the input text (or text from
//     the editor if no text given as input) is XML data or not.
//

function dataIsXml(data) {
	if (!data) {
		data = getTextFromEditor();
	}
	if (data.match(/^\s*<\?xml\b/)) {
		return true;
	} else {
		return false;
	}
}



//////////////////////////////
//
// trimTabs -- also removes blank lines and tabs from inside of reference records.
//

function trimTabs(data) {
	var lines = data.split(/\r?\n/);
	var output = "";
	for (var i=0; i<lines.length; i++) {
		let line = lines[i].replace(/\t+$/, "");
		if (line.match(/^\s*$/)) {
			// ignoring blank lines
			continue;
		}
		if (line.match(/^!!![^\s]+:\t/)) {
			line = line.replace(/\t/, " ");
		}
		output += line + "\n";
	}
	return output;
}



//////////////////////////////
//
// trimTabsInEditor -- remove trailing tabs on text lines in
//    editor.  Also removes empty lines.
//

function trimTabsInEditor(text) {
	if (!text) {
		text = getTextFromEditor();
	}
	if (!text) {
		console.log("No content to convert to Humdrum");
		return;
	}
	
	var newtext = trimTabs(text);
	setTextInEditor(newtext);
}



////////////////////////////////////////////////////////////////////////////
//
//  Base64 encode/decode: Fixs problems with atob and btoa with UTF-8 encoded text.
//
//  https://www.webtoolkit.info
//

var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}



//////////////////////////////
//
// convertDataToTsv --
//

function convertDataToTsv(lines) {
	var output = "";
	for (var i=0; i<lines.length; i++) {
		output += convertLineToTsv(lines[i]) + "\n";
	}
	return output;
}



//////////////////////////////
//
// convertDataToCsv --
//

function convertDataToCsv(lines) {
	var output = "";
	for (var i=0; i<lines.length; i++) {
		output += convertLineToCsv(lines[i]) + "\n";
	}
	return output;
}



//////////////////////////////
//
// convertLineToTsv --
//

function convertLineToTsv(line) {
	var chars = line.split("");
	var output = "";
	if (chars.length < 1) {
		return output;
	}
	var inquote = 0;

	if ((chars.length >= 2) && (chars[0] == '!') && (chars[1] == '!')) {
		// Global commands and reference records which do not start with a
		// quote are considered to be literal.
		return line;
	}

	var separator = ",";

	for (var i=0; i<chars.length; i++) {

		if ((chars[i] == '"') && !inquote) {
			inquote = 1;
			continue;
		}
		if (inquote && (chars[i] == '"') && (chars[i+1] == '"')
				&& (i < chars.length-1)) {
			output += '"';
			i++;
			continue;
		}
		if (chars[i] == '"') {
			inquote = 0;
			continue;
		}
		if ((!inquote) && (line.substr(i, separator.length) == separator)) {
			output += '\t';
			i += separator.length - 1;
			continue;
		}
		output += chars[i];
	}
	return output;
}



//////////////////////////////
//
// convertLineToCsv --
//

function convertLineToCsv(line) {
	if (line.match(/^!!/)) {
		return line;
	}
	// Using \t rather than \t to preserve tabs
	var tokens = line.split(/\t/);
	var output = "";
	for (var i=0; i<tokens.length; i++) {
		output += convertTokenToCsv(tokens[i]);
		if (i<tokens.length-1) {
			output += ",";
		}
	}
	return output;
}



//////////////////////////////
//
// convertTokenToCsv --
//

function convertTokenToCsv(token) {
	var output = "";
	if (token.match(/,/) || token.match(/"/)) {
		output += '"';
		output += token.replace(/"/g, '""');
		output += '"';
		return output;
	} else {
		return token;
	}
}





// Functions for processing Humdrum text:


//////////////////////////////
//
// getReferenceRecords --
//

function getReferenceRecords(contents) {
	var lines = contents.split(/\r?\n/);
	var output = {};

	var matches;
	for (i=lines.length-1; i>=0; i--) {
		if (matches = lines[i].match(/^\!\!\!([^\s]+):\s*(.*)\s*$/)) {
			var key   = matches[1];
			var value = matches[2];
			output[key] = value;
			if (matches = key.match(/(.*)@@(.*)/)) {
				output[matches[1]] = value;
			}
			if (matches = key.match(/(.*)@(.*)/)) {
				output[matches[1]] = value;
			}
		}
		if (matches = lines[i].match(/^\!?\!\!title:\s*(.*)\s*/)) {
			output["title"] = matches[1];
		}
	}

	if ((!output["title"]) || output["title"].match(/^\s*$/)) {
		output["title"] = FILEINFO["title-expansion"];
	}

	var counter = 0;
	var prefix = "";
	var postfix = "";
	var substitute;
	if (output["title"] && !output["title"].match(/^\s*$/)) {
		var pattern = output["title"];
		while (matches = pattern.match(/@\{([^\}]*)\}/)) {
			prefix = "";
			postfix = "";
			key = "";
			if (matches = pattern.match(/@\{([^\}]*)\}\{([^\}]*)\}\{([^\}]*)\}/)) {
				prefix = matches[1];
				key = matches[2];
				postfix = matches[3];
				pattern = pattern.replace(/@\{([^\}]*)\}\{([^\}]*)\}\{([^\}]*)\}/, "ZZZZZ");
			} else if (matches = pattern.match(/@\{([^\}]*)\}\{([^\}]*)\}/)) {
				prefix = matches[1];
				key = matches[2];
				postfix = "";
				pattern = pattern.replace(/@\{([^\}]*)\}\{([^\}]*)\}/, "ZZZZZ");
			} else if (matches = pattern.match(/@\{([^\}]*)\}/)) {
				prefix = "";
				key = matches[1];
				postfix = "";
				pattern = pattern.replace(/@\{([^\}]*)\}/, "ZZZZZ");
			}

			if (!key) {
				break;
			}
			if (key.match(/^\s*$/)) {
				break;
			}
			if (output[key]) {
				substitute = prefix + output[key] + postfix;
			} else {
				substitute = "";
			}
			pattern = pattern.replace(/ZZZZZ/, substitute);
			counter++;
			if (counter > 20) {
				// avoid infinite loop in case something goes wrong
				break;
			}
		}
		output["title"] = pattern;
	}

	return output;
}



//////////////////////////////
//
// getStaffCount -- Return the number of **kern or **mens spines in the data.
//

function getStaffCount(data) {
	var output = 0;
	var lines = data.split(/\r?\n/);
	for (var i=0; i<lines.length; i++) {
		if (!lines[i].match(/^\*\*/)) {
			continue;
		}
		var tokens = lines[i].split(/\t+/);
		var kcount = 0;
		var mcount = 0;
		for (var j=0; j<tokens.length; j++) {
			if (tokens[j] === "**kern") {
				kcount++;
			} else if (tokens[j] === "**mens") {
				mcount++;
			}
		}
		// **kern and **mens are currently mutually exclusive
		if (mcount > 0) {
			kcount = 0;
		}
		output = mcount + kcount;
		break;
	}
	return output;
}



//////////////////////////////
//
// diatonicToHumdrum --
//

function diatonicToHumdrum(pitch) {
	pitch = parseInt(pitch);
	var octave = parseInt(pitch / 7);
	var pc = pitch % 7;
	var pchar = "x";
	if      (pc == 0) { pchar = "c"; }
	else if (pc == 1) { pchar = "d"; }
	else if (pc == 2) { pchar = "e"; }
	else if (pc == 3) { pchar = "f"; }
	else if (pc == 4) { pchar = "g"; }
	else if (pc == 5) { pchar = "a"; }
	else if (pc == 6) { pchar = "b"; }

	var i;
	var count;
	var output = "";
	if (octave < 4) {
		pchar = pchar.toUpperCase();
		count = 4 - octave;
		for (i=0; i<count; i++) {
			output += pchar;
		}
	} else {
		count = octave - 3;
		for (i=0; i<count; i++) {
			output += pchar;
		}
	}

	return output;
}



//////////////////////////////
//
// humdrumToDiatonic -- Does not like rests, null tokens.
//

function humdrumToDiatonic(pitch) {
	var len = pitch.length;
	var octave = 0;
	var firstchar = pitch.charAt(0);
	var firstlow = firstchar.toLowerCase();
	if (firstchar === firstlow) {
		octave = 3 + len;
	} else {
		octave = 4 - len;
	}
	var diatonic = 0;
	if      (firstlow === "d") { diatonic = 1; }
	else if (firstlow === "e") { diatonic = 2; }
	else if (firstlow === "f") { diatonic = 3; }
	else if (firstlow === "g") { diatonic = 4; }
	else if (firstlow === "a") { diatonic = 5; }
	else if (firstlow === "b") { diatonic = 6; }
	return 7 * octave + diatonic;
}



//////////////////////////////
//
// transposeDiatonic --
//

function transposeDiatonic(pitch, amount) {
	var len = pitch.length;
	amount = parseInt(amount);
	if (len == 0) {
		return "";
	}
	var pitchnum = humdrumToDiatonic(pitch);
	pitchnum += amount;

	if (pitchnum < 1) {
		// to low to process or mean anything
		return pitch;
	}
	if (pitchnum >= 70) {
		// to high to process or mean anything
		return pitch;
	}
	return diatonicToHumdrum(pitchnum);
}



//////////////////////////////
//
// getFieldAndSubtoken -- Return the data token and subtoken position
//    of the item at the given column on the line (column is index from 0),
//    but token and subtoken are indexed from 1.
//

function getFieldAndSubtoken(text, column) {
	// column++; // needed for some reason?
	var output = {field: -1, subspine: -1};
	if (text.match(/^[*!=]/)) {
		return output;
	}
	if (text == "") {
		return output;
	}

	var field = 0;
	var subspine = 0;
	var i;
	for (i=0; i<column; i++) {
		// deal with tab at start of line?
		if ((i > 0) && (text[i] == '\t') && (text[i-1] != '\t')) {
			field++;
			subspine = 0;
		} else if (text[i] == ' ') {
			subspine++;
		}
	}

	var subtok = false;
	// check if the field contains subtokens.  If so, set the
	if (subspine > 0) {
		subtok = true;
	} else {
		for (i=column; i<text.length; i++) {
			if (text[i] == " ") {
				subtok = true;
				break;
			} else if (text[i] == '\t') {
				break;
			}
		}
	}
	if (subtok) {
		subspine++;
	}
	field++;

	output.field = field;
	output.subspine = subspine;
	return output;
}



//////////////////////////////
//
// insertMarkedNoteRdf -- If not present, insert marked note
//     RDF marker in data; otherwise returns what chatacters should represent
//     a marked note.
//

function insertMarkedNoteRdf() {
	var limit = 20; // search only first and last 20 lines of data for RDF entries.
	var editchar = "";
	var matches;
	var i;
	var size = EDITOR.session.getLength();
	for (i=size-1; i>=0; i--) {
		if (size - i > limit) {
			break;
		}
		var line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*mark.*\s+note/)) {
			editchar = matches[1];
		}
		if (editchar !== "") {
			break;
		}
	}

	if (editchar === "") {
		for (i=0; i<size; i++) {
			if (i > limit) {
				break;
			}
			var line = EDITOR.session.getLine(i);
			if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*mark.*\s+note/)) {
				editchar = matches[1];
			}
			if (editchar !== "") {
				break;
			}
		}
	}

	if (editchar !== "") {
		return editchar;
	}

	var text  = "";

	if (editchar === "") {
		text     +=  "!!!RDF**kern: @ = marked note";
		editchar = "@";
	} else {
		text     +=  "!!!RDF**kern: " + editchar + " = marked note";
	}

	// append markers to end of file.
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}
	EDITOR.session.insert({
			row: EDITOR.session.getLength(),
			column: 0
		},
		"\n" + text);
	FreezeRendering = freezeBackup;

	return editchar;
}



//////////////////////////////
//
// insertDirectionRdfs -- If not present, insert above/below RDF markers
//     in data; otherwise returns what chatacters should represent "above"
//     and "below".  Typically ">" means "above" and "<" means "below".
//     also can be used to check if "<" or ">" are already used for
//     something else.
//

function insertDirectionRdfs() {
	var limit = 20; // search only first and last 20 lines of data for RDF entries.
	var abovechar = "";
	var belowchar = "";
	var matches;
	var i;
	var size = EDITOR.session.getLength();
	for (i=size-1; i>=0; i--) {
		if (size - i > limit) {
			break;
		}
		var line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*above/)) {
			abovechar = matches[1];
		} else if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*below/)) {
			belowchar = matches[1];
		}
		if ((abovechar !== "") && (belowchar !== "")) {
			break;
		}
	}

	if ((abovechar === "") || (belowchar === "")) {
		for (i=0; i<size; i++) {
			if (i > limit) {
				break;
			}
			var line = EDITOR.session.getLine(i);
			if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*above/)) {
				abovechar = matches[1];
			} else if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*below/)) {
				belowchar = matches[1];
			}
			if ((abovechar !== "") && (belowchar !== "")) {
				break;
			}
		}
	}

	if ((abovechar !== "") && (belowchar !== "")) {
		return [abovechar, belowchar];
	}

	var text  = "";

	if (abovechar === "") {
		text     +=  "!!!RDF**kern: > = above\n";
		abovechar = ">";
	} else {
		text     +=  "!!!RDF**kern: " + abovechar + " = above\n";
	}

	if (belowchar === "") {
		text     +=  "!!!RDF**kern: < = below";
		belowchar = "<";
	} else {
		text     +=  "!!!RDF**kern: " + belowchar + " = below";
	}

	// append markers to end of file.
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}
	EDITOR.session.insert({
			row: EDITOR.session.getLength(),
			column: 0
		},
		"\n" + text);
	FreezeRendering = freezeBackup;

	return [abovechar, belowchar];
}



//////////////////////////////
//
// insertEditorialAccidentalRdf -- If not present, insert editorial accidental
//     RDF marker in data; otherwise returns what chatacters should represent
//     an editorial accidental.
//

function insertEditorialAccidentalRdf() {
	var limit = 20; // search only first and last 20 lines of data for RDF entries.
	var editchar = "";
	var matches;
	var i;
	var size = EDITOR.session.getLength();
	for (i=size-1; i>=0; i--) {
		if (size - i > limit) {
			break;
		}
		var line = EDITOR.session.getLine(i);
		if (matches = line.match(/^!!!RDF\*\*kern:\s+([^\s])\s*=.*edit.*\s+acc/)) {
			editchar = matches[1];
		}
		if (editchar !== "") {
			break;
		}
	}

	if (editchar === "") {
		for (i=0; i<size; i++) {
			if (i > limit) {
				break;
			}
			var line = EDITOR.session.getLine(i);
			if (matches = line.match(/^\!\!\!RDF\*\*kern:\s+([^\s])\s*=.*edit.*\s+acc/)) {
				editchar = matches[1];
			}
			if (editchar !== "") {
				break;
			}
		}
	}

	if (editchar !== "") {
		return editchar;
	}

	var text  = "";

	if (editchar === "") {
		text     +=  "!!!RDF**kern: i = editorial accidental\n";
		editchar = "i";
	} else {
		text     +=  "!!!RDF**kern: " + editchar + " = editorial accidental\n";
	}

	// append markers to end of file.
	var freezeBackup = FreezeRendering;
	if (FreezeRendering == false) {
		FreezeRendering = true;
	}
	EDITOR.session.insert({
			row: EDITOR.session.getLength(),
			column: 0
		},
		"\n" + text);
	FreezeRendering = freezeBackup;

	return editchar;
}


// Functions related to svg manipulation:


//////////////////////////////
//
// goDownHarmonically --
//

function goDownHarmonically(current) {
	moveHarmonically(current, -1);
}



//////////////////////////////
//
// goUpHarmonically --
//

function goUpHarmonically(current) {
	moveHarmonically(current, +1);
}



//////////////////////////////
//
// moveHarmonically --
//

function moveHarmonically(current, direction) {
	if (!current) {
		return;
	}
	var startid = current.id;
	unhighlightCurrentNote(current);
	var nextid = getNextHarmonicNote(startid, direction)
	if (!nextid) {
		return;
	}
	highlightIdInEditor(nextid, "moveHarmonically");
}



//////////////////////////////
//
// inSvgImage -- Used to prevent processing clicks in the text
//      editor for the click event listener used in the SVG image.
//      Returns true if the node is inside of an SVG image, or
//      false otherwise.
//

function inSvgImage(node) {
	var current = node;
	while (current) {
		if (current.nodeName === "svg") {
			return true;
		}
		current = current.parentNode;
	}
	return false;
}



//////////////////////////////
//
// observeSVGContent --
//

function observeSvgContent() {
	var content = document.querySelector("#output");
	var i;
	var s;
	var callback = function(mList, observer) {
		var svg = content.querySelector("svg");
		if (svg) {

			// Mark encoding problem messages with red caution symbol.
			spans = svg.querySelectorAll("g.dir.problem tspan.rend tspan.text tspan.text");
			for (i=0; i<spans.length; i++) {
				s = spans[i];
				if (s.innerHTML === "P") {
					s.innerHTML = "&#xf071;";
					s.classList.add("p");
				}
			}

			// Mark encoding problem messages with green caution symbol.
			spans = svg.querySelectorAll("g.dir.sic tspan.rend tspan.text tspan.text");
			for (i=0; i<spans.length; i++) {
				s = spans[i];
				if (s.innerHTML === "S") {
					s.innerHTML = "&#xf071;";
					s.classList.add("s");
				}
			}

		}

		for (var mu in mList) {
			if (svg && svg.isSameNode(mList[mu].target)) {
				//remove busy class if svg changed
				document.body.classList.remove("busy");
			}
		}
	}
	var observer = new MutationObserver(callback);

	observer.observe(content, { childList: true, subtree: true });
}



//////////////////////////////
//
// turnOffAllHighlights -- Remove highlights from all svg elements.
//

function turnOffAllHighlights() {
	var svg = document.querySelector("svg");
	var highlights = svg.querySelectorAll(".highlight");
	for (var i=0; i<highlights.length; i++) {
		var cname = highlights[i].className.baseVal;
		cname = cname.replace(/\bhighlight\b/, "");
		highlights[i].className.className = cname;
		highlights[i].className.baseVal = cname;
		highlights[i].className.animVal = cname;
	}
}



//////////////////////////////
//
// getNextHarmonicNote --
//

function getNextHarmonicNote(startid, direction) {
	var match = startid.match(/^[^-]+-[^-]*L(\d+)/);
	var startline = -1;
	if (match) {
		startline = parseInt(match[1]);
	} else {
		return undefined;
	}
	if (startline == -1) {
		return undefined;
	}
	// Assuming one svg on the page, which is currently correct.
	var svg = document.querySelector('svg');
	var allids = svg.querySelectorAll('*[id]:not([id=""])');
	var regex = new RegExp("^[^-]+-[^-]*L" + startline + "(?!\d)");
	var harmonic = [];
	var x;
	var i;
	for (i=0; i<allids.length; i++) {
		if (allids[i].id.match(regex)) {
			x = allids[i].id.replace(/-.*/, "");
			if (!((x == "note") || (x == "rest") || (x == "mrest"))) {
				// only keep track of certain types of elements
				// should chords be included or not? currently not.
				continue;
			}
			harmonic.push(allids[i]);
		}
	}
	harmonic.sort(function(a, b) {
		var aloc = getStaffAndLayerNumbersByElement(a);
		var bloc = getStaffAndLayerNumbersByElement(b);
		var astaff = aloc.staff | 0;
		var bstaff = bloc.staff | 0;
		var alayer = aloc.layer | 0;
		var blayer = bloc.layer | 0;

		if (astaff > bstaff) { return -1; }
		if (astaff < bstaff) { return +1; }
		if (alayer > blayer) { return -1; }
		if (alayer < blayer) { return +1; }

		// notes are in a chord so sort by pitch from low to high
		var match;
		var aoct = 0;
		var boct = 0;
		var ab40 = 0;
		var bb40 = 0;
		if (match = a.className.baseVal.match(/oct-(-?\d+)/)) {
			aoct = parseInt(match[1]);
		}
		if (match = b.className.baseVal.match(/oct-(-?\d+)/)) {
			boct = parseInt(match[1]);
		}
		if (match = a.className.baseVal.match(/b40c-(\d+)/)) {
			ab40 = aoct * 40 + parseInt(match[1]);
		}
		if (match = b.className.baseVal.match(/b40c-(\d+)/)) {
			bb40 = boct * 40 + parseInt(match[1]);
		}
		if (ab40 < bb40) { return -1; }
		if (ab40 > bb40) { return +1; }
		return 0;
	});
	if (harmonic.length == 1) {
		// nothing to do
		return undefined;
	}
	for (var j=0; j<harmonic.length; j++) {
		var oc = getStaffAndLayerNumbersByElement(harmonic[j]);
	}
	var startingindex = -1;
	for (i=0; i<harmonic.length; i++) {
		if (harmonic[i].id === startid) {
			startingindex = i;
			break;
		}
	}
	if (startingindex < 0) {
		return undefined;
	}
	var index = startingindex + direction;
	if (index < 0) {
		index = harmonic.length - 1;
	} else if (index >= harmonic.length) {
		index = 0;
	}
	return harmonic[index].id;
}



//////////////////////////////
//
// unhighlightCurrentNote --
//

function unhighlightCurrentNote(element) {
	if (element) {
		var classes = element.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		element.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// chooseBestId -- Match to the staff number and the layer number of the
//    original element.  The original element could be unattached from the
//    current SVG image, so its id is passed to this
//

function chooseBestId(elist, targetstaff, targetlayer) {
	var staffelements = [0,0,0,0,0,0,0,0,0,0,0,0];
	for (var i=0; i<elist.length; i++) {
		var location = getStaffAndLayerNumbers(elist[i].id);
		if (location.staff == targetstaff) {
			staffelements[location.layer] = elist[i];
			if ((location.layer == targetlayer) && (!elist[i].id.match(/space/))) {
				return elist[i].id;
			}
		}
	}
	// no exact match, so try a different layer on the same staff.
	if (staffelements.length == 1) {
		// only one choice so use it
		return staffelements[0].id;
	}

	// find a note/rest in a lower layer
	for (i=targetlayer; i>0; i--) {
		if (!staffelements[i]) {
			continue;
		}
		if (staffelements[i].id) {
			if (staffelements[i].id.match(/space/)) {
				continue;
			}
		}
		return staffelements[i].id;
	}

	// find a note/rest in a higher layer
	for (i=targetlayer; i<staffelements.length; i++) {
		if (!staffelements[i]) {
			continue;
		}
		if (staffelements[i].id) {
			if (staffelements[i].id.match(/space/)) {
				continue;
			}
		}
		return staffelements[i].id;
	}

	// go back and allow matching to invisible rests

	// find a note/rest in a lower layer
	for (i=targetlayer; i>0; i--) {
		if (!staffelements[i]) {
			continue;
		}
		return staffelements[i].id;
	}

	// find a note/rest in a higher layer
	for (i=targetlayer; i<staffelements.length; i++) {
		if (!staffelements[i]) {
			continue;
		}
		return staffelements[i].id;
	}

	// found nothing suitable
	return undefined;
}



//////////////////////////////
//
// getStaffPosition -- Return the nth position of a <staff> elemnet within a
//   measure.
//

function getStaffPosition(element) {
	var count = 0;
	var current = element;
	while (current) {
		if (current.className.baseVal.match(/staff/)) {
			count++;
		}
		current = current.previousElementSibling;
	}
	return count;
}



//////////////////////////////
//
// getLayerPosition -- Return the nth position of a <layer> elemnet within a
//   staff.
//

function getLayerPosition(element) {
	var count = 0;
	var current = element;
	while (current) {
		if (current.className.baseVal.match(/layer/)) {
			count++;
		}
		current = current.previousElementSibling;
	}
	return count;
}



//////////////////////////////
//
// getStaffAndLayerNumbers -- Return the staff and layer number of the
//   location of the given id's element.  The layer and staff numbers
//   are zero indexed to match MEI's enumeration (but this is not
//   necessary).
//

function getStaffAndLayerNumbers(id) {
	var element = document.querySelector("#" + id);
	return getStaffAndLayerNumbersByElement(element);
}


function getStaffAndLayerNumbersByElement(element) {
	if (!element) {
		return {};
	}
	var id = element.id;
	var staff = 0;
	var layer = 0;
	var current = element;

	current = current.parentNode;
	while (current && current.className.baseVal) {
		// console.log("CURRENT", current.className.baseVal);
		if (current.className.baseVal.match(/layer/)) {
			layer = getLayerPosition(current);
		} else if (current.className.baseVal.match(/staff/)) {
			staff = getStaffPosition(current);
		}
		current = current.parentNode;
	}
	return {
		layer: layer,
		staff: staff
	}

}



//////////////////////////////
//
// getOffClassElements --
//

function getOffClassElements(offclass) {
	var nlist = document.querySelectorAll("." + offclass);
	var rlist = document.querySelectorAll(".r" + offclass);
	var alist = [];
	for (var i=0; i<nlist.length; i++) {

		match = nlist[i].className.baseVal.match(/qon-([^\s]+)/);
		if (match) {
			qon = match[1];
		} else {
			qon = "xyz";
		}

		match = nlist[i].className.baseVal.match(/qoff-([^\s]+)/);
		if (match) {
			qoff = match[1];
		} else {
			qoff = "xyz";
		}
		if (qon === qoff) {
			// no grace notes
			continue;
		}

		alist.push(nlist[i]);
	}
	for (var i=0; i<rlist.length; i++) {
		alist.push(rlist[i]);
	}
	return alist;
}



//////////////////////////////
//
// getOnClassElements --
//

function getOnClassElements(onclass) {
	var nlist = document.querySelectorAll("." + onclass);
	var rlist = document.querySelectorAll(".r" + onclass);
	var alist = [];
	var match;
	var qon;
	var qoff;
	for (var i=0; i<nlist.length; i++) {

		match = nlist[i].className.baseVal.match(/qon-([^\s]+)/);
		if (match) {
			qon = match[1];
		} else {
			qon = "xyz";
		}

		match = nlist[i].className.baseVal.match(/qoff-([^\s]+)/);
		if (match) {
			qoff = match[1];
		} else {
			qoff = "xyz";
		}
		if (qon === qoff) {
			// no grace notes
			continue;
		}

		alist.push(nlist[i]);
	}
	for (var i=0; i<rlist.length; i++) {
		alist.push(rlist[i]);
	}
	return alist;
}



//////////////////////////////
//
// goToPreviousNoteOrRest --
//

function goToPreviousNoteOrRest(currentid) {
	var current = document.querySelector("#" + currentid);
	if (!current) {
		console.log("CANNOT FIND ITEM ", currentid);
		return;
	}
	var location = getStaffAndLayerNumbers(current.id);
	var matches = current.className.baseVal.match(/qon-([^\s]+)/);
	if (!matches) {
		console.log("CANNOT FIND QON IN", current.className);
		return;
	}
	var qon = matches[1];
	if (qon == 0) {
		// cannot go before start of work
		return;
	}
	offclass = "qoff-" + qon;
	var alist = getOffClassElements(offclass);
	var nextid;
	if (!alist) {
		return;
	}
	unhighlightCurrentNote(current);
	if (alist.length == 1) {
		highlightIdInEditor(alist[0].id, "goToPreviousNoteOrRest");
	} else if (alist.length == 0) {
		// gotoNextPage();
		if (vrvWorker.page == 1) {
			// at first page, so don't do anything.
			console.log("AT FIRST PAGE, so not continuing further");
			return;
		}
		vrvWorker.gotoPage(vrvWorker.page - 1)
		.then(function(obj) {
			// loadPage(vrvWorker.page);
			var page = obj.page || vrvWorker.page;
			$("#overlay").hide().css("cursor", "auto");
			$("#jump_text").val(page);
			vrvWorker.renderPage(page)
			.then(function(svg) {
				$("#output").html(svg);
				// adjustPageHeight();
				// resizeImage();
			})
			.then(function() {
				alist = getOnClassElements(offclass);
				if (alist.length == 1) {
					highlightIdInEditor(alist[0].id, "goToPreviousNoteOrRest2");
				} else {
					nextid = chooseBestId(alist, location.staff, location.layer);
					if (nextid) {
						EDITINGID = nextid;
						highlightIdInEditor(nextid, "goToPreviousNoteOrRest3");
					}
				}
			});
		});
	} else {
		nextid = chooseBestId(alist, location.staff, location.layer);
		if (nextid) {
			EDITINGID = nextid;
			highlightIdInEditor(nextid, "goToPreviousNoteOrRest4");
		}
	}
}



//////////////////////////////
//
// goToNextNoteOrRest -- current is the value of global variable CursorNote.
//    This function moves the cursor to the next note or rest in the spine
//    or subspine.  This is accomplished by examing the timestamps of the
//    notes and rests in the currently viewed SVG image generated by verovio.
//

function goToNextNoteOrRest(currentid) {
	var current = document.querySelector("#" + currentid);
	if (!current) {
		return;
	}
	var location = getStaffAndLayerNumbers(current.id);
	var matches = current.className.baseVal.match(/qoff-([^\s]+)/);
	if (!matches) {
		return;
	}
	var qoff = matches[1];
	var onclass = "qon-" + qoff;
	var alist = getOnClassElements(onclass);
	var nextid;
	if (!alist) {
		return;
	}
	unhighlightCurrentNote(current);

	if (alist.length == 1) {
		highlightIdInEditor(alist[0].id, "goToNextNoteOrRest");
	} else if (alist.length == 0) {
		// console.log("NO ELEMENT FOUND (ON NEXT PAGE?)");
		// gotoNextPage();
		if ((vrvWorker.pageCount > 0) && (vrvWorker.pageCount == vrvWorker.page)) {
			// at last page, so don't do anything.
			// console.log("AT LAST PAGE, so not continuing further");
			return;
		}
		vrvWorker.gotoPage(vrvWorker.page + 1)
		.then(function(obj) {
			// loadPage(vrvWorker.page);
			var page = obj.page || vrvWorker.page;
			$("#overlay").hide().css("cursor", "auto");
			$("#jump_text").val(page);
			vrvWorker.renderPage(page)
			.then(function(svg) {
				$("#output").html(svg);
				// adjustPageHeight();
				// resizeImage();
			})
			.then(function() {
				alist = getOnClassElements(onclass);
				if (alist.length == 1) {
					highlightIdInEditor(alist[0].id, "goToNextNoteOrRest2");
				} else {
					nextid = chooseBestId(alist, location.staff, location.layer);
					if (nextid) {
						EDITINGID = nextid;
						highlightIdInEditor(nextid, "goToNextNoteOrRest3");
					}
				}
			});
		});
	} else {
		nextid = chooseBestId(alist, location.staff, location.layer);
		if (nextid) {
			EDITINGID = nextid;
			highlightIdInEditor(nextid, "goToNextNoteOrRest4");
		}
	}
}



//////////////////////////////
//
// toggleAppoggiaturaColoring -- turn appoggiatura color highlighting on/off.
//

function toggleAppoggiaturaColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#appoggiatura-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "";
	text += "g.appoggiatura-start { fill: limegreen; }";
	text += "g.appoggiatura-stop { fill: forestgreen; }";
	stylesheet.innerHTML = text;
	stylesheet.id = "appoggiatura-color-stylesheet";
	document.body.appendChild(stylesheet);
}



//////////////////////////////
//
// toggleLayerColoring -- turn layer color highlighting on/off.
//

function toggleLayerColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#layer-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "";
	text += "g[id^='layer-'][id*='N2'] { fill: #00cc00; }\n";
	text += "g[id^='layer-'][id*='N3'] { fill: #cc00aa; }\n";
	text += "g[id^='layer-'][id*='N4'] { fill: #0088cc; }\n";
	text += "g[id^='layer-'][id*='N5'] { fill: #0000cc; }\n";
	text += "g[id^='layer-'][id*='N6'] { fill: #cc0000; }\n";
	text += "g[id^='layer-'][id*='N7'] { fill: #00cc00; }\n";
	// Disable highlighting of clefs in layers:
	text += "g.clef { fill: black !important; }";
	stylesheet.innerHTML = text;
	stylesheet.id = "layer-color-stylesheet";
	document.body.appendChild(stylesheet);
}



//////////////////////////////
//
// togglePlaceColoring -- turn explicitly placed item highlighting on/off.
//

function togglePlaceColoring() {
	var sylesheet;
	stylesheet = document.querySelector("#placed-color-stylesheet");
	if (stylesheet) {
		var parentElement = stylesheet.parentNode;
		parentElement.removeChild(stylesheet);
		return;
	}
	stylesheet = document.createElement('style');
	var text = "g.placed { fill: orange; } ";
	text += "g.placed path { stroke: orange; } ";
	stylesheet.innerHTML = text;
	stylesheet.id = "placed-color-stylesheet";
	document.body.appendChild(stylesheet);
}



///////////////////////////////////
//
// restoreSelectedSvgElement -- Need to generalize to multiple pages.
//

function restoreSelectedSvgElement(id) {
	if (!id) {
		return;
	}
	var item = document.querySelector("#" + id);
	if (!item) {
		return;
	}
	var line;
	var matches = id.match(/L(\d+)/);
	if (matches) {
		line = parseInt(line);0
	} else {
		return;
	}
	markItem(item, line);
}



//////////////////////////////
//
// markItem -- Used by highlightNoteInScore.
//

function markItem(item, line) {
	if (!item) {
		item = CursorNote;
	}
	if (!item) {
		return;
	}
	EditorLine = line;
	// This case is not good for editing a note:
	//if (CursorNote && item && (CursorNote.id == item.id)) {
	//	console.log("THE SAME NOTE");
	//	return;
	//}
	if (CursorNote) {
		// console.log("TURNING OFF OLD NOTE", CursorNote);
		/// CursorNote.setAttribute("fill", "#000");
		// CursorNote.removeAttribute("fill");

		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass = outclass.replace(/^\s+/, "");
		CursorNote.setAttribute("class", outclass);

	}
	if (item) {
		setCursorNote(item, "markItem");
	}
	if (CursorNote) {
		// console.log("TURNING ON NEW NOTE", CursorNote);
		// CursorNote.setAttribute("fill", "#c00");

		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass += " highlight";
		CursorNote.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// unhighlightAllElements --
//

function unhighlightAllElements() {
	if (!CursorNote) {
		return;
	}
	var hilights = document.querySelectorAll("svg .highlight");
	for (var i=0; i<hilights.length; i++) {
		var classes = CursorNote.getAttribute("class");
		var classlist = classes.split(" ");
		var outclass = "";
		for (var i=0; i<classlist.length; i++) {
			if (classlist[i] == "highlight") {
				continue;
			}
			outclass += " " + classlist[i];
		}
		outclass = outclass.replace(/^\s+/, "");
		CursorNote.setAttribute("class", outclass);
	}
}



//////////////////////////////
//
// highlightIdInEditor --
//

function highlightIdInEditor(id, source) {

	unhighlightAllElements(id);

	if (!id) {
		// no element (off of page or outside of musical range
		console.log("NO ID so not changing to another element");
		return;
	}
	matches = id.match(/^([^-]+)-[^-]*L(\d+)F(\d+)/);
	if (!matches) {
		return;
	}

	var etype = matches[1];
	var row   = matches[2];
	var field = matches[3];
	var subtoken = 0;
	if (matches = id.match(/-.*L\d+F\d+S(\d+)/)) {
		subtoken = matches[1];
	}

	var linecontent = EDITOR.session.getLine(row-1);

	var col = 0;
	if (field > 1) {
		var tabcount = 0;
		for (i=0; i<linecontent.length; i++) {
			col++;
			if (linecontent[i] == '\t') {
				if ((i > 0) && (linecontent[i-1] != '\t')) {
					tabcount++;
				}
			}
			if (tabcount == field - 1) {
				break;
			}
		}
	}

	if (subtoken >= 1) {
		var scount = 1;
		while ((col < linecontent.length) && (scount < subtoken)) {
			col++;
			if (linecontent[col] == " ") {
				scount++;
				if (scount == subtoken) {
					col++;
					break;
				}
			}
		}
	}

	col2 = col;
	var searchstring = linecontent[col2];
	while (col2 < linecontent.length) {
		col2++;
		if (linecontent[col2] == " ") {
			break;
		} else if (linecontent[col2] == "\t") {
			break;
		} else {
			searchstring += linecontent[col2];
		}
	}

	CursorNote = document.querySelector("#" + id);
	MENU.showCursorNoteMenu(CursorNote);
	EDITOR.gotoLine(row, col);

	// 0.5 = center the cursor vertically:
	EDITOR.renderer.scrollCursorIntoView({row: row-1, column: col}, 0.5);
	centerCursorHorizontallyInEditor();

}





// Functions related to svg manipulation:



//////////////////////////////
//
// centerCursorHorizontallyInEditor --
//

function centerCursorHorizontallyInEditor() {
	// Center the cursort horizontally:
	// Get distance between cursor and left side of textarea in pixels:
	let cursorLeft = EDITOR.renderer.$cursorLayer.getPixelPosition(0).left;

	// Get width of visible text area
	let scrollerWidth = EDITOR.renderer.$size.scrollerWidth;

	// Move scroller so that left side at same point as cursor minus half width of visible area:
	if (cursorLeft > scrollerWidth / 2) {
		EDITOR.renderer.scrollToX(cursorLeft - scrollerWidth/2);
	}
}



//////////////////////////////
//
// setEditorModeAndKeyboard --
//

function setEditorModeAndKeyboard() {
	if (EDITOR) {
		EDITOR.setTheme(EditorModes[EditorMode][KeyboardMode].theme);
		EDITOR.getSession().setMode("ace/mode/" + EditorMode);
		// null to reset to default (ace) mode
		EDITOR.setKeyboardHandler(KeyboardMode === "ace" ? null : "ace/keyboard/" + KeyboardMode);
	}
};



//////////////////////////////
//
// toggleEditorMode -- Switch between plain text editing and vim editing.
//     This is used by the alt-v keyboard shortcut.
//

function toggleEditorMode() {
	if (KeyboardMode == "ace") {
		KeyboardMode  = "vim";
	} else {
		KeyboardMode  = "ace";
	};
	setEditorModeAndKeyboard();
};



//////////////////////////////
//
// showIdInEditor -- Highlight the current line of data being played,
//     and center it.  But only do this if Humdrum data is being shown
//     in the editor (MEI data is not time-ordered by notes, only by
//     measure).
//

function showIdInEditor(id) {
	if (EditorMode == "xml") {
		return;
	}
	var matches = id.match(/-[^-]*L(\d+)/);
	if (!matches) {
		return;
	}
	var row = parseInt(matches[1]);
	EDITOR.gotoLine(row, 0);
	EDITOR.centerSelection();
	// console.log("PLAYING ROW", row);
}



//////////////////////////////
//
// getMode -- return the Ace editor mode to display the data in:
//    ace/mode/humdrum  == for Humdrum
//    ace/mode/xml   == for XML data (i.e., MEI, or SVG)
//

function getMode(text) {
	if (!text) {
		return "humdrum";
	}
	if (text.match(/^\s*</)) {
		return "xml";
	} else if (text.substring(0, 2000).match(/Group memberships:/)) {
		return "musedata";
	} else if (text.substring(0, 2000).match(/^[A-Za-z0-9+\/\s]+$/)) {
		return "mime";
	} else {
		return "humdrum";
	}
}



//////////////////////////////
//
// highlightNoteInScore -- Called when the cursor has changed position
//     int the editor.
//

function highlightNoteInScore(event) {
	if (EditorMode == "xml") {
		xmlDataNoteIntoView(event);
	} else {
		humdrumDataNoteIntoView(event);
	}
}


//////////////////////////////
//
// dataIntoView -- When clicking on a note (or other itmes in SVG images later),
//      go to the corresponding line in the editor.
//

function	dataIntoView(event) {
	if (EditorMode == "xml") {
		xmlDataIntoView(event);
	} else {
		humdrumDataIntoView(event);
	}
}



//////////////////////////////
//
// xmlDataNoteIntoView --
//

function xmlDataNoteIntoView(event) {
	var location = EDITOR.selection.getCursor();
	var line = location.row;
	if (EditorLine == line) {
		// already highlighted (or close enough)
		return;
	}
	// var column = location.column;
	var text = EDITOR.session.getLine(line);
	var matches = text.match(/xml:id="([^"]+)"/);
	if (!matches) {
		markItem(null, line);
		return;
	}
	var id = matches[1];
	var item;
	if (Splitter.rightContent) {
		// see: https://www.w3.org/TR/selectors
		var item = Splitter.rightContent.querySelector("#" + id);
		// console.log("ITEM", item);
	}
	markItem(item, line);
}



//////////////////////////////
//
// humdrumDataNoteIntoView --
//

function humdrumDataNoteIntoView(row, column) {
	if (!row || !column) {
		var location = EDITOR.selection.getCursor();
		var line = location.row;
		column = location.column;
	}
	var line = row;
	var text = EDITOR.session.getLine(line);
	var fys = getFieldAndSubtoken(text, column);
	var field = fys.field;
	var subspine = fys.subspine;
	var query = HIGHLIGHTQUERY;
	HIGHLIGHTQUERY = "";
	// the following code causes problems with note highlighting
	// after another note was edited.
	//	if (!query) {
	//		query = EDITINGID;
	//		HIGHLLIGHTQUERY = EDITINGID;
	//		// EDITINGID = null;
	//	}
	if (!query) {
		var query = "L" + (line+1) + "F" + field;
		if (subspine > 0) {
			query += "S" + subspine;
		}
	}
	var item = 0;
	if (Splitter.rightContent) {
		// see: https://www.w3.org/TR/selectors
		var items = Splitter.rightContent.querySelectorAll("g[id$='" +
			query + "']");
		if (items.length == 0) {
			// cannot find (hidden rest for example)
			return;
		}
		// give priority to items that possess qon/qoff classes.
		for (var i=0; i<items.length; i++) {
			if (items[i].className.baseVal.match(/qon/)) {
				item = items[i];
				break;
			}
		}
		if (!item) {
			item = items[items.length-1];
		}
		if (item.id.match(/^accid/)) {
			item = items[items.length-2];
		}
	}
	// markItem(item);
	return item;
	// sendTarget(item);
}




// Splitter prototypes for dealing with split
// windowing system for text and notation:


///////////////////////////////////////////////////////////////////////////
//
// Split window interface:
//

function SPLITTER() {
	this.mouseState    = 0;
	this.positionX     = null;
	this.leftContent   = null;
	this.splitContent  = null;
	this.splitWidth    = 5;
	this.minXPos       = 100;
	this.maxXPos       = 2000;
	this.rightPadding  = 10;
	this.defaultPos    = 400;
	this.snapTolerance = 30;
	return this;
}


SPLITTER.prototype.setPositionX = function(xPosition) {
	if ((xPosition < this.defaultPos + this.snapTolerance) &&
			(xPosition > this.defaultPos - this.snapTolerance)){
		xPosition = this.defaultPos;
	}

	if (xPosition < 0) {
		xPosition = 0;
	}
	if (xPosition > this.maxXPos) {
		xPosition = this.maxXPos;
	}
	this.positionX = xPosition;

	if (!this.leftContent) {
		this.leftContent = document.querySelector('#input');
	}
	if (!this.splitContent) {
		this.splitContent = document.querySelector('#splitter');
	}
	if (!this.rightContent) {
		this.rightContent = document.querySelector('#output');
	}

	if (this.leftContent) {
		this.leftContent.style.left = 0;
		this.leftContent.style.width = xPosition + 'px';
	}
	if (this.splitContent) {
		this.splitContent.style.left = xPosition + 'px';
	}
	if (this.rightContent) {
		this.rightContent.style.left = (xPosition
			+ this.splitWidth + this.rightPadding)
			+ 'px';
	}

};

var Splitter = new SPLITTER();


// Functions related to load and save buffers,
// also related to the load/save toolbar:


//////////////////////////////
//
// loadBuffer -- load the text contents from a local buffer, but if the
//    shift key is pressed, delete the current contents of the buffer instead.
//

function loadBuffer(number, event) {
	if (number < 1 || number > 9) {
		return;
	}
	if (event && event.shiftKey) {
		// clear contents of given buffer.
		var key = "SAVE" + number;
		delete localStorage[key];
		var title = key + "-TITLE";
		delete localStorage[title];
		var selement = document.querySelector("#save-" + number);
		if (selement) {
			selement.classList.remove("filled");
		}
		var lelement = document.querySelector("#load-" + number);
		if (lelement) {
			lelement.classList.remove("filled");
		}
	} else {
		// store contents of text editor in given buffer.
		MENU.loadFromBuffer(number);
	}
}



//////////////////////////////
//
// saveBuffer -- save the text contents to a local buffer, but if the
//    shift key is pressed, delete the current contents of the buffer instead.
//

function saveBuffer(number, event) {
	if (number < 1 || number > 9) {
		return;
	}
	if (event && event.shiftKey) {
		// clear contents of given buffer.
		var key = "SAVE" + number;
		delete localStorage[key];
		var title = key + "-TITLE";
		delete localStorage[title];
		var selement = document.querySelector("#save-" + number);
		if (selement) {
			selement.classList.remove("filled");
		}
		var lelement = document.querySelector("#load-" + number);
		if (lelement) {
			lelement.classList.remove("filled");
		}
	} else {
		// store contents of text editor in given buffer.
		MENU.saveToBuffer(number);
	}
}



//////////////////////////////
//
// restoreEditorContentsLocally -- Restore the editor contents from localStorage.
//

function restoreEditorContentsLocally() {
	// save current contents to 0th buffer
	var encodedcontents = encodeURIComponent(getTextFromEditorRaw());
	localStorage.setItem("SAVE0", encodedcontents);
	// reset interval timer of buffer 0 autosave here...

	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	key = "SAVE" + target;
	var contents = localStorage.getItem(key);
	if (!contents) {
		return;
	}
	var decodedcontents = decodeURIComponent(localStorage.getItem(key));
	setTextInEditor(decodedcontents);
	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// prepareBufferStates --
//

function prepareBufferStates() {
	var saves = document.querySelectorAll("[id^=save-]");
	var loads = document.querySelectorAll("[id^=load-]");
	var i;
	var id;
	var num = 0;
	var value;
	var matches;
	var skey;
	var lkey;
	var tkey;

	for (i=0; i<saves.length; i++) {
		id = saves[i].id;
		matches = id.match(/save-(\d+)/);
		if (matches) {
			num = parseInt(matches[1]);
		} else {
			continue;
		}
		if (num < 1) {
			continue;
		}
		skey = "SAVE" + num;
		if (localStorage.hasOwnProperty(skey)) {
			value = localStorage[skey];
			if (value) {
				saves[i].classList.add("filled");
				tkey = "SAVE" + num + "-TITLE";
				if (localStorage.hasOwnProperty(tkey)) {
					title = localStorage[tkey];
					if (title) {
						saves[i].title = title;
					}
				}
			}
		}
	}

	for (i=0; i<loads.length; i++) {
		id = loads[i].id;
		matches = id.match(/load-(\d+)/);
		if (matches) {
			num = parseInt(matches[1]);
		} else {
			continue;
		}
		if (num < 1) {
			continue;
		}
		skey = "SAVE" + num;
		if (localStorage.hasOwnProperty(skey)) {
			value = localStorage[skey];
			if (value) {
				loads[i].classList.add("filled");
				tkey = "SAVE" + num + "-TITLE";
				if (localStorage.hasOwnProperty(tkey)) {
					title = localStorage[tkey];
					if (title) {
						loads[i].title = title;
					}
				}
			}
		}
	}
}



//////////////////////////////
//
// saveEditorContentsLocally -- Save the editor contents to localStorage.
//

function saveEditorContentsLocally() {
	var target = InterfaceSingleNumber;
	if (!target) {
		target = 1;
	}
	key = "SAVE" + target;
	var value = getTextFromEditorRaw();
	var filled = false;
	var encodedcontents = "";
	if (value.match(/^\s*$/)) {
		encodedcontents = "";
		filled = false;
	} else {
		encodedcontents = encodeURIComponent(value);
		filled = true;
	}
	localStorage.setItem(key, encodedcontents);
	var telement = document.querySelector("#title-info");
	var title = "";
	if (telement) {
		title = telement.textContent.replace(/^\s+/, "").replace(/\s+$/, "");
	}
	localStorage.setItem(key + "-TITLE", title);

	var selement = document.querySelector("#save-" + target);
	if (selement) {
		selement.title = title;
		if (filled) {
			selement.classList.add("filled");
		} else {
			selement.classList.remove("filled");
		}
	}

	var lelement = document.querySelector("#load-" + target);
	if (lelement) {
		lelement.title = title;
		if (filled) {
			lelement.classList.add("filled");
		} else {
			lelement.classList.remove("filled");
		}
	}

	InterfaceSingleNumber = 0;
}



//////////////////////////////
//
// downloadEditorContentsInHtml --
//

function downloadEditorContentsInHtml() {
	var filebase = getFilenameBase();
	var ext = "html";
	var filename = filebase + "." + ext;
	var text = getTextFromEditor();

	var humdrum = dataIsHumdrum(text);
	if (humdrum && GLOBALFILTER) {
		if (text.charAt[text.length-1] !== "\n") {
			text += "\n";
		}
		text += "!!!filter: " + GLOBALFILTER + "\n";
	}

	var output = '<html>\n';
	output += '<head>\n';
	output += '<title>My Score</title>\n';
	output += '<script src="https://plugin.humdrum.org/scripts/humdrum-notation-plugin-worker.js">\n';
	output += '</sc' + 'ript>\n';
	output += '</head>\n';
	output += '<body>\n';
	output += '<script>\n';
	output += '   displayHumdrum({\n';
	output += '      source: "my-score",\n';
	output += '      autoResize: "true",\n';
	output += '      header: "true"\n';
	output += '   });\n';
	output += '<!-- See https://plugin.humdrum.org/#options for more display options -->\n';
	output += '</script>\n';
	output += '\n';
	output += '<script type="text/x-humdrum" id="my-score">\n';
	output += text;
	output += '</script>\n';
	output += '\n';
	output += '</body>\n';
	output += '</html>\n';
	// var blob = new Blob([output], {type: 'text/plain;charset=utf-8'});
	var blob = new Blob([output], {type: 'text/plain'});
	saveAs(blob, filename);
}



//////////////////////////////
//
// saveSvgData --
//

function saveSvgData() {
	if (ShowingIndex) {
		return;
	}

	var options = JSON.parse(JSON.stringify(OPTIONS));
	console.log("SVG PRINTING OPTIONS", options);
	var data = getTextFromEditor();
	if (data.match(/^\s*$/)) {
		return;
	};

	var humdrum = dataIsHumdrum(data);
	if (humdrum && GLOBALFILTER) {
		if (data.charAt[data.length-1] !== "\n") {
			data += "\n";
		}
		data += "!!!filter: " + GLOBALFILTER + "\n";
	}

	var page = vrvWorker.page;
	var force = true;

	// vrvWorker.renderPage(vrvWorker.page)
	vrvWorker.renderData(options, data, page, force)
	.then(function(data) {
		var filename = SAVEFILENAME;
		var size = EDITOR.session.getLength();
		var matches;
		var line;
		for (var i=0; i<size; i++) {
			line = EDITOR.session.getLine(i);
			if (matches = line.match(/^!!!!SEGMENT:\s*([^\s].*)\s*$/)) {
				filename = matches[1];
			}
		}
		filename = filename.replace(/\.[^.]+/, ".svg");
		if (!filename.match(/svg$/)) {
			filename += ".svg";
		}

		var blob = new Blob([data], {type: 'text/plain'});
		saveAs(blob, filename);

		// Redraw without adjustPageWidth on.
		options.adjustPageWidth = 0;
		vrvWorker.renderData(options, data, page, force)
	});
}


// Functions related to verovio options:

let VEROVIOOPTIONS = {
   "OPTION": [
      {
         "NAME": "help",
         "ABBR": "?",
         "INFO": "Display help message.",
         "ARG": "boolean",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "allPages",
         "ABBR": "a",
         "INFO": "Output all pages.",
         "ARG": "boolean",
         "CLI_ONLY": "true?"
      },
      {
         "NAME": "inputFrom",
         "ABBR": "f",
         "INFO": "Select input data type.",
         "ARG": "string",
         "DEF": "mei",
         "ALT": [
            "auto",
            "darms",
            "pae",
            "xml",
            "humdrum",
            "humdrum-xml"
         ],
         "CLI_ONLY": "true?"
      },
      {
         "NAME": "outfile",
         "ABBR": "o",
         "INFO": "Output file name (use \"-\" for standard output).",
         "ARG": "string",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "page",
         "ABBR": "p",
         "INFO": "Select the page to engrave.",
         "ARG": "integer",
         "DEF": "1",
         "MIN": "1",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "resources",
         "ABBR": "r",
         "INFO": "Path to SVG resources.",
         "ARG": "string",
         "DEF": "/usr/local/share/verovio",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "scale",
         "ABBR": "s",
         "INFO": "Scale percentage",
         "ARG": "integer",
         "DEF": "100",
         "MIN": "1"
      },
      {
         "NAME": "minLastJustification",
         "INFO": "Minimum length of last system which can be stretched to 100% width of page.",
         "ARG": "float",
         "DEF": "0.8",
         "MIN": "0.0",
         "MAX": "1.0"
      },
      {
         "NAME": "outputTo",
         "ABBR": "t",
         "INFO": "Select output data format",
         "ARG": "string",
         "DEF": "svg",
         "ALT": [
            "mei",
            "midi"
         ]
      },
      {
         "NAME": "version",
         "ABBR": "v",
         "INFO": "Display verovio version number.",
         "ARG": "boolean",
         "CLI_ONLY": "true"
      },
      {
         "NAME": "xmlIdSeed",
         "ABBR": "x",
         "INFO": "Seed the random number generator for XML IDs.",
         "ARG": "integer"
      },
      {
         "NAME": "adjustPageHeight",
         "CAT": "Input and page layout options",
         "INFO": "Crop the page height to the actual height of the content.",
         "ARG": "boolean"
      },
      {
         "NAME": "adjustPageWidth",
         "CAT": "Input and page layout options.",
         "INFO": "Crop the page width to the actual width of the content.",
         "ARG": "boolean"
      },
      {
         "NAME": "breaks",
         "CAT": "Input and page layout options",
         "INFO": "Define page and system breaks layout.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "line",
            "smart",
            "encoded"
         ]
      },
      {
         "NAME": "breaksSmartSb",
         "CAT": "Input and page layout options",
         "INFO": "In smart breaks mode, the portion of the system width usage\n\tat which an encoded system break will be used.",
         "ARG": "float",
         "DEF": "0.66",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "condense",
         "CAT": "Input and page layout options",
         "INFO": "Control condensed score layout.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "encoded"
         ]
      },
      {
         "NAME": "condenseFirstPage",
         "CAT": "Input and page layout options",
         "INFO": "When condensing a score, also condense the first page.",
         "ARG": "boolean"
      },
      {
         "NAME": "condenseTempoPages",
         "CAT": "Input and page layout options",
         "INFO": "When condensing a score, also condense pages with a tempo.",
         "ARG": "boolean"
      },
      {
         "NAME": "evenNoteSpacing",
         "CAT": "Input and page layout options",
         "INFO": "Specify the linear spacing factor.  This is useful for mensural notation display.",
         "ARG": "boolean"
      },
      {
         "NAME": "expand",
         "CAT": "Input and page layout options",
         "INFO": "Expand all referenced elements in the expanion.  Input is an xml:id of the expansion list.",
         "ARG": "string"
      },
      {
         "NAME": "humType",
         "CAT": "Input and page layout options",
         "INFO": "Include type attributes when importing rom Humdrum",
         "ARG": "boolean"
      },
      {
         "NAME": "justifyVertically",
         "CAT": "Input and page layout options",
         "INFO": "Justify spacing veritcally to fill a page.",
         "ARG": "boolean"
      },
      {
         "NAME": "landscape",
         "CAT": "Input and page layout options",
         "INFO": "The landscape paper orientation flag.",
         "ARG": "boolean"
      },
      {
         "NAME": "mensuralToMeasure",
         "CAT": "Input and page layout options",
         "INFO": "Convert mensural sections to measure-based MEI.",
         "ARG": "boolean"
      },
      {
         "NAME": "mmOutput",
         "CAT": "Input and page layout options",
         "INFO": "Specify that the output in the SVG is given in mm (default is px).",
         "ARG": "boolean"
      },
      {
         "NAME": "footer",
         "CAT": "Input and page layout options",
         "INFO": "Do not add any footer, add a footer, use automatic footer.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "encoded",
            "always"
         ]
      },
      {
         "NAME": "header",
         "CAT": "Input and page layout options",
         "INFO": "Do not add any header, add a header, use automatic header.",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "encoded"
         ]
      },
      {
         "NAME": "noJustification",
         "CAT": "Input and page layout options",
         "INFO": "Do not justify the system.",
         "ARG": "boolean"
      },
      {
         "NAME": "openControlEvents",
         "CAT": "Input and page layout options",
         "INFO": "Render open control events.",
         "ARG": "boolean"
      },
      {
         "NAME": "outputIndent",
         "CAT": "Input and page layout options",
         "INFO": "Output indent value for MEI and SVG.",
         "ARG": "integer",
         "DEF": "3",
         "MIN": "1",
         "MAX": "10"
      },
      {
         "NAME": "outputFormatRaw",
         "CAT": "Input and page layout options",
         "INFO": "Output MEI with no line indents or non-content newlines. See svgFormatRaw.",
         "ARG": "boolean"
      },
      {
         "NAME": "outputIndentTab",
         "CAT": "Input and page layout options",
         "INFO": "Use tabs rather than spaces for indenting XML output.",
         "ARG": "boolean"
      },
      {
         "NAME": "outputSmuflXmlEntities",
         "CAT": "Input and page layout options",
         "INFO": "Output SMuFL characters as XML entities instead of hex byte codes.",
         "ARG": "boolean"
      },
      {
         "NAME": "pageHeight",
         "CAT": "Input and page layout options",
         "INFO": "The page height.",
         "ARG": "integer",
         "DEF": "2970",
         "MIN": "100",
         "MAX": "60000"
      },
      {
         "NAME": "pageMarginBottom",
         "CAT": "Input and page layout options",
         "INFO": "Bottom margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginLeft",
         "CAT": "Input and page layout options",
         "INFO": "Left margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginRight",
         "CAT": "Input and page layout options",
         "INFO": "Right margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageMarginTop",
         "CAT": "Input and page layout options",
         "INFO": "Top margin of pages.",
         "ARG": "integer",
         "DEF": "50",
         "MIN": "0",
         "MAX": "500"
      },
      {
         "NAME": "pageWidth",
         "CAT": "Input and page layout options",
         "INFO": "Page width.",
         "ARG": "integer",
         "DEF": "2100",
         "MIN": "100",
         "MAX": "60000"
      },
      {
         "NAME": "preserveAnalyticalMarkup",
         "CAT": "Input and page layout options",
         "INFO": "Preserves the analytical markup in MEI.",
         "ARG": "boolean"
      },
      {
         "NAME": "removeIDs",
         "CAT": "Input and page layout options",
         "INFO": "Remove XML IDs in the MEI output when not referenced.",
         "ARG": "boolean"
      },
      {
         "NAME": "shrinkToFit",
         "CAT": "Input and page layout options",
         "INFO": "Scale down page content to fit the page height if needed.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgBoundingBoxes",
         "CAT": "Input and page layout options",
         "INFO": "Include bounding boxes in SVG output.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgViewBox",
         "CAT": "Input and page layout options",
         "INFO": "Use viewbox on SVG root element for easy scaling of document.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgHtml5",
         "CAT": "Input and page layout options",
         "INFO": "Write data-id and data-class attributes for JS usage and ID clash avoidance.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgFormatRaw",
         "CAT": "Input and page layout options",
         "INFO": "Writes SVG with no line indenting or non-content newlines. See outputFormatRaw.",
         "ARG": "boolean"
      },
      {
         "NAME": "svgRemoveXlink",
         "CAT": "Input and page layout options",
         "INFO": "Removes the \"xlink:\" prefix from href attributes for compatibility with some newer browsers.",
         "ARG": "boolean"
      },
      {
         "NAME": "unit",
         "CAT": "Input and page layout options",
         "INFO": "The MEI unit (1/2 of the distance between the staff lines).",
         "ARG": "integer",
         "DEF": "9",
         "MIN": "6",
         "MAX": "20"
      },
      {
         "NAME": "useBraceGlyph",
         "CAT": "Input and page layout options",
         "INFO": "Use brace glyph from current font.",
         "ARG": "boolean"
      },
      {
         "NAME": "useFacsimile",
         "CAT": "Input and page layout options",
         "INFO": "Use information in the facsimile element to control the layout.",
         "ARG": "boolean"
      },
      {
         "NAME": "usePgFooterForAll",
         "CAT": "Input and page layout options",
         "INFO": "Use the pgFooter element for all pages.",
         "ARG": "boolean"
      },
      {
         "NAME": "usePgHeaderForAll",
         "CAT": "Input and page layout options",
         "INFO": "Use the pgHeader element for all pages.",
         "ARG": "boolean"
      },
      {
         "NAME": "clefChangeFactor",
         "CAT": "Input and page layout options",
         "INFO": "Set the size ratio of normal clefs to changing clefs.",
         "ARG": "float",
         "DEF": "0.66",
         "MIN": "0.25;",
         "MAX": "1.00;"
      },
      {
         "NAME": "midiTempoAdjustment",
         "CAT": "General layout",
         "INFO": "MIDI tempo adjustment factor.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.20",
         "MAX": "4.00"
      },
      {
         "NAME": "barLineSeparation",
         "CAT": "General layout",
         "INFO": "Default distance between multiple barlines when locked together.",
         "ARG": "float",
         "DEF": "0.80",
         "MIN": "0.50",
         "MAX": "2.00"
      },
      {
         "NAME": "barLineWidth",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "The width of a barline.",
         "DEF": "0.30",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "beamMaxSlope",
         "INFO": "The maximum beam slope.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "10",
         "MIN": "1",
         "MAX": "20"
      },
      {
         "NAME": "beamMinSlope",
         "INFO": "The minimum beam slope.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "0",
         "MIN": "0",
         "MAX": "0"
      },
      {
         "NAME": "bracketThickness",
         "INFO": "Thickness of the system bracket.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "1.0",
         "MIN": "0.5",
         "MAX": "2.0"
      },
      {
         "NAME": "dynamDist",
         "INFO": "Default distance from staff to dynamic marks.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.50",
         "MAX": "16.00"
      },
      {
         "NAME": "engravingDefaults",
         "INFO": "JSON describing defaults for engraving SMuFL elements.",
         "CAT": "General layout",
         "ARG": "string"
      },
      {
         "NAME": "engravingDefaultsFile",
         "INFO": "Path to JSON file describing defaults for engraving SMuFL elements.",
         "CAT": "General layout",
         "ARG": "string"
      },
      {
         "NAME": "font",
         "INFO": "Set the music font.",
         "CAT": "General layout",
         "ARG": "string",
         "DEF": "Leipzig",
         "ALT": [
            "Bravura",
            "Gootville",
            "Leland"
         ]
      },
      {
         "NAME": "graceFactor",
         "INFO": "The grace size ratio numerator.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.75",
         "MIN": "0.50",
         "MAX": "1.00"
      },
      {
         "NAME": "graceRhythmAlign",
         "INFO": "Align grace notes rhythmically with all staves.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "graceRightAlign",
         "INFO": "Align the right position of a grace group with all staves.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "hairpinSize",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Size of hairpins (crescendo lines).",
         "DEF": "3.00",
         "MIN": "1.00",
         "MAX": "8.00"
      },
      {
         "NAME": "hairpinThickness",
         "CAT": "General layout",
         "INFO": "Hairpin thickness (crescendo lines).",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "harmDist",
         "CAT": "General layout",
         "INFO": "Default distance from haromonic labels to the staff.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.50",
         "MAX": "16.00"
      },
      {
         "NAME": "justificationStaff",
         "CAT": "General layout",
         "INFO": "Staff justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "justificationSystem",
         "CAT": "General layout",
         "INFO": "Vertical system spacing justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "justificationBracketGroup",
         "CAT": "General layout",
         "INFO": "Space between staves inside a bracket group justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "justificationBraceGroup",
         "CAT": "General layout",
         "INFO": "Space between staves inside a brace group justification.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "ledgerLineThickness",
         "CAT": "General layout",
         "INFO": "Thickness of ledger lines.",
         "ARG": "float",
         "DEF": "0.25",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "ledgerLineExtension",
         "CAT": "General layout",
         "INFO": "Amount by which ledger lines should extend on either side of a notehead.",
         "ARG": "float",
         "DEF": "0.54",
         "MIN": "0.20",
         "MAX": "1.00"
      },
      {
         "NAME": "lyricSize",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Size of lyric text.",
         "DEF": "4.50",
         "MIN": "2.00",
         "MAX": "8.00"
      },
      {
         "NAME": "lyricHyphenLength",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Lyric hyphen and dash lengths.",
         "DEF": "1.20",
         "MIN": "0.50",
         "MAX": "3.00"
      },
      {
         "NAME": "lyricLineThickness",
         "CAT": "General layout",
         "INFO": "Lyric extender line thicknesses.",
         "ARG": "float",
         "DEF": "0.25",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "lyricNoStartHyphen",
         "CAT": "General layout",
         "INFO": "Do not show hyphens at system beginnings.",
         "ARG": "boolean"
      },
      {
         "NAME": "lyricTopMinMargin",
         "CAT": "General layout",
         "INFO": "The minmal margin above the lyrics",
         "ARG": "float",
         "DEF": "3.00",
         "MIN": "3.00",
         "MAX": "8.00"
      },
      {
         "NAME": "lyricWordSpace",
         "CAT": "General layout",
         "INFO": "Minimum width of spaces separating lyric text.",
         "ARG": "float",
         "DEF": "1.20",
         "MIN": "0.50",
         "MAX": "3.00"
      },
      {
         "NAME": "minMeasureWidth",
         "INFO": "The minimal measure width.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "15",
         "MIN": "1",
         "MAX": "30"
      },
      {
         "NAME": "mnumInterval",
         "INFO": "Repeat measure numbers at the given cycle size.",
         "CAT": "General layout",
         "ARG": "integer"
      },
      {
         "NAME": "multiRestStyle",
         "INFO": "Rendering style of multiple measure rests.",
         "CAT": "General layout",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "default",
            "block",
            "symbols"
         ]
      },
      {
         "NAME": "repeatBarLineDotSeparation",
         "INFO": "Default horizontal distance between dots and inner repeat barline.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.30",
         "MIN": "0.10",
         "MAX": "1.00"
      },
      {
         "NAME": "repeatEndingLineThickness",
         "INFO": "Repeat and endling line thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.15",
         "MIN": "0.10",
         "MAX": "2.00"
      },
      {
         "NAME": "slurControlPoints",
         "INFO": "Slur control points.  Higher values mean more curvature at endpoints.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "5",
         "MIN": "1",
         "MAX": "10"
      },
      {
         "NAME": "slurHeightFactor",
         "INFO": "Slur height factor.  Higher values mean flatter slurs.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "5",
         "MIN": "1",
         "MAX": "100"
      },
      {
         "NAME": "slurMinHeight",
         "INFO": "Minimum slur height.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "1.20",
         "MIN": "0.30",
         "MAX": "2.00"
      },
      {
         "NAME": "slurMaxHeight",
         "INFO": "Maximum slur height.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "3.00",
         "MIN": "2.00",
         "MAX": "6.00"
      },
      {
         "NAME": "slurMaxSlope",
         "INFO": "Maximum slur slope in degrees.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "20",
         "MIN": "0",
         "MAX": "60"
      },
      {
         "NAME": "slurEndpointThickness",
         "INFO": "Slur endpoint thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.10",
         "MIN": "0.05",
         "MAX": "0.25"
      },
      {
         "NAME": "slurMidpointThickness",
         "INFO": "Slur midpoint thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.60",
         "MIN": "0.20",
         "MAX": "1.20"
      },
      {
         "NAME": "spacingBraceGroup",
         "INFO": "Minimum space between staves inside of a braced group.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "spacingBracketGroup",
         "INFO": "Minimum space between staves inside a bracketed group.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "spacingDurDetection",
         "INFO": "Detect long duration for adjusting spacing.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "slurCurveFactor",
         "INFO": "Slur curve factor.  Higher values mean rounder slurs.",
         "CAT": "General layout",
         "ARG": "integer",
         "DEF": "10",
         "MIN": "1",
         "MAX": "100"
      },
      {
         "NAME": "octaveAlternativeSymbols",
         "INFO": "Use alternative symbols for displaying octaves.",
         "CAT": "General layout",
         "ARG": "boolean"
      },
      {
         "NAME": "octaveLineThickness",
         "INFO": "Octave line thickness.",
         "CAT": "General layout",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingLinear",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Specify the linear spacing factor",
         "DEF": "0.25",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingNonLinear",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Specify the non-linear spacing factor.",
         "DEF": "0.60",
         "MIN": "0.00",
         "MAX": "1.00"
      },
      {
         "NAME": "spacingStaff",
         "ARG": "integer",
         "INFO": "The staff minimal spacing",
         "CAT": "General layout",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "spacingSystem",
         "ARG": "integer",
         "INFO": "The system minimal spacing",
         "CAT": "General layout",
         "DEF": "12",
         "MIN": "0",
         "MAX": "48"
      },
      {
         "NAME": "staffLineWidth",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "The staff line width in unit",
         "DEF": "0.15",
         "MIN": "0.10",
         "MAX": "0.30"
      },
      {
         "NAME": "stemWidth",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "The stem width",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.50"
      },
      {
         "NAME": "subBracketThickness",
         "CAT": "General layout",
         "ARG": "float",
         "INFO": "Thickness of system sub-brackets.",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "2.00"
      },
      {
         "NAME": "systemDivider",
         "CAT": "General layout",
         "INFO": "Display style of system dividers",
         "ARG": "string",
         "DEF": "auto",
         "ALT": [
            "none",
            "left",
            "left-right"
         ]
      },
      {
         "NAME": "systemMaxPerPage",
         "CAT": "General layout",
         "INFO": "Maximum number of systems per page",
         "ARG": "integer"
      },
      {
         "NAME": "textEnclosureThickness",
         "CAT": "General layout",
         "INFO": "Thickness of text-enclosing boxes.",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "thickBarlineThickness",
         "CAT": "General layout",
         "INFO": "Thickness of thick barlines.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.50",
         "MAX": "2.00"
      },
      {
         "NAME": "tieEndpointThickness",
         "CAT": "General layout",
         "INFO": "Endpoint tie thickenesses",
         "ARG": "float",
         "DEF": "0.10",
         "MIN": "0.05",
         "MAX": "0.25"
      },
      {
         "NAME": "tieMidpointThickness",
         "CAT": "General layout",
         "INFO": "Tie midpoint thickenesses",
         "ARG": "float",
         "DEF": "0.50",
         "MIN": "0.20",
         "MAX": "1.00"
      },
      {
         "NAME": "tupletBracketThickness",
         "CAT": "General layout",
         "INFO": "Tuplet bracket thicknesses.",
         "ARG": "float",
         "DEF": "0.20",
         "MIN": "0.10",
         "MAX": "0.80"
      },
      {
         "NAME": "tupletNumHead",
         "CAT": "General layout",
         "INFO": "Placement of tuplet number on the notehead-side.",
         "ARG": "boolean"
      },
      {
         "NAME": "defaultBottomMargin",
         "CAT": "element margins",
         "INFO": "Default bottom margin",
         "ARG": "float",
         "DEF": "0.50",
         "MIN": "0.00",
         "MAX": "5.00"
      },
      {
         "NAME": "defaultLeftMargin",
         "CAT": "element margins",
         "INFO": "Default left margin.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "defaultRightMargin",
         "CAT": "element margins",
         "INFO": "The default right margin",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "defaultTopMargin",
         "CAT": "element margins",
         "INFO": "The default top margin",
         "ARG": "float",
         "DEF": "0.50",
         "MIN": "0.00",
         "MAX": "6.00"
      },
      {
         "NAME": "leftMarginAccid",
         "CAT": "element margins",
         "INFO": "The margin for accid",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "bottomMarginArtic",
         "CAT": "element margins",
         "INFO": "Bottom margin for articulations.",
         "ARG": "float",
         "DEF": "0.75",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "bottomMarginHarm",
         "CAT": "element margins",
         "INFO": "Bottom margin for harmony labels.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "bottomMarginHeader",
         "CAT": "element margins",
         "INFO": "Bottom margin for page headers.",
         "ARG": "float",
         "DEF": "8.00",
         "MIN": "0.00",
         "MAX": "24.00"
      },
      {
         "NAME": "leftMarginBarLine",
         "CAT": "element margins",
         "INFO": "Left margin for barLines.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginBeatRpt",
         "CAT": "element margins",
         "INFO": "Left margin for beatRpt.",
         "ARG": "float",
         "DEF": "2.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginChord",
         "CAT": "element margins",
         "INFO": "Left margin for chords.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginClef",
         "CAT": "element margins",
         "INFO": "Left margin for clefs.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginKeySig",
         "CAT": "element margins",
         "INFO": "Left margin for key signatures.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginLeftBarLine",
         "CAT": "element margins",
         "INFO": "Left margin for left barLines.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMensur",
         "CAT": "element margins",
         "INFO": "Left margin for mensur.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMeterSig",
         "CAT": "element margins",
         "INFO": "Left margin for meterSig.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMRest",
         "CAT": "element margins",
         "INFO": "Left margin for mRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMRpt2",
         "CAT": "element margins",
         "INFO": "Left margin for mRpt2.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMultiRest",
         "CAT": "element margins",
         "INFO": "Left margin for multiRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginMultiRpt",
         "CAT": "element margins",
         "INFO": "Left  margin for multiRpt.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginNote",
         "CAT": "element margins",
         "INFO": "Right margin for note.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginRest",
         "CAT": "element margins",
         "INFO": "Left margin for rest.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginRightBarLine",
         "CAT": "element margins",
         "INFO": "Margin for right barLine.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "leftMarginTabDurSym",
         "CAT": "element margins",
         "INFO": "Margin for tabDurSym.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginAccid",
         "CAT": "element margins",
         "INFO": "Right margin for accid.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginBarLine",
         "CAT": "element margins",
         "INFO": "Right margin for barLine.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginBeatRpt",
         "CAT": "element margins",
         "INFO": "Right margin for beatRpt.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginChord",
         "CAT": "element margins",
         "INFO": "Right margin for chord.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginClef",
         "CAT": "element margins",
         "INFO": "Right margin for clef.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginKeySig",
         "CAT": "element margins",
         "INFO": "Right margin for keySig.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginLeftBarLine",
         "CAT": "element margins",
         "INFO": "Right margin for left barLine.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMensur",
         "CAT": "element margins",
         "INFO": "Right margin for mensur.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMeterSig",
         "CAT": "element margins",
         "INFO": "Right margin for meterSig.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMRest",
         "CAT": "element margins",
         "INFO": "Right margin for mRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMRpt2",
         "CAT": "element margins",
         "INFO": "Right margin for mRpt2.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMultiRest",
         "CAT": "element margins",
         "INFO": "Right margin for multiRest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginMultiRpt",
         "CAT": "element margins",
         "INFO": "Right margin for multiRpt.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginNote",
         "CAT": "element margins",
         "INFO": "The right margin for note.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginRest",
         "CAT": "element margins",
         "INFO": "The right margin for rest.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginRightBarLine",
         "CAT": "element margins",
         "ARG": "float",
         "INFO": "The right margin for right barLine.",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "rightMarginTabDurSym",
         "CAT": "element margins",
         "INFO": "Right margin for tabDurSym.",
         "ARG": "float",
         "DEF": "0.00",
         "MIN": "0.00",
         "MAX": "2.00"
      },
      {
         "NAME": "topMarginArtic",
         "CAT": "element margins",
         "INFO": "Top margin for articulations.",
         "ARG": "float",
         "DEF": "0.75",
         "MIN": "0.00",
         "MAX": "10.00"
      },
      {
         "NAME": "topMarginHarm",
         "CAT": "element margins",
         "INFO": "Top margin for harmony labels.",
         "ARG": "float",
         "DEF": "1.00",
         "MIN": "0.00",
         "MAX": "10.00"
      }
   ]
}
;




//////////////////////////////
//
// getScaleFromPercentSize --  This is used to set the scale of the music
//    from a CGI parameter.  The default scale used for Verovio is 40,
//    so a parameter size of 100.0% will set the scale TO 40.  If the
//    scale is too small (< 5) or too large (>500), it will be limited
//    to those values.  A size of 0 will set scale to 40.  Currently
//    this function does not store the calculated SCALE value in
//    localStorage so that the music size can be returned to in a
//    later session.  This seems best, since any custom SCALE should
//    not be overridden by a scale for a particular work included in
//    the URL.
//

function getScaleFromPercentSize(string, baseScale) {
	if (!baseScale) {
		baseScale = 40;
	}
	if (!string) {
		return baseScale;
	}
	var mysize;
	try {
		mysize = parseFloat(string);
	} catch(err) {
		mysize = 100.0;
	}
	var scale = parseInt(baseScale * mysize / 100.0 + 0.5);
	if (scale < 15) {
		scale = 15;
	} else if (scale > 500) {
		scale = 500;
	}
	return scale;
}



//////////////////////////////
//
// getVerovioDefaultOptions --
//

function getVerovioDefaultOptions() {
	let output = {};
	if (!VEROVIOOPTIONS) {
		return output;
	}
	var options = VEROVIOOPTIONS.OPTION;
	for (let i=0; i<options.length; i++) {
		if (typeof options[i].DEF !== "undefined") {
			if (typeof (options[i].NAME !== "undefined")) {
				if (typeof options[i].CLI_ONLY !== "undefined") {
					if (options[i].CLI_ONLY !== "true") {
						output[options[i].NAME] = options[i].DEF;
					}
				}
			}
		}
	}
	return output;
}



//////////////////////////////
//
// humdrumToSvgOptions --
//
// Verovio options:
// # = number
// B = boolean (1, or 0)
// S = string
//
// border #           == border around SVG image (default 50)
// inputFrom S        == input data from (darms, mei, pae, xml)
// pageHeight #       == height of page (default 2970)
// pageWidth #        == width of page (default 2100)
// scale #            == scaling percent for image
// adjustPageHeight B == crop the page height to content
// adjustPageWidth  B == crop the page width to content
// evenNoteSpacing B  == space notes evenly and close regardless of durations
// font S             == Bravura, Gootville, Leland (default Leipzig)
// ignoreLayout       == ignore any encoded layout and recalulate
// noLayout B         == ignore any encoded layout and display single system
// page #             == select page to engrave
// appXPathQuery S    == xpath query for selecting app
// spacingLinear #    == linear spacing factor (default 0.25)
// spacingNonLinear # == non-linear spacing factor (default 0.6)
// spacingStaff #     == spacing above each staff (MEI vu)
// spacigSystem #     == spacing above each system (MEI vu)
// humType            == embedd extra type/class attributes
// tupletNumHead      == display tuplets on note-head side of notes by default.
//

function humdrumToSvgOptions() {
	var output = getVerovioDefaultOptions();

	output.adjustPageHeight     = 1;
	// output.adjustPageWidth   = 1;
	output.barLineWidth         = 0.12;
	output.breaks               = (BREAKS ? "encoded" : "auto");
	output.font                 = FONT;
	output.inputFrom            = "auto";
	output.humType              = 1;
	output.tupletNumHead        = 0;
	output.justifyVertically    = 0;
	output.leftMarginClef       = 1.50;
	output.lyricSize            = LYRIC_SIZE;
	output.minLastJustification = 0.5;
	output.footer               = "none";
	output.header               = "none";
	output.pageHeight           = 60000;
	output.pageMarginBottom     = 40;
	output.pageMarginLeft       = 30;
	output.pageMarginRight      = 20;
	output.pageMarginTop        = 100;
	output.pageWidth            = 2500;
	output.scale                = SCALE;
	output.spacingLinear        = 0.25;
	output.spacingNonLinear     = 0.6;
	output.spacingStaff         = SPACING_STAFF;
	output.spacingSystem        = SPACING_SYSTEM;
	output.staffLineWidth       = 0.12;
	output.outputIndent         = 1;

	if (OriginalClef) {
		// now done with modori filter.
		// output.appXPathQuery = "./rdg[contains(@label, 'original-clef')]";
	} else {
		// the xpath query may need to be cleared
		// out of the persistent object:
		// output.appXPathQuery = "./rdg[contains(@label, 'asiuahetlkj')]";
	}
	if (PAGED) {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		// output.pageHeight = ($(window).innerHeight() - $("#navbar").outerHeight()) / ZOOM - 100;
		// output.pageWidth = ($(window).innerWidth() - tw) / ZOOM - 100;
		// jQuery $window.innerHeight() not working properly (in Chrome).
		output.pageHeight = (window.innerHeight - $("#topnav").outerHeight()) / (ZOOM * SCALE / 40) - 50;
		output.pageWidth = (window.innerWidth - tw) / (ZOOM * SCALE / 40 ) - 100;
	} else {
		var tw = $("#input").outerWidth();
		if ($("#input").css("display") == "none") {
			tw = 0;
		}
		output.pageWidth = (window.innerWidth - tw) / (ZOOM * SCALE / 40 ) - 100;
	}
	if (CGI.tasso) {
		output.spacingNonLinear = 0.65;
	}

	var newLinearSpacing = SPACINGADJUSTMENT + output.spacingLinear;
	if (newLinearSpacing < 0.05) {
		newLinearSpacing = 0.05;
	}
	output.spacingLinear = newLinearSpacing;

	return output;
}

function humdrumToMeiOptions() {
	return {
		inputFrom         : "humdrum",
		adjustPageHeight  : 1,
		// adjustPageWidth   : 1,
		pageHeight        : 8000,
		pageMarginLeft    : 20,
		pageMarginRight   : 20,
		pageMarginTop     : 0,
		pageMarginBottom  : 20,
		pageWidth         : 2500,
		scale             : 40,
		footer            : "none",
		header            : "none",
		breaks            : "auto",
		spacingNonLinear	: 0.6,
		spacingLinear		: 0.25,
		barLineWidth		: 0.12,
		staffLineWidth		: 0.12,
		font              : FONT,
		outputIndent      : 1
	}
}

function humdrumToHumdrumOptions() {
	return {
		inputFrom         : "humdrum"
	}
}

function musicxmlToHumdrumOptions() {
	return {
		inputFrom         : "musicxml-hum"
	}
}

function musedataToHumdrumOptions() {
	return {
		inputFrom         : "musedata-hum"
	}
}

function musicxmlToMeiOptions() {
	return {
		inputFrom         : "musicxml",
		breaks            : "auto"
	}
}

function meiToMeiOptions() {
	return {
		inputFrom         : "mei",
		breaks            : "encoded"
	}
}

function meiToHumdrumOptions() {
	return {
		inputFrom         : "mei-hum",
		breaks            : "auto"
	}
}

function esacToHumdrumOptions() {
	return {
		inputFrom         : "esac"
	}
}



//////////////////////////////
//
// loadEditorFontSizes -- Recover the last session's font size for the text editor.  If there is no previous
//     session, the use a size of 1.0;  Also the music size (SCALE = 40 default).
//

function loadEditorFontSizes() {
	var value = localStorage.INPUT_FONT_SIZE;
	if (!value) {
		value = 1.0;
	} else {
		value *= 1.0;
	}
	if (value < 0.25) {
		value = 0.25;
	}
	if (value > 3.0) {
		value = 3.0;
	}
	INPUT_FONT_SIZE = value;

	var value2 = localStorage.SCALE;
	if (!value2) {
		value2 = 40;
	} else {
		value2 *= 1;
	}
	if (value2 < 1) {
		value2 = 40;
	} else if (value2 > 1000) {
		value2 = 40;
	}
	SCALE = value2;
}


// Uncategorized files:
//////////////////////////////
//
// displayNotation -- Convert Humdrum data in textarea to notation.
//  This function seems to be called twice in certain cases (editing).
//

function displayNotation(page, force, restoreid) {
  if (!vrvWorker.initialized || (FreezeRendering && !force)) {
    // console.log("Ignoring displayNotation request: not initialized or frozen");
    return;
  }
  if (COMPILEFILTERAUTOMATIC) {
    COMPILEFILTERAUTOMATIC = false;
    compileFilters();
    return;
  }

  // if input area is a <textarea>, then use .value to access contnets:
  // let inputarea = document.querySelector("#input");
  // let data = inputarea.value;

  let data = getTextFromEditor();
  if (!data) {
    // This could be a transient state of the text editor before
    // new contents is added.
    // console.log("Editor contents is empty");
    return;
  }
  if (data.match(/^\s*$/)) {
    console.log('Editor contents is empty (2)');
    return;
  }
  let options = humdrumToSvgOptions();
  if (data.match(/CUT[[]/)) {
    options.inputFrom = 'esac';
  }
  if (data.match(/Group memberships:/)) {
    options.inputFrom = 'musedata';
  }
  if (GLOBALFILTER) {
    data += '\n!!!filter: ' + GLOBALFILTER + '\n';
  }
  if (SEARCHFILTER) {
    data += '\n!!!filter: ';
    if (SEARCHCHORDDIRECTION) {
      data += SEARCHCHORDDIRECTION + ' | ';
    }
    data += SEARCHFILTER;
    if (BRIEFSEARCHVIEW) {
      data += ' | ' + BRIEFSEARCHVIEW;
    }
    data += '\n';
  }

  OPTIONS = options;
  vrvWorker
    .renderData(options, data, page, force)
    .then(function (svg) {
      let ishumdrum = true;
      if (data.charAt(0) == '<') {
        ishumdrum = false;
      } else if (data.match(/CUT[[]/)) {
        ishumdrum = false;
      } else if (data.match(/Group memberships:/)) {
        ishumdrum = false;
      }

      let output = document.querySelector('#output');
      output.innerHTML = svg;
      if (ishumdrum) {
        if (restoreid) {
          restoreSelectedSvgElement(restoreid);
        } else if (RestoreCursorNote) {
          restoreSelectedSvgElement(RestoreCursorNote);
        }
        displayFileTitle(data);
        if (!force) document.querySelector('body').classList.remove('invalid');
      }
      verovioCallback(svg);
      return true;
    })
    .catch(function (message) {
      document.querySelector('body').classList.add('invalid');
      console.log('>>>>>>>>>> ERROR LOG:', message);
      return false;
    })
    .finally(function () {
      let indexelement = document.querySelector('#index');
      indexelement.style.visibility = 'invisibile';
      indexelement.style.display = 'none';
      if (UndoHide) {
        showInputArea(true);
        UndoHide = false;
      }
      if (ApplyZoom) {
        applyZoom();
        ApplyZoom = false;
      }
      if (CGI.k && !CGI.kInitialized) {
        processOptions();
      }
      if (ApplyZoom) {
        applyZoom();
        ApplyZoom = false;
      }
      ShowingIndex = false;
      $('html').css('cursor', 'auto');
      // these lines are needed to re-highlight the note when
      // the notation has been updated.
      //setCursorNote (null, "displayNotation");
      //highlightNoteInScore();

      if (SEARCHFILTER) {
        // extract the filtered Humdrum data from verovio, and
        // pull out the match count from the data and report
        // search toolbar
        vrvWorker.getHumdrum().then(function (humdrumdata) {
          let data = humdrumdata.match(/[^\r\n]+/g);
          let count = 0;
          let matches;
          for (let i = data.length - 1; i > 0; i--) {
            matches = data[i].match(/^!!@MATCHES:\s*(\d+)/);
            if (matches) {
              count = parseInt(matches[1]);
              break;
            }
          }
          console.log('COUNT', count);
          let eresults = document.querySelector('#search-results');
          if (eresults) {
            let output = '';
            if (count == 0) {
              output = '0 matches';
            } else if (count == 1) {
              output = '1 match';
            } else {
              output = count + ' matches';
            }
            eresults.innerHTML = output;
            showSearchLinkIcon();
          }
        });
      }
    });
}

//////////////////////////////
//
// processOptions -- Can only handle alphabetic key commands.
//   Also only lower case, but that is easier to fix when there
//   is an uppercase command.  Not needed  anymore?
//

function processOptions() {
  CGI.kInitialized = true;
  if (!CGI.k) {
    return;
  }
  // do something here?
}

//////////////////////////////
//
// toggleFreeze --
//

function toggleFreeze() {
  FreezeRendering = !FreezeRendering;
  document.querySelector('body').classList.toggle('frozen');
  if (!FreezeRendering) {
    displayNotation();
  }

  let felement = document.querySelector('#text-freeze-icon');
  let output = '';
  if (felement) {
    if (FreezeRendering) {
      // display is frozen so show lock icon
      output =
        "<div title='Unfreeze notation (alt-f)' class='nav-icon fas fa-lock'></div>";
    } else {
      // display is not frozen so show unlock icon
      output =
        "<div title='Freeze notation (alt-f)' class='nav-icon fas fa-unlock'></div>";
    }
    felement.innerHTML = output;
  }
}

//////////////////////////////
//
// toggleTextVisibility --
//

function toggleTextVisibility(suppressZoom) {
  InputVisible = !InputVisible;
  let input = document.querySelector('#input');
  if (InputVisible) {
    if (LastInputWidth == 0) {
      LastInputWidth = 400;
    }
    Splitter.setPositionX(LastInputWidth);
  } else {
    LastInputWidth = parseInt(input.style.width);
    Splitter.setPositionX(0);
  }
  if (!suppressZoom) {
    displayNotation();
    // applyZoom();
  }
  EDITOR.resize();
  matchToolbarVisibilityIconToState();
}

//////////////////////////////
//
// redrawInputArea --
//

function redrawInputArea(suppressZoom) {
  let input = document.querySelector('#input');
  if (InputVisible) {
    if (LastInputWidth == 0) {
      LastInputWidth = 400;
    }
    Splitter.setPositionX(LastInputWidth);
  } else {
    LastInputWidth = parseInt(input.style.width);
    Splitter.setPositionX(0);
  }
  if (!suppressZoom) {
    applyZoom();
  }
  EDITOR.resize();
}

//////////////////////////////
//
// hideInputArea --
//

function hideInputArea(suppressZoom) {
  InputVisible = false;
  let input = document.querySelector('#input');
  LastInputWidth = parseInt(input.style.width);
  Splitter.setPositionX(0);
  if (!suppressZoom) {
    applyZoom();
  }
}

//////////////////////////////
//
// showInputArea --
//

function showInputArea(suppressZoom) {
  InputVisible = true;
  Splitter.setPositionX(LastInputWidth);
  if (!suppressZoom) {
    applyZoom();
  }
  EDITOR.resize();
}

//////////////////////////////
//
// toggleVhvTitle --
//

function toggleVhvTitle() {
  VrvTitle = !VrvTitle;
  let area = document.querySelector('#vhv');
  if (VrvTitle) {
    area.style.visibility = 'visible';
    area.style.display = 'inline';
  } else {
    area.style.visibility = 'hidden';
    area.style.display = 'none';
  }
}

//////////////////////////////
//
// hideWorkNavigator --
//

function restoreWorkNavigator(selector) {
  if (!selector) {
    selector = '#work-navigator';
  }
  if (ERASED_WORK_NAVIGATOR.match(/^\s*$/)) {
    return;
  }
  FILEINFO = ERASED_FILEINFO;
  let element = document.querySelector(selector);
  element.innerHTML = ERASED_WORK_NAVIGATOR;
  ERASED_WORK_NAVIGATOR = '';
}

//////////////////////////////
//
// removeWorkNavigator --
//

function removeWorkNavigator(selector) {
  if (!selector) {
    selector = '#work-navigator';
  }
  let element = document.querySelector(selector);
  ERASED_WORK_NAVIGATOR = element.innerHTML;
  ERASED_FILEINFO = FILEINFO;
  element.innerHTML = '';
}

//////////////////////////////
//
// displayWorkNavigation --
//

function displayWorkNavigation(selector) {
  if (!selector) {
    selector = '#work-navigator';
  }
  contents = '';
  element = document.querySelector(selector);
  if (!element) {
    console.log('Error: cannot find work navigator');
    return;
  }

  if (FILEINFO['previous-work']) {
    contents += '<span style="cursor:pointer" onclick="displayWork(\'';
    contents += FILEINFO['previous-work'];
    contents += '\');"';
    contents += " title='previous work/movement (&#8679;+&#8592;)'";
    contents += '>';
    contents += "<span class='nav-icon fas fa-arrow-circle-left'></span>";
    contents += '</span>';
  }

  if (
    FILEINFO['previous-work'] &&
    FILEINFO['next-work'] &&
    FILEINFO['has-index'] == 'true'
  ) {
    contents += '&nbsp;';
  }

  if (FILEINFO['has-index'] == 'true') {
    contents += '<span style="cursor:pointer" onclick="displayIndex(\'';
    contents += FILEINFO['location'];
    contents += '\');"';
    contents += " title='repertory index (&#8679;+&#8593;)'";
    contents += '>';
    contents += "<span class='nav-icon fas fa-arrow-circle-up'></span>";
    contents += '</span>';
  }

  if (
    FILEINFO['previous-work'] &&
    FILEINFO['next-work'] &&
    FILEINFO['has-index'] == 'true'
  ) {
    contents += '&nbsp;';
  }

  if (
    FILEINFO['previous-work'] &&
    FILEINFO['next-work'] &&
    FILEINFO['has-index'] != 'true'
  ) {
    contents += '&nbsp;';
  }

  if (FILEINFO['next-work']) {
    contents += '<span style="cursor:pointer" onclick="displayWork(\'';
    contents += FILEINFO['next-work'];
    contents += '\');"';
    contents += " title='next work/movement (&#8679;+&#8594;)'";
    contents += '>';
    contents += "<span class='nav-icon fas fa-arrow-circle-right'></span>";
    contents += '</span>';
  }

  if (FILEINFO['file']) {
    contents +=
      '<span style="padding-left:3px; cursor:pointer" onclick="displayKeyscape();"';
    contents += " title='Keyscape'";
    contents += '>';
    contents += "<span class='nav-icon fa fa-key'></span>";
    contents += '</span>';
  }

  if (FILEINFO['has-index'] == 'true') {
    contents +=
      '<span style="padding-left:3px; cursor:pointer" onclick="copyRepertoryUrl(\'';
    contents += FILEINFO['location'];
    contents += '/';
    contents += FILEINFO['file'];
    contents += '\')"';
    contents += " title='copy link for work'";
    contents += '>';
    contents += "<span class='nav-icon fas fa-link'></span>";
    contents += '</span>';
  }

  if (FILEINFO['previous-work'] || FILEINFO['next-work']) {
    contents += '&nbsp;&nbsp;';
  }

  element.innerHTML = contents;
}

//////////////////////////////
//
// copyRepertoryUrl --
//

function copyRepertoryUrl(file) {
  if (!file) {
    if (FILEINFO) {
      file = FILEINFO.location;
      file += '/';
      file += FILEINFO.file;
    }
  }

  let url = 'https://verovio.humdrum.org';
  let initialized = 0;

  if (file) {
    url += '/?file=';
    url += file;
    initialized = 1;
  }

  let kstring = '';
  if (!InputVisible) {
    kstring += 'ey';
  }

  if (kstring.length > 0) {
    if (!initialized) {
      url += '/?';
      initialized = 1;
    } else {
      url += '&';
    }
    url += 'k=' + kstring;
  }
  if (GLOBALFILTER && GLOBALFILTER.length > 0) {
    if (!initialized) {
      url += '/?';
      initialized = 1;
    } else {
      url += '&';
    }
    url += 'filter=';
    url += encodeURIComponent(GLOBALFILTER);
  }
  if (PQUERY && PQUERY.length > 0) {
    if (!initialized) {
      url += '/?';
      initialized = 1;
    } else {
      url += '&';
    }
    url += 'p=';
    url += encodeURIComponent(PQUERY);
  }
  if (RQUERY && RQUERY.length > 0) {
    if (!initialized) {
      url += '/?';
      initialized = 1;
    } else {
      url += '&';
    }
    url += 'r=';
    url += encodeURIComponent(RQUERY);
  }
  if (IQUERY && IQUERY.length > 0) {
    if (!initialized) {
      url += '/?';
      initialized = 1;
    } else {
      url += '&';
    }
    url += 'i=';
    url += encodeURIComponent(IQUERY);
  }
  copyToClipboard(url);
}

//////////////////////////////
//
// displayFileTitle --
//

function displayFileTitle(contents) {
  let references = getReferenceRecords(contents);

  let lines = contents.split(/\r?\n/);
  let title = '';
  let number = '';
  let composer = '';
  let sct = '';
  let matches;

  if (references['title'] && !references['title'].match(/^\s*$/)) {
    title = references['title'];
  } else if (references['OTL'] && !references['OTL'].match(/^\s*$/)) {
    title = references['OTL'];
  }

  if (references['COM'] && !references['COM'].match(/^\s*$/)) {
    if ((matches = references['COM'].match(/^\s*([^,]+),/))) {
      composer = matches[1];
    } else {
      composer = references['COM'];
    }
  }

  title = title.replace(/-sharp/g, '&#9839;');
  title = title.replace(/-flat/g, '&#9837;');

  let tarea;
  tarea = document.querySelector('#title');
  if (tarea) {
    tarea.innerHTML = title;
  }

  tarea = document.querySelector('#composer');
  let pretitle = '';

  if (tarea && !composer.match(/^\s*$/)) {
    pretitle += composer + ', ';
  }
  tarea.innerHTML = pretitle;

  displayWorkNavigation('#work-navigator');
}

//////////////////////////////
//
// displayWork --
//

function displayWork(file) {
  if (!file) {
    return;
  }
  clearCgiHash();
  moveToTopOfNotation();
  vrvWorker.page = 1;
  CGI.file = file;
  delete CGI.mm;
  delete CGI.kInitialized;
  $('html').css('cursor', 'wait');
  stop();
  loadKernScoresFile({
    file: CGI.file,
    measures: CGI.mm,
    previous: true,
    next: true,
  });
}

//////////////////////////////
//
// displayIndex --
//

function displayIndex(directory) {
  ShowingIndex = true;
  if (!directory) {
    return;
  }
  $('html').css('cursor', 'wait');
  loadIndexFile(directory);
}

//////////////////////////////
//
// replaceEditorContentWithHumdrumFile -- If the editor contents is
//    MusicXML, then convert to Humdrum and display in the editor.
//

function replaceEditorContentWithHumdrumFile(text, page) {
  if (!text) {
    text = getTextFromEditor();
  }
  if (!text) {
    console.log('No content to convert to Humdrum');
    return;
  }

  vrvWorker.page = 1;
  page = page || vrvWorker.page;
  let options = null;
  let meiQ = false;

  let mode = getMode(text);

  if (text.slice(0, 1000).match(/<score-partwise/)) {
    // MusicXML data
    options = musicxmlToHumdrumOptions();
  } else if (text.slice(0, 2000).match(/Group memberships:/)) {
    // MuseData data
    options = musedataToHumdrumOptions();
  } else if (text.slice(0, 1000).match(/<mei/)) {
    // this is MEI data
    options = meiToHumdrumOptions();
    meiQ = true;
  } else if (text.slice(0, 1000).match(/CUT[[]/)) {
    // EsAC data
    options = esacToHumdrumOptions();
  } else {
    // don't know what it is, but probably Humdrum
    alert('Cannot convert data to Humdrum');
    return;
  }

  if (options) {
    if (
      options.inputFrom == 'musedata' ||
      options.inputFrom == 'musedata-hum'
    ) {
      vrvWorker.filterData(options, text, 'humdrum').then(showMei);
    } else if (
      options.inputFrom == 'musicxml' ||
      options.inputFrom == 'musicxml-hum'
    ) {
      vrvWorker.filterData(options, text, 'humdrum').then(showMei);
    } else {
      vrvWorker.filterData(options, text, 'humdrum').then(function (newtext) {
        let freezeBackup = FreezeRendering;
        if (FreezeRendering == false) {
          FreezeRendering = true;
        }
        if (CGI.filter) {
          if (mode == 'musedata') {
            setTextInEditor('@@@filter: ' + CGI.filter + '\n' + newtext);
          } else if (mode == 'xml') {
            // This may cause problems since the "<?xml" processor directive
            // is now not at the start of the data.
            setTextInEditor('<!-- !!!filter: ' + CGI.filter + '\n' + newtext);
          } else {
            setTextInEditor('!!!filter: ' + CGI.filter + '\n' + newtext);
          }
        } else {
          setTextInEditor(newtext);
        }
        FreezeRendering = freezeBackup;
        displayNotation(page);
      });
    }
  }
}

///////////////////////////////
//
// applyZoom --
//

function applyZoom() {
  // let measure = 0;

  let testing = document.querySelector('#output svg');
  if (!testing) {
    // console.log("NO OUTPUT SVG LOCATION");
    return;
  }

  // if (vrvWorker.page !== 1) {
  // 	measure = $("#output .measure").attr("id");
  // }

  let options = humdrumToSvgOptions();
  OPTIONS = options;
  stop();
  vrvWorker.HEIGHT = options.pageHeight;
  vrvWorker.WIDTH = options.pageWidth;

  vrvWorker.redoLayout(options, 1, vrvWorker.page).then(function () {
    loadPage(vrvWorker.page);
  });
}

//////////////////////////////
//
// loadPage --
//

function loadPage(page) {
  page = page || vrvWorker.page;
  $('#overlay').hide().css('cursor', 'auto');
  $('#jump_text').val(page);
  vrvWorker.renderPage(page).then(function (svg) {
    $('#output').html(svg);
    verovioCallback(svg);
    // adjustPageHeight();
    // resizeImage();
  });
}

//////////////////////////////
//
// resizeImage -- Make all SVG images match the width of the new
//     width of the window.
//

function resizeImage(image) {
  return; /* not needed anymore */
  /*
	let ww = window.innerWidth;
	let tw = $("#input").outerWidth();

	// let newheight = (window.innerHeight - $("#navbar").outerHeight()) / ZOOM - 100;
	// let newwidth = (ww - tw) / ZOOM - 100;
	let newheight = (window.innerHeight - $("#navbar").outerHeight());
	let newwidth = (ww - tw);

	let image = document.querySelector("#output svg");
	//console.log("OLD IMAGE HEIGHT", $(image).height());
	console.log("OLD IMAGE WIDTH", $(image).width());
	if (!image) {
		return;
	}
	console.log("ZOOM", ZOOM);

return;

	$(image).width(newwidth);
	$(image).height(newheight);
	$(image.parentNode).height(newheight);
	$(image.parentNode).width(newwidth);
*/
}

//////////////////////////////
//
// gotoPreviousPage --
//

function gotoPreviousPage() {
  vrvWorker.gotoPage(vrvWorker.page - 1).then(function () {
    loadPage(vrvWorker.page);
  });
}

//////////////////////////////
//
// gotoNextPage --
//

function gotoNextPage() {
  vrvWorker.gotoPage(vrvWorker.page + 1).then(function () {
    loadPage(vrvWorker.page);
  });
}

//////////////////////////////
//
// gotoLastPage --
//

function gotoLastPage() {
  vrvWorker.gotoPage(0).then(function () {
    loadPage(vrvWorker.page);
  });
}

//////////////////////////////
//
// gotoFirstPage --
//

function gotoFirstPage() {
  vrvWorker.gotoPage(1).then(function () {
    loadPage(vrvWorker.page);
  });
}

//////////////////////////////
//
// showBufferedHumdrumData --
//

function showBufferedHumdrumData() {
  let oldmode = EditorMode;
  if (oldmode == 'musedata') {
    EditorMode = 'humdrum';
    setEditorModeAndKeyboard();
    displayHumdrum();
  } else {
    EditorMode = 'humdrum';
    setEditorModeAndKeyboard();
    if (!BufferedHumdrumFile.match(/^\s*$/)) {
      let page = vrvWorker.page;
      displayScoreTextInEditor(BufferedHumdrumFile, vrvWorker.page);
      BufferedHumdrumFile = '';
    }
  }
}

//////////////////////////////
//
// displayHumdrum --
//

function displayHumdrum() {
  let options = humdrumToSvgOptions();
  vrvWorker
    .filterData(options, getTextFromEditor(), 'humdrum')
    .then(showHumdrum);
}

//////////////////////////////
//
// showHumdrum --
//

function showHumdrum(humdrumdata) {
  if (EditorMode == 'musedata') {
    // could implement a key to return to MuseData contents
    MuseDataBuffer = getTextFromEditor();
  }
  setTextInEditor(humdrumdata);
}

//////////////////////////////
//
// getTextFromEditor -- return the content of the text editor,
//    removing any leading space (which will cause confusion in
//    the verovio auto-format detection algorithm).  Trailing
//    space is not removed.
//
// Maybe use for UTF-8, but seems to be working without:
//     btoa(unescape(encodeURIComponent(str))))
//

function getTextFromEditor() {
  let text = EDITOR.getValue();
  if (!text) {
    return '';
  }
  text = ensureTsv(text);
  if (text.length < 5) {
    // do not try to unmime if length less than 5 characters
    return text;
  }
  // if the first 100 charcters are only spaces or [A-Za-z0-9/+=], the assume
  // the text is MIME encoded, so decode before returning:
  let starting = text.substring(0, 100);
  if (starting.match(/^[\nA-Za-z0-9/+=]+$/)) {
    try {
      text = atob(text);
      text = ensureTsv(text);
    } catch (err) {
      // console.log("text is not mime", text);
      // It is still possible that the text is not
      // MIME data, but it will still be decodeable
      // into junk.
    }
  }
  return text;
}

//////////////////////////////
//
// getTextFromEditorRaw --
//

function getTextFromEditorRaw() {
  return EDITOR.getValue();
}

//////////////////////////////
//
// getTextFromEditorNoCsvProcessing --
//

function getTextFromEditorNoCsvProcessing() {
  let text = EDITOR.getValue();
  if (!text) {
    return '';
  }
  if (text.length < 5) {
    // do not try to unmime if length less than 5 characters
    return text;
  }
  // if the first 100 charcters are only spaces or [A-Za-z0-9/+=], the assume
  // the text is MIME encoded, so decode before returning:
  let starting = text.substring(0, 100);
  if (starting.match(/^[\nA-Za-z0-9/+=]+$/)) {
    try {
      text = atob(text);
    } catch (err) {
      // console.log("text is not mime", text);
      // It is still possible that the text is not
      // MIME data, but it will still be decodeable
      // into junk.
    }
  }
  return text;
}

//////////////////////////////
//
// ensureTsv -- convert to TSV if in CSV format.
//

function ensureTsv(text) {
  let lines = text.split('\n');
  let commacount = 0;
  let linecount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^!!/)) {
      continue;
    }
    linecount++;
    if (lines[i].match(/,/)) {
      commacount++;
    }
    if (linecount > 10) {
      break;
    }
  }
  if (linecount && linecount == commacount) {
    return convertDataToTsv(lines);
  } else {
    return text;
  }
}

//////////////////////////////
//
// setTextInEditor -- Sets the text in the editor, remving the last
//   newline in the file to prevent an empty line in the ace editor
//   (the ace editor will add an empty line if the last line of
//   data ends with a newline).  The cursor is moved to the start
//   of the data, but the view is not moved to the start (this is needed
//   for keeping a used filter in view when compiling filters, in
//   particular).  Also the selection of the entire copied data
//   is deselected.
//

function setTextInEditor(text) {
  if (!text) {
    EDITOR.setValue('');
  } else if (text.charAt(text.length - 1) === '\n') {
    // Get rid of #@%! empty line at end of text editor:
    EDITOR.setValue(text.slice(0, -1), -1);
  } else {
    EDITOR.setValue(text, -1);
  }
  EDITOR.getSession().selection.clearSelection();
}

//////////////////////////////
//
// getTextFromEditorWithGlobalFilter -- Same as getTextFromEditor(),
//    but with global filter added.
//

function getTextFromEditorWithGlobalFilter(data) {
  if (!data) {
    data = getTextFromEditor();
  }
  // remove leading/trailing spaces:
  data = data.replace(/^\s+/, '').replace(/\s+$/, '');

  // If there is contents in the GLOBALFILTER (handled by the
  // filter toolbar), then include it as the last filter in the file:
  if (GLOBALFILTER) {
    let mode = getMode(data);
    if (mode === 'musedata') {
      data += '\n@@@filter: ' + GLOBALFILTER + '\n';
    } else if (mode === 'humdrum') {
      data += '\n!!!filter: ' + GLOBALFILTER + '\n';
    } else {
      // This will not really be useful, however, since
      // MusicXML data get converted directly to MEI
      // when it is in the text editor.
      data += '\n<!-- !!!filter: ' + GLOBALFILTER + ' -->\n';
    }
    // also consider other data formats such as EsAC
  }

  return data;
}

//////////////////////////////
//
// showMei --
//

function showMei(meidata) {
  if (ShowingIndex) {
    return;
  }
  EditorMode = 'xml';
  setEditorModeAndKeyboard();
  if (BufferedHumdrumFile.match(/^\s*$/)) {
    BufferedHumdrumFile = getTextFromEditor();
  }
  displayScoreTextInEditor(meidata, vrvWorker.page);
}

//////////////////////////////
//
// displayMeiNoType --
//

function displayMeiNoType() {
  let options = humdrumToSvgOptions();
  options.humType = 0;
  let text = getTextFromEditor();
  if (GLOBALFILTER) {
    text += '\n!!!filter: ' + GLOBALFILTER + '\n';
    detachGlobalFilter();
  }
  vrvWorker.filterData(options, text, 'mei').then(function (meidata) {
    detachGlobalFilter();
    showMei(meidata);
  });
}

//////////////////////////////
//
// displayMei --
//

function displayMei() {
  vrvWorker.getMEI().then(function (meidata) {
    detachGlobalFilter();
    showMei(meidata);
  });
}

//////////////////////////////
//
// displaySvg --
//

function displaySvg() {
  if (ShowingIndex) {
    return;
  }
  vrvWorker.renderPage(vrvWorker.page).then(function (data) {
    let prefix =
      "<textarea style='spellcheck=false; width:100%; height:100%;'>";
    let postfix = '</textarea>';
    let w = window.open(
      'about:blank',
      'SVG transcoding',
      'width=600,height=800,resizeable,scrollabars,location=false'
    );
    w.document.write(prefix + data + postfix);
    w.document.close();

    // Set the title of the window.  It cannot be set immediately and must wait
    // until the content has been loaded.
    function checkTitle() {
      if (w.document) {
        w.document.title = 'SVG transcoding';
      } else {
        setTimeout(checkTitle, 40);
      }
    }
    checkTitle();

    verovioCallback(data);
  });
}

//////////////////////////////
//
// displayPdf --
//

function displayPdf() {
  // If a humdrum file has a line starting with
  //     !!!URL-pdf: (https?://[^\s]*)
  // then load that file.
  let loaded = false;
  if (EditorMode === 'humdrum') {
    let loaded = displayHumdrumPdf();
  }

  if (loaded) {
    return;
  }

  if (!FILEINFO['has-pdf']) {
    return;
  }
  if (FILEINFO['has-pdf'] != 'true') {
    return;
  }

  let url = 'https://kern.humdrum.org/data?l=' + FILEINFO['location'];
  url += '&file=' + FILEINFO['file'];
  url += '&format=pdf&#view=FitH';

  openPdfAtBottomThirdOfScreen(url);
}

//////////////////////////////
//
// displayKeyscape --
//

function displayKeyscape() {
  let fileinfo = FILEINFO;
  if (!fileinfo) {
    console.log('Error: no fileinfo');
    return;
  }
  if (typeof fileinfo.file === 'undefined') {
    console.log('Error: filename not found');
    return;
  }
  let file = fileinfo.file;
  if (!file) {
    console.log('Error: filename is empty');
    return;
  }
  if (typeof fileinfo.location === 'undefined') {
    console.log('Error: location not found');
    return;
  }
  let location = fileinfo.location;
  if (!location) {
    console.log('Error: location is empty');
    return;
  }

  let url = 'https://kern.humdrum.org/data?file=';
  url += encodeURIComponent(file);
  url += '&l=';
  url += encodeURIComponent(location);
  url += '&format=keyscape-html';
  console.log('Keyscape URL is', url);

  console.log('Loading Keyscape', url);
  if (WKEY) {
    WKEY.close();
    WKEY = null;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/open#window____features
  let features = '';
  // width and height are not the dimensions of the PNG image (600x461)
  // features += "width=950";
  // features += ", height=775";
  features += 'width=664';
  features += ', height=511';
  features += ', left=10';
  features += ', top=10';
  features += ', resizeable';
  features += ', scrollbars';
  features += ', toolbar=no';
  features += ', location=0';
  console.log('FEATURES', features);
  WKEY = window.open(url, '', features);
  WKEY.focus();
}

//////////////////////////////
//
// displayHumdrumPdf --
//
//         !!!URL-pdf: (https?://[^\s]*)
// If there is a number in the keyboard buffer:
//         !!!URL-pdf[1-9]: (https?://[^\s]*)
// Return value: false if not loaded from reference record
//
//

function displayHumdrumPdf() {
  let urllist = getPdfUrlList();

  let url = '';
  let i;
  if (InterfaceSingleNumber > 1) {
    for (i = 0; i < urllist.length; i++) {
      if (urllist[i].number == InterfaceSingleNumber) {
        url = urllist[i].url;
        break;
      }
    }
  } else {
    for (i = 0; i < urllist.length; i++) {
      if (urllist[i].number <= 1) {
        url = urllist[i].url;
        break;
      }
    }
  }

  // if the URL is empty but the urls array is not, then
  // select the last url (which is the first URL entry
  // in the file.
  // console.log("URLs:", urls);

  if (url) {
    openPdfAtBottomThirdOfScreen(url);
    return 1;
  } else {
    return 0;
  }
}

//////////////////////////////
//
// getPdfUrlList --
//

function getPdfUrlList() {
  if (EditorMode !== 'humdrum') {
    // can't handle MEI mode yet
    return 0;
  }
  let predata = getTextFromEditor();
  if (!predata) {
    return [];
  }
  let data = predata.split(/\r?\n/);
  let refrecords = {};
  let output = [];
  let title = '';

  let query;
  query = '^!!!URL(\\d*)-pdf:\\s*((?:ftp|https?)://[^\\s]+)';
  query += '\\s+(.*)\\s*$';
  let rex = new RegExp(query);

  let references = [];

  let i;
  for (i = 0; i < data.length; i++) {
    let line = data[i];
    let matches = line.match(rex);
    if (matches) {
      let obj = {};
      if (!matches[1]) {
        obj.number = -1;
      } else {
        obj.number = parseInt(matches[1]);
      }
      obj.url = matches[2];
      obj.title = matches[3];
      output.push(obj);
    }

    matches = line.match(/^!!!([^:]+)\s*:\s*(.*)\s*$/);
    if (matches) {
      obj = {};
      obj.key = matches[1];
      obj.value = matches[2];
      if (!refrecords[obj.key]) {
        refrecords[obj.key] = [];
      }
      refrecords[obj.key].push(obj);
    }
  }

  for (let i = 0; i < output.length; i++) {
    output[i].title = templateExpansion(output[i].title, refrecords);
  }

  return output;
}

//////////////////////////////
//
// templateExpansion --
//

function templateExpansion(title, records) {
  let matches = title.match(/@{(.*?)}/);
  if (!matches) {
    return title;
  }

  let replacement = getReferenceValue(matches[1], records);
  let rex = new RegExp('@{' + matches[1] + '}', 'g');
  title = title.replace(rex, replacement);

  matches = title.match(/@{(.*?)}/);
  while (matches) {
    replacement = getReferenceValue(matches[1], records);
    rex = new RegExp('@{' + matches[1] + '}', 'g');
    title = title.replace(rex, replacement);

    matches = title.match(/@{(.*?)}/);
  }

  return title;
}

//////////////////////////////
//
// getReferenceValue -- return the (first) reference record
//    value for the given key.
//

function getReferenceValue(key, records) {
  let entry = records[key];
  if (!entry) {
    return '';
  }

  return entry[0].value;
}

//////////////////////////////
//
// openPdfAtBottomThirdOfScreen --
//
// Reference: https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
//

function openPdfAtBottomThirdOfScreen(url, keepfocus) {
  if (!url) {
    return;
  }

  console.log('Loading URL', url);
  let features = 'left=0';
  features += ',top=' + parseInt((screen.height * 2) / 3);
  features += ',width=' + screen.width;
  features += ',height=' + parseInt(screen.height / 3);
  features += ',resizeable';
  features += ',scrollbars';
  features += ',location=false';
  let wpdf = window.open(url, '', features);

  if (!keepfocus) {
    if (window.focus) {
      wpdf.focus();
    }
  }
}

//////////////////////////////
//
// reloadData -- Expand later to work with other input URIs.
//

function reloadData() {
  // delete all sessionStorage keys starting with "basket-"
  for (let key in sessionStorage) {
    if (sessionStorage.hasOwnProperty(key) && /^basket-/.test(key)) {
      console.log('DELETING', key);
      delete sessionStorage[key];
    }
  }

  if (CGI && CGI.file) {
    // Reload from URL file parameter if this method was used.
    // (Don't know if a different work was loaded differently, however).
    let basket = 'basket-' + CGI.file;
    if (CGI.mm) {
      basket += '&mm=' + CGI.mm;
    }
    sessionStorage.removeItem(basket);
    loadKernScoresFile(
      {
        file: CGI.file,
        measures: CGI.mm,
        previous: false,
        next: false,
      },
      true
    );
  } else {
    // (assume) reload a repertory score
    console.log("Don't know what to reload");
  }
}

//////////////////////////////
//
// initializeVerovioToolkit --
//

function initializeVerovioToolkit() {
  // console.log("Verovio toolkit being initialized.");

  let inputarea = document.querySelector('#input');

  // now done with Ace editor callback:
  // inputarea.addEventListener("keyup", function() {
  //		displayNotation();
  //});
  if (EDITOR) {
    EDITOR.session.on('change', function (e) {
      // console.log("EDITOR content changed", e);
      monitorNotationUpdating();
    });
  } else {
    console.log('Warning: Editor not setup yet');
  }

  // $(window).resize(function() { applyZoom(); });
  $(window).resize(function () {
    displayNotation();
  });

  $('#input').mouseup(function () {
    let $this = $(this);
    if (
      $this.outerWidth() != $this.data('x') ||
      $this.outerHeight() != $this.data('y')
    ) {
      applyZoom();
    }
    $this.data('x', $this.outerWidth());
    $this.data('y', $this.outerHeight());
  });

  if (!ShowingIndex) {
    console.log('Score will be displayed after verovio has finished loading');
    displayNotation();
  }

  downloadWildWebMidi('scripts/midiplayer/wildwebmidi.js');
}

//////////////////////////////
//
// monitorNotationUpdating --
//

function monitorNotationUpdating() {
  updateEditorMode();
  displayNotation();
}

//////////////////////////////
//
// downloadWildWebMidi --
//

function downloadWildWebMidi(url) {
  let url3 = 'scripts/midiplayer/midiplayer.js';

  basket
    .require(
      { url: url, expire: 26, unique: BasketVersion },
      { url: url3, expire: 17, unique: BasketVersion }
    )
    .then(
      function () {
        initializeWildWebMidi();
      },
      function () {
        console.log('There was an error loading script', url);
      }
    );
}

//////////////////////////////
//
// initializeWildWebMidi --
//

function initializeWildWebMidi() {
  $('#player').midiPlayer({
    color: null,
    // color: "#c00",
    onUnpdate: midiUpdate,
    onStop: midiStop,
    width: 250,
  });

  $('#input').keydown(function () {
    stop();
  });

  // window blur event listener -- Stop MIDI playback.  It is very computaionally
  //    expensive, and is not useful if the window is not in focus.
  window.addEventListener('blur', function () {
    pause();
  });
}

//////////////////////////////
//
// dataIntoView -- When clicking on a note (or other itmes in SVG images later),
//      go to the corresponding line in the editor.
//

function dataIntoView(event) {
  if (EditorMode == 'xml') {
    xmlDataIntoView(event);
  } else {
    humdrumDataIntoView(event);
  }
}

//////////////////////////////
//
// xmlDataIntoView -- When clicking on a note (or other itmes in SVG
//      images later), make the text line in the MEI data visible in
//      the text area.
//
// https://github.com/ajaxorg/ace/wiki/Embedding-API
//

function xmlDataIntoView(event) {
  let target = event.target;
  let id = target.id;
  let matches;
  let regex;
  let range;
  let searchstring;

  while (target) {
    if (!target.id) {
      target = target.parentNode;
      continue;
    }
    let id = target.id;
    // if (!id.match(/-L\d+F\d+/)) {
    if (!id) {
      target = target.parentNode;
      continue;
    }
    if (!id.match(/-L\d+F\d+/)) {
      // find non-humdrum ID.
      searchstring = 'xml:id="' + target.id + '"';
      regex = new RegExp(searchstring);
      range = EDITOR.find(regex, {
        wrap: true,
        caseSensitive: true,
        wholeWord: true,
      });
      break;
    }
    // still need to verify if inside of svg element in the first place.
    searchstring = 'xml:id="' + target.id + '"';
    regex = new RegExp(searchstring);
    range = EDITOR.find(regex, {
      wrap: true,
      caseSensitive: true,
      wholeWord: true,
    });
    break; // assume that the first formatted id found is valid.
  }
}

//////////////////////////////
//
// humdrumDataIntoView -- When clicking on a note (or other items in
//      SVG images later), make the text line in the Humdrum data visible
//      in the text area.
//
function humdrumDataIntoView(event) {
  let target;
  if (typeof event === 'string') {
    target = document.querySelector('#' + event);
  } else {
    target = event.target;
  }
  let matches;
  while (target) {
    if (!target.id) {
      target = target.parentNode;
      continue;
    }
    matches = target.id.match(/-[^-]*L(\d+)F(\d+)/);
    if (!matches) {
      target = target.parentNode;
      continue;
    }

    sendTarget(target);

    HIGHLIGHTQUERY = target.id;
    highlightIdInEditor(target.id, 'humdrumDataIntoView');
    break;
  }
}

//////////////////////////////
//
// displayScoreTextInEditor --
//

function displayScoreTextInEditor(text, page) {
  let mode = getMode(text);

  if (mode != EditorMode) {
    EditorMode = mode;
    setEditorModeAndKeyboard();
  }

  // -1 is to unselect added text, and move cursor to start
  setTextInEditor(text);

  // update the notation display
  displayNotation(page);
}

//////////////////////////////
//
// toggleHumdrumCsvTsv --
//

function toggleHumdrumCsvTsv() {
  console.log('converting from CSV TO TSV');
  if (EditorMode == 'xml') {
    // not editing Humdrum data
    return;
  }
  let data = getTextFromEditorNoCsvProcessing();
  let lines = data.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\*\*/)) {
      if (lines[i].match(/,/)) {
        console.log('CONVERTING TO TSV');
        setTextInEditor(convertDataToTsv(lines));
      } else {
        console.log('CONVERTING TO CSV');
        setTextInEditor(convertDataToCsv(lines));
      }
      break;
    }
  }
}

//////////////////////////////
//
// decreaseTab --
//

function decreaseTab() {
  TABSIZE--;
  if (TABSIZE < 1) {
    TABSIZE = 1;
  }
  EDITOR.getSession().setTabSize(TABSIZE);
}

//////////////////////////////
//
// increaseTab --
//

function increaseTab() {
  TABSIZE++;
  if (TABSIZE > 100) {
    TABSIZE = 100;
  }
  EDITOR.getSession().setTabSize(TABSIZE);
}

//////////////////////////////
//
// clearContent -- Used by the alt-e option or the erase button
// in the main toolbar.
//

function clearContent() {
  let data = getTextFromEditorNoCsvProcessing();
  clearCgiHash();
  moveToTopOfNotation();
  if (data.match(/^\s*$/)) {
    // restore the text (which may have accidentally been erased)
    setTextInEditor(ERASED_DATA);
    displayFileTitle(ERASED_DATA);
    restoreWorkNavigator();
    // The left/right arrows are still active for navigating to
    // other works in the repertory.
  } else {
    // Erase the text, but store it in a buffer in case
    // the user wants to recall it if the editor is still empty.
    ERASED_DATA = data;
    let element;
    setTextInEditor('');
    let output = document.querySelector('#output');
    if (output) {
      output.innerHTML = '';
    }
    displayFileTitle('');
    removeWorkNavigator();
  }
  EDITOR.focus();
}

//////////////////////////////
//
// playCurrentMidi -- If a note is selected start playing from that note;
//     otherwise, start from the start of the music.
//

function playCurrentMidi() {
  if (CursorNote && CursorNote.id) {
    let id = CursorNote.id;
    vrvWorker.getTimeForElement(id).then(function (time) {
      play_midi(time);
    });
  } else {
    play_midi();
  }
}

//////////////////////////////
//
// setCursorNote --
//

function setCursorNote(item, location) {
  CursorNote = item;
  MENU.showCursorNoteMenu(CursorNote);
}

//////////////////////////////
//
// hideRepertoryIndex --
//

function hideRepertoryIndex() {
  let element = document.querySelector('#index');
  if (element && element.style.display != 'none') {
    element.style.display = 'none';
    // element.style.visibility = "hidden";
    let output = document.querySelector('#output');
    if (output) {
      console.log('FOCUSING ON OUTPUT');
      output.focus();
    }
    ShowingIndex = 0;
  }
}

//////////////////////////////
//
// updateEditorMode -- Automatically detect the type of data and change edit mode:
//

function updateEditorMode() {
  if (!EDITOR) {
    return;
  }
  let text = getTextFromEditorRaw();
  if (!text) {
    // This check is needed to prevent intermediate
    // states when the editor has been cleared in preparation
    // for new contents.
    // console.log("EDITOR IS EMPTY");
    return;
  }
  let shorttext = text.substring(0, 2000);
  let xmod = getMode(shorttext);
  if (xmod !== EditorMode) {
    EditorMode = xmod;
    setEditorModeAndKeyboard();
    console.log('Changing to', xmod, 'mode.');
  }
}

//////////////////////////////
//
// nextPageClick -- this is a click event for the next page.  If the shift key is
//     pressed, go to the last page instead of the next page.
//

function nextPageClick(event) {
  if (!event) {
    MENU.goToNextPage(event);
  }
  if (event.shiftKey) {
    MENU.goToLastPage(event);
  } else {
    MENU.goToNextPage(event);
  }
}

//////////////////////////////
//
// previousPageClick -- this is a click event for the previous page.
//     If the shift key is pressed, go to the last page instead of
//     the next page.
//

function previousPageClick(event) {
  if (!event) {
    MENU.goToPreviousPage(event);
  }
  if (event.shiftKey) {
    MENU.goToFirstPage(event);
  } else {
    MENU.goToPreviousPage(event);
  }
}

//////////////////////////////
//
// copyToClipboard --
//

function copyToClipboard(string) {
  // console.log("Copying", string, "to clipboard");
  let element = document.createElement('textarea');
  element.value = string;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  document.body.removeChild(element);
}

//////////////////////////////
//
// dataHasLineBreaks --
//

function dataHasLineBreaks(data) {
  if (!data) {
    data = getTextFromEditor();
  }
  // do something here ggg
}

//////////////////////////////
//
// removeLastLineInTextEditorIfMatches -- Remove the last non-empty line
//    in the text editor if it matches the given input string.  This function
//    is used by compileFilters() to remove the used GLOBALFILTER.
//

function removeLastLineInTextEditorIfMatches(line) {
  if (!line) {
    return;
  }
  let text = getTextFromEditor();
  if (!text) {
    return;
  }
  let lines = text.replace(/^\s+/, '').replace(/\s+$/, '').split(/\r?\n/);

  let deleteindex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].match(/^\s*$/)) {
      continue;
    }
    if (lines[i] === line) {
      deleteindex = i;
      // also delete #@%! empty lines before the delete line
      for (let j = deleteindex - 1; j <= 0; j--) {
        if (lines[j].match(/^\s*$/)) {
          deleteindex--;
          continue;
        }
        break;
      }
      break;
    }
    break;
  }

  if (deleteindex < 0) {
    retrun;
  }

  let newtext = '';
  for (let i = 0; i < deleteindex; i++) {
    newtext += lines[i] + '\n';
  }

  setTextInEditor(newtext);
}

//////////////////////////////
//
// clearCgiHash --
//

function clearCgiHash() {
  for (let property in CGI) {
    let matches;
    matches = property.match(/^hash_/);
    if (matches) {
      delete CGI[property];
    }
  }
}

//////////////////////////////
//
// moveToTopOfNotation --
//

function moveToTopOfNotation() {
  GOTOTOPOFNOTATION = true;
}

//////////////////////////////
//
// cleanFont --
//

function cleanFont(font) {
  // Make sure that the font name is not corrupted:
  let found = 0;
  if (font.match(/bravura/i)) {
    font = 'Bravura';
    found = 1;
  } else if (font.match(/goo?tvil?e?/i)) {
    font = 'Gootville';
    found = 1;
  } else if (font.match(/leipzig/i)) {
    font = 'Leipzig';
    found = 1;
  } else if (font.match(/leland/i)) {
    font = 'Leland';
    found = 1;
  } else if (font.match(/petaluma/i)) {
    font = 'Petaluma';
    found = 1;
  }
  if (!found) {
    font = 'Leland';
  }
  return font;
}


// Measure highlighting:
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sat Jan  9 19:54:31 PST 2021
// Last Modified:  Sun Jan 10 16:01:24 PST 2021
// Filename:       highlight.js
// Syntax:         ECMAScript 6
// vim:            ts=3:nowrap:ft=javascript
//
// Description:    Interface to highlight SVG notation created from Humdrum
//                 files.
//


///////////////////////////////////////////////////////////////////////////
//
// HnpMarkup class -- Interface to highlight and markup regions of a
//                 verovio-generated SVG image.
//

//////////////////////////////
//
// HnpMarkup constructor -- Creat an HnpMarkup object.
//    to create an object:
//        let highligher = new HnpMarkup();
//    to load an SVG image (an SVG element or a selector for an SVG element):
//        highlighter.loadSvg(svg)
//    functions starting with "m_" should be treated as private to the class.
//

function HnpMarkup() {
	this.clear();
	return this;
}



//////////////////////////////
//
// HnpMarkup.prototype.clear -- Clear the contents of the highlighter.
//

HnpMarkup.prototype.clear = function() {
	this.clearSvgInfo();
};



//////////////////////////////
//
// HnpMarkup.prototype.clearSvgInfo -- Clear information about
//    the stored SVG image.  Does not clear highlighting database.
//

HnpMarkup.prototype.clearSvgInfo = function() {
	this.m_svg = new HnpSvg();
};



//////////////////////////////
//
// HnpMarkup.prototype.loadSvg --
//

HnpMarkup.prototype.loadSvg = function (svg) {
	let status = this.m_svg.loadSvg(svg);
	if (!status) {
		console.warn("Warning: could not load SVG image");
	}
	return status;
}



//////////////////////////////
//
// HnpMarkup.prototype.getMeasure --
//

HnpMarkup.prototype.getMeasure = function (barnum) {
	if (!this.m_svg) {
		return null;
	}
	return this.m_svg.getMeasure(barnum);
};



//////////////////////////////
//
// HnpMarkup.prototype.getMeasureElement --
//

HnpMarkup.prototype.getMeasureElement = function (barnum) {
	if (!this.m_svg) {
		return null;
	}
	let measure  = this.m_svg.getMeasure(barnum);
	if (!measure) {
		return null;
	}
	if (typeof measure.element === "undefined") {
		return null;
	}
	return measure.element;
};



//////////////////////////////
//
// HnpMarkup.prototype.getLowerSystemMarkupElement --
//

HnpMarkup.prototype.getLowerSystemMarkupElement = function () {
	return this.m_svg.getLowerSystemMarkupElement();
};



//////////////////////////////
//
// HnpMarkup.prototype.getLowerMeasureMarkupElement --
//

HnpMarkup.prototype.getLowerMeasureMarkupElement = function () {
	return this.m_svg.getLowerMeasureMarkupElement();
};



//////////////////////////////
//
// HnpMarkup.prototype.highlightMeasure --
//
// Options:
//     measure : the measure # to highlight
//     opacity : 0.0 == transparent, 1.0 == opaque
//     padding : units of 1/2 space between stafflines

HnpMarkup.prototype.highlightMeasure = function (options) {
	let measure;
	let color;
	let opacity;
	let padding;

	if (typeof options === "number") {
		measure = options;
		color    = "goldenrod";
		opacity  = 0.25;
		padding  = 1;
	} else if (typeof options === "string") {
		measure  = parseInt(options);
		color    = "goldenrod";
		opacity  = 0.25;
		padding  = 1;
	} else {
		measure  = options.measure || 1;
		color    = options.color   || "goldenrod";
		opacity  = options.opacity || 0.25;
		if (typeof options.padding !== "undefined") {
			padding = options.padding;
		} else {
			padding = 1;
		}
	}
	if (measure < 0) {
		return null;
	}

	let measureobj = this.getMeasure(measure);
	if (!measureobj) {
		return null;
	}
	let x = measureobj.getX();
	let y = measureobj.getY();
	let width = measureobj.getWidth();
	let height = measureobj.getHeight();
	let vu = measureobj.getVuScale();

	if ((padding > 0.0) && (vu > 0.0)) {
		x = x - padding * vu;
		y = y - padding * vu;
		width = width + 2 * padding * vu;
		height = height + 2 * padding * vu;
	}

	let mbox = document.createElementNS("http://www.w3.org/2000/svg","rect");
	mbox.setAttribute("x",       x);
	mbox.setAttribute("y",       y);
	mbox.setAttribute("width",   width);
	mbox.setAttribute("height",  height);
	mbox.setAttribute("fill",    color);
	mbox.setAttribute("opacity", opacity);

	let markupLayer = this.getLowerMeasureMarkupElement();
	if (!markupLayer) {
		return null;
	}
	markupLayer.appendChild(mbox);
	return mbox;
}



///////////////////////////////////////////////////////////////////////////
//
// HnpSvg class -- Interface to verovio-generated SVG image of music notation.
//


//////////////////////////////
//
// HnpSvg constructor -- Creat an HnpSvg object.  This is used by the
//    HnpMarkup class to interact with verovio-generated SVG image.
//

function HnpSvg() {
	this.clear();
	return this;
}



//////////////////////////////
//
// HnpSvg.prototype.clear -- Remove link to SVG image.
//

HnpSvg.prototype.clear = function () {
	this.element = null;

	// List of SVG system elements in image:
	this.svgSystems = [];

	// List of list of measure elements in each system:
	this.svgSystemMeasures = [];

	// List of all measures on the page (with other information added
	// such as the measure number and bounding box of the measure).
	this.svgMeasures = [];

	///////////////////////////
	//
	// Clear attributes relatd to the SVG image:
	//

	// pagemargin == element for the page region of the SVG image:
	this.pagemargin = null;

	// lowerMarkupLayer == element for storing highlights in SVG
	// (behind the notation):
	this.lowerMarkupElement = null;

	// lowerSystemMarkups == element containing system highlights:
	this.lowerSystemMarkupElement = null;

	// lowerMeasureMarkupElement == element containing measure highlights:
	this.lowerMeasureMarkupElement = null;

};



//////////////////////////////
//
// HnpSvg.prototype.loadSvg -- Load an svg image for later processing.
//   Returns false if cannot load SVG.
//

HnpSvg.prototype.loadSvg = function (svg) {
	this.clear();

	// Verify the SVG image being loaded:
	if (typeof svg === "string") {
		// Assume selector to SVG object:
		let element = document.querySelector(svg);
		if (!element) {
			console.warn("Warning: Selector for SVG element is invalid", svg);
			return false;
		}
		svg = element;
	}
	if (!svg) {
		console.warn("Warning: SVG element not found");
		return false;
	}
	let nodename = svg.nodeName;
	if (nodename !== "svg") {
		console.warn("Warning: SVG element is not an SVG element:", svg);
		return false;
	}
	this.element = svg;

	// Create a list of systems in the SVG image:
	let systems = svg.querySelectorAll('g[id^="system-"].system');
	if (!systems) {
		console.warn("Warning: no systems in SVG image");
		return false;
	}
	this.svgSystems = [];
	for (let i=0; i<systems.length; i++) {
		let obj = {};
		obj.element = systems[i];
		this.svgSystems.push(obj);
	}

	// Create a 2D list of the measrues in the image.
	// this.svgSystemMeasures indexes measures by system index, then measure
	// index on that system.
	this.svgSystemMeasures = [];
	for (let i=0; i<this.svgSystems.length; i++) {
		let system = this.svgSystems[i].element;
		let measures = system.querySelectorAll('g[id^="measure-"].measure');
		let m = [];
		this.svgSystemMeasures.push(m);
		if (!measures) {
			continue;
		}
		for (let j=0; j<measures.length; j++) {
			let obj = new HnpSvgMeasure();
			obj.element = measures[j];
			obj.systemIndex = i;
			obj.systemMeasureIndex = j;
			obj.m_setMeasureNumber();
			// Other measure information will be calculated
			// when needed by .m_setMeasureInfo().
			m.push(obj);
		}

	}

	// Now create a 1D list of the measures in the SVG image
	this.svgMeasures = [];
	for (let i=0; i<this.svgSystemMeasures.length; i++) {
		let mlist = this.svgSystemMeasures[i];
		for (let j=0; j<mlist.length; j++) {
			mlist[j].measureIndex = this.svgMeasures.length;
			this.svgMeasures.push(mlist[j]);
		}
	}

	// And create a lookup table by measure number.  Each measure
	// index contains a list of measures with a given number
	// (in case there are multiple measures with the same number).
	this.measures = {};
	for (let i=0; i<this.svgMeasures.length; i++) {
		let item = this.svgMeasures[i];
		let number = item.number;
		let obj = this.measures[number];
		if (!obj) {
			this.measures[number] = [];
		}
		obj = this.measures[number];
		obj.push(item);
	}

	this.m_insertLowerMarkupLayer();

	return true;
};



/////////////////////////////
//
// HnpSvg.prototype.m_insertLowerMarkupLayer = function () {
//

HnpSvg.prototype.m_insertLowerMarkupLayer = function () {
	if (!this.element) {
		console.warn("Error: no SVG image");
		return;
	}
	let svg = this.element;
	let pagemargin = svg.querySelector(".page-margin");
	if (!pagemargin) {
		console.warn("Error: invalid SVG image", svg);
		return;
	}
	this.pagemargin = pagemargin;
	let child = pagemargin.firstElementChild;
	let classlist = child.classList;
	let hasLayer = false;
	for (let i=0; i<classlist.length; i++) {
		if (classlist[i] === "lowerMarkupLayer") {
			hasLayer = true;
			break;
		}
	}
	if (hasLayer) {
		this.lowerMarkupElement = child;
	} else {
		let element = document.createElementNS("http://www.w3.org/2000/svg","g");
		let parent = child.parentNode;
		parent.prepend(element);
		element.classList.add("lowerMarkupLayer");
		this.lowerMarkupElement = element;
	}

	// fill in lowerMarkupLayer with sublayers:
	this.lowerMarkupElement.innerHTML = "";
	let subelement;

	subelem = document.createElementNS("http://www.w3.org/2000/svg","g");
	subelem.classList.add("lowerSystemMarkups");
	this.lowerMarkupElement.appendChild(subelem);
	this.lowerSystemMarkupElement = subelem;

	subelem = document.createElementNS("http://www.w3.org/2000/svg","g");
	subelem.classList.add("lowerMeasureMarkups");
	this.lowerMarkupElement.appendChild(subelem);
	this.lowerMeasureMarkupElement = subelem;
};



//////////////////////////////
//
// HnpSvg.prototype.getLowerSystemMarkupElement --
//

HnpSvg.prototype.getLowerSystemMarkupElement = function () {
	if (this.lowerSystemMarkupElement) {
		return this.lowerSystemMarkupElement;
	} else {
		return null;
	}
};



//////////////////////////////
//
// HnpSvg.prototype.getLowerMeasureMarkupElement --
//

HnpSvg.prototype.getLowerMeasureMarkupElement = function () {
	if (this.lowerMeasureMarkupElement) {
		return this.lowerMeasureMarkupElement;
	} else {
		return null;
	}
};



//////////////////////////////
//
// HnpSvg.prototype.getMeasure --
//

HnpSvg.prototype.getMeasure = function (barnum) {
	if (typeof barnum === "undefined") {
		console.log("Warning: no bar number given as input.");
		return;
	}
	if (!this.measures) {
		return null;
	}
	if (typeof barnum === "string") {
		barnum = parseInt(barnum);
	}
	let output = this.measures[barnum][0];
	return output;
};



///////////////////////////////////////////////////////////////////////////
//
// HnpSvgMeasure class -- Interface to measure element int
//     verovio-generated SVG image of music notation.
//



//////////////////////////////
//
// HnpSvgMeasure constructor -- Creat an HnpSvgMeasure object.
//    to create an object:
//        let measure = new HnpSvgMeasure();
//

function HnpSvgMeasure() {
	this.clear();
	return this;
}



//////////////////////////////
//
// HnpSvgMeasure.prototype.clear --
//

HnpSvgMeasure.prototype.clear = function () {
	delete this.element; // measure element in SVG image.
	delete this.number;  // measure number extracted from element.
}



//////////////////////////////
//
// HnpSvgMeasure.prototype.getMeasureNumber --
//

HnpSvgMeasure.prototype.getMeasureNumber = function () {
	if (typeof this.number !== "undefined") {
		return this.number;
	}
	this.m_setMeasureNumber();
	return this.number;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getMeasureElement --
//

HnpSvgMeasure.prototype.getMeasureElement = function () {
	if (typeof this.element !== "undefined") {
		return this.element;
	}
	return null;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setMeasureNumber --  Extract measure number
//   from measure element.  It is stored as a class element in the form
//   m-#.
//

HnpSvgMeasure.prototype.m_setMeasureNumber = function () {
	if (typeof this.number !== "undefined") {
		return this.number;
	}
	let output = - 1;
	let measure = this.element;
	if (!measure) {
		return output;
	}
	let classlist = measure.classList;
	for (let i=0; i<classlist.length; i++) {
		let matches = classlist[i].match(/m-(\d+)/);
		if (matches) {
			output = parseInt(matches[1]);
			break;
		}
	}
	this.number = output;
	return output;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getX -- Return the top left corner horizontal
//   position of the bounding box for a measure (positiver direction is
//   to the right).  The X value may be influenced by a measure number,
//   so this function will set the X position to the left barline instead.
//

HnpSvgMeasure.prototype.getX = function () {
	if (typeof this.x !== "undefined") {
		return this.x;
	}
	this.m_setMeasureInfo();
	return this.x;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getY -- Return the top left corner vertical
//    position of the bounding box for a measure (positive direction
//    is down).
//

HnpSvgMeasure.prototype.getY = function () {
	if (typeof this.y !== "undefined") {
		return this.y;
	}
	this.m_setMeasureInfo();
	return this.y;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getHeight --
//

HnpSvgMeasure.prototype.getHeight = function () {
	if (typeof this.height !== "undefined") {
		return this.height;
	}
	this.m_setMeasureInfo();
	return this.height;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getWidth --
//

HnpSvgMeasure.prototype.getWidth = function () {
	if (typeof this.width !== "undefined") {
		return this.width;
	}
	this.m_setMeasureInfo();
	return this.width;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.getVuScale -- Return 1/2 the distance
//   between staff lines.
//

HnpSvgMeasure.prototype.getVuScale = function () {
	if (typeof this.vu !== "undefined") {
		return this.vu;
	}
	this.m_setMeasureInfo();
	return this.vu;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setMeasureInfo --
//

HnpSvgMeasure.prototype.m_setMeasureInfo = function () {
	if (typeof this.x !== "undefined") {
		// Already have measure dimensions, do not recalculate.
		return false;
	}
	if (!this.element) {
		// No SVG element to process
		console.log("NO SVG ELEMENT");
		return false;
	}

	let bbox = this.element.getBBox();
	let lines = this.element.querySelectorAll(".staff path");
	if (lines.length <= 0) {
		this.width = bbox.width;
		console.warn("Warning: NO STAFF LINES IN MEASURE");
		return false;
	}
	this.stafflines = lines;
	this.m_setX();
	this.y = bbox.y;
	this.height = bbox.height;

	let sbbox = this.stafflines[0].getBBox();
	this.width = sbbox.width;

	let status = this.m_setVuScale();
	return status;
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setX -- The measure X position may be pushed
//    to the left because of a measure number.  This function will instead
//    look at the X position of the staff lines in the measure.
//


HnpSvgMeasure.prototype.m_setX = function () {
	let stafflines = this.stafflines;
	if (stafflines.length <= 0) {
		console.log("STAFFLINES NOT FOUND");
		this.x = 0.0;
		return false;
	}
	let path1 = stafflines[0].getAttribute("d");
	let y1;
	let y2;
	var matches = path1.match(/M([\d.+-]+)/);
	if (!matches) {
		this.x = 0.0;
		console.log("STAFFLINES NOT FOUND B");
		return false;
	} else {
		this.x = parseFloat(matches[1]);
		return true;
	}
};



//////////////////////////////
//
// HnpSvgMeasure.prototype.m_setVuScale -- 1/2 of the distance between stafflines.
//     Checking only the to staff of a system, and assuming all staves
//     are the same size.
//

HnpSvgMeasure.prototype.m_setVuScale = function () {
	let stafflines = this.stafflines;
	if (stafflines.length <= 0) {
		this.vu = 0.0;
		return false;
	}
	let path1 = stafflines[0].getAttribute("d");
	let y1;
	let y2;
	var matches = path1.match(/M[\d.+-]+\s+([\d.+-]+)/);
	if (!matches) {
		this.vu = 0.0;
		return false;
	} else {
		y1 = parseInt(matches[1]);
	}
	let path2 = stafflines[1].getAttribute("d");
	matches = path2.match(/M[\d.+-]+\s+([\d.+-]+)/);
	if (!matches) {
		this.vu = 0.0;
		return false;
	} else {
		y2 = parseInt(matches[1]);
	}
	let difference = Math.abs(y2 - y1);
	this.vu = difference;
	return true;
};


//////////////////////////////////////////////////////////////////////////


//////////////////////////////
//
// processMeasureHash --  When loading a score, if #m13 is
//     given in the URL, move to measure 13.
//
// Delete CGI.hash_m and CGI.hash_mh if the repertory file changes, or
//     if alt-e is pressed.
//

function processMesaureHash() {
	if (typeof CGI.hash_m !== "undefined") {
		scrollToMeasure(CGI.hash_m, "#output");
	}
	if (typeof CGI.hash_mh !== "undefined") {
		let options = {};
		options.measure = CGI.hash_mh;
		options.padding = 1;
		let measure = MARKUP.highlightMeasure(options);
		if (measure) {
	 		scrollToMeasure(CGI.hash_mh, "#output");
		}
	}
}



//////////////////////////////
//
// scrollToMeasure -- Bring a particular measure into view at the
//   top of the selected element.
//

function scrollToMeasure(number, selector) {
	if (!SCROLL_HASH) {
		return;
	}
	SCROLL_HASH = false;
	let scroller = document.querySelector("#output");
	let element = MARKUP.getMeasureElement(number);
	if (scroller && element) {
		let viewport = element.getBoundingClientRect();
		let topmargin = 100;
		let scrolly = viewport.y - topmargin;
		if (scrolly < 0) {
			scrolly = 0;
		}
		scroller.scrollTo(0, scrolly);
	}
}





// Main event listener functions:
//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Thu Aug 18 21:03:35 CEST 2016
// Filename:       listeners.js
// Web Address:    https://verovio.humdrum.org/listeners.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Event listeners and related code for index.html.
//

var PDFLISTINTERVAL = null;
var HIDEINITIALTOOLBAR = false;
var HIDEMENUANDTOOLBAR = false;
var HIDEMENU = false;
var TOOLBAR = null;  // used to select the toolbar from URL toolbar parameter.
var LASTTOOLBAR = 1;
if (localStorage.LASTTOOLBAR) {
	LASTTOOLBAR = parseInt(localStorage.LASTTOOLBAR);
}
if (localStorage.FONT) {
	FONT = cleanFont(localStorage.FONT);

}
var PQUERY = "";
var IQUERY = "";
var RQUERY = "";
// The search toolbar is currently the 4th one.  This variable
// will need to be updated if that changes...
var SEARCHTOOLBAR = 4;

//////////////////////////////
//
// highlighting options --
//

MARKUP = new HnpMarkup();


//////////////////////////////
//
// DomContentLoaded event listener -- Display the sample data.
//

document.addEventListener("DOMContentLoaded", function() {
	loadEditorFontSizes();
	var inputElement = document.querySelector("#input");
	if (inputElement) {
			inputElement.style.fontSize = INPUT_FONT_SIZE + "rem";
	}

	// EditorMode = "humdrum";
	EditorMode = "humdrum";
	setEditorModeAndKeyboard();

	CGI = GetCgiParameters();

	// Set up any music searching parameters from CGI.
	// If there are any, then set the search toolbar to be visible,
	// overriding any previous toolbar state from the previous session.
	if (CGI.p) {
		PQUERY = CGI.p || "";
		LASTTOOLBAR = SEARCHTOOLBAR;
	}
	if (CGI.i) {
		IQUERY = CGI.i || "";
		LASTTOOLBAR = SEARCHTOOLBAR;
	}
	if (CGI.r) {
		RQUERY = CGI.r || "";
		LASTTOOLBAR = SEARCHTOOLBAR;
	}

	if (!PQUERY.match(/^\s*$/) || !IQUERY.match(/^\s*$/) || !RQUERY.match(/^\s*$/)) {
		// Set up the search for initial display of music.  The searches will be
		// loaded into the search toolbar as well.
		SEARCHFILTER = buildSearchQueryFilter({
			pitch:    PQUERY,
			interval: IQUERY,
			rhythm:   RQUERY
		});
	}
	if (CGI.t) {
		if (!CGI.k) {
			CGI.k = "e";
		} else {
			CGI.k += "e";
		}
	}
	if (CGI.k) {
		if (CGI.k.match(/e/)) {
			var input = document.querySelector("#input");
			if (input) {
				input.innerHTML = "";
			}
			localStorage.setItem("AUTOSAVE", "");
			localStorage.setItem("AUTOSAVE_DATE", 0);
		}
	}
	if (CGI.font) {
		FONT = cleanFont(CGI.font);
	}

	var ctime = (new Date).getTime();
	var otime = localStorage.getItem("AUTOSAVE_DATE");
	var dur = ctime - otime;
	var encodedcontents = localStorage.getItem("AUTOSAVE");
	var autosave = decodeURIComponent(encodedcontents);
	if (!autosave) {
		autosave = "";
	}
	if ((!autosave.match(/^\s*$/)) && (dur < 60000)) {
		var input = document.querySelector("#input");
		if (input) {
			input.textContent = autosave;
		}
	}

	setupAceEditor("input");
	setupDropArea();

	if (CGI.toolbar) {
		TOOLBAR = CGI.toolbar;
	} else if (CGI.tb) {
		TOOLBAR = CGI.tb;
	}

	if (CGI.size) {
		SCALE = getScaleFromPercentSize(CGI.size);
	} else if (CGI.sz) {
		SCALE = getScaleFromPercentSize(CGI.sz);
	}

	if (CGI.k) {
		if (CGI.k.match(/y/)) {
			toggleTextVisibility(true);
		}
		if (CGI.k.match(/b/)) {
			toggleVhvTitle();
		}
		if (CGI.k.match(/B/)) {
			HIDEINITIALTOOLBAR = true;
		}
		if (CGI.k.match(/E/)) {
			HIDEMENUANDTOOLBAR = true;
		}
		if (CGI.k.match(/d/)) {
			HIDEMENU = true;
		}

		var wcount = 0;
		for (var i=0; i<CGI.k.length; i++) {
			if (CGI.k.charAt(i) === "w") {
				SPACINGADJUSTMENT += 0.05;
			} else if (CGI.k.charAt(i) === "W") {
				SPACINGADJUSTMENT -= 0.05;
			}
		}

		if (CGI.k.match(/m/)) {
			// start in MEI mode
			EditorMode = "xml";
			setEditorModeAndKeyboard();
			if (!CGI.k.match(/e/)) {
				displayMeiNoType();
			}
		}
	}

	if (CGI.filter) {
		GLOBALFILTER = CGI.filter;
	}

	if (CGI.file || CGI.tasso || CGI.jrp || CGI.bb || CGI.bitbucket || CGI.gh || CGI.github) {
		loadKernScoresFile(
			{
				file: CGI.file,
				tasso: CGI.tasso,
				jrp: CGI.jrp,
				bitbucket: CGI.bitbucket,
				bb: CGI.bb,
				github: CGI.github,
				gh: CGI.gh,
				measures: CGI.mm,
				next: true,
				previous: true
			}
		);
	} else {
		if (CGI.t) {
			var text = CGI.t;
			if (text.match(/\*kern/)) {
				// do nothing
			} else if (text.match(/\*mens/)) {
				// do nothing
			} else if (text.match(/<xml/)) {
				// do nothing
			} else {
				// presumably MIME data, so decode
				// will have to deal with embedded UTF-8 probably.
				try {
					text = atob(text);
				} catch (err) {
					// text is not MIME encoded
				}
			}
			setTextInEditor(text);
		}
		displayNotation();
	}

	setupSplitter();

	// set init (default) state
	$("#input").data('x', $("#input").outerWidth());
	$("#input").data('y', $("#input").outerHeight());

// 
//   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//   })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
//   ga('create', 'UA-82554203-1', 'auto');
//   ga('send', 'pageview');
// 

	var body = document.querySelector("body");
	body.addEventListener("click", function(event) {
		// console.log("SINGLE CLICK", event);
		// turnOffAllHighlights();
		var insvg = inSvgImage(event.target);
		if (inSvgImage(event.target)) {
		   dataIntoView(event);
		}
	});
	body.addEventListener("dblclick", function(event) {
		console.log("DOUBLE CLICK");
	});

	window.addEventListener("keydown", processNotationKeyCommand, true);
	window.addEventListener("keydown", processInterfaceKeyCommand);

	observeSvgContent();

	PDFLISTINTERVAL = setInterval(function() {
		buildPdfIconListInMenu();
	}, 3000);

});



//////////////////////////////
//
// keydown event listener -- Notation editor listener.
//

function processNotationKeyCommand(event) {
	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	// only works outside of the editor.
	if (event.altKey || event.target.nodeName == "TEXTAREA") {
		return;
	}
	if (document.activeElement.nodeName == "INPUT") {
		// needed to suppress key commands when running vim command
		return;
	}

	//undo doesn't need CursorNote
	if (event.code === ZKey && (event.ctrlKey || event.metaKey)) {
		EDITOR.undo();
		return;
	};

	if (!CursorNote) {
		return;
	}
	if (!CursorNote.id) {
		return;
	}

	switch (event.code) {
		case AKey:
			processNotationKey("a", CursorNote);
			break;

		case BKey:
			processNotationKey("b", CursorNote);
			break;

		case CKey:
			processNotationKey("c", CursorNote);
			break;

		case DKey:
			if (event.shiftKey) {
				processNotationKey("D", CursorNote);
			}
			break;

		// case EKey:

		case FKey:
			processNotationKey("f", CursorNote);
			break;

		// case GKey:
		// case HKey:

		case IKey:
			processNotationKey("i", CursorNote);
			break;

		case JKey:
			if (event.shiftKey) {
				processNotationKey("J", CursorNote);
			}
			break;

		// case KKey:

		case LKey:
			if (event.shiftKey) {
				processNotationKey("L", CursorNote);
			}
			break;

		case MKey:
			if (event.shiftKey) {
				processNotationKey("M", CursorNote);
			} else {
				processNotationKey("m", CursorNote);
			}
			break;

		case NKey:
			processNotationKey("n", CursorNote);
			break;

		// case OKey:

		case PKey:
			if (event.shiftKey) {
				processNotationKey("P", CursorNote);
			} else {
				processNotationKey("p", CursorNote);
			}
			break;

		case QKey:
			processNotationKey("q", CursorNote);
			break;

		// case RKey:

		case SKey:
			processNotationKey("s", CursorNote);
			break;

		case TKey:
			if (event.shiftKey) {
				processNotationKey("T", CursorNote);
			} else {
				processNotationKey("t", CursorNote);
			}
			break;

		// case UKey:

		case VKey:
			if (CursorNote.id.match("note-")) {
				processNotationKey("^", CursorNote);
			}
			break;

		case WKey:
			if (event.shiftKey) {
				processNotationKey("W", CursorNote);
			} else {
				processNotationKey("w", CursorNote);
			}
			break;

		case XKey:
			processNotationKey("X", CursorNote);
			break;

		case YKey:
			processNotationKey("y", CursorNote);
			break;

		// case ZKey:

		case OneKey:
			processNotationKey("1", CursorNote);
			break;

		case TwoKey:
			if (event.shiftKey) {
				processNotationKey("@", CursorNote);
			} else {
				processNotationKey("2", CursorNote);
			}
			break;

		case ThreeKey:
			if (event.shiftKey) {
				processNotationKey("#", CursorNote);
			} else {
				processNotationKey("3", CursorNote);
			}
			break;

		case FourKey:
			processNotationKey("4", CursorNote);
			break;

		case FiveKey:
			processNotationKey("5", CursorNote);
			break;

		case SixKey:
			if (CursorNote.id.match("note-")) {
				if (event.shiftKey) {
					processNotationKey("^^", CursorNote);
				} else {
					processNotationKey("6", CursorNote);
				}
			} else {
				processNotationKey("6", CursorNote);
			}
			break;

		case SevenKey:
			processNotationKey("7", CursorNote);
			break;

		case EightKey:
			processNotationKey("8", CursorNote);
			break;

		case NineKey:
			processNotationKey("9", CursorNote);
			break;

		case MinusKey:
			processNotationKey("-", CursorNote);
			break;

		case SingleQuoteKey:
			processNotationKey("'", CursorNote);
			break;

		case SemiColonKey:
			if (event.shiftKey) {
				processNotationKey(":", CursorNote);
			} else {
				processNotationKey(";", CursorNote);
			}
			break;

		case BackQuoteKey:
			if (event.shiftKey) {
				processNotationKey("~", CursorNote);
			} else {
				processNotationKey("`", CursorNote);
			}
			break;

		case UpKey:
			if (event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					console.log('Shift + Up, Current note: ', CursorNote);
					processNotationKey("transpose-up-step", CursorNote);
				}
			} else if (event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-up-octave", CursorNote);
				}
			} else {
				event.preventDefault();
				event.stopPropagation();
				goUpHarmonically(CursorNote);
			}
			break;

		case DownKey:
			if (event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-down-step", CursorNote);
				}
			} else if (event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-down-octave", CursorNote);
				}
			} else {
				event.preventDefault();
				event.stopPropagation();
				goDownHarmonically(CursorNote);
			}
			break;

		case DeleteKey:
		case BackKey:
			processNotationKey("delete", CursorNote);
			event.stopPropagation();
			break;

		case LeftKey:
			if (CursorNote.id.match("slur-")) {
				event.preventDefault();
				event.stopPropagation();
				if (event.shiftKey) {
					processNotationKey("rightEndMoveBack", CursorNote);
				} else {
					processNotationKey("leftEndMoveBack", CursorNote);
				}
			} else {
				// move one note to the left
				event.preventDefault();
				event.stopPropagation();
				goToPreviousNoteOrRest(CursorNote.id);
				sendTarget(CursorNote);
			}
			break;

		case RightKey:
			if (CursorNote.id.match("slur-")) {
				event.preventDefault();
				event.stopPropagation();
				if (event.shiftKey) {
					processNotationKey("rightEndMoveForward", CursorNote);
				} else {
					processNotationKey("leftEndMoveForward", CursorNote);
				}
			} else {
				// move one note to the right
				event.preventDefault();
				event.stopPropagation();
				goToNextNoteOrRest(CursorNote.id);
				sendTarget(CursorNote);
			}
			break;

		case EscKey:
			event.preventDefault();
			event.stopPropagation();
			processNotationKey("esc", CursorNote);
			break;

	}
}



//////////////////////////////
//
// keydown event listener -- Interface control listener.
//

function processInterfaceKeyCommand(event) {

	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	if ((!event.altKey) && (event.target.nodeName == "TEXTAREA")) {
		// needed to prevent key commands when editing text
		return;
	}
	if ((!event.altKey) && (document.activeElement.nodeName == "INPUT")) {
		// needed to prevent key commands when running vim command
		return;
	}

	if (event.metaKey) {
		// usually ignore metaKey unless 0:
		if (event.code == ZeroKey) {
			MENU.resetTextFontSize();
			SCALE = 40;
			localStorage.SCALE = SCALE;
			displayNotation();
			// not preventingDefault so that web browser can reset size as well.
		}
		return;
	}

	switch (event.code) {
		case AKey:          // UNUSED
			if (event.altKey) {
				if (event.shiftKey) {
					// toggle display of toolbar
					toggleNavigationToolbar();
				} else {
					// toggle display of banner
					toggleVhvTitle();
				}
				event.preventDefault();
			}
			break;

		case BKey:
			if (event.altKey) {
				if (event.shiftKey) {
					addBarlineAboveCurrentPosition();
					event.preventDefault();
				}
			}
			break;

		case CKey:
			if (event.altKey) {
				if (event.shiftKey) {
					togglePlaceColoring();
				} else {
					// compile filtered contents & display in text editor
					compileFilters();
				}
				event.preventDefault();
			}
			break;

		case DKey:          // Add null data line
			if (event.altKey) {
				if (event.shiftKey) {
					addDataLineAboveCurrentPosition();
				} else {
					toggleMenuDisplay();
				}
				event.preventDefault();
			}
			break;

		case EKey:          // erase text editor contents or Tooggle display of menu with shift key.
			if (event.altKey) {
				if (event.shiftKey) {
					toggleMenuAndToolbarDisplay();
				} else {
					clearContent();
				}
				event.preventDefault();
			}
			break;

		case FKey:          // toogle notation update freezing
			if (event.altKey) {
				if (event.shiftKey) {
					displayNotation(false, true);
				} else {
					toggleFreeze();
				}
				event.preventDefault();
			}
			break;

		case GKey:          // save current view to SVG image
			if (event.altKey) {
				// displaySvg();
				saveSvgData();
				event.preventDefault();
			}
			break;

		case HKey:          // show Humdrum data in text editor
			if (event.altKey) {
				if (!ShowingIndex) {
					showBufferedHumdrumData();
					event.preventDefault();
				}
			}
			break;

		case IKey:          // Add null interpretation line
			if (event.altKey) {
				if (event.shiftKey) {
					addInterpretationLineAboveCurrentPosition();
					event.preventDefault();
				}
			}
			break;

		case JKey:          // UNUSED
			break;

		case KKey:          // UNUSED
			break;

		case LKey:          // toggle color of staff layers
			if (event.altKey) {
				if (event.shiftKey) {
					addLocalCommentLineAboveCurrentPosition();
				} else {
					toggleLayerColoring();
				}
				event.preventDefault();
			}
			break;

	 	case MKey:          // show MEI data in text editor
			if (event.altKey) {
				EditorMode = "xml";
				if (event.shiftKey) {
					// display with @type data
					displayMei();
				} else {
					// display without @type data
					displayMeiNoType();
				}
				event.preventDefault();
			}
			break;

	 	case NKey:          // toggle display of navigation toolbar
			if (event.altKey) {
				if (event.shiftKey) {
					// toggleNavigationToolbar();
					gotoPrevToolbarDelta();
				} else {
					chooseToolbarMenu();
				}
				event.preventDefault();
			}
			break;

		case OKey:          // toggle display of *oclef data
			if (event.altKey) {
				OriginalClef = !OriginalClef;
				console.log("Original clef changed to:", OriginalClef);
				if (!ShowingIndex) {
					displayNotation();
				}
				event.preventDefault();
			}
			break;

		case PKey:          // show PDF in separate window
			if (event.altKey) {
				displayPdf();
				event.preventDefault();
			}
			break;

		case QKey:          // toggle coloring of appoggiaturas
			if (event.altKey) {
				if (event.shiftKey) {
					// do nothing
				} else {
					toggleAppoggiaturaColoring();
				}
				event.preventDefault();
			}
			break;

		case RKey:          // reload Humdrum data from server
			if (event.altKey) {
				if (event.shiftKey) {
					restoreEditorContentsLocally();
					event.preventDefault();
				} else {
					reloadData();
					event.preventDefault();
				}
			}
			break;

		case SKey:          // save contents of text editor to file
			if (event.altKey) {
				if (event.shiftKey) {
					saveEditorContentsLocally();
					event.preventDefault();
				} else {
					saveEditorContents();
					event.preventDefault();
				}
			}
			break;

		case TKey:          // save PDF file
			// Needed functions are defined in _includes/pdfkit.html
			if (event.altKey) {
				if (event.shiftKey) {
					if (typeof generatePdfFull === "function") {
						generatePdfSnapshot();
					}
				} else {
					if (typeof generatePdfSnapshot === "function") {
						generatePdfFull();
					}
				}
				event.preventDefault();
			}
			break;

		case UKey:              // toggle TSV/CSV display of Humdrum data
			if (event.shiftKey) {
				decreaseTab();
				event.preventDefault();
			} else {
				toggleHumdrumCsvTsv();
				event.preventDefault();
			}
			break;

		case VKey:          // toggle vi mode in text editor
			if (event.altKey) {
				toggleEditorMode();
				event.preventDefault();
			}
			break;

	 	case WKey:          // adjust notation width parameter
			if (event.altKey) {
				if (event.shiftKey) {
					SPACINGADJUSTMENT -= 0.05;
				} else {
					SPACINGADJUSTMENT += 0.05;
				}
				if (SPACINGADJUSTMENT <= 0.0) {
					SPACINGADJUSTMENT = 0.0;
				}
				event.preventDefault();
				displayNotation();
			}
			break;

		case XKey:          // UNUSED
			break;

		case YKey:          // show/hide text editor
			if (event.altKey) {
				if (!ShowingIndex) {
					toggleTextVisibility();
				}
				event.preventDefault();
			}
			break;

/*		case ZKey:  // use undo key from OS/browser
			if (event.ctrlKey || event.metaKey) {
				EDITOR.undo();
			};
			break;
*/

		case ZeroKey:  InterfaceSingleNumber = 0; break;
		case OneKey:   InterfaceSingleNumber = 1; break;
		case TwoKey:   InterfaceSingleNumber = 2; break;
		case ThreeKey: InterfaceSingleNumber = 3; break;
		case FourKey:  InterfaceSingleNumber = 4; break;
		case FiveKey:  InterfaceSingleNumber = 5; break;
		case SixKey:   InterfaceSingleNumber = 6; break;
		case SevenKey: InterfaceSingleNumber = 7; break;
		case EightKey: InterfaceSingleNumber = 8; break;
		case NineKey:  InterfaceSingleNumber = 9; break;

		case SpaceKey:          // start/pause MIDI playback
			if (!PLAY) {
				if (PAUSE) {
					play();
					PLAY = true;
					PAUSE = false;
				} else {
					playCurrentMidi();
					PLAY = true;
					PAUSE = false;
				}
			} else {
				PLAY = false;
				PAUSE = true;
				pause();
			}
			event.preventDefault();
			break;

		case CommaKey:          // toggle TSV/CSV display of Humdrum data
		                        // decrease tab size in editor
			// See UKey for relocation of comma-command for
			// (related to non-US keyboard layout)
			if (event.shiftKey) {
				decreaseTab();
				event.preventDefault();
			} else {
				//toggleHumdrumCsvTsv();
				//event.preventDefault();
			}
			break;

		case DotKey:          // increase tab size in editor
			if (event.shiftKey) {
				increaseTab();
				event.preventDefault();
			}
			break;

		case UpKey:          // return to repertory index
			if (event.shiftKey) {
				if (FILEINFO["has-index"] == "true") {
					displayIndex(FILEINFO["location"]);
				}
			}
			event.preventDefault();
			break;

		case PgUpKey:          // shift: go to previous repertory work/movement
		case LeftKey:          // go to previous page
			if (event.shiftKey) {
				displayWork(FILEINFO["previous-work"]);
			} else {
				gotoPreviousPage();
			}
			event.preventDefault();
			break;

		case PgDnKey:          // shift: go to next repertory work/movement
		case RightKey:         // go to next page
			if (event.shiftKey) {
				displayWork(FILEINFO["next-work"]);
			} else {
				gotoNextPage();
			}
			event.preventDefault();
			break;

		case HomeKey:          // go to the first page
			gotoFirstPage();
			event.preventDefault();
			break;

		case EndKey:          // go to the last page
			gotoLastPage();
			event.preventDefault();
			break;

		case SlashKey:          // toggle menu display (to be implemented)
			if (event.shiftKey) {
				event.preventDefault();
			}
			break;

		case EscKey:
			hideRepertoryIndex();
			event.preventDefault();
			break;

	}
}



//////////////////////////////
//
// beforeunload event -- save the text editor's content when exiting the window.
//     This is useful if the window is left by accident, and allows the user
//     to recover their data by loading VHV again within 24 hours.
//

window.addEventListener("beforeunload", function (event) {
	var encodedcontents = encodeURIComponent(getTextFromEditorRaw());
	localStorage.setItem("AUTOSAVE", encodedcontents);
	localStorage.setItem("AUTOSAVE_DATE", (new Date).getTime());
	localStorage.setItem("FONT", FONT);
});



//////////////////////////////
//
// Autosave feature:  Save the contents of the editor every 60 seconds to
//   local storage ("SAVE0")  Which can be recalled by typing 0 shift-R
//   within one minute after reloading the VHV website.
//

setInterval(function() { 
	localStorage.setItem("SAVE0", encodeURIComponent(getTextFromEditorRaw())); 
}, 60000);


// needed for startup, but not afterwards, so adjust later:
setInterval(function() { updateEditorMode(); }, 1000);



//////////////////////////////
//
// verovioCallback -- Function that is run after SVG data is calcualted
//     by verovio.
//

function verovioCallback(data) {
	console.log("SVG updated");
	if (GOTOTOPOFNOTATION) {
		GOTOTOPOFNOTATION = false;
		let scroller = document.querySelector("#output");
		if (scroller) {
			scroller.scrollTo(0, 0);
		}
	}
	MARKUP.loadSvg("svg");
	processMesaureHash();
}





// PDF file creating/downloading
//
//	Functions for saving SVG images to a PDF file.
//	See demo at:
//		http://pdfkit.org/demo/browser.html
//
//	vim: ts=3:ft=javascript
//
//
//These external scripts are also needed to create PDF files (found
//in the _include/head/main.html file:
//
//<xscript src="/scripts/pdfkit/blobstream.js" type="text/javascript"></xscript>
//<xscript src="/scripts/pdfkit/pdfkit.js" type="text/javascript"></xscript>
//<xscript src="/scripts/pdfkit/source.js" type="text/javascript"></xscript>
//
//Verovio text font not needed anymore (loaded as a base-64 string):
//<xscript src="scripts/pdfkit/vrv-ttf.js" type="text/javascript"></xscript> 
//
//
//	The saving process also needs FileSaver.js:
//		https://github.com/eligrey/FileSaver.js
//	but this is already included for saving editor contents.
//


//////////////////////////////
//
// loadPdfFonts -- load all default fonts used by Verovio
//

function loadPdfFonts(pdf) {
	return RSVP.all([
		loadFontResource(pdf, 'Times', '/scripts/pdfkit/EBGaramond-Regular.ttf'),
		loadFontResource(pdf, 'TimesItalic', '/scripts/pdfkit/EBGaramond-Italic.ttf'),
		loadFontResource(pdf, 'TimesBold', '/scripts/pdfkit/EBGaramond-Bold.ttf'),
		loadFontResource(pdf, 'TimesBoldItalic', '/scripts/pdfkit/EBGaramond-BoldItalic.ttf'),
		loadFontResource(pdf, 'VerovioText', '/scripts/pdfkit/VerovioText-1.0.ttf'),
	]);
}



//////////////////////////////
//
// loadFontResource -- use font from file in pdf, returns promise
//

function loadFontResource(pdf, name, path) {
	var promise = new RSVP.Promise(function(resolve, reject) {

		var client = new XMLHttpRequest();
		client.open("GET", path);
		client.responseType = "arraybuffer";

		client.onreadystatechange = function() {
			if (this.readyState === this.DONE) {
				if (this.status === 200) {
					resolve(this.response);
				} else {
					reject(this);
				};
			}
		};

		client.send(null);
	});

	return promise.then(function(data) {
		pdf.registerFont(name, data);
		return true;
	});
}



//////////////////////////////
//
// svgFontCallback -- substitute svg fonts with pdf fonts
//

function svgFontCallback(family, bold, italic, options) {
	if (family == "VerovioText") {
		return family;
	}
	if (family.match(/(?:^|,)\s*sans-serif\s*$/) || true) {
		if (bold) {
			return (italic) ? "TimesBoldItalic" : "TimesBold";
		} else {
			return (italic) ? "TimesItalic" : "Times";
		};
	}
}


//////////////////////////////
//
// generatePdfShapshot -- Write a PDF file containing the currently displayed SVG.
//

function generatePdfSnapshot(format, orientation) {
	$('html').css('cursor', 'wait');

	var svg = document.querySelector("#output svg");
	var svgwidth = svg.getAttribute("width");
	var svgheight = svg.getAttribute("height");
	svgwidth = parseInt(svgwidth);
	svgheight = parseInt(svgheight);
	var aspect = svgheight / svgwidth;

	var format = format ? format : "letter";

	var pagewidth = 2159;
	var pageheight = 2794;
	if (format === "A4") {
		pagewidth = 2100;
		pageheight = 2970;
	} else if (format === "B3") {
		pagewidth = 2500;
		pageheight = 3530;
	}

	if (!orientation) {
		if (svgwidth > svgheight) {
			orientation = "landscape";
		}
	}
	var orientation = orientation ? orientation : "portrait";
	if (orientation === "landscape") {
		pagewidth = [pageheight, pageheight = pagewidth][0];
	}

	var pageaspect = pageheight / pagewidth;
	var scaling = 0.99;
	var mmwidth;
	var mmheight;

	if (aspect < pageaspect) {
		mmwidth = (pagewidth / 10) * scaling;
		mmheight = (pagewidth / 10) * aspect * scaling;
	} else {
		mmheight = (pageheight / 10) * scaling;
		mmwidth = (pageheight / 10) / aspect * scaling;
	}

	var pagewidthmm = pagewidth / 10.0;
	var pageheightmm = pageheight / 10.0;

	// pdf page offset (units are in mm?)
	var x = 0;
	var y = 0;

	if (mmwidth < pagewidthmm) {
		x = (pagewidthmm - mmwidth);
	}
	x += 1;

	var newspan = document.createElement("span");
	newspan.innerHTML = svg.outerHTML;
	var newsvg = newspan.querySelector("svg");

	newsvg.setAttribute("width", mmwidth + "mm");
	newsvg.setAttribute("height", mmheight + "mm");

	var pdfOptions = {};
	pdfOptions.fontCallback = svgFontCallback;
	var pdf = new PDFDocument({
		useCSS:        true,
		compress:      true,
		autoFirstPage: false,
		layout:        orientation
	});

	var stream = pdf.pipe(blobStream());
	stream.on('finish', function() {
		var blob = stream.toBlob('application/pdf');
		var pdfFilebase = getFilenameBase();
		var pdfFilename = pdfFilebase;
		//if (SAVEFILENAME) {
		//	pdfFilename = SAVEFILENAME.replace(/\.[^.]*$/, "") + "-snapshot.pdf";
		//} else {
		//	pdfFilename = "snapshot.pdf";
		//}
		if (pdfFilename) {
			pdfFilename += "-snapshot.pdf";
		} else {
			pdfFilename = "snapshot.pdf";
		}
		saveAs(blob, pdfFilename);
		$('html').css('cursor', 'auto');
	});

	loadPdfFonts(pdf)
	.then(function() {
		pdf.addPage({size: format, layout: orientation});
		SVGtoPDF(pdf, newsvg, x, y, pdfOptions);
		pdf.end();
	});
}



//////////////////////////////
//
// generatePdfFull -- Write a multi-page PDF of the full score in the text editor.
//

function generatePdfFull(format, orientation) {
	var oldOptions = vrvWorker.options;
	// need to explicitly disable mmOutput = 1 set by the printing process.
	oldOptions.mmOutput = 0;

	$('html').css('cursor', 'wait');
	var format = format ? format : "letter";
	var orientation = orientation ? orientation : "portrait";

	var width = 2159;
	// var height = 2794;
	var height = 2920;

	if (format === "A4") {
		width = 2100;
		height = 2970;
	} else if (format === "B3") {
		width = 2500;
		height = 3530;
	}
	if (orientation === "landscape") {
		width = [height, height = width][0];
	}

	var pdfOptions = {};
	pdfOptions.fontCallback = svgFontCallback;

	var pdf = new PDFDocument({
		useCSS:        true,
		compress:      true,
		autoFirstPage: false,
		layout:        orientation
	});
	var stream = pdf.pipe(blobStream());
	stream.on('finish', function() {
		var blob = stream.toBlob('application/pdf');
		var pdfFilebase = getFilenameBase();
		var pdfFilename = pdfFilebase;
		if (pdfFilename) {
			pdfFilename += ".pdf";
		} else {
			pdfFilename = "data.pdf";
		}
		saveAs(blob, pdfFilename);

		$('html').css('cursor', 'auto');
	});

	var scale = 95;
	height /= scale / 100;
	width  /= scale / 100;

	// var spacingBraceGroup   = 12;
	// var spacingBracketGroup = 12;
	var spacingStaff        = 10;
	var spacingSystem       = 14;
	var pageMarginTop       = 100;
	var pageMarginBottom    = 100;
	var pageMarginLeft      = 50;
	var pageMarginRight     = 50;

	var vrvOptions = {
		pageHeight             : height - pageMarginTop,
		pageWidth              : width,
		pageMarginLeft         : pageMarginLeft,
		pageMarginRight        : pageMarginRight,
		pageMarginTop          : pageMarginTop,
		pageMarginBottom       : pageMarginBottom,
		spacingSystem          : spacingSystem,
		spacingStaff           : spacingStaff,
		scale                  : scale,
		adjustPageHeight       : 0,
		justifyVertically      : 1,
		breaks                 : (BREAKS ? "encoded" : "auto"),
		mmOutput               : 1,
		// justifyIncludeLastPage : 1, // no longer a verovio option?
		// justifySystemOnly   : 1, // no longer a verovio option?
		// justifySystemsOnly  : 1, // no longer a verovio option?
		header                 : "auto",
		footer                 : "encoded",
		usePgFooterForAll      : 1,
		barLineWidth           : 0.12,
		staffLineWidth         : 0.12,
		font                   : FONT
	}


	var scoredata = EDITOR.getValue().replace(/^\s+/, "");

	var staffcount = getStaffCount(scoredata);
	if (staffcount == 2) {
		//vrvOptions.justifySystemsOnly = 1;
		//vrvOptions.justifyIncludeLastPage = 1;
	}

	if (GLOBALFILTER) {
		scoredata += "\n!!!filter: " + GLOBALFILTER + "\n";
	}

	vrvOptions = cleanOptions2(scoredata, vrvOptions);
	console.log("PRINTING OPTIONS", vrvOptions);

	// store the options for debugging PDF files:
	PDFOPTIONS = vrvOptions;

	RSVP.hash({
		fonts: loadPdfFonts(pdf),
		svglist: vrvWorker.renderAllPages(scoredata, vrvOptions)
	})
	.then(function(data) {
		for (var i=0; i < data.svglist.length; i++) {
			pdf.addPage({size: format, layout: orientation});
			var x = 0;
			var y = 0;
			SVGtoPDF(pdf, data.svglist[i], x, y, pdfOptions);
		}
		pdf.end();
		return true;
	})
	.finally(function() {
		// restore the old layout for the VHV  webpage:
		var force = false;
		var page = vrvWorker.page;
		var cleanoldoptions = cleanOptions2(scoredata, oldOptions);
		vrvWorker.redoLayout(oldOptions, true);
		vrvWorker.options = oldOptions;
	});
}



//////////////////////////////
//
// cleanOptions2 -- Remove options that will be processed interally from the data.
//

function cleanOptions2(content, options) {
	var lines = content.match(/[^\r\n]+/g);
	var output = options;
	var setlist = [""];
	var optionsets = {};
	optionsets[""] = {};
	var i;

	for (i=0; i<lines.length; i++) {
		var matches = lines[i].match(/^!!!verovio([^\s]*):\s*(.*)\s*$/);
		if (!matches) {
			continue;
		}
		if (matches[1] == "-parameter-group") {
			setlist.push(matches[2]);
			continue;
		}
		var mm = matches[2].match(/^\s*([^\s]+)\s+(.*)\s*$/);
		if (!mm) {
			continue;
		}
		var m = matches[1].match(/^-([^\s]+)\s*$/);
		var set = "";
		if (m) {
			set = m[1];
		}
		if (typeof optionsets[set] === 'undefined') {
			optionsets[set] = {};
		}
		optionsets[set][mm[1]] = mm[2];
	}

	for (i=0; i<setlist.length; i++) {
		if (!optionsets[setlist[i]]) {
			continue;
		}
		var keys = Object.keys(optionsets[setlist[i]]);
		var j;
		var key;
		for (j=0; j<keys.length; j++) {
			if (typeof output[keys[j]] !== 'undefined') {
				delete output[keys[j]];
			}
		}
	}

	return output;
}





// MusicXML export

// Convert Humdrum data to MusicXML (server-side conversion),
// with result being saved to hard disk.
// vim: ts=3:nowrap
//

function convertToMusicXmlAndSave() {
	if (document.body.classList.contains("waiting")) {
		alert("Already converting a score");
		return;
	}

	let formdata = new FormData();
	let inputdata = getTextFromEditor();
	var blob = new Blob([inputdata], { type: "text/x-humdrum" });
	formdata.append("inputdata", blob);

	for (var pair of formdata.entries()) {
		console.log("FORMDATA", pair[0] + ', ' + pair[1]); 
	}

	document.body.classList.add("waiting");
	let request = new XMLHttpRequest();
	request.open("POST", "https://data.musicxml.humdrum.org");
	request.responseType = "blob";
	request.onload = function () {
		document.body.classList.remove("waiting");
		let myblob = this.response;
		let url = window.URL.createObjectURL(myblob);

		// open in another window:
		// window.open(url);

		// or save to a file:
		let link = document.createElement("a");
		document.body.appendChild(link);
		link.style = "display: none";
		link.href = url;
		link.download = "data" + ".musicxml";
		link.click();
		// window.URL.revokeObjectURL(url);
		document.body.removeChild(link);

	};
	request.send(formdata);
}





// Extensions for collaboration
const MULTI_SELECT_ALPHA = 0.09;

function sendTarget(target) {
  if (!target) return null;
  const selectedElemAttrs = `#${target.id}.${[...target.classList].join('.')}`;
  // sendToServer({
  //   type: 'note-select',
  //   attrs: selectedElemAttrs,
  // });
}

// const socket = new WebSocket('ws://localhost:8080');
// const socket = new WebSocket('ws://vhv-ws-server.herokuapp.com');

let DEBUG = false;
function log(text) {
  if (DEBUG) {
    console.log(`[${new Date().toLocaleTimeString()}] ${text}`);
  }
}

function sendToServer(msg) {
  let msgJSON = JSON.stringify(msg);

  log(`Sending ${msg.type} message: ${msgJSON}`);
  socket.send(msgJSON);
}

window.addEventListener('beforeunload', e => {
  socket?.close();
});

const colors = [
  { value: '#e6194b', used: false },
  { value: '#3cb44b', used: false },
  { value: '#ffe119', used: false },
  { value: '#4363d8', used: false },
  { value: '#f58231', used: false },
  { value: '#911eb4', used: false },
  { value: '#46f0f0', used: false },
  { value: '#f032e6', used: false },
  { value: '#bcf60c', used: false },
  { value: '#fabebe', used: false },
  { value: '#008080', used: false },
  { value: '#e6beff', used: false },
  { value: '#9a6324', used: false },
  { value: '#800000', used: false },
  { value: '#aaffc3', used: false },
  { value: '#808000', used: false },
  { value: '#ffd8b1', used: false },
  { value: '#000075', used: false },
  { value: '#808080', used: false },
];

function getRandomColor() {
  let color;
  while (colors.some(c => c.used == false)) {
    color = colors[Math.floor(Math.random() * colors.length)];
    if (!color.used) {
      color.used = true;
      return color.value;
    }
  }
}

// function removeUnusedElements() {
//   const usersDivs = document.querySelectorAll('.users-div');
//   const singleNoteSelects = document.querySelectorAll('.single-note-select');
//   const multiNoteSelects = document.querySelectorAll('.multi-select-area');

//   // Remove all users divs when no user is selecting the note element they represent
//   [...usersDivs].forEach(div => {
//     if (!(div.dataset.noteId in userElemMap)) {
//       div.remove();
//     }
//   });

//   [...singleNoteSelects].forEach(select => {
//     if (!(select.dataset.noteId in userElemMap)) {
//       select.remove();
//     }
//   });

//   [...multiNoteSelects].forEach(select => {
//     if (!(select.dataset.clientId in userMultiSelectMap)) {
//       select.remove();
//     }
//   });

//   document.querySelector('.note-info')?.remove();

//   colors.forEach(c => {
//     if (!Object.values(userColorMap).includes(c.value)) {
//       c.used = false;
//     }
//   })
// }
function removeUnusedElements(clientIds) {
  const usersDivs = document.querySelectorAll('.users-div');
  const singleNoteSelects = document.querySelectorAll('.single-note-select');
  const multiSelects = document.querySelectorAll('.multi-select-area');

  Array.from(usersDivs).forEach(div => {
    if (!clientIds.includes(+div.dataset.clientId)) {
      div.remove();
    }
  });
  
  Array.from(singleNoteSelects).forEach(div => {
    if (!clientIds.includes(+div.dataset.clientId)) {
      div.remove();
    }
  });
  
  Array.from(multiSelects).forEach(div => {
    if (!clientIds.includes(+div.dataset.clientId)) {
      div.remove();
    }
  });
}
// function removeUnusedElements(itemIds) {
//   const usersDivs = document.querySelectorAll('.users-div');
//   const singleNoteSelects = document.querySelectorAll('.single-note-select');

//   Array.from(usersDivs).forEach(div => {
//     if (!itemIds.includes(div.dataset.noteId)) {
//       div.remove();
//     }
//   });
  
//   Array.from(singleNoteSelects).forEach(div => {
//     if (!itemIds.includes(div.dataset.noteId)) {
//       div.remove();
//     }
//   });
// }

let userMap = {};

let userColorMap = {};
let userElemMap = {};
// socket?.addEventListener('message', event => {
//   const msg = JSON.parse(event.data);
//   log(`Message from server: ${JSON.stringify(msg, null, 2)}`);

//   switch (msg.type) {
//     case 'connected':
//       socket.self = msg.self ?? socket.self;

//       if (!(socket.self in userColorMap)) {
//         userColorMap[socket.self] = getRandomColor();
//       }
//       break;
//     case 'note-select':
//       handleNoteSelect(msg);
//       break;
//     case 'client-list':
//       handleClientListUpdate(msg);
//       break;
//     case 'note-multi-select':
//       handleNoteMultiSelect(msg);
//       break;
//     default:
//       log('Uknown message type');
//       return;
//   }
// });

function handleNoteSelect(msg) {
  // Choose a random color for each other user
  msg.clientList?.forEach(client => {
    // prettier-ignore
    if (client.clientId !== socket.self && !(client.clientId in userColorMap)) {
      userColorMap[client.clientId] = getRandomColor();
    }
  });

  /*
  "note-4343": {
    attrs: "#note-4343.bla.bla",
    count: 2,
    clientIds: Set{'client1', 'client2'}
  }
  */
  userElemMap = msg.clientList?.reduce((prevClients, client) => {
    if (typeof client.attrs == 'undefined') {
      return prevClients;
    }

    const id = client.attrs.match(/^#.*?(?=\.)/g)[0].slice(1);

    return {
      ...prevClients,
      [id]: {
        count: id in prevClients ? prevClients[id].count + 1 : 1,
        attrs: client.attrs,
        clientIds:
          typeof prevClients[id]?.clientIds != 'undefined'
            ? prevClients[id].clientIds.add(client.clientId)
            : new Set([client.clientId]),
      },
    };
  }, {});

  removeUnusedElements();

  Object.entries(userElemMap).forEach(([key, values]) => {
    const options = {
      color: userColorMap[Array.from(values?.clientIds)[0]],
      // text: values?.clientIds?.size,
      text: Array.from(userElemMap[key]?.clientIds)
        .map(id => id.split('-')[0].slice(0, 5))
        .join('\n'),
    };
    updateSingleSelect(document.querySelector(`#${key}`), options);
  });
}

function handleClientListUpdate(msg) {
  const clientIds = msg.clientList?.map(c => c.clientId);

  // Delete disconnected client information
  Object.entries(userElemMap).forEach(([id, values]) => {
    for (const clientId of Array.from(values.clientIds)) {
      if (!clientIds?.includes(clientId)) {
        userElemMap[id].clientIds.delete(clientId);
        userElemMap[id].count = userElemMap[id].clientIds.size;
        let elem = document.querySelector(`[data-note-id=${id}]`);
        elem.textContent = userElemMap[id].count;
      }
    }

    if (userElemMap[id].clientIds.size === 0) {
      delete userElemMap[id];
    }
  });

  Object.entries(userColorMap).forEach(([id, _]) => {
    if (!clientIds?.includes(id)) {
      delete userColorMap[id];
    }
  });

  Object.entries(userMultiSelectMap).forEach(([id, _]) => {
    if (!clientIds?.includes(id)) {
      delete userMultiSelectMap[id];
    }
  });

  removeUnusedElements();
}

// function formatUserElem(elem) {
//   const formattedElem = { ...elem };
//   console.log(elem);
//   // #note-L34F5.note.qon-5_2.qoff-3.pname-d.acc-n.oct-5.b40c-8.b12c-2
//   const [, , qOn, qOff, pitchName, accidental, octave] =
//      formattedElem.attrs.split('.');

//   // prettier-ignore
//   formattedElem.attrs = formatAttributes({ qOn, qOff, pitchName, accidental, octave });
//   formattedElem.clientIds = Array.from(elem.clientIds);

//   return JSON.stringify(formattedElem, null, 2);
// }

function formatUserElem(elem) {
  const [, qOn, qOff, pitchName, accidental, octave] = elem?.classList;

  const formattedElem = {};
  // prettier-ignore
  formattedElem.attrs = formatAttributes({ qOn, qOff, pitchName, accidental, octave });
  // formattedElem.clientIds = Array.from(elem.clientIds);

  return JSON.stringify(formattedElem, null, 2);
}

function formatAttributes(attrs) {
  let qOn = parseQuarterTime(attrs.qOn);
  let qOff = parseQuarterTime(attrs.qOff);

  let duration = qOff - qOn;

  switch (duration) {
    case 0.25:
      duration = '1/4';
      break;
    case 0.5:
      duration = '1/2';
      break;
    case 1:
    case 2:
    case 4:
      duration = duration.toString();
      break;
    default:
      log('Uknown time duration value', duration);
      break;
  }

  let accidental = attrs.accidental.split('-')[1];
  switch (accidental) {
    case 'n':
      accidental = 'natural';
      break;
    case 's':
      accidental = 'sharp';
      break;
    case 'f':
      accidental = 'flat';
      break;
    case 'ff':
      accidental = 'double flat';
      break;
    case 'ss':
      accidental = 'double sharp';
      break;
    default:
      log('Uknown accidental value', accidental);
      break;
  }

  return {
    duration,
    pitch: attrs.pitchName.split('-')[1],
    accidental,
    octave: attrs.octave.split('-')[1],
  };
}

function parseQuarterTime(quarterTime) {
  let [qTimeValue, divisor] = quarterTime.split(/\D/).filter(Boolean);
  qTimeValue = parseInt(qTimeValue, 10);
  return quarterTime.includes('_') ? qTimeValue / divisor : qTimeValue;
}

function updateSingleSelect(clientId, target, options) {
  updateUsersDiv(clientId, target, options);

  updateSingleNoteSelect(clientId, target, options);
}

function updateUsersDiv(clientId, target, options) {
  let usersDivs = document.querySelectorAll('.users-div');

  // let usersDiv = [...usersDivs].find(div => div.dataset.noteId === target.id);
  let usersDiv = [...usersDivs].find(div => div.dataset.clientId == clientId);

  if (!usersDiv) {
    usersDiv = document.createElement('div');
    usersDiv.setAttribute('class', 'users-div');
    usersDiv.addEventListener('click', handleSingleNoteSelectClick(usersDivs));
    document.body.appendChild(usersDiv);
  }
  usersDiv.dataset.noteId = target.id;
  usersDiv.dataset.clientId = clientId;

  const { staffY, targetX } = getCoordinates(target);

  usersDiv.style.transform = `translate(${
    targetX - usersDiv.offsetWidth / 4
  }px, ${staffY - 25}px)`;

  usersDiv.innerText = options.text;
}

function updateSingleNoteSelect(clientId, target, options) {
  const noteSelects = Array.from(
    document.querySelectorAll('.single-note-select')
  );
  // let select = noteSelects.find(s => s.dataset.noteId === target.id);
  let select = noteSelects.find(s => s.dataset.clientId == clientId);
  if (!select) {
    select = document.createElement('div');
    select.setAttribute('class', 'single-note-select');
    select.addEventListener('click', handleSingleNoteSelectClick(noteSelects));
    document.body.appendChild(select);
  }
  select.dataset.noteId = target.id;
  select.dataset.clientId = clientId;

  const { staffY, targetX, targetBounds } = getCoordinates(target);
  select.style.transform = `translate(${targetX}px, ${staffY}px)`;

  select.style.width = `${Math.abs(targetX - targetBounds.right)}px`;
  select.style.height = `${Math.abs(staffY - targetBounds.bottom)}px`;
  select.style.backgroundColor = options.color;
}

function handleSingleNoteSelectClick(singleNoteSelects) {
  return event => {
    const elem = event.target;
    const noteInfo = document.querySelector('.note-info');

    if (elem.classList.contains('expanded') && noteInfo) {
      elem.classList.remove('expanded');
      document.body.removeChild(noteInfo);
      return;
    }

    singleNoteSelects.forEach(div => div.classList.remove('expanded'));
    const noteElem = document.querySelector(`#${elem?.dataset?.noteId}`);

    if (!noteInfo) {
      const noteInfo = document.createElement('div');
      noteInfo.classList.add('note-info');
      const pre = document.createElement('pre');
      if (noteElem) {
        pre.textContent = formatUserElem(noteElem);
      }
      noteInfo.appendChild(pre);
      document.body.appendChild(noteInfo);
    } else {
      noteInfo.firstChild.textContent = formatUserElem(noteElem);
    }

    elem.classList.add('expanded');
  };
}

function styleSelectedElem(
  elem,
  options = { color: '', classesToAdd: [], classesToRemove: [] }
) {
  if (typeof options.classesToAdd != 'undefined') {
    elem.classList.add(...options.classesToAdd);
  }
  if (typeof options.classesToRemove != 'undefined') {
    elem.classList.remove(...options.classesToRemove);
  }
  elem.style.color = options.color;
  elem.style.stroke = options.color;
  elem.style.fill = options.color;
}

function getCoordinates(target) {
  const targetBounds = target.getBoundingClientRect();
  const closestStaffElem = target.parentNode?.parentNode;

  let staffBounds;
  if (closestStaffElem?.classList.contains('staff')) {
    staffBounds = closestStaffElem.getBoundingClientRect();
  }

  return {
    staffX: staffBounds?.x ?? targetBounds.x,
    staffY: staffBounds?.y ?? targetBounds.y,
    targetX: targetBounds.x,
    targetY: targetBounds.y,
    targetBounds,
    staffBounds,
  };
}

let selectArea = document.querySelector('#select-area');

window.addEventListener('DOMContentLoaded', () => {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'multi-select-sheet';
  styleSheet.innerHTML = `
  .multi-select-area {
    position: absolute;
    z-index: 20000;
    background-color: blue;
    pointer-events: none;
  }
  `.trim();
  document.head.appendChild(styleSheet);

  // Use a MutationObserver to find out when the score output SVG
  // is added to the DOM and attach mouse event listeners to it.
  // Then, disconnect the observer.
  const mutationObserver = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (mutation.target.id === 'output') {
          if (
            !mutation.target.onmousedown &&
            !mutation.target.onmousemove &&
            !mutation.target.onmouseup
          ) {
            addListenersToOutput(mutation.target);
            observer.disconnect();
          }
        }
      }
    }
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
});

class RubberBandSelection {
  coords = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  };

  isSelecting = false;

  selectAreaElem = document.querySelector('#select-area');

  constructor(coords) {
    this.coords = coords ?? this.coords;

    if (!this.selectAreaElem) {
      this.selectAreaElem = document.createElement('div');
      this.selectAreaElem.id = 'select-area';
      document.body.appendChild(this.selectAreaElem);
    }
  }

  set isSelecting(value) {
    this.isSelecting = Boolean(value);
  }

  /**
   * Update the position new position of the selection area DOM element
   *
   * @returns  The new coordinates of the DOM element
   */
  updateElemPosition() {
    let { left, top, right, bottom } = this.coords;
    let minX = Math.min(left, right);
    let maxX = Math.max(left, right);
    let minY = Math.min(top, bottom);
    let maxY = Math.max(top, bottom);

    this.selectAreaElem.style.transform = `translate(${minX}px, ${minY}px)`;
    this.selectAreaElem.style.width = maxX - minX + 'px';
    this.selectAreaElem.style.height = maxY - minY + 'px';

    return {
      left: minX,
      top: minY,
      right: maxX,
      bottom: maxY,
    };
  }

  /**
   * Update the internal coordinates state of the object with
   * the position of the selection area DOM element
   *
   * @returns  The new coordinates of the current object
   */
  reCalculateCoords() {
    return (this.coords = this.updateElemPosition());
  }

  resetCoords() {
    this.coords = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };
    this.updateElemPosition();
  }

  /**
   * Find every element of the array that is within the bounds of the selection
   * area DOM element
   *
   * @param {Element[]} elements
   * @returns {Element[]}
   */
  selectNoteElements(elements) {
    return elements.filter(elem => {
      const box = elem.getBoundingClientRect();

      return (
        this.coords.left <= box.left &&
        this.coords.top <= box.top &&
        this.coords.right >= box.right &&
        this.coords.bottom >= box.bottom
      );
    });
  }
}

function addListenersToOutput(outputTarget) {
  let startTime, endTime;
  let shouldMultiSelect = false;

  const rbSelection = new RubberBandSelection();

  outputTarget?.addEventListener('mousedown', event => {
    startTime = performance.now();

    rbSelection.isSelecting = true;
    rbSelection.coords.left = event.clientX;
    rbSelection.coords.top = event.clientY;

    const selectedAreas = document.querySelectorAll('.multi-select-area');
  
    const selectToRemove = [...selectedAreas].find(
      elem => elem.dataset.clientId == window.provider.awareness.clientID
    );
    if (selectToRemove) {
      provider.awareness.setLocalStateField('multiSelect', null);
      selectToRemove?.remove();
    }
  });

  // TODO: Use requestAnimationFrame
  document.addEventListener('mousemove', event => {
    if (rbSelection.isSelecting) {
      endTime = performance.now();
      let timePassed = endTime - startTime;

      if (timePassed >= 300) {
        rbSelection.coords.right = event.clientX;
        rbSelection.coords.bottom = event.clientY;

        rbSelection.selectAreaElem.hidden = false;
        rbSelection.updateElemPosition();

        shouldMultiSelect = true;
      }
    }
  });

  document.addEventListener('mouseup', handleMouseUp(window.provider.awareness, window.userData.color));
  
  function handleMouseUp(awareness, color) {
    return event => {
      rbSelection.reCalculateCoords();
      rbSelection.isSelecting = false;
  
      if (shouldMultiSelect) {
        const selectedAreas = document.querySelectorAll('.multi-select-area');
  
        let selectedArea = [...selectedAreas].find(
          elem => elem.dataset.clientId == awareness?.clientID
        );
  
        // TODO: extremely inefficient, selecting every single note element
        const notes = Array.from(document.querySelectorAll('.note, .beam'));
        const selectedNotes = rbSelection.selectNoteElements(notes);
        const coords = calculateMultiSelectCoords(selectedNotes);
        
        if (!selectedArea) {
          selectedArea = document.createElement('div');
          selectedArea.dataset.clientId = awareness?.clientID;
          selectedArea.classList.add('multi-select-area');
          document.body.appendChild(selectedArea);
        }
  
        selectedArea.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
        selectedArea.style.width = `${coords.width}px`;
        selectedArea.style.height = `${coords.height}px`;
        selectedArea.style.backgroundColor = hexToRgbA(color, MULTI_SELECT_ALPHA) ?? 'blue';
  
        awareness?.setLocalStateField('multiSelect', selectedNotes
            .map(note => note.id)
            .filter(id => /^note/g.test(id)));
  
        shouldMultiSelect = false;
      }
  
      rbSelection.resetCoords();
      rbSelection.selectAreaElem.hidden = true;
      startTime = endTime = undefined;
    }
  }
}

function updateMultiSelect(clientState, noteIds) {
  const selectedAreas = document.querySelectorAll('.multi-select-area');

  let selectedArea = [...selectedAreas].find(
    elem => elem.dataset.clientId == clientState.clientId
  );

  if (!noteIds || noteIds.length === 0) {
    selectedArea?.remove();
    return;
  }

  const selector = noteIds?.map(id => '#' + id)?.join(',');
  if (selector) {
    const notes = Array.from(document.querySelectorAll(selector));
    if (notes.length === 0) {
      return;
    }
    const coords = calculateMultiSelectCoords(notes);

    if (!selectedArea) {
      selectedArea = document.createElement('div');
      selectedArea.dataset.clientId = clientState.clientId;
      selectedArea.classList.add('multi-select-area');
      document.body.appendChild(selectedArea);
    }

    selectedArea.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
    selectedArea.style.width = `${coords.width}px`;
    selectedArea.style.height = `${coords.height}px`;
    // selectedArea.style.backgroundColor = clientState?.user?.color ?? 'blue';
    selectedArea.style.backgroundColor = `${hexToRgbA(clientState?.user?.color, MULTI_SELECT_ALPHA)}` ?? 'blue';
  }
}

// https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRgbA(hex, alpha) {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255, alpha ? alpha : '1'].join(',')+')';
  }
  throw new Error('Bad Hex');
}

function calculateMultiSelectCoords(selectedNotes) {
  const coords = selectedNotes.reduce(
    (oldBox, note) => {
      const box = note.getBoundingClientRect();
      return {
        left: Math.min(oldBox.left, box.left),
        top: Math.min(oldBox.top, box.top),
        right: Math.max(oldBox.right, box.right),
        bottom: Math.max(oldBox.bottom, box.bottom),
      };
    },
    { left: Infinity, top: Infinity, right: 0, bottom: 0 }
  );

  return {
    ...coords,
    width: coords.right - coords.left,
    height: coords.bottom - coords.top,
  };
}

function userListDisplay(users) {
  if (!users || !Array.isArray(users)) return;
  let userList = document.querySelector('.user-list');
  const output = document.querySelector('#output');

  if (!userList) {
    userList = document.createElement('div');
    userList.classList.add('user-list');
    document.body.appendChild(userList);
  }

  userList.addEventListener('mouseenter', e => {
    e.target.innerHTML = `${users.join(',\n')}`;
    output.style.opacity = 0.1;
  })
  
  userList.addEventListener('mouseout', e => {
    e.target.innerHTML = userIcon + users.length + ' users';
    output.style.opacity = 1;
  })
  
  let userIcon = '👤 ';
  let userText = ' user'
  if(users.length > 1){
    userIcon = '👥 ';
    userText = ' users';
  }
  userList.innerHTML = userIcon + users.length + userText;

  const menubar = document.getElementById('menubar');
  if (menubar) {
    const menuBox = menubar.getBoundingClientRect();
    userList.style.transform = `translate(${menuBox.right - userList.getBoundingClientRect().width * 1.1}px, ${menuBox.top * 3}px)`
  }
}

