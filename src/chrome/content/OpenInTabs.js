/* Open in tabs */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.OpenInTabs = {
	Bind: function(doc) {
		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);

		// Collect all view page links
		var tabLinks = jQuery("a[href*='/view/']");
		
		// Exit if no valid links were found so we don't inject
		if (tabLinks.length == 0) { return; }

		// Check to make sure if the injection point already exists
		var openLink = jQuery("#__ext_fa_opentabs");
		if (openLink.length > 0) { return; }

		// Create Open in Tabs link
		var openLink = jQuery("<a>").attr("id", "__ext_fa_opentabs").attr("href", "javascript:void(0);").text("Open images in tabs");

		// Find our tabs open injection point (submissions then general)
		var tabsOpenInsertPos = jQuery("#messagecenter-submissions div.actions");
		if (tabsOpenInsertPos.length > 0) {
			tabsOpenInsertPos.first().after(openLink);
		}
		else {
			// Injection paths to test
			var testPaths = [
				"id('gallery')/table[2]/tbody/tr/td/table/tbody/tr[1]/td[2]", // Gallery
				"id('scraps')/table[2]/tbody/tr/td/table/tbody/tr[1]/td[2]", // Scraps
				"id('favorites')/table[2]/tbody/tr/td/table/tbody/tr[1]/td[2]" // Favorites
			];
			
			// Iterate through each test path until we find a valid one
			for (var i = 0; i < testPaths.length; i++) {
				tabsOpenInsertPos = jQuery(com.neocodenetworks.faextender.Base.getXPath(doc, testPaths[i]));
				if (tabsOpenInsertPos.length > 0) break;
			}
			
			// Abort if not found
			if (tabsOpenInsertPos.length == 0) {
				com.neocodenetworks.faextender.Base.logError("Bad tabs open xpath, aborting");
				return;
			}
			
			tabsOpenInsertPos.append("<br /><br />").append(openLink);
		}
		
		openLink.click(function() {
			// Find the links, use a delay if configured
			var queueTimeDelay = prefs.getIntPref("extensions.faext.openintabs.delaytime");
			var useQueueTimer = prefs.getBoolPref("extensions.faext.openintabs.delay");
			var queueTime = queueTimeDelay;

			if (queueTimeDelay < 1) {
				useQueueTimer = false;
			}

			for (var i = 0; i < tabLinks.length; i++) {
				thisLink = tabLinks[i];
				if (useQueueTimer) {
					gBrowser.addTab("chrome://faextender/content/TabDelay.xul?url=" + encodeURI(thisLink) + "&delay=" + queueTime);
					queueTime += queueTimeDelay;
				}
				else {
					gBrowser.addTab(thisLink);
				}
			}
		});
	}
}

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.OpenInTabs.Bind, ["/gallery/", "/scraps/", "/favorites/", "/msg/submissions/"]);