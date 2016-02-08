
//returns true if it is, else false
if(typeof Number.isInteger === "undefined") Number.prototype.isInteger = function(x) { return x % 1 === 0;};

//inserts a string into another string at the specified index
String.prototype.insert = function(index, string) {
  if(index > 0)
    return this.toString().substring(0, index) + string + this.toString().substring(index, this.toString().length);
  else
    return string + this.toString();
};

//repeats a string 'x' times
if(typeof String.repeat === "undefined") {
	String.prototype.repeat = function(x) {
		var temp = "";
		for(var i=0;i<x;i++) temp += this.toString();
		return temp;
	};
}

//returns true if the string starts with said string, else false
if(typeof String.startsWith === "undefined") {
	String.prototype.startsWith = function(str) {
		if(this.toString().substring(0,str.length) === str) return true;
		else return false;
	};
}

//returns true if the string ends with said string, else false
if(typeof String.endsWith === "undefined") {
	String.prototype.endsWith = function(str) {
		if(this.toString().substring(this.toString().length - str.length, this.toString().length) === str) return true;
		else return false;
	};
}

//returns true if the string has said string in it, else false
if(typeof String.includes === "undefined") {
	String.prototype.includes = function(str) {
		if(this.toString().indexOf(str) >= 0) return true;
		else return false;
	};
}
