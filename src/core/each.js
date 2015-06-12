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