/*! ============================================= 
    project: easyframe  
    version: 0.1.1 
    update: 2015-08-05 
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
	var utils;
	

var rword = /[^, ]+/g,
	rnospaces = /\S+/g,
	rwindow = /^\[object (?:Window|DOMWindow|global)\]$/,
	doc = document,
	root = doc.documentElement,
	W3C = window.dispatchEvent;

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
var oproto = Object.prototype,
	oToString = oproto.toString,
	ohasOwn = oproto.hasOwnProperty;
// 缓存系统
var globalCache = {
	eventCache   : {},
	guid         : 1,
	sName        : '__eventCache',
	elemOldStatus: {},
	dataCache    : {},
	getGid       : function ( elem ) {
		return elem[ '__$gid' + globalCache.sName ] || ( elem[ '__$gid' + globalCache.sName ] = globalCache.guid++ )
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
var _isFunction = typeof alert === 'object' ? function ( fn ) {
	try {
		return /^\s*\bfunction\b/.test(fn + "")
	} catch ( e ) {
		return false
	}
} : function ( fn ) {
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
//与jQuery.extend方法，可用于浅拷贝，深拷贝
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
	//如果只有一个参数，那么新成员添加于mix所在的对象上
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
				if ( deep && copy && (_isPlainObject(copy) || (copyIsArray = Array.isArray(copy))) ) {
					if ( copyIsArray ) {
						copyIsArray = false
						clone = src && Array.isArray(src) ? src : []
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
// var _getElement = (funcion (){

// 	return function () {

// 	}
// })();
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
		return context.getElementsByTagName(select);
	}
}
/*======================
		class	
======================*/
// var cls = (function (){
	
// })();
function _addClass ( elem, cls, fn ) {
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
function _removeClass ( elem, cls, fn ) {
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
function _hasClass ( elem, cls ) {
	if ( elem.nodeType === 1 && elem.className ) {
		return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1
	}
	return false;
}
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
	var cssNumber = {
		'columncount': !0,
		'fontweight': !0,
		'lineheight': !0,
		'column-count': !0,
		'font-weight': !0,
		'line-height': !0,
		'opacity': !0,
		'orphans': !0,
		'widows': !0,
		'zIndex': !0,
		'z-index': !0,
		'zoom': !0
	};


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
		if( attr === 'opacity' && !window.getComputedStyle ) {
			setOpacity(obj, value);
		} else {
			obj.style[attr] = addPx(attr, value);
		}
	};
	var rGet = /^(opacity|outerWidth|outerHeight)$/;
	var getMaps = {
		opacity:  getOpacity,
		outerWidth: outerWidth,
		outerHeight: outerHeight
	}
	var getStyle, getOpacity, setOpacity, ret, style;
	if (window.getComputedStyle) {
		getStyle = function ( obj, attr ) {
			style = getComputedStyle(obj, null);
			if (style) {
				ret = attr === 'filter' ? style.getPropertyValue(attr) : style[attr]
				if (ret === '') {
					ret = obj.style[attr] //其他浏览器需要我们手动取内联样式
				}
			}
			return ret
		}
	} else {
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
		getStyle = function ( obj, attr ) {
			if( rGet.test(attr) ) {
				return getMaps[attr](obj);
			}
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
		};
		getOpacity = function( node ) {
			//这是最快的获取IE透明值的方式，不需要动用正则了！
			var alpha = node.filters.alpha || node.filters[salpha],
				op = alpha && alpha.enabled ? alpha.opacity : 100
			return (op / 100) + '' //确保返回的是字符串
		};
		setOpacity = function ( node, val ) {
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
	}
	var addPx = function ( attr, val ) {
		return (typeof(val) === 'number') && !cssNumber[ attr.toLowerCase() ] ? val + 'px' : val;
	};

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
		if( value ) {

			setStyle(elem, cssName(ops), value);
			return elem;
		}
		if( ops ) { //设置
			if( typeof ops === 'string' ) { // ops如果是字符串把它当成要获取的属性
				return getStyle(elem, cssName(ops));
			}
			for( i in ops ) {
				setStyle(elem, cssName(i), ops[i]);
			}
			return elem;
		} else { //获取
			return getStyle(elem, cssName(ops));
		}
		return elem;
	}
})();

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
		event.initEvent(ev, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
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
function _on ( obj, ev, fn, capture, one ) {
	if ( arguments.length < 3 ) return;
	//用空格 间隔 事件
	ev = ev.match(rword);
	var id = globalCache.getGid(obj, one),
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
			obj.attachEvent('on' + ev, fn);
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
function _off ( obj, ev, fn, capture ) {
	if ( !obj ) {
		return;
	}
	if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || _isWindow(obj) ) {
		var id = globalCache.getGid(obj);
		var ageLen = arguments.length;
		var cache = globalCache.eventCache[ id ];
		var removeEvent = function ( evS, ev, fn, idx ) {
			evS.splice(idx, 1);
			if ( obj.addEventListener ) {
				obj.removeEventListener(ev, fn);
			} else if ( obj.detachEvent ) {
				obj.detachEvent('on' + ev, fn);
			} else {
				obj[ 'on' + ev ] = null;
			}
		}
		var handleEvent = function ( hdlEvt, hdlFn ) {
			var evt = hdlEvt ? cache[ hdlEvt ] : false;
			var callBackFn = hdlFn === undefined ? fn : false;
			var eLen = 0;
			if ( evt ) {
				eLen = evt.length;
				if ( callBackFn ) {
					for ( var i = 0; i < eLen; i++ ) {
						if ( evt[ i ].fn == callBackFn ) {
							// obj.removeEventListener( hdlEvt, fn, !!capture );
							// evt.splice( i, 1 );
							removeEvent(evt, hdlEvt, fn, i);
						}
					}
				} else if ( callBackFn === false ) {
					for ( var i = 0; i < eLen; i++ ) {
						// obj.removeEventListener( hdlEvt, evt[ i ], !!capture );
						// evt.splice( i, 1 );
						removeEvent(evt, hdlEvt, evt[ i ].fn, i);
					}
				}
			} else {
				for ( var i in cache ) {
					var evt = cache[ i ],
					    eLen = evt.length;
					for ( var j = 0; j < eLen; j++ ) {
						// obj.removeEventListener( i, evt[ j ], !!capture );
						// evt.splice( j, 1 );
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
				handleEvent(ev[ i ])
			}
		} else if ( ageLen == 2 ) {
			for ( var i = 0, len = ev.length; i < len; i++ ) {
				handleEvent(ev[ i ], false);
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
function _one ( obj, ev, fn, capture ) {
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
function _trigger ( obj, ev, data ) {
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
utils =  {
	globalCache : globalCache,
	browser     : _browser,
	isArray     : _isArray,
	unique      : _unique,
	each        : _each,
	getType     : _getType,
	extend      : _extend,
	getEle      : _getElement,
	getElement  : _getElement,
	css         : _css,
	hasClass    : _hasClass,
	addClass    : _addClass,
	removeClass : _removeClass,
	on          : _on,
	off         : _off,
	one         : _one,
	trigger     : _trigger
}
window.utils = utils;
return utils;

}));