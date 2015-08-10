	//切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
	var rword = /[^, ]+/g,
		rnospaces = /\S+/g;
	var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
	var oproto = Object.prototype;
	var oToString = oproto.toString;
	var ohasOwn = oproto.hasOwnProperty;
	var class2type = {}
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
	 * [regWordBorder 单词边距正则]
	 * @param  string
	 * @return regExp
	 */
	function regWordBorder ( str ) {
		return new RegExp('(^|\\s)' + str + '(\\s|$)')
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
	
	/**
	 * @param arr
	 * @returns boolean
	 */
	function _isArray ( arr ) {
		return oToString.call(arr) == '[object Array]';
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
	
	function camelize ( target ) {
		//转换为驼峰风格
		if ( target.indexOf('-') < 0 && target.indexOf('_') < 0 ) {
			return target; //提前判断，提高getStyle等的效率
		}
		return target.replace(/[-_][^-_]/g, function ( match ) {
			return match.charAt(1).toUpperCase()
		})
	}
	/*======================
			selector	
	======================*/
	/**
	 * @param select [ string ]
	 * @param context
	 * @returns elements || nodeElement
	 */
	function _getElement ( select, context ) {
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
	function _css ( elem, ops ) {
		if (!elem || !(elem instanceof HTMLElement) ) return;
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
			event	data
	======================*/
	
	var globalCache = {
		eventCache    : {},
		guid          : 1,
		sName          : '__eventCache',
		elemOldStatus : {},
		getGid        : function ( elem ) {
			return elem[ '__$gid' + globalCache.sName ] || ( elem[ '__$gid' + globalCache.sName ] = globalCache.guid++ )
		}
	};

	function _on ( obj, ev, fn, capture ) {
		if( arguments.length < 3 ) return;
		//用空格 间隔 事件
		ev = ev.match( rword );	
		var id = globalCache.getGid( obj ), 
			i = 0,
			len = ev.length;
		// 获取事件缓存, 如果不存在则创建
		var set = globalCache.eventCache[ id ] = globalCache.eventCache[ id ] ? globalCache.eventCache[ id ] : {};

		function eventBind ( obj, ev, fn, capture ) {
			if( obj.addEventListener ) {
				obj.addEventListener( ev, fn, !!capture );
			} else {
				obj.attachEvent( 'on'+ ev, fn );
			}
		}
		// 判断是否 dom 对象 或者 window
		if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || _isWindow( obj ) ) {
			for (; i < len; i++ ) {
				// 判断事件是否存在, 不存在则声明, 并push fn 
				if( !set[ ev[ i ] ] ) {
					set[ ev[ i ] ] = [];
					set[ ev[ i ] ].push( fn );
					eventBind( obj, ev[ i ], fn, !!capture )
				} else if ( _isArray( set[ ev[ i ] ] ) && set[ ev[ i ] ].indexOf(fn) ) {
					set[ ev[ i ] ].push( fn );
					eventBind( obj, ev[ i ], fn, !!capture )
				}
			}
		}
	}
	// 指定 event fn, 则销毁
	function _off ( obj, ev, fn, capture ) {
		if ( !obj ) {
			return;
		}
		if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || _isWindow( obj ) ) {
			var id = globalCache.getGid( obj );
			var ageLen = arguments.length;
			var chache = globalCache.eventCache[ id ];
			var handleEvent = function ( hdlEvt, hdlFn ) {
				var evt = hdlEvt ? chache[ hdlEvt ] : false;
				var callBackFn = hdlFn === undefined ? fn : false;
				var eLen  = 0;
				if(  evt ) {
					eLen = evt.length;
					if ( callBackFn ) {
						for ( var i = 0; i < eLen; i++ ) {
							if( evt[ i ] == callBackFn ) {
								obj.removeEventListener( hdlEvt, fn, !!capture );
								evt.splice( i, 1 );
							}
						}
					} else if ( callBackFn === false ) {
						for ( var i = 0; i < eLen; i++ ) {
							obj.removeEventListener( hdlEvt, evt[ i ], !!capture );
							evt.splice( i, 1 );
						}
					}				
				} else {
					for ( var i in chache ) {
						var evt = chache[ i ],
							eLen = evt.length;
						for ( var j = 0; j < eLen; j++ ) {
							obj.removeEventListener( i, evt[ j ], !!capture );
							evt.splice( j, 1 );
						}					
					}
				}
			}
			if ( !chache || _isFunction( ev ) ) return;
			ev = ev ? ev.match(rword) : [] ;
			if ( ageLen >= 3 ) {
				for ( var i = 0, len = ev.length; i < len; i++ ) {
					handleEvent( ev[ i ] )
				}
			} else if ( ageLen == 2 ) {
				for ( var i = 0, len = ev.length; i < len; i++ ) {
					handleEvent( ev[ i ], false );
				}				
			} else {
				handleEvent();
			}
		}
	};