// data


//设置 都会返回当前节点
//获取 返回需要获取的数据
/* 
_data( obj, 'test', 'a') 
data-test = a 
return obj

_data( obj, 'test', {a:1, b:2}) 
data-test = {a:1, b:2} 
return obj

_data( obj, 'test', [0, 1, 2])
data-test = [0, 1, 2] 
return obj

==========

_data( obj, 'test')
返回绑定obj上 key 为 test 的 数据 


_data( obj, 'test', null)
返回 obj,  并删除绑定到obj上key为test的数据 
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