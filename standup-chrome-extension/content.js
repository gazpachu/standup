sessionStorage.getScreenMediaJSExtensionId = chrome.runtime.id;

var isInstalledNode = document.createElement('div');
isInstalledNode.id = 'extension-is-installed';
document.body.appendChild(isInstalledNode);
