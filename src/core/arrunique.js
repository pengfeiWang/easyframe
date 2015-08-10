/**
 * 数组去重
 * @param  arr [ Array ]
 * @return arr
 */
function _unique ( arr ) {
	var n = [];
	if( !arr ) return;
	for ( var i = 0, len = arr.length; i < len; i++ ) {
		if ( n.indexOf(arr[ i ]) == -1 ) n.push(arr[ i ]);
	}
	return n;
}