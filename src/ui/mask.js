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