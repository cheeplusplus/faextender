/* FAExtender settings */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.Settings = function() {
	var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
	var fileObject = null;
	
	// Open the folder picker
	this.browseDir = function() {
		// Get original directory
		try {
			if ((fileObject == null) && (prefs.prefHasUserValue("extensions.faext.download.directory"))) {
				fileObject = prefs.getComplexValue("extensions.faext.download.directory", Components.interfaces.nsILocalFile);
			}
	
			var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
	
			fp.init(window, "Pick FA Save Folder", Components.interfaces.nsIFilePicker.modeGetFolder);
			if ((fileObject != null) && (fileObject.exists())) {
				fp.displayDirectory = fileObject;
			}
	
			var res = fp.show();
			var newFilePath = null;
	
			if (res == Components.interfaces.nsIFilePicker.returnOK) {
				fileObject = fp.file;
				newFilePath = fp.file.path;
			}
			
			if (newFilePath) {
				// Change the textbox value
				var dir = document.getElementById("dir");
				dir.value = newFilePath;
			}
		}
		catch (e) {
			com.neocodenetworks.faextender.Base.logException(e);
			return;
		}
		
		return true;
	}
	
	// Load the settings
	this.doLoad = function() {
		if ((prefs.getPrefType("extensions.faext.download.directory") != Components.interfaces.nsIPrefBranch.PREF_INVALID) &&
			(prefs.prefHasUserValue("extensions.faext.download.directory"))) {
			var dir = document.getElementById("dir");
			fileObject = prefs.getComplexValue("extensions.faext.download.directory", Components.interfaces.nsILocalFile);
			dir.value = fileObject.path;
		}
		
		if (prefs.getPrefType("extensions.faext.download.newdir") != Components.interfaces.nsIPrefBranch.PREF_INVALID) {
			var makenewdir = document.getElementById("makenewdir");
			makenewdir.checked = prefs.getBoolPref("extensions.faext.download.newdir");
		}
		
		if (prefs.getPrefType("extensions.faext.download.auto") != Components.interfaces.nsIPrefBranch.PREF_INVALID) {
			var autodownload = document.getElementById("autodownload");
			autodownload.checked = prefs.getBoolPref("extensions.faext.download.auto");
		}
		
		if (prefs.getPrefType("extensions.faext.openintabs.delay") != Components.interfaces.nsIPrefBranch.PREF_INVALID) {
			var delaytabs = document.getElementById("delaytabs");
			delaytabs.checked = prefs.getBoolPref("extensions.faext.openintabs.delay");
		}
		
		if (prefs.getPrefType("extensions.faext.hotkeys.enable") != Components.interfaces.nsIPrefBranch.PREF_INVALID) {
			var hotkeys = document.getElementById("hotkeys");
			hotkeys.checked = prefs.getBoolPref("extensions.faext.hotkeys.enable");
		}
		
		if (prefs.getPrefType("extensions.faext.colornotification.enable") != Components.interfaces.nsIPrefBranch.PREF_INVALID) {
			var colornotification = document.getElementById("colornotification");
			colornotification.checked = prefs.getBoolPref("extensions.faext.colornotification.enable");
		}
	
		return true;
	}
	
	// Save the settings
	this.doSave = function() {
		var dir = document.getElementById("dir");
		var makenewdir = document.getElementById("makenewdir");
		var delaytabs = document.getElementById("delaytabs");
		var autodownload = document.getElementById("autodownload");
		var hotkeys = document.getElementById("hotkeys");
		var colornotification = document.getElementById("colornotification");
	
		if (fileObject != null) {
			prefs.setComplexValue("extensions.faext.download.directory", Components.interfaces.nsILocalFile,fileObject);
		}
		
		prefs.setBoolPref("extensions.faext.download.newdir", makenewdir.checked);
		prefs.setBoolPref("extensions.faext.download.auto", autodownload.checked);
		prefs.setBoolPref("extensions.faext.openintabs.delay", delaytabs.checked);
		prefs.setBoolPref("extensions.faext.hotkeys.enable", hotkeys.checked);
		prefs.setBoolPref("extensions.faext.colornotification.enable", colornotification.checked);
		
		// Immediately save preferences
		var prefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		prefService.savePrefFile(null);
		
		return true;
	}
}