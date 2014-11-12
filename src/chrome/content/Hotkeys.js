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
		
		// Previous link
		var prevClick = function() {
			var href = jQuery("a.prev")[0].href;
			if (href) doc.location.href = href;
		}
		
		jQuery(doc).bind("keydown", "left", prevClick);
		jQuery(doc).bind("keydown", "p", prevClick);
		
		// Next
		var nextClick = function() {
			var href = jQuery("a.next")[0].href;
			if (href) doc.location.href = href;
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

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.Hotkeys.Bind, "/view/");
