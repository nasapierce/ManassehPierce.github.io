$(function() {
	var addedLanguages = ["en"];
	var language = navigator.language.split("-")[0];
	for(var i in addedLanguages) {
		if(addedLanguages[i] == language) {
			$.ajax({
				url: 'language.xml',
				success: function(xml) {
					$(xml).find('translation').each(function(){
						var id = $(this).attr('id');
						var text = $(this).find(language).text();
						$("[l=" + id + "]").html(text);
					});
				}
			});
		}
	}
});
