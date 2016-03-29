
var lines;

$(document).ready(function() {
	$('#searchButton').click(function() {
		$('#outputFunctions').html('');
		search();
	});
});

function search() {
	var searchClass = $("#searchClass").val();
	if(!lines) { 
		$.ajax({
			url: "Functions.txt",
			dataType: "text",
			success: function(result) {
				lines = result.split("\n");
				for(var i in lines) {
					if(lines[i].search(' ' + searchClass + '::') != -1) {
                	    $("#outputFunctions").append("<li>" + lines[i].slice( lines[i].search( ' ' + searchClass + '::')) + ";" + "</li>");
        	        }
				}
			}
		});
	} else {
		for(var i in lines) {
			if(lines[i].search(searchClass+'::') != -1) {
				$("#outputFunctions").append("<li>"+lines[i].slice(lines[i].search(searchClass+'::'))+";"+"</li>");
			}
		}
	}
}
