let timeGiven = 1000;
 let repeatCall = function(){
	 setTimeout(function(){
		 timeGiven = 10000;
		 if(document.hasFocus()){
			 window.location.replace('https://www.geeksforgeeks.org/')
		 }
		 repeatCall();
	 },timeGiven);
 }
 repeatCall();