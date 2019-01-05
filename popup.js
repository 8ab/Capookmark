chrome.storage.local.get(["captureUrl", "captureTabUrl", "captureTabTitle"], function (items) {
    var captureUrl = items.captureUrl ? items.captureUrl : [];
    var tabTitle = items.captureTabTitle ? items.captureTabTitle : [];
    var tabUrl = items.captureTabUrl ? items.captureTabUrl : [];
    addElement(captureUrl, tabTitle, tabUrl);
});

function addElement(captureUrl, tabTitle, tabUrl) {
    for (var i = 0; i < captureUrl.length; i++) {
        var div = document.createElement("div");
        div.className = "container";
        //画像URLをidに設定
        div.id = captureUrl[i];
        var a = document.createElement("a");
        a.href = tabUrl[i];
        a.target = "_blank";
        var img = document.createElement("img");
        img.src = captureUrl[i];
        img.alt = tabTitle[i];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.onclick = function () {
            var divId = this.parentElement.id
            //自containerの削除
            var divElt = document.getElementById(divId);
            divElt.parentNode.removeChild(divElt);
            //storage内のデータ削除
            deleteStorageItem(divId);
        }
        a.appendChild(img);
        div.appendChild(a);
        div.appendChild(btn);
        document.body.appendChild(div);
    }
}

function deleteStorageItem(divId) {
    chrome.storage.local.get(["captureUrl", "captureTabUrl", "captureTabTitle"], function (items) {
        var captureUrl = items.captureUrl;
        var tabTitle = items.captureTabTitle;
        var tabUrl = items.captureTabUrl;
        for (var i = 0; i < captureUrl.length; i++) {
            if (captureUrl[i] === divId) {
                captureUrl.splice(i, 1);
                tabTitle.splice(i, 1);
                tabUrl.splice(i, 1);
                chrome.storage.local.set({ captureUrl: captureUrl });
                chrome.storage.local.set({ captureTabUrl: tabTitle });
                chrome.storage.local.set({ captureTabTitle: tabUrl });
                break;
            }
        }
    });
}