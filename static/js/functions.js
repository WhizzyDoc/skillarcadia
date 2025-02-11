//const base_image_url = `https://127.0.0.1:8000`;
const base_image_url = `https://riganhub.pythonanywhere.com`;
const base_url = `${base_image_url}/api/`;
var auth_token = localStorage.skill_auth_token
/* Navigation bar */

function digify(n, decimal=false) {
  a = Number(n)
  if(decimal) {
    return a.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
  }
  else{
    return a.toLocaleString()
  }
  
}
function datify(date, time=false) {
  if(time) {
    return `${new Date(date).toDateString()} ${new Date(date).toLocaleTimeString()}`
  }
  else {
    return `${new Date(date).toDateString()}`;
  }
}
function truncateWord(str, n) {
  trunc_str = str.substring(0, n);
  if(str.length > n) {
    trunc_str += "...";
  }
  return trunc_str
}
function deslugify(str) {
  var splitted_str = str.split('_');
  var joined_str = splitted_str.join(' ')
  return joined_str
}

function pushNotification(type, text, time, event=null) {
  var t = {
    n_error: "./static/image/error.png",
    n_info: "./static/image/info.png",
    n_network: "./static/image/network.png",
    n_success: "./static/image/success.png",
    n_warning: "./static/image/warning.jpeg"
  }
  Toastify({
    text: text,
    duration: time, // -1 for permanent
    className: `${type} w-card`,
    //destination: "#",
    newWindow: true,
    close: true,
    avatar: t[type], // image to br shown before text
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      //background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    offset: {
      x: '0px',
      y: '-10px',
    },
    //callback: function(){}, // when toast is dismissed
    ariaLive: "polite",
    oldestFirst: true,
    escapeMarkup: false, // escape markup syntax
    onClick: event // Callback after click
  }).showToast();
}

function check_response(res) {
  if(((res.status).toString())[0] == "4" || ((res.status).toString())[0] == "5") {
    pushNotification("n_error", `Error ${res.status}: ${res.statusText}`, 5000)
  }
}

function base64UrlToBuffer(base64) {
  let binary = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
  let len = binary.length;
  let buffer = new Uint8Array(len);
  for(let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer
}

function bufferToBase64Url(buffer) {
  let binary = "";
  let len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

