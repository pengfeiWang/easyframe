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