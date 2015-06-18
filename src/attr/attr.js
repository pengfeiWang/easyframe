//元素属性


/**
 * 属性名不区分大小大
 * @param  
 * @return 
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
				if( clsBool ) {
					_class(obj, val)
				} else {
					obj.setAttribute( name, value + '' );
				}
			}
			return obj;
		} else { // 获取
			if( clsBool ) {
				ret = obj.className;
			} else {
				ret = obj.getAttribute( name );
			}
			return ret;
		}
	}
}());

var _removeAttr = (function ( obj, attr ) {
	if( !obj && obj.nodeType !== 1 && attr === undefined ) return;
	if( obj.hasAttribute( attr ) ) {
		obj.removeAttribute( attr );
	}
	return obj;
}());