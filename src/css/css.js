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

		if( attr === 'opacity' ) {
			if( window.getComputedStyle ) {
				obj.style[attr] = value
			} else {
				setOpacity(obj, value);
			}
			
		} else {
			// value 有可能是负值, ie8 以下的版本需要处理, 用当前元素值 + 负值, 得到正常值
			if( value < 0 && _browser.version <= 8 ) {
				value += parseFloat( _css( obj, attr ) );
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
		//这是最快的获取IE透明值的方式，不需要动用正则了！
		var alpha = node.filters.alpha || node.filters[salpha],
			op = alpha && alpha.enabled ? alpha.opacity : 100
		return (op / 100) + '' //确保返回的是字符串
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
		console.log( 'css---' )
		return elem;
	}
})();
