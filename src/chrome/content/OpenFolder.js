/* Open folder */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.OpenFolder = {
	// Open Folder from inside view page
	ForView: function(doc) {
		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);

		if (!prefs.prefHasUserValue("extensions.faext.download.directory")) {
			// Not yet set up
			return;
		}

		var components = com.neocodenetworks.faextender.Base.getDownloadUrlComponents(doc, jQuery);
		if (!components) return;
		
		// Set up ID links
		var openFolderLink = jQuery("#__ext_fa_opendir");

		// Check to make sure if the injection point already exists
		if (openFolderLink.length > 0) {
			return;
		}

		// See if the file or folder we want to open even exists
		var fileObject = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var folderWithFN = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var folderWithoutFN = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

		var folder = prefs.getComplexValue("extensions.faext.download.directory",Components.interfaces.nsILocalFile);
		fileObject.initWithFile(folder);

		if (prefs.getBoolPref("extensions.faext.download.newdir")) {
			fileObject.append(components.artist);
		}

		folderWithoutFN.initWithFile(fileObject);

		fileObject.append(components.filename);

		folderWithFN.initWithFile(fileObject);

		// Check to see if the artist subdirectory exists, if not, return the main directory
		if (folderWithFN.exists()) {
			fileObject = folderWithFN;
		}
		else if (folderWithoutFN.exists()) {
			fileObject = folderWithoutFN;
		}
		else {
			return;
		}
		
		openFolderLink = jQuery("<a>").attr("id", "__ext_fa_opendir").attr("href", "javascript:void(0);").attr("title", "Open the target folder in your shell.").text("Open folder");

		// Find our folder open injection point
		var folderOpenInsertPos = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, "/html/body/div/div[3]/div/table/tbody/tr[1]/td/table/tbody/tr[2]/td/table/tbody/tr[1]/td[1]"));
		if (folderOpenInsertPos.length > 0) {
			// Inject text
			folderOpenInsertPos.append("[").append(openFolderLink).append("]");
		}
		else {
			com.neocodenetworks.faextender.Base.logError("Bad folder open xpath, aborting");
			return;
		}

		openFolderLink.click(function() {
			// See if the file exists first
			if (!fileObject.exists()) {
				openFolderLink.remove();
				return;
			}

			fileObject.reveal();
		});
	},

	// Open Folder from inside user page
	ForUser: function(doc) {
		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);

		// Only add this if we have seperate artist directories set, otherwise its pointless
		if (!prefs.getBoolPref("extensions.faext.download.newdir")) return;

		// Get the artist name safely out of the URL
		var url = doc.location.pathname;
		var artist = url.substr(6).replace("/", "");
		if (!artist) {
			return;
		}

		// Set up ID links
		var openFolderLink = jQuery("#__ext_fa_opendir");

		// Check to make sure if the injection point already exists
		if (openFolderLink.length > 0) {
			return;
		}

		var folder = prefs.getComplexValue("extensions.faext.download.directory", Components.interfaces.nsILocalFile);

		var fileObject = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		fileObject.initWithFile(folder);
		fileObject.append(artist);

		// Check to see if the artist subdirectory exists, if not, abort
		if (!fileObject.exists()) {
			return;
		}

		openFolderLink = jQuery("<a>").attr("id", "__ext_fa_opendir").attr("href", "javascript:void(0);").attr("title", "Open the target folder in your shell.").text("Open folder");

		// Find our folder open injection point
		var folderOpenInsertPos = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, "/html/body/div/div[3]/table[1]/tbody/tr/td/div"));
		if (folderOpenInsertPos.length > 0) {
			// Inject text
			jQuery("<b>").append(openFolderLink).appendTo(folderOpenInsertPos);
		}
		else {
			com.neocodenetworks.faextender.Base.logError("Bad folder open xpath, aborting");
			return;
		}

		openFolderLink.click(function() {
			// Make sure the folder still exists
			if (!fileObject.exists()) {
				openFolderLink.remove();
				return;
			}

			fileObject.reveal();
		});
	}
}

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.OpenFolder.ForView, ["/view/", "/full/"]);
com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.OpenFolder.ForUser, "/user/");