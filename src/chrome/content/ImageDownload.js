/* Image download */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.ImageDownload = {
	Bind: function(doc) {
		var trimString = function(val) {
			return val.replace(/^\s*/, "").replace(/\s*$/, "");
		}

		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);

		// Use Download link
		var url = jQuery("a:contains('Download')", jQuery("#submission"));
		if (url.length == 0) {
			// No download at all
			com.neocodenetworks.faextender.Base.logError("Could not find download link, aborting");
			return;
		}

		url = url.attr("href");
		
		var filelessurl = url.substr(0, url.lastIndexOf("/"));
		var artist = filelessurl.substr((filelessurl.lastIndexOf("/") + 1));

		// Check to see for non-pictures
		if ((artist == "stories") || (artist == "poetry") || (artist == "music")) {
			// Get artist name for non-pictures
			var type = filelessurl.substr(0, filelessurl.lastIndexOf("/"));
			var pre = filelessurl.substr(type.lastIndexOf("/") + 1);
			artist = pre.substr(0, pre.lastIndexOf("/"));
		}
		
		// Set up ID links
		var downloadLink = jQuery("#__ext_fa_imgdl");
		var downloadSpan = jQuery("#__ext_fa_imgdlsp");

		// Check to make sure we haven't already injected
		if ((downloadLink.length > 0) || (downloadSpan.length > 0)) {
			return;
		}

		// Find our download text injection point
		var downloadInsertPos;
		downloadInsertPos = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, "id('submission')/table/tbody/tr[1]/td/table/tbody/tr[1]/td"));
		if (downloadInsertPos.length == 0) {
			// Can't find either
			com.neocodenetworks.faextender.Base.logError("Bad download inject xpath, aborting");
			return;
		}
		
		// Inject text
		downloadLink = jQuery("<a>").attr("href", "javascript:void(0);").attr("id", "__ext_fa_imgdl").text("Download now");
		downloadSpan = jQuery("<span>").attr("id", "__ext_fa_imgdlsp").append(downloadLink);
		downloadInsertPos.prepend(jQuery("<span>").append("[").append(downloadSpan).append("]"));

		var chgMsg = function(text, alt) {
			downloadSpan.html(text);
			downloadSpan.attr("title", alt);
		};

		if (!prefs.prefHasUserValue("extensions.faext.download.directory")) {
			// Not yet set up
			var configLink = jQuery("<a>").attr("id", "__ext_fa_config").attr("href", "javascript:void(0);").text("FAExtender not configured.");
			downloadSpan.html(configLink).attr("title", "Please click to configure.");
			
			configLink.click(function() {
				if (!document.getElementById("faConfigDlg")) {
					// Show configure window
					window.openDialog("chrome://faextender/content/Settings.xul", "faConfigDlg", "chrome, dialog, modal, resizable=no").focus();
					
					// Re-fire after configuration
					chgMsg("Please reload the page.", "Please reload the page to use the new settings.");
				}
			});
			return;
		}
		
		// Pretty artist name support
		if (prefs.prefHasUserValue("extensions.faext.download.prettyartist")) {
			var artistName = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, "id('submission')/table/tbody/tr[1]/td/table/tbody/tr[2]/td/table[2]/tbody/tr[1]/td[1]/a")).text();
			if (artistName) {
				artist = artistName;
			}
			else {
				com.neocodenetworks.faextender.Base.logError("Unable to retrieve pretty artist name, falling back on default");
			}
		}

		var fileObject = prefs.getComplexValue("extensions.faext.download.directory", Components.interfaces.nsILocalFile);

		if (prefs.getBoolPref("extensions.faext.download.newdir")) {
			fileObject.append(artist);
		}

		var fname = url.substr(url.lastIndexOf("/") + 1);

		var fext = fname.substr(fname.lastIndexOf(".") + 1);
		if (fext == "") {
			chgMsg("Error: No extension", "This file does not have an file extension. Please save it manually.");
			return;
		}

		fileObject.append(fname);

		if (fileObject.exists()) {
			chgMsg("File already exists.","File " + fname + " already exists.");
			return;
		}
		
		// Store retrieval info directly into link for later
		downloadLink.data("faext", {artist: artist, fname: fname, url: url, downloadSpan: downloadSpan, referrer: doc.location.href});

		// Handle link onclick event
		downloadLink.click(com.neocodenetworks.faextender.ImageDownload.DownloadClickEvent);
		//automatic instant submission-download when loading submission
		if (prefs.getBoolPref("extensions.faext.download.instantly")) {
			downloadLink.click();
		}
	},
	
	DownloadClickEvent: function(e) {
		var thisLink = e.target;
		var doc = thisLink.ownerDocument;
	
		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);
		
		var info = jQuery(thisLink).data("faext");
		var artist = info.artist;
		var fname = info.fname;
		var url = info.url;
		var referrer = info.referrer;
		var chgMsg = function(text,alt) {
			info.downloadSpan.html(text);
			info.downloadSpan.attr("title", alt);
		};
	
		try {
			var fileObject = prefs.getComplexValue("extensions.faext.download.directory", Components.interfaces.nsILocalFile);

			if (prefs.getBoolPref("extensions.faext.download.newdir")) {
				fileObject.append(artist);
			}

			try {
				if (!fileObject.exists()) {
					fileObject.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755);
				}
			}
			catch(err) {
				chgMsg("Could not create directory.", "Could not create directory '" + fileObject.path + "'");
				return;
			}

			var sourceDir = fileObject.clone();
			
			var tempObject = sourceDir.clone();
			tempObject.append(fname + ".faextmp");
			
			fileObject.append(fname);

			try {
				if (fileObject.exists()) {
					chgMsg("File already exists.", "File " + fname + " already exists.");
					return;
				}
				
				if (tempObject.exists()) {
					tempObject.remove();
				}
				else {
					tempObject.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0644);
				}
			}
			catch(err) {
				chgMsg("Could not create file.", "Could not create file '" + fileObject.path +"'");
				return;
			}

			var cachekey = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
			var urifix = Components.classes['@mozilla.org/docshell/urifixup;1'].getService(Components.interfaces.nsIURIFixup);
			var persist = Components.classes['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Components.interfaces.nsIWebBrowserPersist);

			var uri = urifix.createFixupURI(url, 0);
			var referrer = urifix.createFixupURI(referrer, 0);

			cachekey.data = url;

			persist.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_FROM_CACHE | Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_CLEANUP_ON_FAILURE;

			// Add a progress for downloading files
			persist.progressListener = {
				onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
					if (aMaxTotalProgress == -1) {
						chgMsg("Downloading...", "Downloading file (progress not availiable).");
					}
					else {
						var percent = Math.round((aCurTotalProgress / aMaxTotalProgress) * 100);
						chgMsg("Downloading: " + percent + "%", "Downloading file...");
					}
				},
				onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) {
					if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)
					{
						var response = aRequest.QueryInterface(Components.interfaces.nsIHttpChannel);
						if (response.requestSucceeded) {
							chgMsg("File saved.","File " + fname + " saved.");
							
							if (fileObject.exists()) {
								// Somehow it got saved already, don't be destructive
								tempObject.remove();
							}
							else {
								tempObject.moveTo(sourceDir, fname);
							}

							// Double-check to make sure Open Folder runs
							com.neocodenetworks.faextender.OpenFolder.ForView(doc);
						}
						else {
							// Server returned an error
							chgMsg("Error: " + response.responseStatus + " " + response.responseStatusText, "The server returned an error.");
							
							// Delete the file
							tempObject.remove(false);
						}
					}
				}
			}

			persist.saveURI(uri, cachekey, referrer, null, null, tempObject);
		}
		catch(err) {
			com.neocodenetworks.faextender.Base.logException(err);
			return;
		}
	}
}

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.ImageDownload.Bind, ["/view/", "/full/"]);