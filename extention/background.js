let color = "#3aa757";

chrome.runtime.onInstalled.addListener((reason) => {
	if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
		checkCommandShortcuts();
	}
	chrome.storage.sync.set({ color });
	console.log("Default background color set to %cgreen", `color: ${color}`);
});

// Only use this function during the initial install phase. After
// installation the user may have intentionally unassigned commands.
function checkCommandShortcuts() {
	chrome.commands.getAll((commands) => {
		let missingShortcuts = [];

		for (let { name, shortcut } of commands) {
			if (shortcut === "") {
				missingShortcuts.push(name);
			}
		}

		if (missingShortcuts.length > 0) {
			// Update the extension UI to inform the user that one or more
			// commands are currently unassigned.
		}
	});
}
