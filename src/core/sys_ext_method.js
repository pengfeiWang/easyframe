/**
 * 数组原型添加 indexOf 方法
 */
if ( !Array.prototype.indexOf ) {
	Array.prototype.indexOf = function ( element, index ) {
		var length = this.length;
		var current;
		if ( index == null ) {
			index = 0;
		} else {
			index = +index || 0;
			if ( index < 0 ) index += length;
			if ( index < 0 ) index = 0;
		}
		for ( ; index < length; index++ ) {
			current = this[ index ];
			if ( current === element ) return index;
		}
		return -1;
	}
}
if (!'string'.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function () {
        return this.replace(rtrim, "")
    }
}