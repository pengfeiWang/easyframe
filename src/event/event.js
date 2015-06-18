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
	return {
		/**
		 * 绑定事件
		 * @param  obj     dom对象
		 * @param  ev      事件
		 * @param  fn      回调函数
		 * @param  capture 标准浏览器, 是否捕获
		 * @param  one     内部使用, 是否来自 one函数
		 * @return 返回 obj
		 */
		_on: function ( obj, ev, fn, capture, one ) {
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
		},
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
		_off: function ( obj, ev, fn, capture ) {
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
		},
		/**
		 * 绑定, 执行一次
		 * @param  obj     dom 对象
		 * @param  ev      事件
		 * @param  fn      回调
		 * @param  capture 捕获
		 * @return 返回 dom 对象
		 */
		_one: function ( obj, ev, fn, capture ) {
			if ( !obj ) {
				return;
			}
			var proxy = function () {
				fn.apply(obj, arguments);
				_off(obj, ev, proxy, capture);
			}
			_on(obj, ev, proxy, capture, 'one');
			return obj;
		},
		/**
		 * 执行事件, 系统事件, 自定义事件
		 * @param  obj  dom对象
		 * @param  ev   事件
		 * @param  data 传递的数据
		 * @return 返回 dom
		 */
		_trigger: function ( obj, ev, data ) {
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
	}
});

