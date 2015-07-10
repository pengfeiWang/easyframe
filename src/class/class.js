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
