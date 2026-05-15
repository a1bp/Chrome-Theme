const enableToggle = document.getElementById('enable-toggle') as HTMLInputElement;
const openSettingsBtn = document.getElementById('open-settings') as HTMLElement;

// Load initial state
chrome.storage.local.get(['extensionEnabled'], (res) => {
    // Default to true if not set
    const enabled = res.extensionEnabled !== false;
    enableToggle.checked = enabled;
});

// Handle toggle
enableToggle.addEventListener('change', () => {
    const isEnabled = enableToggle.checked;
    chrome.storage.local.set({ extensionEnabled: isEnabled });
});

// Handle open settings
openSettingsBtn.addEventListener('click', () => {
    // Open the new tab page
    chrome.tabs.create({ url: 'chrome://newtab' });
});
