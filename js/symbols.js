
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
			url: "https://dl.dropbox.com/s/bp4rcdgaqoorttz/Functions.txt?dl=0",
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
