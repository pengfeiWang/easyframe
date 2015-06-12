var class2type = {};
'Boolean Number String Function Array Date RegExp Object Error'.replace(rword, function ( name ) {
	class2type[ '[object ' + name + ']' ] = name.toLowerCase()
});
/*取得目标类型*/
function _getType ( obj ) { //
	if ( obj == null ) {
		return String(obj)
	}
	// 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
	return typeof obj === 'object' || typeof obj === 'function' ?
	class2type[ oToString.call(obj) ] || 'object' :
		typeof obj
}	