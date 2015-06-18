/*======================
		class	
======================*/

// var cls = (function (){
	
// })();
function _addClass ( elem, cls, fn ) {
	if ( cls && typeof cls === 'string' && elem.nodeType === 1 ) {
		if ( !elem.className ) {
			elem.className = cls;
		} else {
			var arr = elem.className.match(rnospaces);
			cls.replace(rnospaces, function ( a ) {
				if ( arr.indexOf(a) === -1 ) {
					arr.push(a);
				}
			});
			elem.className = arr.join(' ');
		}
		if ( fn ) {
			fn.call(elem);
		}
	}
	return elem;
}
function _removeClass ( elem, cls, fn ) {
	if ( cls && typeof cls > 'o' && elem.nodeType === 1 && elem.className ) {
		var classNames = (cls || '').match(rnospaces) || [];
		var cl = classNames.length;
		var set = ' ' + elem.className.match(rnospaces).join(' ') + ' ';
		for ( var c = 0; c < cl; c++ ) {
			set = set.replace(' ' + classNames[ c ] + ' ', ' ');
		}
		elem.className = set.slice(1, set.length - 1);
		if ( fn ) {
			fn.call(elem);
		}
	}
	return elem;
}	
function _hasClass ( elem, cls ) {
	if ( elem.nodeType === 1 && elem.className ) {
		return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1
	}
	return false;
}