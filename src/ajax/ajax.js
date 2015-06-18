// ajax

/*

type: [post, get]
dataType: [json, text]
data: {test: 1}
success : function
error: function

_ajax({
	url: '',
	type: 'post',
	dataType: 'json',
	data: {test: 1},
	success: function ( data ) {
	
	},
	error: function ( xhr ) {
	
	}
})

 */
function _ajax( obj ) {
	var timerID = null, timeIsOut = false;
	var ops = _extend({}, {
		type     : 'POST',
		url      : '',
		dataType : 'JSON',
		data     : {},
		timeout  : 0,
		success  : function () {},
		error    : function () {}
	}, obj);


	if( !ops.url ) return;
	if ( typeof ops.dataType !== 'string' ) {
		ops.dataType = 'json'
	}
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP') ;

	xhr.onreadystatechange = function () {
		var json;
		if( xhr.readyState == 4 && !timeIsOut && xhr.status == 200 ) {

			var responseText = xhr.responseText;

			if( /json/i.test( ops.dataType ) ) {
				try {
					json = JSON.parse(responseText);
				} catch ( e ) {
					new Error( e );
				}

				ops.success( json );
			} else {
				ops.success( responseText );
			}
		} else {
			ops.error( xhr )
		}
	}
	ops.data = _isEmptyObject( ops.data ) ? '' : _serialize( ops.data ) ;

	//超时检测
	ops.timeout = typeof ops.timeout === 'boolean' ? ( ops.timeout === true ? 5000 : false) : (typeof ops.timeout === 'string' || typeof ops.timeout === 'number' ? ( parseInt(ops.timeout, 10) == 0 || parseInt(ops.timeout, 10) <= 5000 ? false : parseInt(ops.timeout, 10) ) : parseInt(ops.timeout, 10) );
	if( !!ops.timeout ) {
		timerID = setTimeout(function() {
			if ( xhr.readyState != 4 ) {
				timeIsOut = true;
				xhr.abort();
				var confirmBol = confirm('请求超时\n点击确定自动刷新本页\n点击取消手动刷新')
				if( confirmBol ) {
					window.location.reload();
				}
				clearTimeout(timerID);
			}
		}, ops.timeout );
	}

	if ( /post/i.test( ops.type ) ) {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send( ops.data );
	} else {
		xhr.send( null );
	}
	}

function _post( url, data, callback, dataType ) {
	var ops = {};
		ops.url = url;
		ops.data = data;
		ops.success = callback
		ops.type = 'post';
		ops.dataType = dataType

	if( _isFunction( data )  ) {
		ops.success = data;
		ops.data = ''
	}
	if ( typeof callback === 'string' && _isFunction( data ) ) {
		ops.dataType = callback
	}
	_ajax( ops );
}
function _get( url, data, callback, dataType ) {
	var ops = {};
		ops.url = url;
		ops.data = data;
		ops.success = callback;
		ops.type = 'get';
		ops.dataType = dataType;

	if( _isFunction( data ) ) {
		ops.success = data;
		ops.data = ''
	}
	if ( typeof callback === 'string' && _isFunction( data ) ) {
		ops.dataType = callback
	}
	_ajax( ops );
}