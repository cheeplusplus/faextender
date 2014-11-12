/* Open in tabs delay */

if (!com) { var com = {}; }
if (!com.neocodenetworks) { com.neocodenetworks = {}; }
if (!com.neocodenetworks.faextender) { com.neocodenetworks.faextender = {}; }

com.neocodenetworks.faextender.TabDelay = function() {
	// http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript/901144#901144
	function queryString(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results == null)
			return "";
		else
			return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	var countdownURL = "";
	var countdownTimer = 0;
	var urlLabel = null;
	var delayLabel = null;
	
	function tabDelayOnLoad() {
		// URL parameters:
		//  url - Destination URL (encoded)
		//  delay - Time to count down
		
		countdownURL = queryString("url");
		countdownTimer = queryString("delay");
		urlLabel = document.getElementById("redirURL");
		delayLabel = document.getElementById("redirTime");
		
		if (countdownURL == "false") {
			urlLabel.textContent = "Error: Invalid URL";
			return;
		}
		else if ((countdownTimer == "false") || (countdownTimer < 1)) {
			//delayLabel.textContent = "Error: Invalid delay time";
			//return;
			
			// Instead of aborting with an error, redirect immediately
			countdownTimer = 0;
		}
	
		urlLabel.textContent = countdownURL;
		urlLabel.href = countdownURL;
	
		tabDelayCountdown();
	}
	
	function tabDelayCountdown() {
		if (countdownTimer > 0) {
	
			document.title = "FurAffinity Redirecting in " + countdownTimer;
			labelText = "in " + countdownTimer;
			
			if (countdownTimer == 1) {
				labelText += " second.";
			}
			else {
				labelText += " seconds.";
			}
			
			delayLabel.textContent = labelText;
			countdownTimer -= 1;
			setTimeout(tabDelayCountdown, 1000);
		}
		else {
			window.location.href = countdownURL;
		}
	}
	
	// Start
	tabDelayOnLoad();
}