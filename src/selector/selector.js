/*======================
		selector	
======================*/
/**
 * @param select [ string ]
 * @param context
 * @returns elements || nodeElement
 */

// 
;function _getElement ( select, context ) {
	if ( !select )  return;
	if( select == 'body' ) {
		return document.body;
	}
	if ( typeof select !== 'string' ) return select;
	context = context || document;
	var selectFirst = select.charAt(0);
	var selectString = select.substring(1);
	var elem = null;
	var tmp = [];
	if ( selectFirst === '#' ) {
		elem = context.getElementById(selectString);
		return elem;
	} else if ( selectFirst === '.' ) {
		var tmpElems = context.getElementsByTagName('*');
		var reg = regWordBorder(selectString);
		for ( var i = 0, len = tmpElems.length; i < len; i++ ) {
			if ( reg.test(tmpElems[ i ].className) ) {
				tmp.push(tmpElems[ i ]);
			}
		}
		return tmp;
	} else {
		if( _browser.version <= 8 ) {
			return context.getElementsByTagName(select)
		}
		// return context.getElementsByTagName(select);
		return slice.call( context.getElementsByTagName(select) )
		// return ;
	}
}