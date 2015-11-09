
$(document).ready(function(){
	$("#searchButton").click(function(){
		init();
	});
});

function init(){
	var searchClass = $("#searchClass").val();
	$.ajax({
		url: "Functions.txt",
		dataType: "text",
		success: function(result){
		var lines = result.split("\n");
		for(var i in lines){
			$("#outputFunctions").append("<li>" + lines[i] + "</li>");
		}
		$("li:not(:contains('" + searchClass + "::" + "'))").hide();
		innerHighlight( document.getElementById('outputFunctions'), searchClass );
	}});
}

function innerHighlight(node, pat) {
	var html = node.innerHTML;
	var rexp = new RegExp( '\\b('+pat+')\\b', 'igm' );
	html = html.replace( rexp, '<span class="hl">$1</span>' );
	node.innerHTML = html;
}

