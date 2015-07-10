/*! ============================================= 
    project: easyframe  
    version: 0.1.1 
    update: 2015-07-10 
    author: pengfeiWang 
==================================================  */
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
	var _ui = window._ui || (window._ui = {});
	

/* ==============================
	js template
	{%=it.data%}
================================ */
;
var _doT = (function ( window  ) {
/*! 
doT.js
2011, Laura Doktorova, https://github.com/olado/doT
Licensed under the MIT license.
templateSettings: {
	evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode:      /\{\{!([\s\S]+?)\}\}/g,
	use:         /\{\{#([\s\S]+?)\}\}/g,
	useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	defineParams:/^\s*([\w$]+):([\s\S]+)/,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname:	'it',
	strip:		true,
	append:		true,
	selfcontained: false
}
*/
"use strict";
var doT = {
	version: '1.0.1',
	templateSettings:{evaluate:/\{\%([\s\S]+?)\%\}/g,interpolate:/\{\%=([\s\S]+?)\%\}/g,encode:/\{\%!([\s\S]+?)\%\}/g,use:/\{\%#([\s\S]+?)\%\}/g,define:/\{\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\}/g,conditional:/\{\%\?(\?)?\s*([\s\S]*?)\s*\%\}/g,iterate:/\{\%~\s*(?:\%\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\})/g,varname:"it",strip:true,append:true,selfcontained:false},
	template: undefined, //fn, compile template
	compile:  undefined  //fn, for express
}, global;
/*!if (typeof module !== 'undefined' && module.exports) {
	module.exports = doT;
} else if (typeof define === 'function' && define.amd) {
	define(function(){return doT;});
} else {
	global = (function(){ return this || (0,eval)('this'); }());
	global.doT = doT;
}*/

function encodeHTMLSource() {
	var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
		matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
	return function() {
		return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
	};
}
String.prototype.encodeHTML = encodeHTMLSource();

var startend = {
	append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" },
	split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"}
}, skip = /$^/;

function resolveDefs(c, block, def) {
	return ((typeof block === 'string') ? block : block.toString())
	.replace(c.define || skip, function(m, code, assign, value) {
		if (code.indexOf('def.') === 0) {
			code = code.substring(4);
		}
		if (!(code in def)) {
			if (assign === ':') {
				if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
					def[code] = {arg: param, text: v};
				});
				if (!(code in def)) def[code]= value;
			} else {
				new Function("def", "def['"+code+"']=" + value)(def);
			}
		}
		return '';
	})
	.replace(c.use || skip, function(m, code) {
		if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
			if (def[d] && def[d].arg && param) {
				var rw = (d+":"+param).replace(/'|\\/g, '_');
				def.__exp = def.__exp || {};
				def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
				return s + "def.__exp['"+rw+"']";
			}
		});
		var v = new Function("def", "return " + code)(def);
		return v ? resolveDefs(c, v, def) : v;
	});
}

function unescape(code) {
	return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
}

doT.template = function(tmpl, c, def) {
	c = c || doT.templateSettings;
	var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
		str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

	str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
				.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
		.replace(/'|\\/g, '\\$&')
		.replace(c.interpolate || skip, function(m, code) {
			return cse.start + unescape(code) + cse.end;
		})
		.replace(c.encode || skip, function(m, code) {
			needhtmlencode = true;
			return cse.start + unescape(code) + cse.endencode;
		})
		.replace(c.conditional || skip, function(m, elsecase, code) {
			return elsecase ?
				(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
				(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
		})
		.replace(c.iterate || skip, function(m, iterate, vname, iname) {
			if (!iterate) return "';} } out+='";
			sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
			return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
				+vname+"=arr"+sid+"["+indv+"+=1];out+='";
		})
		.replace(c.evaluate || skip, function(m, code) {
			return "';" + unescape(code) + "out+='";
		})
		+ "';return out;")
		.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
		.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
		.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

	if (needhtmlencode && c.selfcontained) {
		str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
	}
	try {
		return new Function(c.varname, str);
	} catch (e) {
		if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
		throw e;
	}
};
doT.compile = function(tmpl, def) {
	return doT.template(tmpl, null, def);
};
return doT;
// $.doT = function ( tmpl, data ) {
// 	if( tmpl && data ) {
// 		return doT.template(tmpl).apply(null, [data])
// 	}
// }
})(window);


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

if ( typeof JSON !== 'object' ) {
	JSON = {};
}
;(function () {
	function f ( n ) {
		return n < 10 ? '0' + n : n;
	}

	if ( typeof Date.prototype.toJSON !== 'function' ) {
		Date.prototype.toJSON = function ( key ) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function ( key ) {
			return this.valueOf();
		};
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	    gap,
	    indent,
	    meta = {
		    '':  '\\b',
		    '\t': '\\t',
		    '\n': '\\n',
		    '\f': '\\f',
		    '\r': '\\r',
		    '"':  '\\"',
		    '\\': '\\\\'
	    },
	    rep;

	function quote ( string ) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function ( a ) {
			var c = meta[ a ];
			return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}

	function str ( key, holder ) {
		var i,
		    k,
		    v,
		    length,
		    mind = gap,
		    partial,
		    value = holder[ key ];
		if ( value && typeof value === 'object' && typeof value.toJSON === 'function' ) {
			value = value.toJSON(key);
		}
		if ( typeof rep === 'function' ) {
			value = rep.call(holder, key, value);
		}
		switch ( typeof value ) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if ( !value ) {
					return 'null';
				}
				gap += indent;
				partial = [];
				if ( Object.prototype.toString.apply(value) === '[object Array]' ) {
					length = value.length;
					for ( i = 0; i < length; i += 1 ) {
						partial[ i ] = str(i, value) || 'null';
					}
					v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}
				if ( rep && typeof rep === 'object' ) {
					length = rep.length;
					for ( i = 0; i < length; i += 1 ) {
						if ( typeof rep[ i ] === 'string' ) {
							k = rep[ i ];
							v = str(k, value);
							if ( v ) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				} else {
					for ( k in value ) {
						if ( Object.prototype.hasOwnProperty.call(value, k) ) {
							v = str(k, value);
							if ( v ) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}
				v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}

	if ( typeof JSON.stringify !== 'function' ) {
		JSON.stringify = function ( value, replacer, space ) {
			var i;
			gap = '';
			indent = '';
			if ( typeof space === 'number' ) {
				for ( i = 0; i < space; i += 1 ) {
					indent += ' ';
				}
			} else {
				if ( typeof space === 'string' ) {
					indent = space;
				}
			}
			rep = replacer;
			if ( replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number') ) {
				throw new Error('JSON.stringify');
			}
			return str('', {
				'': value
			});
		};
	}
	if ( typeof JSON.parse !== 'function' ) {
		JSON.parse = function ( text, reviver ) {
			var j;

			function walk ( holder, key ) {
				var k,
				    v,
				    value = holder[ key ];
				if ( value && typeof value === 'object' ) {
					for ( k in value ) {
						if ( Object.prototype.hasOwnProperty.call(value, k) ) {
							v = walk(value, k);
							if ( v !== undefined ) {
								value[ k ] = v;
							} else {
								delete value[ k ];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			text = String(text);
			cx.lastIndex = 0;
			if ( cx.test(text) ) {
				text = text.replace(cx, function ( a ) {
					return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}
			if ( /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')) ) {
				j = eval('(' + text + ')');
				return typeof reviver === 'function' ? walk({
					'': j
				}, '') : j;
			}
			throw new SyntaxError('JSON.parse');
		};
	}
}());

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
	concat       = emptyArray.concat,
	cssNumber = {
		'columncount': !0,
		'fontweight': !0,
		'lineheight': !0,
		'column-count': !0,
		'font-weight': !0,
		'line-height': !0,
		'opacity': !0,
		'orphans': !0,
		'widows': !0,
		'zindex': !0,
		'z-index': !0,
		'zoom': !0
	};
	function noop() {}
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
// 缓存系统

var globalCache = {
	
	guid: {
		__eventCache  : 1,
		__animateCache: 1,
		__dataCache   : 1
	},
	//事件缓存前置
	eventName  : '__eventCache',
	//动画缓存前置
	animateName: '__animateCache',
	//data缓存前置
	dateName   : '__dataCache',
	//缓存对象
	eventCache  : {},
	animateCache: {},
	dataCache   : {},
	//
	elemOldStatus: {},
	getGid       : function ( elem, typeName ) {
		typeName = globalCache[ typeName ] || globalCache[ 'eventName' ];
		return elem[ '__$gid' + typeName ] || ( elem[ '__$gid' + typeName ] = globalCache.guid[ typeName ]++ );
	}
};
var class2type = {};
'Boolean Number String Function Array Date RegExp Object Error'.replace(rword, function ( name ) {
	class2type[ '[object ' + name + ']' ] = name.toLowerCase()
});
/*取得目标类型*/
function _getType ( obj ) { //
	if ( obj == null ) {
		return String(obj)
	}
	// 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
	return typeof obj === 'object' || typeof obj === 'function' ?
	class2type[ oToString.call(obj) ] || 'object' :
		typeof obj
}	
/**
 * 数组去重
 * @param  arr [ Array ]
 * @return arr
 */
function _unique ( arr ) {
	var n = [];
	if( !arr ) return;
	for ( var i = 0, len = arr.length; i < len; i++ ) {
		if ( n.indexOf(arr[ i ]) == -1 ) n.push(arr[ i ]);
	}
	return n;
}
// var _isFunction = typeof alert === 'object' ? function ( fn ) {
// 	try {
// 		return /^\s*\bfunction\b/.test(fn + "")
// 	} catch ( e ) {
// 		return false
// 	}
// } : function ( fn ) {
// 	return oToString.call(fn) === '[object Function]'
// }
function _isFunction ( fn ) {
	return oToString.call(fn) === '[object Function]'
}
function _isWindow ( obj ) {
	if ( !obj )
		return false
	// 利用IE678 window == document为true,document == window竟然为false的神奇特性
	// 标准浏览器及IE9，IE10等使用 正则检测
	return obj == obj.document && obj.document != obj //jshint ignore:line
}
// function _isWindow(obj) {
//     return rwindow.test(oToString.call(obj))
// }
/*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
function _isPlainObject ( obj ) {
	// return !!obj && typeof obj === "object" && Object.getPrototypeOf(obj) === oproto
	if ( !obj || _getType(obj) !== 'object' || obj.nodeType || _isWindow(obj) ) {
		return false;
	}
	try { //IE内置对象没有constructor
		if ( obj.constructor && !ohasOwn.call(obj, 'constructor') && !ohasOwn.call(obj.constructor.prototype, 'isPrototypeOf') ) {
			return false;
		}
	} catch ( e ) { //IE8 9会在这里抛错
		return false;
	}
	
	for ( key in obj ) {
	}
	return key === void 0 || ohasOwn.call(obj, key)
}
function _isObject ( obj ) {
	return oToString.call( obj ) === '[object Object]';
};
function _isEmptyObject ( obj ) {
	var name;
	if( !_isObject( obj ) ) return true;
	for ( name in obj ) {
		return false;
	}
	return true;
};
/**
 * @param arr
 * @returns boolean
 */
function _isArray ( arr ) {
	return oToString.call(arr) == '[object Array]';
}
/**
 * 判断是否存在某个值
 * @param  {[type]} arr [description]
 * @param  {[type]} key [description]
 * @return 
 */
function _inArray( arr, key ) {
	if( !_isArray( arr ) ) {
		return false;
	}
	return arr.indexOf( key ) > -1 ? true : false;
};
//偷jQuery.extend方法，可用于浅拷贝，深拷贝
function _extend () {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false
	// 如果第一个参数为布尔,判定是否深拷贝
	if ( typeof target === 'boolean' ) {
		deep = target
		target = arguments[ 1 ] || {}
		i++
	}
	//确保接受方为一个复杂的数据类型
	if ( typeof target !== 'object' && _getType(target) !== 'function' ) {
		target = {}
	}
	//如果只有一个参数立即返回
	if ( i === length ) {
		return target;
		// target = this
		// i--
	}
	for ( ; i < length; i++ ) {
		//只处理非空参数
		if ( (options = arguments[ i ]) != null ) {
			for ( name in options ) {
				src = target[ name ]
				copy = options[ name ]
				// 防止环引用
				if ( target === copy ) {
					continue
				}
				if ( deep && copy && (_isPlainObject(copy) || (copyIsArray = _isArray(copy))) ) {
					if ( copyIsArray ) {
						copyIsArray = false
						clone = src && _isArray(src) ? src : []
					} else {
						clone = src && _isPlainObject(src) ? src : {}
					}
					target[ name ] = _extend(deep, clone, copy)
				} else if ( copy !== void 0 ) {
					target[ name ] = copy
				}
			}
		}
	}
	return target
}
/**
 * 遍历数组与对象,回调的第一个参数为 元素或键值 ,第二个索引或键名
 * @param obj
 * @param callBack
 * @private
 */
function _each ( obj, callBack ) {
	if ( obj ) {
		if ( _isArray(obj) ) {
			// if ( !!Array.prototype.forEach ) {
			// 	obj.forEach(function ( value, i ) {
			// 		if( callBack(i, value) === false ) {
			// 			// break
			// 		}
			// 	});
			// } else {
				for ( var i = 0, len = obj.length; i < len; i++ ) {
					// callBack(obj[ i ], i);
					if( callBack(i, obj[ i ]) === false ) {
						break
					}
				}
			// }
		} else {
			for ( var i in obj ) {
				//if (i == 'length') continue;
				if ( obj.hasOwnProperty(i) && callBack(i, obj[ i ]) === false ) {
					// callback(obj[ i ], i);
					// if( callBack.call(i, obj[ i ]) === false ) {
						break
					// }
				}
			}
		}
	}
}
/*======================
		browser	
======================*/
var _browser;
// 偷 jQuery
;(function (){
	var matched, browser;

	// Use of jQuery.browser is frowned upon.
	// More details: http://api.jquery.com/jQuery.browser
	// jQuery.uaMatch maintained for back-compat
	var uaMatch = function( ua ) {
		ua = ua.toLowerCase();
		
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];
		
		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};
	
	matched = uaMatch( navigator.userAgent );
	browser = {};
	
	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}
	_browser = browser;
}());
/*======================
		selector	
======================*/
/**
 * @param select [ string ]
 * @param context
 * @returns elements || nodeElement
 */

// 
;function _getElement ( select, context ) {
	if ( !select )  return;
	if( select == 'body' ) {
		return document.body;
	}
	if ( typeof select !== 'string' ) return select;
	context = context || document;
	var selectFirst = select.charAt(0);
	var selectString = select.substring(1);
	var elem = null;
	var tmp = [];
	if ( selectFirst === '#' ) {
		elem = context.getElementById(selectString);
		return elem;
	} else if ( selectFirst === '.' ) {
		var tmpElems = context.getElementsByTagName('*');
		var reg = regWordBorder(selectString);
		for ( var i = 0, len = tmpElems.length; i < len; i++ ) {
			if ( reg.test(tmpElems[ i ].className) ) {
				tmp.push(tmpElems[ i ]);
			}
		}
		return tmp;
	} else {
		var tmpElems = context.getElementsByTagName(select);
		for(var i = 0, len = tmpElems.length; i < len; i++ ) {
			tmp.push(tmpElems[ i ]);
		}
		return tmp;
	}
}
/*======================
		class	
======================*/

/*	
_addClass( elem, cls, fn )

_addClass 添加 class
_removeClass 删除 class
_hasClass 验证 class
 */

var __class = (function () {
	
		function _addClass( elem, cls, fn ) {
			if ( cls && typeof cls === 'string' && elem.nodeType === 1 ) {
				if ( !elem.className ) {
					elem.className = cls;
				} else {
					var arr = elem.className.match(rnospaces);
					cls.replace(rnospaces, function ( a ) {
						if ( arr.indexOf(a) === -1 ) {
							arr.push(a);
						}
					});
					elem.className = arr.join(' ');
				}
				if ( fn ) {
					fn.call(elem);
				}
			}
			return elem;
		}
		function _removeClass( elem, cls, fn ) {
			if ( cls && typeof cls > 'o' && elem.nodeType === 1 && elem.className ) {
				var classNames = (cls || '').match(rnospaces) || [];
				var cl = classNames.length;
				var set = ' ' + elem.className.match(rnospaces).join(' ') + ' ';
				for ( var c = 0; c < cl; c++ ) {
					set = set.replace(' ' + classNames[ c ] + ' ', ' ');
				}
				elem.className = set.slice(1, set.length - 1);
				if ( fn ) {
					fn.call(elem);
				}
			}
			return elem;
		}
		function _hasClass( elem, cls ) {
			

			var elemCls, nCls, reg, len, i = 0, bool;
			if( !cls ) {
				return false;
			}
			nCls = cls.match(rword).join('|');
			reg = new RegExp("(^|\\s)(" + nCls + ")(\\s|$)");

			// console.log( cls, nCls, )
			if ( elem.nodeType === 1 && elem.className ) {
				elemCls = elem.className.match(rword);
				len = elemCls.length;
				for( ; i < len; i++ ) {
					if( reg.test( elemCls[i] ) ) {
						bool = true;
						break
					}
				}
				if( bool ) return bool;
				return false;
			}
			return false;
		}
		function _classAnimate( elem, cls, callBack ) {
			if ( !elem.nodeType || elem.nodeType !== 1 || _attr(elem, 'data-pressed') ) {
				return;
			}
			var args = arguments, len = args.length;

			if ( len == 2 && (typeof args[ 1 ] !== 'string' || _isFunction( args[ 1 ] )) ) {
				callBack = args[ 1 ];
				cls = null;
			}

			var attr = _attr(elem, 'data-animate'),
				cls = cls || attr,
				oldClass = _attr(elem, 'data-animate-old');

			if( cls === oldClass ) {
				return;
			}

			if( oldClass && __class._hasClass(elem, oldClass ) ) {
				__class._removeClass(elem, oldClass );
			}
			
			_attr(elem, 'data-animate-old', cls);
			_attr(elem, 'data-pressed', 'true');
			__class._addClass(elem, cls);

			__event._one(elem, _css3Prefix.animateEnd_EV, function (){
				_attr(elem, 'data-pressed', null);
				callBack&&callBack.call(elem);
			});
		}
	return {
		_addClass     : _addClass,
		_removeClass  : _removeClass,
		_hasClass     : _hasClass,
		_classAnimate : _classAnimate
	}
}());

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
// css

/*
设置 获取 样式
_css( obj, 'attr' ) 
返回obj.style[attr]

_css( obj, 'attr', 'val')
设置obj.style[attr] = val
返回 obj

_css( obj, {width:100px, height: 200px})
设置obj.style, width height
返回obj
*/
;
var _css = (function () {
	"use strict";
	var rnocame = /[^_-]/;
	var rcame = /[_-]/;
	var rNoUpper = /^(webkit|Moz|ms|O)/;
	var floatMap = {
		"float": W3C ? "cssFloat" : "styleFloat"
	}


	var cssName = function ( name ) {
		if ( floatMap[name] ) {
			return cssMap[name];
		}
		if( rcame.test(name) ) {
			name = camelize(name)
		}
		var handName = rNoUpper.test(name) ? name : _cssPrefix + firstUpperCase(name);
		if( handName in root.style ) {
			return handName;
		}
		return name
	}
	


	var getBounding = function ( node ) {
		return node.getBoundingClientRect();
	},
	outerWidth = function ( node ) {
		var o = getBounding( node );
		return o.right - o.left + 'px';
	},
	outerHeight = function ( node ) {
		var o = getBounding( node );
		return o.bottom - o.top + 'px';
	};

	/**
	 * 设置样式
	 * @param  obj   dom 对象
	 * @param  attr  要操作的属性
	 * @param  value 要操作的属性值
	 * @return 
	 */
	var setStyle = function ( obj, attr, value ) {
		var tmpNum = 0;

		if( attr === 'opacity' ) {
			if( window.getComputedStyle ) {
				obj.style[attr] = value > 1 ? value /100 : value
			} else {
				setOpacity(obj, value);
			}
			
		} else {
			// value 有可能是负值, ie8 以下的版本需要处理, 用当前元素值 + 负值, 得到正常值
			if( value < 0 && _browser.version <= 8 && /^(width|height)$/i.test(attr) ) {
				tmpNum = parseFloat( _css( obj, attr ) );
				value +=  isNaN( tmpNum ) ? 0 : tmpNum ;
			}
			obj.style[attr] = addPx(attr, value);
		}
	};
	var rGet = /^(opacity|outerWidth|outerHeight)$/;

	var ret, style;
	var addPx = function ( attr, val ) {
		return (typeof(val) === 'number') && !cssNumber[ attr.toLowerCase() ] ? val + 'px' : val;
	};

	function getOpacity ( node ) {
		var alpha, op;
		if( window.getComputedStyle ) {
			op = window.getComputedStyle( node, null)['opacity'];
		} else {
			alpha = node.filters.alpha || node.filters[salpha];
			op = alpha && alpha.enabled ? alpha.opacity : 100;
			op = (op / 100) + '';//确保返回的是字符串
		}
		return op 
	};
	function setOpacity ( node, val ) {
		var style = node.style
		var opacity = isFinite(val) && val <= 1 ? 'alpha(opacity=' + val * 100 + ')' : ''
		var filter = style.filter || '';
		style.zoom = 1;
		style.filter = (ralpha.test(filter) ?
			filter.replace(ralpha, opacity) :
			filter + ' ' + opacity).trim()
		if (!style.filter) {
			style.removeAttribute('filter');
		}
	};
	var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
	var rposition = /^(top|right|bottom|left)$/
	var ralpha = /alpha\([^)]*\)/i
	var ie8 = !! window.XDomainRequest
	var salpha = 'DXImageTransform.Microsoft.Alpha';
	var border = {
		thin: ie8 ? '1px' : '2px',
		medium: ie8 ? '3px' : '4px',
		thick: ie8 ? '5px' : '6px'
	}
	var getMaps = {
		opacity:  getOpacity,
		outerWidth: outerWidth,
		outerHeight: outerHeight
	}
	function getStyle ( obj, attr ) {
		if( rGet.test(attr) ) {
			return getMaps[attr](obj);
		}
			
		if( window.getComputedStyle ) {
			style = getComputedStyle(obj, null);
			if (style) {
				ret = attr === 'filter' ? style.getPropertyValue(attr) : style[attr]
				if (ret === '') {
					ret = obj.style[attr] //其他浏览器需要我们手动取内联样式
				}
			}
			return ret
		} else {
			
			var currentStyle = obj.currentStyle
			ret = currentStyle[attr];
			// 非 px 单位 ,  非 left 等
			if ( (rnumnonpx.test(ret) && !rposition.test(ret)) ) {
				//①，保存原有的style.left, runtimeStyle.left,
				var style = obj.style,
					left = style.left,
					rsLeft = obj.runtimeStyle.left
					//②由于③处的style.left = xxx会影响到currentStyle.left，
					//因此把它currentStyle.left放到runtimeStyle.left，
					//runtimeStyle.left拥有最高优先级，不会style.left影响
					obj.runtimeStyle.left = currentStyle.left
					//③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
					//得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
					style.left = name === 'fontSize' ? '1em' : (ret || 0)
					ret = style.pixelLeft + 'px'
					//④还原 style.left，runtimeStyle.left
				style.left = left
				obj.runtimeStyle.left = rsLeft
			}
			if (ret === 'medium') {
				name = name.replace('Width', 'Style')
				//border width 默认值为medium，即使其为0"
				if (currentStyle[name] === 'none') {
					ret = '0px'
				}
			}
			if( /^(width|height)$/.test(attr) && (ret === 'auto' || ret === '') ) {
				ret = getMaps['outer' + firstUpperCase(attr) ](obj)
			} 

			return  border[ret] || ret;				
		}
	}
	


	/**
	 * 设置 获取 css 样式
	 * @param  elem dom对象
	 * @param  ops  object { name: value }
	 * @return elem dom对象 || style[attr]
	 */
	return function ( elem, ops, value ) {
		elem = _getElement(elem);
		if (!elem || !elem.nodeType || elem.nodeType !== 1 ) {
			throw new Error('css方法要求传入一个dom节点' + elem )
		}
		// 先做 是否css3属性验证;
		var prop;
		var i;
		// typeof ops === 'string'
		// value 目标值
		// 设置
		if(typeof ops === 'string' && value ) {
			setStyle(elem, cssName(ops), value);
			return elem;
		}

		if( ops ) { //设置 || 获取
			if( typeof ops === 'string' ) { // ops如果是字符串把它当成要获取的属性
				return getStyle(elem, cssName(ops));
			}
			// 设置属性值
			for( i in ops ) {
				setStyle(elem, cssName(i), ops[i]);
			}
			return elem;
		} 
		//else { //获取
			// return getStyle(elem, cssName(ops));
		// }
		// console.log( 'css---' )
		return elem;
	}
})();

//事件系统

/*======================
 event	data
 ======================*/

/**
 * 查找数组内的对象 是否有 相同的值
 * arr = [ {fn:function}, {fn: function} ]
 * 如果后期有数据较大情况采用其他方式查找, 暂时不考虑
 * @param  array
 * @param  target  function
 * @return boolean
 */

var __event = (function () {
	function eventCacheFind ( arr, target ) {
		var bool = false;
		for ( var i = 0, len = arr.length; i < len; i++ ) {
			if ( arr[ i ].fn == target ) {
				bool = true;
				break;
			}
		}
		return bool;
	}
	function  ieInput(obj, fn) {
		return function (e){
			var e = e || window.event;
			if (e.propertyName.toLowerCase() == "value") {
				if(!obj.strL) {
					obj.strL = [];
				}
				if( obj.strL.length>=2 ) {
					obj.strL.splice(0, 1, obj.strL[1]);
					obj.strL.splice(1, 1, obj.value.length);
				} else {
					obj.strL.push(obj.value.length);
				}
				if(obj.strL.length>=2) {
					if( obj.strL[0]==obj.strL[1] ) {return;}
				}
				return fn.call(obj, e);
			}
		} 
	}
	// 创建 事件
	function createEvent ( ev/*, props */ ) {
		// document.createEvent || document.createEventObject
		var event /*= document.createEvent("Events") || document.createEventObject()*/,
		    bubbles = true;
		// if (props) {
		// 	for ( var name in props ) {
		// 		if ( name === "bubbles" ) { 
		// 			bubbles = !!props[name];
		// 		} else {
		// 			event[name] = props[name];
		// 		}
		// 	}
		// }
		// 标准浏览器 使用 createEvent, ie 使用 createEventObject
		if ( document.createEvent ) {
			event = document.createEvent('Events');
			event.initEvent(ev, bubbles, true);
			// event.initEvent(ev, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
		} else {
			event = document.createEventObject();
			event.type = ev;
			event.cancelBubble = bubbles;// 冒泡
			event.returnValue = undefined;//默认事件
			event.srcElement = null;
			event.recordset = null;
			event.data = null;
		}
		return event;
	}
		/**
		 * 绑定事件
		 * @param  obj     dom对象
		 * @param  ev      事件
		 * @param  fn      回调函数
		 * @param  capture 标准浏览器, 是否捕获
		 * @param  one     内部使用, 是否来自 one函数
		 * @return 返回 obj
		 */
		function _on( obj, ev, fn, capture, one ) {
			if ( arguments.length < 3 ) return;
			//用空格 间隔 事件
			ev = ev.match(rword);
			var id = globalCache.getGid(obj, 'eventName'),
			    i = 0,
			    len = ev.length;
			// 获取事件缓存, 如果不存在则创建
			var set = globalCache.eventCache[ id ] = globalCache.eventCache[ id ] ? globalCache.eventCache[ id ] : {};
			var tmpObject = {
				fn: fn
			}
			if ( one === 'one' ) {
				tmpObject.one = true;
			}
			function eventBind ( obj, ev, fn, capture ) {
				if ( obj.addEventListener ) {
					obj.addEventListener(ev, fn, !!capture);
				} else if ( obj.attachEvent ) {
					if( ev === 'input' ) {
							fn = ieInput(obj, fn);
							ev = 'propertychange';
							obj.attachEvent('on'+ev, fn);
					} else {
						obj.attachEvent('on' + ev, function ( e ){
							var e = e || window.event
							fn.call(obj, e)
						});
					}
					
				} else {
					obj[ 'on' + ev ] = fn;
				}
			}
			
			// 判断是否 dom 对象 或者 window
			if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || _isWindow(obj) ) {
				for ( ; i < len; i++ ) {
					// 判断事件是否存在, 不存在则声明, 并push fn 
					if ( !set[ ev[ i ] ] ) {
						set[ ev[ i ] ] = [];
						// set[ ev[ i ] ].push( fn );
						set[ ev[ i ] ].push(tmpObject);
						eventBind(obj, ev[ i ], fn, !!capture)
					} else if ( _isArray(set[ ev[ i ] ]) && !eventCacheFind(set[ ev[ i ] ], fn) ) {
						// set[ ev[ i ] ].push( fn );
						set[ ev[ i ] ].push(tmpObject);
						eventBind(obj, ev[ i ], fn, !!capture);
					}
				}
			}
			return obj;
		}
		// 指定 event fn, 则销毁
		/**
		 * 销毁事件
		 * @param  obj     dom 对象
		 * @param  ev      销毁的事件
		 * @param  fn      销毁的回调
		 * @param  capture
		 * @return 返回 dom 对象
		 *
		 * _off(obj) 销毁obj上的所有事件
		 * _off(obj, ev) 销毁obj绑定的 ev 事件
		 * _off(obj, ev, fn) 销毁 obj 绑定的 ev 事件 并且 回调一致
		 */
		function _off( obj, ev, fn, capture ) {
			if ( !obj ) {
				return;
			}
			if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || _isWindow(obj) ) {
				var id = globalCache.getGid(obj);
				var ageLen = arguments.length;
				var cache = globalCache.eventCache[ id ];
				var removeEvent = function ( evS, ev, fn, idx ) {
					
					if ( obj.addEventListener ) {
						obj.removeEventListener(ev, fn);
					} else if ( obj.detachEvent ) {
						obj.detachEvent('on' + ev, fn);
					} else {
						obj[ 'on' + ev ] = null;
					}
					evS.splice(idx, 1);
				}
				var handleEvent = function ( hdlEvt, hdlFn ) {
					var evt = hdlEvt ? cache[ hdlEvt ] : false;
					var callBackFn = hdlFn === undefined ? fn : false;
					var eLen = 0;
					if ( evt ) {
						eLen = evt.length;
						if ( callBackFn ) {
							for ( var i = 0; i < eLen; i++ ) {
								if ( evt[ i ] && evt[ i ].fn == callBackFn ) {
									removeEvent(evt, hdlEvt, fn, i);
								}
							}
						} else if ( callBackFn === false ) {
							for ( var i = 0; i < eLen; i++ ) {
								// if( evt[ i ] && evt[ i ].fn ) {
									removeEvent(evt, hdlEvt, evt[ i ].fn, i);
								// }
							}
						}
					} else {
						for ( var i in cache ) {
							var evt = cache[ i ],
							    eLen = evt.length;
							for ( var j = 0; j < eLen; j++ ) {
								removeEvent(evt, i, evt[ j ].fn, j);
							}
						}
					}
				}
				if ( !cache || _isFunction(ev) ) return;
				ev = ev ? ev.match(rword) : [];
				// 这里没有做严谨的判断
				if ( ageLen >= 3 ) {
					for ( var i = 0, len = ev.length; i < len; i++ ) {
						(function (k){
							handleEvent(ev[ k ])
						}(i));
					}
				} else if ( ageLen == 2 ) {
					for ( var i = 0, len = ev.length; i < len; i++ ) {
						// handleEvent(ev[ i ], false);
						(function (k){
							handleEvent(ev[ k ], false)
						}(i));
					}
				} else {
					handleEvent();
				}
			}
			return obj;
		}
		/**
		 * 绑定, 执行一次
		 * @param  obj     dom 对象
		 * @param  ev      事件
		 * @param  fn      回调
		 * @param  capture 捕获
		 * @return 返回 dom 对象
		 */
		function _one( obj, ev, fn, capture ) {
			if ( !obj ) {
				return;
			}
			var proxy = function () {
				fn.apply(obj, arguments);
				_off(obj, ev, proxy, capture);
			}
			_on(obj, ev, proxy, capture, 'one');
			return obj;
		}
		/**
		 * 执行事件, 系统事件, 自定义事件
		 * @param  obj  dom对象
		 * @param  ev   事件
		 * @param  data 传递的数据
		 * @return 返回 dom
		 */
		function _trigger( obj, ev, data ) {
			if ( !obj || !ev ) return;
			var sEv, i = 0, j, evt;
			if ( typeof ev !== 'string' && _isPlainObject(ev) ) {
				for ( j in ev ) {
					sEv += ' ' + ev[ j ];
				}
			} else {
				sEv = ev;
			}
			sEv = sEv.match(rword);
			for ( var len = sEv.length; i < len; i++ ) {
				evt = createEvent(sEv[ i ]);
				if ( data ) {
					evt.data = data;
				}
				// 标准浏览器
				if ( /*document.createEvent*/ obj.dispatchEvent ) {
					obj.dispatchEvent(evt);
					// IE 	
				} else if ( obj.fireEvent ) {
					try {
						obj.fireEvent(sEv[ i ], evt);
					} catch ( e ) {
						var id = globalCache.getGid(obj);
						var cache = globalCache.eventCache[ id ];
						var n = 0, tmp, len;
						evt.srcElement = obj;
						for ( var i in cache ) {
							tmp = cache[ i ];
							len = tmp.length;
							for ( ; n < len; n++ ) {
								tmp[ n ].fn.call(obj, evt);
								if ( tmp[ n ].one ) {
									tmp.splice(n, 1);
								}
							}
						}
					}
				}
			}
			return obj;
		}
		function _evtStop( e ) {
			object._preventDefault( e );
			object._stopPropagation( e );
		}
		function _preventDefault( e ) {
			if ( e.preventDefault ) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		}
		function _stopPropagation( e ) {
			if ( e.stopPropagation ) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		}
	

	return {
		_on: _on,
		_off: _off,
		_one: _one,
		_trigger: _trigger,
		_evtStop: _evtStop,
		_preventDefault: _preventDefault,
		_stopPropagation: _stopPropagation
	}
}());


//获取有效的表单字段, 或dom节点内的 input select等标签的value, 并转成 key-value


var _getField = (function () {
	/**
	 * 获取表单字段
	 */
	function getFrmField ( obj ) {
		var elems = obj.elements;
		return filterFieldName( elems );
	}
	/**
	 * 获取元素下的字段
	 */
	function getElemField ( obj ) {
		var elems,
			input = _getElement('input', obj),
			textarea = _getElement('textarea', obj),
			select = _getElement('select', obj);
		elems = input.concat(textarea).concat(select);
		return filterFieldName( elems )
	}
	/**
	 * 筛选出有效的字段, 以name是否为真作为依据
	 */
	function filterFieldName ( elems ) {
		var tmp = [];
		for( var i = 0, len = elems.length; i < len; i++) {
			if( elems[ i ].name ){
				tmp.push( elems[ i ] );
			}
		}
		return tmp;
	}
	/**
	 * <input type="checkbox" name="t1[]" checked>
	 * <input type="checkbox" name="t1[]" checked>
	 * return { t1: [ value, value ]  }
	 * ============
	 * 
	 * 获取有效的字段, 并转成 key-value
	 */
	return function ( obj ) {
		if( !obj ) return;
		if( _isObject( obj ) ) {
			return obj; 
		}
		var dataArray = obj.tagName.toLowerCase() == 'form' ? getFrmField( obj ) : getElemField( obj );
		var o = {}, 
			i = 0, 
			len = dataArray.length,
			field = null,
			optLen,
			option,
			optValue,
			name = '',
			rbracket = /\[\]$/,
			handOpt = function(obj){
				var v = '';
				var tmp = [];
				var name = obj.name;
				for( var j = 0, optLen = obj.options.length; j < optLen; j++ ) {
					option = obj.options[j];
					if( option.selected ){
						if( option.hasAttribute ) {
							v = (option.hasAttribute('value') ? option.value : option.text )
						} else {
							v = (option.attributes('value').specified ? option.value : option.text )
						}
						tmp.push(v);
					}
				}
				if( tmp.length == 1 ) {
					tmp = tmp.join();
				}
				return tmp;
			};

			for( var i = 0, len = dataArray.length; i < len; i++) {
				field = dataArray[i];
				switch( field.type ) {
					case 'select-one':
					case 'select-multiple':
						name = field.name;
						o[name] = handOpt(field);
						break;
					case undefined:
					case 'file':
					case 'submit':
					case 'reset':
					case 'button':
						break;
					case 'radio':
					case 'checkbox':
						if( !field.checked ) {
							break
						}
					default:
						if( rbracket.test( field.name ) ) {
							name = field.name.replace(/\[|\]/g, '');
							if(  !o[name] ){
								o[name] = [];
							}
							o[name].push( field.value );
						} else {
							o[field.name] = field.value;
						}
				}
			}

		return o;
	}
}());
//系列化


/*
_serialize( {a:1, b:2} )
return a=1&b=2
 */
;var _serialize = (function () {
	function param ( a ) {
		var prefix,
			s = [],
			r20 = /%20/g,
			add = function( key, value ) {
				value = _isFunction( value ) ? value() : ( value == null ? '' : value );
				s[ s.length ] = encodeURIComponent( key ) + '=' + encodeURIComponent( value );
			};
		if ( _isArray( a ) ) {
			for(var i = 0, len = a.length; i < len; i++) {	
				add( i, a[i] );
			}
		} else {					
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ],  add );
			}
		}
		return s.join( '&' ).replace( r20, '+' );
	}
	function buildParams ( prefix, obj, add ) {
		var name,
			rbracket = /\[\]$/;
		if ( _isArray( obj ) ) {
			for(var i = 0, len = obj.length; i < len; i++ ) {
				if ( rbracket.test( prefix ) ) {
					add( prefix, obj[i] );
				} else {
					buildParams( prefix + '[' + ( typeof obj[i] === 'object' ? i : '' ) + ']', obj[i],  add );
				}
			}
		} else if ( _isObject( obj ) ) {
			for ( name in obj ) {
				buildParams( prefix + '[' + name + ']', obj[ name ],  add );
			}
		} else {
			add( prefix, obj );
		}
	}

	return function ( obj ) {
		if( !obj ) return;
		return param( _getField( obj ) );
	}
}());
// ajax

/*

type: [post, get]
dataType: [json, text]
data: {test: 1}
success : function
error: function

_ajax({
	url: '',
	type: 'post',
	dataType: 'json',
	data: {test: 1},
	success: function ( data ) {
	
	},
	error: function ( xhr ) {
	
	}
})

 */
function _ajax( obj ) {
	var timerID = null, timeIsOut = false;
	var ops = _extend({}, {
		type     : 'POST',
		url      : '',
		dataType : 'JSON',
		data     : {},
		timeout  : 0,
		success  : function () {},
		error    : function () {}
	}, obj);


	if( !ops.url ) return;
	if ( typeof ops.dataType !== 'string' ) {
		ops.dataType = 'json'
	}
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') ;

	xhr.onreadystatechange = function () {
		var json;
		if( xhr.readyState == 4 && !timeIsOut && xhr.status == 200 ) {

			var responseText = xhr.responseText;

			if( /json/i.test( ops.dataType ) ) {
				try {
					json = JSON.parse(responseText);
				} catch ( e ) {
					new Error( e );
				}

				ops.success( json );
			} else {
				ops.success( responseText );
			}
		} else {
			ops.error( xhr )
		}
	}
	ops.data = _isEmptyObject( ops.data ) ? '' : _serialize( ops.data ) ;

	//超时检测
	ops.timeout = typeof ops.timeout === 'boolean' ? ( ops.timeout === true ? 5000 : false) : (typeof ops.timeout === 'string' || typeof ops.timeout === 'number' ? ( parseInt(ops.timeout, 10) == 0 || parseInt(ops.timeout, 10) <= 5000 ? false : parseInt(ops.timeout, 10) ) : parseInt(ops.timeout, 10) );
	if( !!ops.timeout ) {
		timerID = setTimeout(function() {
			if ( xhr.readyState != 4 ) {
				timeIsOut = true;
				xhr.abort();
				var confirmBol = confirm('请求超时\n点击确定自动刷新本页\n点击取消手动刷新')
				if( confirmBol ) {
					window.location.reload();
				}
				clearTimeout(timerID);
			}
		}, ops.timeout );
	}

	if ( /post/i.test( ops.type ) ) {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send( ops.data );
	} else {
		xhr.send( null );
	}
	}

function _post( url, data, callback, dataType ) {
	var ops = {};
		ops.url = url;
		ops.data = data;
		ops.success = callback
		ops.type = 'post';
		ops.dataType = dataType

	if( _isFunction( data )  ) {
		ops.success = data;
		ops.data = ''
	}
	if ( typeof callback === 'string' && _isFunction( data ) ) {
		ops.dataType = callback
	}
	_ajax( ops );
}
function _get( url, data, callback, dataType ) {
	var ops = {};
		ops.url = url;
		ops.data = data;
		ops.success = callback;
		ops.type = 'get';
		ops.dataType = dataType;

	if( _isFunction( data ) ) {
		ops.success = data;
		ops.data = ''
	}
	if ( typeof callback === 'string' && _isFunction( data ) ) {
		ops.dataType = callback
	}
	_ajax( ops );
}
// 动画

/*
_animate(obj, {width:100px}, 2000, 'linear', fn)

 */
;var __animate = (function (){
	var Tween = {
		//匀速
		linear: function(t, b, c, d) {
			return c * t / d + b;
		},
		//加速曲线
		easeIn: function(t, b, c, d) {

			return c * (t /= d) * t + b;
		},
		//减速曲线
		easeOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		//加速减速曲线
		easeBoth: function(t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		//加加速曲线
		easeInStrong: function(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		//减减速曲线
		easeOutStrong: function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		//加加速减减速曲线
		easeBothStrong: function(t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t + b;
			}
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		//正弦衰减曲线（弹动渐入）
		elasticIn: function(t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		//正弦增强曲线（弹动渐出）
		elasticOut: function(t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		elasticBoth: function(t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				p = d * (0.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
					Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
		},
		//回退加速（回退渐入）
		backIn: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		backOut: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 3.70158;
				//回缩的距离
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backBoth: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		//弹球减振（弹球渐出）
		bounceIn: function(t, b, c, d) {
			return c - Tween['bounceOut'](d - t, 0, c, d) + b;
		},
		bounceOut: function(t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
			}
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		},
		bounceBoth: function(t, b, c, d) {
			if (t < d / 2) {
				return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
			}
			return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
		}
	}


	var createTime = function(){
		return  (+new Date)
	}
	var isSet = {
		display : !0,
		'z-index': !0,
		zIndex: !0
	}
	var duration = 200;
	return {
		_animate: function ( obj, ops, time, easing, fn ) {
			if( !obj || obj.nodeType !== 1 || !ops ) return;

			if( !time && _isFunction( easing ) ) {
				fn = easing;
				time = duration;
				easing = 'linear';
			}
			if( _isFunction( easing ) ) {
				fn = easing;
				easing = 'linear'
			}
			if( !time ) {
				time = duration
			}
			if( !easing ) {
				easing = 'linear'
			}
			time = parseInt( time );
			fn = fn || noop;
			// 缓存
			var id = globalCache.getGid(obj, 'animateName');
			//获取缓存
			var set = globalCache.animateCache[ id ] = globalCache.animateCache[ id ] ? 
						globalCache.animateCache[ id ] : {};
			// 动画开始时间
			var startTime = createTime();
			var animatePre = '' + startTime;	
			// 缓存数据
			set[ animatePre ] = {
				timerId: null,
				status: false
			}

			// 缓存格式, 利用时间戳来做判断依据		
			// animateCache = {
			// 	startTime: {
			// 		timerId: null,
			//  	status: false  执行过程中设为ture
			// 	}
			// }		
			// console.log( set )
			function step () {
				//每次变化的时间 初始时间 + 预设时间 - 当前时间
				var changTime = time - Math.max(0, startTime + time - createTime());
				var value, target;

				if( !set[ animatePre ] ) return;
				
				set[ animatePre ].status = true;
				for( var i in ops ) {
					value = isSet[ i ] ? ops[ i ] : Tween[ easing ]( changTime, tmpJson[ i ], ops[ i ] - tmpJson[ i ], time );
					_css( obj, i, value );
				}
				if( changTime < time ) {
					requestAnimationFrame( step );
				} else {
					cancelAnimationFrame( set[ animatePre ].timerId );
					
					set[ animatePre ].status = false;
					fn&&fn.call(obj);

					// 动画执行结束删除缓存
					delete set[ animatePre ];
				}
			}
			var i, tmpJson = {};
			cancelAnimationFrame( set[ animatePre ].timerId )

			


			for( i in ops ) {
				if( i === 'opacity' ) {
					tmpJson[ i ] = ops[ i ] > 1 ? 0 : 100;
					ops[ i ] = parseFloat( ops[ i ] ) / 100;
				} else {
					tmpJson[ i ] = isSet[ i ] ? _css( obj, i ) : parseFloat( _css( obj, i ) );
					if( isSet[ i ] ) {
						tmpJson[ i ] = _css( obj, i );
					} else {
						tmpJson[ i ]  = parseFloat( _css( obj, i ) );
						ops[ i ] = parseFloat( ops[ i ] );
					}
					// tmpJson[ i ] = _css( obj, i );
				}
			}
			set[ animatePre ].timerId = requestAnimationFrame( step );
			return obj;
		},
		_stop: function ( obj ) {
			var id = globalCache.getGid(obj, 'animateName');
			var set = globalCache.animateCache[ id ];
			var i;
			for( var i in set ) {
				if( set[ i ].status === true ) {
					cancelAnimationFrame( set[ i ].timerId );
					delete set[ i ];
				}
			}
		}
	}
}());

//元素属性


/**
 * 属性名不区分大小大
 * @param  
 * @return 
 */

/*

_attr( obj, 'test', '123')
设置 obj 属性 test='123'
返回 obj

_attr( obj, 'test', null)
删除obj.test 属性
返回 obj

_attr( obj, test )
获取 obj 属性test的值
返回属性值
 */
;var _attr = (function () {
	var clsFix = /^class$/i;

	return function ( obj, attr, val ) {
		var ret;
		var clsBool = clsFix.test(attr);
		if( !obj && obj.nodeType !== 1 && attr === undefined ) return;
		// 设置
		if( val !== undefined ) {
			if( val === null ) {
				obj.removeAttribute( attr );
			} else {
				if( typeof val !== 'string' ) {
					val = JSON.stringify(val);
				}
				if( clsBool ) {
					_class(obj, val)
				} else {
					obj.setAttribute( attr, val );
				}
			}
			return obj;
		} else { // 获取
			if( clsBool ) {
				ret = obj.className;
			} else {
				ret = obj.getAttribute( attr );
			}
			return ret;
		}
	}
}());

// var _removeAttr = (function () {
// 	return function ( obj, attr ) {
// 		if( !obj && obj.nodeType !== 1 && attr === undefined ) return;
// 		if( obj.hasAttribute( attr ) ) {
// 			obj.removeAttribute( attr );
// 		}
// 		return obj;		
// 	}

// }());
// data


//设置 都会返回当前节点
//获取 返回需要获取的数据
/* 
_data( obj, 'test', 'a') 
data-test = a 
return obj

_data( obj, 'test', {a:1, b:2}) 
data-test = {a:1, b:2} 
return obj

_data( obj, 'test', [0, 1, 2])
data-test = [0, 1, 2] 
return obj

==========

_data( obj, 'test')
返回绑定obj上 key 为 test 的 数据 


_data( obj, 'test', null)
返回 obj,  并删除绑定到obj上key为test的数据 
*/

;var _data = (function () {
	return function ( obj, key, val ) {
		if( !obj || obj.nodeType !== 1 || key === undefined || typeof key === 'object' ) return;
		// 缓存
		var id = globalCache.getGid(obj, 'dateName');
		//获取缓存
		var set = globalCache.dataCache[ id ] = globalCache.dataCache[ id ] ? 
					globalCache.dataCache[ id ] : globalCache.dataCache[ id ] = {};

		
		var ret;
		key = 'data-' + key; 

		if( val === undefined ) { // 获取, 返回查询到的数据
			ret = set[ key ];
			return ret;
		} else { // 设置
			// 返回dom节点
			if( val === null ) { // val === null 则认为删除数据
				delete set[ key ];
			} else { // 设置数据
				set[ key ] = val
			}
			return obj;
		}
	}
}());
/* 遮罩 */

/*
// 显示遮罩
_ui.mask()

_ui.mask({
	// 显示文本
	tipText: '数据加载中数据加载中数据加载中数据加载中数据加载中', 
	// 显示 加载图标
	loading: true
	// 自动隐藏 单位毫秒 等待多少 时间后隐藏
	autoHide: 200
	// 自定义样式
	customClass: 'class1 class2'
	// 如果显示文本 或者 加载图标 宽高设定才生效
	width: '',
	height: '',
	// 显示的回调
	showCallBack: noop,
	// 隐藏的回调
	hideCallBack: noop
})

// 显示
_ui.mask.show(ops, callback)
_ui.mask.show(callback)
// 隐藏
_ui.mask.hide(ops, callback)
_ui.mask.hide(callback)
*/
;(function ( win ) {
	var _ui = win._ui || (win._ui = {});
	var globalOps = {
		loading: false,
		autoHide: '',
		customClass: '',
		width: '',
		height: '',
		tipText: '',
		status: 'hide',
		showCallBack: noop,
		hideCallBack: noop
	}
	var createRoot = function ( obj ) {
		var root = document.getElementById('mask');
		
		var cls = obj.customClass.match(/\S+/g) || [];
		var len = cls.length;
		var tmp = {};
		if( !root ) {
			root = document.createElement('div');
			root.id = 'mask';
			
			root.className = 'mask';
			document.documentElement.appendChild( root );
		} else {
			// root.className = '';
			// root.classList.add('mask');
			root.className = 'mask';
		}
		if( len ) {
			for( var i = 0; i < len; i++ ) {
				// root.classList.add(cls[i]);
				__class.addClass( root, cls[i] );
			}
		}

		root.innerHTML = '';
		obj.root = root;
		return createLoading( obj )		
	};
	var createLoading = function ( obj ) {

		var str = [
			'<div class="mask-loading">'
			,'	<div class="mask-loading-conatiner">'
			,'{%?it.tipText||it.loading%}'
			,'		<div class="mask-loading-inner">'
			,'      	<div class="mask-inner-body">'
			,' 				{%?it.loading%}'
			// ,'					{%?it.loading=="shouxinerLoading"%}'
			// ,'						<div class="logo-loading-box">'
			// ,'							<div class="wave">'
			// ,'								<div class="inner"></div>'
			// ,'							</div>'
			// ,'							<div class="logo"></div>'
			// ,'						</div>'
			// ,'					{%??%}'
			,'				        <div class="loading-spinner-outer">'
			,'							<div class="loading-spinner">'
			,'								<span class="loading-top"></span>'
			,'								<span class="loading-right"></span>'
			,'								<span class="loading-bottom"></span>'
			,'								<span class="loading-left"></span>'
			,'							</div>'
			,'						</div>'
			// ,'					{%?%}'
			,' 				{%?%}'
			,'				{%?it.tipText%}<div class="mask-tip-txt">{%=it.tipText%}</div>{%?%}'
			,'			</div>'
			,'		</div>'
			,'{%?%}'
			,'	</div>'
			,'</div>'
		].join('');

		if( obj.loading && !obj.tipText ) {
			obj.root.className +=' single-loading'
		}

		obj.root.innerHTML = _doT.template(str).apply(null, [obj]);
		// //_doT(str, obj);
		// obj.loadingElem = obj.root.querySelectorAll('.mask-loading')[0];
		obj.loadingElem = _getElement('.mask-loading', root)[0];
	


		return obj;
	};
	var animateHide = function ( obj, callback ) {
		var time_outer, prefix, time = obj.autoHide ? ( typeof obj.autoHide == 'number' ? obj.autoHide : parseInt(obj.autoHide, 10) ) : 0 ;

		if(  (obj.loading || obj.tipText ) && obj.loadingElem ) {
			if( _browser.msie && _browser.version <= 9 ) {
				time_outer = setTimeout(function () {
					var clientHeight = document.documentElement.clientHeight;
					__animate._animate(obj.loadingElem, {
						top: -clientHeight+'px'
					}, 200, 'linear', function () {
						clearTimeout( time_outer );
						obj.root.style.display = 'none';
						if(callback)callback();
					});
				}, time);

			} else {
				prefix = _css3Prefix.cssPrefix.prefix;
				time_outer = setTimeout(function () {
					obj.loadingElem.style[ prefix + 'TransitionDuration' ] = '300ms';
					obj.loadingElem.style[ prefix + 'TransitionTimingFunction' ] = 'linear';
					obj.loadingElem.style[ prefix + 'Transform' ] = 'translateY(-100%)';
				}, time);


				__event._one(obj.loadingElem, _css3Prefix.transEnd_EV, function () {
					clearTimeout( time_outer );
					obj.root.style.display = 'none';
					if(callback)callback();
				});	
			}

		} else {
			obj.root.style.display = 'none';
			if(callback)callback();
		}
	}
	var show = function ( obj ) {
		var time_outer, time = obj.autoHide ? ( typeof obj.autoHide == 'number' ? obj.autoHide : parseInt(obj.autoHide, 10) ) : 0 ;

		if( !!window.getComputedStyle ) {
			if( window.getComputedStyle(obj.root)['display'] == 'none' ) {
				obj.root.style.display = 'block';
			}
		} else {
			if( obj.root.currentStyle['display'] == 'none' ) {
				obj.root.style.display = 'block';
			}
		}
		
		if( (obj.loading || obj.tipText ) && obj.loadingElem ) {



			obj.maskInnerBody = _getElement('.mask-inner-body', obj.loadingElem)[0];
			obj.maskLoadingInner = _getElement('.mask-loading-inner', obj.loadingElem)[0];
			
			if( obj.width ) {
				_css(obj.maskLoadingInner, {width: obj.width})
			} else {
				_css(obj.maskLoadingInner, {
					width: _css(obj.maskInnerBody, 'outerWidth')
				});
			}

			if( obj.height ) {
				_css(obj.maskLoadingInner, {width: obj.height})
			} else {
				_css(obj.maskLoadingInner, {
					height: _css(obj.maskInnerBody, 'outerHeight')
				});	
			}
			
			// obj.loadingElem.style.display = 'block';
			obj.loadingElem.style.visibility = 'visible';
		}
		if( obj.autoHide ) {
			animateHide(obj, obj.showCallBack );
		} else {
			obj.showCallBack();
		}
	};
	var hide = function ( obj ) {
		animateHide( obj, obj.hideCallBack );
	};

	_ui.mask = function ( options ) {
		var obj = _extend( {}, globalOps, options );
		obj = createRoot( obj );
		_data(obj.root, 'ui-mask', obj);
		if( obj.status ) {
			show( obj )
		} else {
			hide( obj  )
		}
	};
	_ui.mask.show = function ( options, callback ) {
		var root = document.getElementById('mask');
		var obj = {};
		if( !root ) {
			obj = _extend( {}, globalOps, _isObject(options) ? options : {} );
			obj = createRoot( obj );
			root = obj.root;
			_data(root, 'ui-mask', obj);
		} else {
			obj = _data(root, 'ui-mask'), ops = {};
		}

		if( options && callback ) {
			obj.showCallBack = callback;
		}

		obj.status = true;

		if( typeof options == 'function' ) {
			obj.showCallBack = options;
		} else {
			if( options === null ) {
				obj.loading = false;
			} else {
				switch ( typeof options ) {
					case 'boolean':
					case 'string':
					case 'number':
					case 'undefined':
						obj.loading = false;
						break;
					case 'object':
						obj = _extend( obj, options );
						break;
				}
			}
		}
		ops = _extend( {}, globalOps, obj);
		show( ops );
	};
	_ui.mask.hide = function ( options, callback ) {
		var root = document.getElementById('mask');
		var obj = {}, ops = {};
		if( !root ) {
			obj = _extend( {}, globalOps, _isObject(options) ? options : {} );
			obj = createRoot( obj );
			root = obj.root;
			_data(root, 'ui-mask', obj);
		} else {
			obj = _data(root, 'ui-mask')
		}

		if( options && callback ) {
			obj.hideCallBack = callback;
		}

		obj.status = false;

		if( typeof options == 'function' && !callback ) {
			obj.hideCallBack = options;
		} else {
			if( options === null ) {
				obj.loading = false;
			} else {
				switch ( typeof options ) {
					case 'boolean':
					case 'string':
					case 'number':
					case 'undefined':
						obj.loading = false;
						break;
					case 'object':
						obj = _extend( obj, options );
						break;
				}
			}
		}
		ops = _extend( {}, globalOps, obj );
		animateHide( ops, obj.hideCallBack );
	}
}(window));
/* 消息通知 弹窗*/

;(function ( win ) {
	var _ui = win._ui || (win._ui = {});
	var css3Animate = ((_browser.msie && _browser.version >= 10) || _browser.webkit || _browser.mozilla);
	var elem = {
		root: null,
		container: null,
		content: null,
		bodyBox: null,
		titleBox: null,
		msgBox: null,
		okBtn: null,
		cancelBtn: null
	};
	var globalOps = {
		title: '提示信息',
		msg: '消息提示',
		type: 'alert',
		txt: {
			okTxt: '确认',
			cancelTxt: '取消'
		},
		elem: elem,
		customClass: {
			userClass: '',
			okClass: '',
			cancelClass: '',
			showAnimateClass: 'bounce-in',
			hideAnimateClass: 'bounce-out'
		},
		maskClass:'',
		callBack: {
			preInput: noop,
			okFn: noop,
			cancelFn: noop
		}
	};
	var bool = {
		cancelBool: false,
		okBool: true
	},
	
	callBackAll = function ( obj ) {
		if ( obj.callBack.okFn ) {
			obj.callBack.okFn.call( obj.elem );
		}
		if ( obj.callBack.cancelFn ) {
			obj.callBack.cancelFn.call( obj.elem );
		}
	},
	createRoot = function ( ops ) {
		var root  = document.getElementById('msgbox');
		
		var cls, len = 0, i = 0;


		var container
		var content
		if ( !root ) {
			var tmpEle = document.createElement('div');
			//创建msgbox根节点
			root = tmpEle.cloneNode(false);
			root.id = 'msgbox';
			root.style.zIndex = 9999;
			// root.classList.add('msgbox');
			root.className = 'msgbox';
			//创建根容器
			container = tmpEle.cloneNode(false);
			// container.classList.add('msgbox-container');
			container.className = 'msgbox-container'

			
			//创建内容容器
			content = tmpEle.cloneNode(false);
			// content.classList.add('msgbox-content');
			content.className = 'msgbox-content';

			root.appendChild(container);
			container.appendChild(content);

			document.documentElement.appendChild(root);
		} else {

			// container = root.querySelectorAll('.msgbox-container')[0];
			// content = root.querySelectorAll('.msgbox-content')[0];

			container = _getElement('.msgbox-container', root)[0];
			content = _getElement('.msgbox-content', root)[0];

		}
		root.className = 'msgbox';
		// root.classList.add('msgbox')
		
		if( ops.customClass.userClass ) {

			cls = ops.customClass.userClass.match(/\S+/g) || [];
			len = cls.length;

			for( ; i < len; i++ ) {
				root.className += ' '+cls[i];
			}
			// root.className = '';
			// root.classList.add('msgbox')
			// root.classList.add(ops.customClass.userClass)
		}
		elem.root      = root;
		elem.container = container;
		elem.content   = content;
		return elem;
	},
	windowBoxHander = function ( obj ) {
		show( obj );
		
		if ( obj.elem.okBtn ) {
			__event._one(obj.elem.okBtn, 'click', function ( e ) {
				__event._stopPropagation(e);
				hide( obj, true );
			});
		}
		if ( obj.elem.cancelBtn ) {
			__event._one(obj.elem.cancelBtn, 'click', function ( e ) {
				__event._stopPropagation(e);
				hide( obj, false );
			});				
		}
	},
	show = function ( obj, bool ) {

		if( _css(obj.elem.root, 'display') === 'none' ) {
			_ui.mask.show(function () {
				obj.elem.root.style.display = 'block';
				obj.elem.content.style.height = obj.elem.titleBox.offsetHeight+obj.elem.msgBox.offsetHeight+obj.elem.btnBox.offsetHeight+'px';
				if( css3Animate && obj.customClass.showAnimateClass ) {
					__class._classAnimate(obj.elem.root, obj.customClass.showAnimateClass, function (){
						__class._removeClass(obj.elem.root, obj.customClass.showAnimateClass);
					});
				}
			});
		}
		if( obj.callBack.preInput ) {
			obj.callBack.preInput.call( obj.elem );
		}
	},
	hide = function ( obj, bool ) {
		if( _css(obj.elem.root, 'display') !== 'none' ) {			
			if( css3Animate && obj.customClass.hideAnimateClass ) {
				__class._classAnimate(obj.elem.root, obj.customClass.hideAnimateClass, function (){
					obj.elem.root.style.display = 'none';
					if( bool === true ) {
						_ui.mask.hide(function () {
							if ( obj.callBack.okFn ) {
								obj.callBack.okFn.call( obj.elem );
							}
						});
					} else if ( bool === false ) {
						_ui.mask.hide(function () {
							if ( obj.callBack.cancelFn ) {
								obj.callBack.cancelFn.call( obj.elem );
							}
						});
					} else {
						_ui.mask.hide();
					}
					__class._removeClass(this, obj.customClass.hideAnimateClass);
				});
			} else {
				_ui.mask.hide(function () {
					obj.elem.root.style.display = 'none';
					if( bool === true ) {
						if ( obj.callBack.okFn ) {
							obj.callBack.okFn.call( obj.elem );
						}
					} else if ( bool === false ) {
						if ( obj.callBack.cancelFn ) {
							obj.callBack.cancelFn.call( obj.elem );
						}
					} else {
						_ui.mask.hide()
					}
				});
			}
		}
	},
	insertHTML = function ( obj ) {
		obj.bool = bool;
		var str = [
			'<div class="msgbox-body">'
			,' <span class="inner-bg">'
			,' 	<span class="inner"><span class="inner2"></span></span>'
			,' </span>'
			,' <div class="msgbox-body-inner">'
			,'		<div class="msgbox-title">'
			,'			<span class="msg-title-txt">{%=it.title%}</span>'
			,'		</div>'
			,'		<div class="msgbox-msg">'
			,'			{%=it.msg%}'
			,'		</div>'
			,'		<div class="msgbox-buttons">'
			,'			{%?it.bool.cancelBool%}'
			,'				<button type="buttom" data-msgbox-btn="cancel" class="btn btn-sm btn-default {%?it.customClass.cancelClass%}{%=it.customClass.cancelClass%}{%?%}">{%=it.txt.cancelTxt%}</button>'
			,'			{%?%}'
			,'			{%?it.bool.okBool%}'
			,'				<button type="buttom" data-msgbox-btn="ok" class="btn btn-sm btn-warning {%?it.customClass.okClass%}{%=it.customClass.okClass%}{%?%}">'
			,'					<span class="btn-txt">{%=it.txt.okTxt%}</span>'
			,'					<div class="loading-spinner-outer">'
			,'						<div class="loading-spinner">'
			,'							<span class="loading-top"></span>'
			,'							<span class="loading-right"></span>'
			,'							<span class="loading-bottom"></span>'
			,'							<span class="loading-left"></span>'
			,'						</div>'
			,'					</div>'
			,'				</button>'
			,'			{%?%}'
			,'		</div>'
			,'	</div>'
			,'</div>'
		].join('');

		// obj.elem.content.innerHTML = $.doT(str, obj);
		obj.elem.content.innerHTML = _doT.template(str).apply(null,[obj]);

		// obj.elem.bodyBox = obj.elem.content.querySelectorAll('.msgbox-body')[0];
		obj.elem.bodyBox = _getElement('.msgbox-body', obj.elem.content)[0];


		// obj.elem.titleBox = obj.elem.content.querySelectorAll('.msgbox-title')[0];
		obj.elem.titleBox = _getElement('.msgbox-title', obj.elem.content)[0];

		// obj.elem.msgBox = obj.elem.content.querySelectorAll('.msgbox-msg')[0];
		obj.elem.msgBox = _getElement('.msgbox-msg', obj.elem.content)[0];

		// var button = obj.elem.content.querySelectorAll('.msgbox-buttons')[0].getElementsByTagName('button');
		obj.elem.btnBox = _getElement('.msgbox-buttons', obj.elem.content)[0];

		var button = obj.elem.btnBox.getElementsByTagName('button');

		for( var i = 0, len = button.length; i < len; i++ ) {
			var attr = button[ i ].getAttribute('data-msgbox-btn');
			if( attr ) {
				if( attr == 'ok' ) {
					obj.elem.okBtn = button[ i ];
				}
				if( attr == 'cancel' ) {
					obj.elem.cancelBtn = button[ i ];
				}
			}
		}
		delete obj.bool;
		return obj;
	},
	containerEvt = function ( obj ) {
		var evStart = _css3Prefix.touch_EV.start_EV;
		var evEnd = _css3Prefix.touch_EV.end_EV;
		__event._one(obj.elem.container, evStart, function ( e ) {
			if ( e.target == obj.elem.container ) {
				__class._addClass(obj.elem.root, 'txt-select-off');
			}
		});
		__event._one(obj.elem.container, evEnd, function ( e ) {
			__class._removeClass(obj.elem.root, 'txt-select-off');

			if ( e.target == obj.elem.container ) {
				hide( obj );
				if( obj.callBack.cancelFn ) {
					obj.callBack.cancelFn.call( obj.elem );
				}
			}
		});
		var keyEventFn = function ( e ) {
			if( e.keyCode === 27 ) {
				__class._removeClass(obj.elem.root, 'txt-select-off');
				hide( obj );
				if( obj.callBack.cancelFn ) {
					obj.callBack.cancelFn.call( obj.elem );
				}
				keyEvent( true )
			}
		}
		var keyEvent = function ( arg ) {
			var winTop = window.top;
			var allIfr = winTop.document.getElementsByTagName('iframe');
			var len = allIfr.length;
			var i = 0;
			if( arg ) {
				if( len ) {
					for( ; i < len; i++ ) {
						__event._off( allIfr[ i ].contentWindow, 'keyup', keyEventFn);
					}
					__event._off( window, 'keyup', keyEventFn);
				} else {
					__event._off( window, 'keyup', keyEventFn);
				}
			} else {
				if( len ) {
					for( ; i < len; i++ ) {
						__event._on( allIfr[ i ].contentWindow, 'keyup', keyEventFn);
					}
					__event._on( window, 'keyup', keyEventFn);
				} else {
					__event._on( window, 'keyup', keyEventFn);
				}
			}

		}
		keyEvent();
	};
	function msgHide() { 
		if(!elem.root) return;
		elem.root.style.display = 'none';
		_ui.mask.hide();
	}
	_ui.msgbox = function ( options ) {

		var options = _extend(!0, {}, globalOps, options );

		options.elem = createRoot( options );

		// containerEvt( options );

		if( options.type == 'alert' ) {

			bool.cancelBool = false;
			bool.okBool = true;

			windowBoxHander( insertHTML( options ) );

		} else if ( options.type == 'confirm' ) {

			bool.cancelBool = true;
			bool.okBool = true;

			windowBoxHander( insertHTML( options ) );
		}
		containerEvt( options );
	};
	_ui.msgbox.hide = msgHide;
}( window ));
utils =  {
	globalCache : globalCache
	,doT              : _doT
	,browser          : _browser
	,isArray          : _isArray
	,isFunction       : _isFunction
	,isWindow         : _isWindow
	,isPlainObject    : _isPlainObject
	,isObject         : _isObject
	,isEmptyObject    : _isEmptyObject
	,unique           : _unique
	,each             : _each
	,getType          : _getType
	,extend           : _extend
	,getEle           : _getElement
	,getElement       : _getElement
	,css3Prefix       : _css3Prefix

	,on               : __event._on
	,off              : __event._off
	,one              : __event._one
	,trigger          : __event._trigger
	,eventStop        : __event._evtStop
	,preventDefault   : __event._preventDefault
	,stopPropagation  : __event._stopPropagation

	,attr             : _attr
	,data             : _data
	,css              : _css
	,hasClass         : __class._hasClass
	,addClass         : __class._addClass
	,removeClass      : __class._removeClass
	,_classAnimate    : __class._classAnimate
	,getField         : _getField
	,serialize        : _serialize
	,ajax             : _ajax
	,post             : _post
	,get              : _get
	,animate          : __animate._animate
	,stop             : __animate._stop
	
	,ui               : window._ui
}
window.utils = utils;
return utils;

}));