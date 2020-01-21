let mainUsers = [];
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "list_action") {
            createList(request.list);
        }
    }
);
createList = function (arr) {
    mainUsers = arr;
    let ul = document.createElement('ul');
    document.getElementById('myItemList').appendChild(ul);
    arr.forEach(function (item) {
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += '<h5> <input type="checkbox" id="'+ item +'"> &nbsp; ' + item + '</h5>';
    });
};
uploadMessage = function(event) {
    if(event && event.keyCode === 13) {
        let senderUser = [];
        document.querySelectorAll('li').forEach(element => {
            for (let index = 0; index < mainUsers.length; index++) {
                if(element.firstChild.children[0].id === mainUsers[index] && element.firstChild.children[0].checked) senderUser.push(mainUsers[index]);
            }
        });
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_enter", "userList": senderUser, "sendThis": event.target.value });
        });
    }
};
document.getElementById('msgText').addEventListener('keypress', uploadMessage);
window.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { "message": "clicked_browser_action" });
    });
});