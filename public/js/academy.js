'use strict';

function selectMenu( menu ){
	if ( menu ){
		var upath = '/md/' + menu.id;
		loadContent( upath );
		History.pushState(null, null, "#" + menu.id);
	}else{
		$('#content-view').html('');
	}
}

function clickCurrent(){
	var offset = "#menu-main";
	var docURL = document.URL;
	console.log('document.URL:' + document.URL);
	console.log('document.baseURI:' + document.baseURI);
	console.log('window.location.host:' + window.location.host);
	console.log("Loading Data From: " + offset);
	$(offset).click();
}

function loadContent( src ){
	$.get(src, function(data){
		var renderedContent = markdown.toHTML( data );
		$('#content-view').html( renderedContent );
	});
}
