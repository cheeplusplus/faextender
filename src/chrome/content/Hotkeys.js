/* Hotkey support */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.Hotkeys = {
	Bind: function(doc) {
		// Require pref to enable
		var prefs = com.neocodenetworks.faextender.Base.getPrefsService();
		if (!prefs.getBoolPref("extensions.faext.hotkeys.enable")) return;
		
		// Get jQuery
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);
		com.neocodenetworks.faextender.Base.loadjQueryHotkeys(doc);
		
		var prevLink = null;
		var prevHref = null;		
		var nextLink = null;
		var nextHref = null;

		// Check for view page
		var miniTarget = jQuery(".minigalleries .minigallery-title");
		if (miniTarget.length > 0) {
			// View page
			prevLink = miniTarget.prev().find("a");
			nextLink = miniTarget.next().find("a");
		}/* else {
			// Gallery pages - TODO: Support
			prevLink = jQuery(".pagination a.left");
			nextLink = jQuery(".pagination a.right");
		}*/

		if (prevLink && prevLink.length > 0) {
			prevHref = prevLink[0].href;
		}
		if (prevLink && nextLink.length > 0) {
			nextHref = nextLink[0].href;
		}

		// Previous link
		var prevClick = function() {
			if (prevHref) doc.location.href = prevHref;
		}
		
		jQuery(doc).bind("keydown", "left", prevClick);
		jQuery(doc).bind("keydown", "p", prevClick);
		
		// Next
		var nextClick = function() {
			if (nextHref) doc.location.href = nextHref;
		}
		
		jQuery(doc).bind("keydown", "right", nextClick);
		jQuery(doc).bind("keydown", "n", nextClick);
		
		// Favorite
		jQuery(doc).bind("keydown", "f", function() {
			var href = jQuery("a[href^='/fav/']:contains('+Add to Favorites')").attr("href");
			if (href) doc.location.href = "https://www.furaffinity.net" + href;
		});
		
		// Save
		jQuery(doc).bind("keydown", "s", function() {
			jQuery("a#__ext_fa_imgdl").click();
		});
	}
}

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.Hotkeys.Bind, ["/view/", "/full/"]);
