;(function ( window, factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define(function() {
			return factory( window );
		});
	} else if( typeof define === 'function' && define.cmd ) {
		define(function(require, exports, module) {
			module.exports = factory( window );;
		});
	} else {
		factory( window );
	}
}(window, function( window ) {
	var utils = {};
	
