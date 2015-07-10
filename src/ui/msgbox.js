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