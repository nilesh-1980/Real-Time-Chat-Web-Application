
let selectedUser = localStorage.getItem("chatUser") || "";

let ws = new WebSocket("ws://localhost:8080/ChatApp/chat");

let typingTimer;
let typingTimeout;
let lastMsgDiv = null;

// ✅ JOIN
ws.onopen = function() {
ws.send("join:" + username);
};

// ✅ RECEIVE MESSAGE
ws.onmessage = function(event) {

let data = event.data;

    // ✅ SENT
if(data === "sent"){
if(lastMsgDiv) lastMsgDiv.innerHTML += " <span class='tick'>✔</span>";
}

    // ✅ DELIVERED
else if(data.startsWith("delivered")){
if(lastMsgDiv) lastMsgDiv.innerHTML += " <span class='tick'>✔✔</span>";
}

    // ✅ SEEN
else if(data.startsWith("seen")){
if(lastMsgDiv) lastMsgDiv.innerHTML += " <span class='tick' style='color:blue'>✔✔</span>";
}

    // 🔥 USER LIST
else if (data.startsWith("users:")) {

let users = data.replace("users:", "").split(",");
let list = document.getElementById("userList");
list.innerHTML = "";

users.forEach(function(user) {

if(user.trim() !== "" && user !== username) {

let li = document.createElement("li");
li.innerText = "🟢 " + user;

li.onclick = function() {
selectedUser = user;
localStorage.setItem("chatUser", user);
loadHistory();
};

list.appendChild(li);

if(user === selectedUser) {
loadHistory();
}
}
});
}

    // 🔥 TYPING SHOW
else if(data.startsWith("typing:")){
let sender = data.split(":")[1];
let typingDiv = document.getElementById("typing");

typingDiv.innerText = sender + " typing...";

clearTimeout(typingTimeout);
typingTimeout = setTimeout(()=>{
typingDiv.innerText="";
},1500);
}

    // 🔥 TYPING STOP
else if(data.startsWith("stop:")){
let typingDiv = document.getElementById("typing");
clearTimeout(typingTimeout);
typingDiv.innerText="";
}

    // 🔥 MESSAGE (UPDATED FORMAT)
else {

let parts = data.split("|");

let sender = parts[0];
let msg = parts[1];
let time = parts[2];

let chatBox = document.getElementById("chatBox");

let div = document.createElement("div");

if(sender === username){
div.className = "msg me";
div.innerHTML = "Me: " + msg + 
"<span class='time'>" + time + "</span>";
lastMsgDiv = div;
} else {
div.className = "msg other";
div.innerHTML = sender + ": " + msg + 
"<span class='time'>" + time + "</span>";
}

chatBox.appendChild(div);
chatBox.scrollTop = chatBox.scrollHeight;
}
};


// ✅ LOAD HISTORY (UPDATED FORMAT)
function loadHistory() {

if(!username || !selectedUser) return;

fetch("history?u1=" + username + "&u2=" + selectedUser)
.then(res => res.text())
.then(data => {

let chatBox = document.getElementById("chatBox");
chatBox.innerHTML = "";

let msgs = data.split("\n");

msgs.forEach(m => {

if(m.trim() !== "") {

let p = m.split("|");

let sender = p[0];
let msg = p[1];
let time = p[2];

let div = document.createElement("div");

if(sender === username){
div.className = "msg me";
div.innerHTML = "Me: " + msg + 
"<span class='time'>" + time + "</span>";
} else {
div.className = "msg other";
div.innerHTML = sender + ": " + msg + 
"<span class='time'>" + time + "</span>";
}

chatBox.appendChild(div);
}
});

chatBox.scrollTop = chatBox.scrollHeight;
});
}


// ✅ SEND MESSAGE
function sendMessage() {

let msg = document.getElementById("msg").value;

if(msg.trim() !== "" && selectedUser !== "") {

ws.send("msg:" + username + ":" + selectedUser + ":" + msg);

document.getElementById("msg").value = "";

} else {
alert("Select user first!");
}
}


// ✅ TYPING FUNCTION (ADD THIS)
function typing(){

if(selectedUser === "") return;

ws.send("typing:" + username + ":" + selectedUser);

clearTimeout(typingTimer);

typingTimer = setTimeout(()=>{
ws.send("stop:" + username + ":" + selectedUser);
},1200);
}
