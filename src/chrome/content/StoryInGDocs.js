/* Story in GDocs */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.StoryInGDocs = {
	Bind: function(doc) {
		var jQuery = com.neocodenetworks.faextender.Base.getjQuery(doc);

		// Reject if already injected
		if (jQuery("#__ext_fa_gdoclink").length > 0) return;

		// Find injection location
		var downloadLink = com.neocodenetworks.faextender.Base.getDownloadLink(doc, jQuery);
		if (!downloadLink) return;

		var url = com.neocodenetworks.faextender.Base.getDownloadUrl(doc, jQuery);
		if (!url) return;

		// Make sure this is a story
		if (url.indexOf("/stories/") < 0) return;

		// Get the parent <b>
		var dLinkContainer = downloadLink.parent();

		// Append new link
		jQuery("<span> | <b><a id=\"__ext_fa_gdoclink\" href=\"https://docs.google.com/viewer?url=" + encodeURIComponent(url) + "\">View in GDocs</a></b></span>").insertAfter(dLinkContainer);
	}
}

com.neocodenetworks.faextender.Base.registerTarget(com.neocodenetworks.faextender.StoryInGDocs.Bind, ["/view/", "/full/"]);