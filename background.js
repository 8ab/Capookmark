// 右クリックメニュー追加
var ContextMenus = new function () {
    var items = {};
    var callbacks = {};

    this.setItems = function (aItems) {
        aItems.forEach(function (item) {
            callbacks[item.id] = item.onclick;
            item.onclick = null;
            items[item.id] = item;
        });
    };

    this.create = function () {
        Object.keys(items).forEach(
            function (key) {
                chrome.contextMenus.create(items[key]);
            }
        );
    };

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        callbacks[info.menuItemId](info, tab);
    });
};

ContextMenus.setItems([
    {
        title: "Capookmark",
        contexts: ["page"],
        type: "normal",
        id: 'Capookmark',
        onclick: addCapookmark()
    }
]);

chrome.runtime.onInstalled.addListener(ContextMenus.create);

//ブックマーク追加
function addCapookmark() {
    return function (info, tab) {
        chrome.tabs.captureVisibleTab(function (screenshotUrl) {
            chrome.storage.local.get(["captureUrl"], function (items) {
                var captureUrl = items.captureUrl ? items.captureUrl : [];
                captureUrl.push(screenshotUrl);
                chrome.storage.local.set({ captureUrl: captureUrl });
            });
            chrome.storage.local.get(["captureTabUrl"], function (items) {
                var captureTabUrl = items.captureTabUrl ? items.captureTabUrl : [];
                captureTabUrl.push(tab.url);
                chrome.storage.local.set({ captureTabUrl: captureTabUrl });
            });
            chrome.storage.local.get(["captureTabTitle"], function (items) {
                var captureTabTitle = items.captureTabTitle ? items.captureTabTitle : [];
                captureTabTitle.push(tab.title);
                chrome.storage.local.set({ captureTabTitle: captureTabTitle });
            });
        })
    }
};
