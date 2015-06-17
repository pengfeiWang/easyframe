//偷jQuery.extend方法，可用于浅拷贝，深拷贝
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
	//如果只有一个参数立即返回
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