var Smartphone = function (options){

	var socket = null;
	var $iframe = $('iframe');
	var $iframecontainer = $('#iFrameContainer');

	var init = function (){
		console.log("init");
		initSocket();
		addHandlers();

		$(window).on("load resize orientationchange", function (event) {
			setIframeSize();
		});
		setIframeSize();
	};

	var setIframeSize = function () {
		$iframecontainer.width( $(window).width() );
		$iframecontainer.height( $(window).height() );

		// alert( $iframecontainer.height() );
	};

	var initSocket = function (){
		if(socket) return; // already initialized

		socket = io.connect(window.location.hostname);

		// some debugging statements concerning socket.io
		socket.on('reconnecting', function(seconds){
			console.log('reconnecting in ' + seconds + ' seconds');
		});
		socket.on('reconnect', function(){
			console.log('reconnected');
		});
		socket.on('reconnect_failed', function(){
			console.log('failed to reconnect');
		});
		// add ourselves to the 'smartphone' room
		socket.on('connect', function() {
			socket.emit('room', 'smartphone');
		});

		socket.on('changeiframe', onChangeiframe);
	};

	var addHandlers = function () {
		$iframe.on('load', function (event) {
			socket.emit('iframechanged', $iframe.attr('src'));
		});
		$('#overlay').on('click', function (event) {
			$('#overlay').hide();
		});
	}

	var onChangeiframe = function (data) {
		// random delay zodat niet iedereen tegelijk veranderd van pagina:
		var delay = Math.random() * 3000;

		setTimeout(function () {
			$iframe.attr('src', data.url);
			$('head>title').text('mixapp.be | ' + data.title);
			if(data.overlay){
				console.log(data.overlay);
				$('#overlayimg').attr('src', data.overlay)
				$('#overlay').show();
			} else {
				$('#overlay').hide();
			}
		},delay);
	};

	return {
		init: init
	};
};



$(function(){
	var smartphone = new Smartphone();
	smartphone.init();
});
