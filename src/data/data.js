// data


/* 
_data( obj, 'test', 'a') // data-test = a
_data( obj, 'test', {a:1, b:2}) // data-test = {a:1, b:2}
_data( obj, 'test', [0, 1, 2]) // data-test = [0, 1, 2]



*/

;var _data = (function () {
	return function ( obj, key, val ) {
		if( !obj || obj.nodeType !== 1 || key === undefined || typeof key === 'object' ) return;
		// 缓存
		var id = globalCache.getGid(obj, 'dateName');
		//获取缓存
		var set = globalCache.dataCache[ id ] = globalCache.dataCache[ id ] ? 
					globalCache.dataCache[ id ] : globalCache.dataCache[ id ] = {};

		
		var ret;
		key = 'data-' + key; 

		if( val === undefined ) { // 获取, 返回查询到的数据
			ret = set[ key ];
			return ret;
		} else { // 设置
			// 返回dom节点
			if( val === null ) { // val === null 则认为删除数据
				delete set[ key ];
			} else { // 设置数据
				set[ key ] = val
			}
			return obj;
		}
	}
}());