
$(document).ready(function(){
$('#searchButton').click(function(){
    $('#outputFunctions').html('');
	init();
});

function init(){
	var searchClass = $("#searchClass").val();
	$.ajax({
		url: "Functions.txt",
		dataType: "text",
		success: function(result){
            var lines = result.split("\n");
			for(var i in lines){
				if(lines[i].search(' ' + searchClass + '::') != -1 && hasClassBeforeParameters(searchClass, lines[i])){
                    $("#outputFunctions").append("<li>" + lines[i].slice( lines[i].search( ' ' + searchClass + '::')) + "</li>");
                }
            }
            innerHighlight( document.getElementById('outputFunctions'), searchClass );
		}
    });
}
});

function hasClassBeforeParameters(classStr, str){
	var searchTo = str.search( ' ' + classStr + '::' );
    for(var i=0;i<=searchTo;i++){
        if( str[i] == '(' ){
        	return false;
            break;
        }
    }
    return true;
}

function innerHighlight(node, pat) {
	var html = node.innerHTML;
	var rexp = new RegExp( '\\b('+pat+')\\b', 'igm' );
	html = html.replace( rexp, '<span class="hl">$1</span>' );
	node.innerHTML = html;
}

