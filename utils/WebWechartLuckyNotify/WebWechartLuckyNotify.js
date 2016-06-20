(function (win, undefined) {
    "use strict";
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver,
        filterRecords = [],
        chartRoomName = null,
        audio = null,
        parentEle = document.querySelector ('#J_NavChatScrollBody>div').querySelectorAll ('.chat_item.slide-left'),
        callback = function (records) {
        filterRecords = records.filter (function (item, index, array) {
            return item.target.parentNode.classList[0] === "ng-binding" //之前有消息
					|| item.addedNodes.length === 2;//之前没有消息,不存在消息节点
        });
        filterRecords.map (function (record) {
            if (record.target.data && record.target.data.indexOf ("收到紅包，") >= 0) {
                chartRoomName = record.target.parentElement.parentNode.parentNode.querySelector (".nickname").querySelector ("span").innerText;
                notify (chartRoomName);
            }
            else if (record.target.innerText && record.target.innerText.indexOf ("收到紅包，") >= 0) {
                chartRoomName = record.target.children[0].innerText;
                notify (chartRoomName);
            }
        });
    },
        options = {
        'childList': true,
        'subtree': true,
        'characterData': true
    },
        observer = new MutationObserver (callback),
        notify = function (chartRoomName) {
        if (window.Notification) {
            if (Notification.permission === 'granted') {
                var notification = new Notification ('红包提醒  ', {
                    body: chartRoomName + " 发红包啦~"
                });
            }
        }
        try {
            audio = audio || new Audio ("https://wx.qq.com/zh_CN/htmledition/v2/sound/msg.mp3");
            audio.play ();
        }
        catch (ex) {
        }
    };
    parentEle.forEach (function (ele, index, array) {
        observer.observe (ele, options);
    });
}) (window);
