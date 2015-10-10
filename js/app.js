// Ben Brown benbrown52@gmail.com
// © 2015 Benbenbob Software

requirejs.config({
	'baseUrl': 'js',
	'paths': {
		'app': '../app',
		'typed': 'typed.js',
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'
	}
});

requirejs(['app/main'])