var container = document.querySelector('.container');
var dateDOM = document.querySelector('.date');
var timeDOM = document.querySelector('.time');
var loaded = false;
var today = new Date(), dayOFWeek;

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THRUSDAY", "FRIDAY", "SATURDAY"];

function buildDate() {
  var month = months[today.getMonth()];
  var day = today.getDate();
  dayOfWeek = days[today.getDay()];
  var year = today.getFullYear();
  dateDOM.innerHTML = "<font class=\"font-3em\">"+month+" "+day+"</font></br><font>"+dayOfWeek+", "+year+"</font>";
}

var colon = true;

function buildTime() {
  today = new Date();
  var hour = today.getHours().toString();
      hour = '0'.repeat(2 - hour.length) + hour;
  var min = today.getMinutes().toString();
      min = '0'.repeat(2 - min.length) + min;
  colon = !colon;
  timeDOM.innerHTML = "<font class=\"font-3em\">"+hour+ (colon ? ':' : ' ') +min+"</font>";
}

buildDate();

setInterval(function() {
  buildTime();
  if(days[today.getDay()] != dayOfWeek) buildDate();
}, 1000);

container.style.opacity = 1;
