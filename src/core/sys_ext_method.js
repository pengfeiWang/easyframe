/**
 * 数组原型添加 indexOf 方法
 */
if ( !Array.prototype.indexOf ) {
	Array.prototype.indexOf = function ( element, index ) {
		var length = this.length;
		var current;
		if ( index == null ) {
			index = 0;
		} else {
			index = +index || 0;
			if ( index < 0 ) index += length;
			if ( index < 0 ) index = 0;
		}
		for ( ; index < length; index++ ) {
			current = this[ index ];
			if ( current === element ) return index;
		}
		return -1;
	}
}
if (!'string'.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function () {
        return this.replace(rtrim, "")
    }
}

;(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
									  window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		}
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		}
	}
}());