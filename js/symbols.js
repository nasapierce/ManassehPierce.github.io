
$(document).ready(function(){
	$("#searchButton").click(function(){
		init();
	});
});

function init(){
	var searchClass = $("#searchClass").val();
	var searchClass2 = searchClass.length + searchClass;
	//alert(searchClass2);
	$.ajax({
		url: "Symbols.txt",
		dataType: "text",
		success: function(result){
		//split the result by line
		//result.replace(/\n/g, "<br/><br/>");
		var lines = result.split("_Z");
		for(var i in lines){
			$("#outputFunctions").append("<li>" + lines[i] + "</li>");
		}
		$("li:not(:contains('" + searchClass2 + "'))").hide();
		//$("#outputFunctions").html(result);
	}});
}
