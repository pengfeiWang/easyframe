var rword = /[^, ]+/g,
	rnospaces = /\S+/g,
	rwindow = /^\[object (?:Window|DOMWindow|global)\]$/,
	doc = document,
	root = doc.documentElement,
	W3C = window.dispatchEvent,
	oproto = Object.prototype,
	oToString = oproto.toString,
	ohasOwn = oproto.hasOwnProperty,
	emptyArray   = [],
	indexOf      = emptyArray.indexOf,
	slice        = emptyArray.slice,
	splice       = emptyArray.splice,
	concat       = emptyArray.concat;
	/**
	 * [regWordBorder 单词边距正则]
	 * @param  string
	 * @return regExp
	 */
	function regWordBorder ( str ) {
		return new RegExp('(^|\\s)' + str + '(\\s|$)')
	}
	function camelize ( target ) {
		//转换为驼峰风格
		if ( target.indexOf('-') < 0 && target.indexOf('_') < 0 ) {
			return target; //提前判断，提高getStyle等的效率
		}
		return target.replace(/[-_][^-_]/g, function ( match ) {
			return match.charAt(1).toUpperCase()
		});
	}
	function firstUpperCase	( str ) {
		if( typeof str !== 'string' ) return;
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	var hasTouch = 'ontouchstart' in window;
	var _cssPrefix = (function () {
		var style = root.style;
		var items=[ 'webkit', 'Moz', 'ms', 'O' ];
		
		 
		var prefix
		if( style['transform'] === '' ) {
			return ''
		}
		for( var j = 0; j < items.length; j++ ) {
			if(  style[ items[ j ] + 'Transform' ] === '' ) {
				prefix = items[ j ];
			}
		}
		return prefix;
	})();