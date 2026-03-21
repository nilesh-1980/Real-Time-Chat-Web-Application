<%@ page language="java" contentType="text/html; charset=UTF-8"%>

<%
String user = request.getParameter("username");
if(user != null){
    session.setAttribute("username", user);
}
%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Chat App</title>

<style>
body { margin:0; font-family:Arial; }
.header { background:#075e54; color:white; padding:10px; display:flex; }
.container { display:flex; height:100vh; }
#userList { width:200px; background:#fff; padding:10px; }
.chatArea { flex:1; display:flex; flex-direction:column; }
#chatBox { flex:1; padding:10px; background:#e5ddd5; overflow:auto; }
.msg { padding:8px; margin:5px; border-radius:10px; max-width:60%; }
.me { background:#dcf8c6; margin-left:auto; }
.other { background:white; }
.inputArea { display:flex; padding:10px; }
input { flex:1; padding:10px; }
</style>
</head>

<body>

<div class="header">
<b><%= session.getAttribute("username") %></b>
</div>

<div class="container">

<ul id="userList"></ul>

<div class="chatArea">

<div id="chatBox"></div>

<div class="inputArea">
<input id="msg" onkeydown="if(event.key==='Enter') send()">
<button onclick="send()">Send</button>
</div>

</div>
</div>

<script>

const username = "<%=session.getAttribute("username")%>";
let selectedUser = "";

let ws = new WebSocket("ws://localhost:8080/ChatApp/chat");

// JOIN
ws.onopen = ()=> ws.send("join:"+username);

// RECEIVE
ws.onmessage = (e)=>{

let d = e.data;

// USER LIST
if(d.startsWith("users:")){
let u = d.replace("users:","").split(",");
let list = document.getElementById("userList");

list.innerHTML="";

u.forEach(x=>{
if(x && x!==username){
let li=document.createElement("li");
li.innerText="🟢 "+x;

li.onclick=()=>{
selectedUser=x;
load();
};

list.appendChild(li);
}
});
}

// MESSAGE
else{
let parts=d.split("|");

let sender=parts[0];
let msg=parts[1];

let box=document.getElementById("chatBox");
let div=document.createElement("div");

if(sender===username){
div.className="msg me";
div.innerText="Me: "+msg;
}else{
div.className="msg other";
div.innerText=sender+": "+msg;
}

box.appendChild(div);
box.scrollTop=box.scrollHeight;
}
};

// SEND
function send(){
let m=document.getElementById("msg").value;

if(m && selectedUser){
ws.send("msg:"+username+":"+selectedUser+":"+m);
document.getElementById("msg").value="";
}
}

// LOAD HISTORY
function load(){
fetch("history?u1="+username+"&u2="+selectedUser)
.then(r=>r.text())
.then(d=>{
let box=document.getElementById("chatBox");
box.innerHTML="";

d.split("\n").forEach(x=>{
if(!x) return;

let p=x.split("|");

let sender=p[0];
let msg=p[1];

let div=document.createElement("div");

if(sender===username){
div.className="msg me";
div.innerText="Me: "+msg;
}else{
div.className="msg other";
div.innerText=sender+": "+msg;
}

box.appendChild(div);
});
});
}

</script>

</body>
</html>