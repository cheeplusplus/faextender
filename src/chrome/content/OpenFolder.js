/* Open folder */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.OpenFolder = {
	// Open Folder from inside view page
	ForView: function(doc) {
		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);

		var components = com.neocodenetworks.faextender.Base.getDownloadUrlComponents(doc, jQuery);
		if (!components) return;
		
		if (!prefs.prefHasUserValue("extensions.faext.download.directory")) {
			// Not yet set up
			return;
		}

		var url = components.href;
		var path = components.pathname;
		var filelessurl = path.substr(0, path.lastIndexOf("/"));
		var artist = filelessurl.substr(filelessurl.lastIndexOf("/") + 1);

		// Check to see for non-pictures
		if ((artist == "stories") || (artist == "poetry") || (artist == "music")) {
			// Get artist name for non-pictures
			var type = filelessurl.substr(0, filelessurl.lastIndexOf("/"));
			var pre = filelessurl.substr(type.lastIndexOf("/") + 1);
			artist = pre.substr(0, pre.lastIndexOf("/"));
		}
		else
		{
			// Make sure the file is the full-size image
			path = path.replace(".half","");
		}

		if (!path) {
			// No download at all
			return;
		}

		// Make sure the artist isn't blank
		if (artist == "") {
			return;
		}

		// Make sure the file is the full-size image
		path = path.replace(".half", "");

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
			fileObject.append(artist);
		}

		folderWithoutFN.initWithFile(fileObject);

		var fname = path.substr(path.lastIndexOf("/") + 1);
		fileObject.append(fname);

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
		var folderOpenInsertPos = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, "id('submission')/table/tbody/tr[1]/td/table/tbody/tr[2]/td/table[2]/tbody/tr[1]/td[1]"));
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

		var url = doc.location.pathname;

		// Only add this if we have seperate artist directories set, otherwise its pointless
		if (!prefs.getBoolPref("extensions.faext.download.newdir")) return;

		// Get the artist name safely out of the URL
		var artist = url.substr(6);
		var lastSlash = artist.lastIndexOf("/");
		if (lastSlash > 0) {
			artist = artist.substr(0, lastSlash);
		}

		// Make sure the artist isn't blank
		if (artist == "") {
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
		var folderOpenInsertPos = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, "/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td/table/tbody/tr/td/div"));
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

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.OpenFolder.ForView, "/view/");
com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.OpenFolder.ForUser, "/user/");