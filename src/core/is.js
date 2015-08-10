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