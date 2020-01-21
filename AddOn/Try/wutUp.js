const callThisFunction = function () {
    //let temp = document.querySelector('[title="Ardhangini ♥"]').value;
    let temp = document.getElementsByClassName("_19RFN _1ovWX _F7Vk");
    let nameArray = [];
    if (temp && temp.length !== 0) {
        for (const element of temp) {
            if (element.title) nameArray.push(element.title)
        }
    }
    chrome.runtime.sendMessage({ "message": "list_action", "list": nameArray }) 
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
            callThisFunction();
        } else if(request.message === "clicked_enter"){
            if(request.userList && request.userList.length && request.sendThis) sendMessage(request.userList, request.sendThis);
        }
    }
);

const sendMessage = function(listContacts, msg) {
    //let listHolder = document.getElementById("pane-side").firstChild.firstChild.firstChild.childNodes[0].firstChild.firstChild.childNodes[1].firstChild.firstChild.firstChild.title;
    let contact = document.getElementById("pane-side").firstChild.firstChild.firstChild.childNodes[0];
    box = contact.getBoundingClientRect();
    document.elementFromPoint(box.x + 10, box.y + 10).click();
    //eventFire(contact, "mousedown");
}

const eventFire = (el, etype) => {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(etype, true, true, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
    el.dispatchEvent(evt);
}