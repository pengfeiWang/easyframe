/* css3 前缀  */

;var _css3Prefix = (function( win ){
	"use strict";
	var doc = document,
		style = doc.documentElement.style,
		obj = {};
	obj.cssPrefix = (function () {
		var items=['', 'webkit', 'Moz', 'ms', 'O' ];
		return {
			hasTouch         : 'ontouchstart' in window,
			prefix           : (function (){
				var prefix;
				for( var j = 0; j < items.length; j++ ) {
					if(style[ items[ j ] ? items[ j ] + 'Transform' :  'transform'] === '' ) {
						prefix = items[ j ];
					}
				}
				return prefix;
			})()
		};
	})();	
	
	
	obj.transEnd_EV = (function () {
		if ( _isEmptyObject( obj.cssPrefix ) ) return false;

		var transitionEnd = {
				''		: 'transitionend',
				'webkit': 'webkitTransitionEnd',
				'Moz'	: 'transitionend',
				'O'		: 'otransitionend',
				'ms'	: 'MSTransitionEnd'
			};

		return transitionEnd[ obj.cssPrefix.prefix ];
	})();
	obj.animateEnd_EV = (function () {
		if ( _isEmptyObject( obj.cssPrefix ) ) return false;
		var animateEnd = {
				''		: 'animationEnd',
				'webkit': 'webkitAnimationEnd',
				'Moz'	: 'animationend',
				'O'		: 'oanimationend',
				'ms'	: 'animationend'
			};

		return animateEnd[ obj.cssPrefix.prefix ];
	})();
	obj.touch_EV = (function () {
		return {
			resize_EV : 'onorientationchange' in window ? 'orientationchange' : 'resize',
			start_EV  : obj.cssPrefix.hasTouch ? 'touchstart' : 'mousedown',
			move_EV   : obj.cssPrefix.hasTouch ? 'touchmove' : 'mousemove',
			end_EV    : obj.cssPrefix.hasTouch ? 'touchend' : 'mouseup',
			cancel_EV : obj.cssPrefix.hasTouch ? 'touchcancel' : 'mouseup'
		}
	})();

	return obj;
}( window ));