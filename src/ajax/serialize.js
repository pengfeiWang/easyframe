;var _serialize = (function () {
	function param ( a ) {
		var prefix,
			s = [],
			r20 = /%20/g,
			add = function( key, value ) {
				value = _isFunction( value ) ? value() : ( value == null ? '' : value );
				s[ s.length ] = encodeURIComponent( key ) + '=' + encodeURIComponent( value );
			};
		if ( _isArray( a ) ) {
			for(var i = 0, len = a.length; i < len; i++) {	
				add( i, a[i] );
			}
		} else {					
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ],  add );
			}
		}
		return s.join( '&' ).replace( r20, '+' );
	}
	function buildParams ( prefix, obj, add ) {
		var name,
			rbracket = /\[\]$/;
		if ( _isArray( obj ) ) {
			for(var i = 0, len = obj.length; i < len; i++ ) {
				if ( rbracket.test( prefix ) ) {
					add( prefix, obj[i] );
				} else {
					buildParams( prefix + '[' + ( typeof obj[i] === 'object' ? i : '' ) + ']', obj[i],  add );
				}
			}
		} else if ( _isObject( obj ) ) {
			for ( name in obj ) {
				buildParams( prefix + '[' + name + ']', obj[ name ],  add );
			}
		} else {
			add( prefix, obj );
		}
	}

	return function ( obj ) {
		if( !obj ) return;
		return param( _getField( obj ) );
	}
}());