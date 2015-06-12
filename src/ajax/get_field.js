var _getField = (function () {
	/**
	 * 获取表单字段
	 */
	function getFrmField ( obj ) {
		var elems = obj.elements;
		return filterFieldName( elems );
	}
	/**
	 * 获取元素下的字段
	 */
	function getElemField ( obj ) {
		var elems,
			input = _getElement('input', obj),
			textarea = _getElement('textarea', obj),
			select = _getElement('select', obj);
		elems = input.concat(textarea).concat(select);
		return filterFieldName( elems )
	}
	/**
	 * 筛选出有效的字段, 以name是否为真作为依据
	 */
	function filterFieldName ( elems ) {
		var tmp = [];
		for( var i = 0, len = elems.length; i < len; i++) {
			if( elems[ i ].name ){
				tmp.push( elems[ i ] );
			}
		}
		return tmp;
	}
	/**
	 * <input type="checkbox" name="t1[]" checked>
	 * <input type="checkbox" name="t1[]" checked>
	 * return { t1: [ value, value ]  }
	 * ============
	 * 
	 * 获取有效的字段, 并转成 key-value
	 */
	function getField ( obj ) {
		if( !obj ) return;
		if( _isObject( obj ) ) return obj;
		var dataArray = obj.tagName.toLowerCase() == 'form' ? getFrmField( obj ) : getElemField( obj );
		var o = {}, 
			i = 0, 
			len = dataArray.length,
			field = null,
			optLen,
			option,
			optValue,
			name = '',
			rbracket = /\[\]$/,
			handOpt = function(obj){
				var v = '';
				var tmp = [];
				var name = obj.name;
				for( var j = 0, optLen = obj.options.length; j < optLen; j++ ) {
					option = obj.options[j];
					if( option.selected ){
						if( option.hasAttribute ) {
							v = (option.hasAttribute('value') ? option.value : option.text )
						} else {
							v = (option.attributes('value').specified ? option.value : option.text )
						}
						tmp.push(v);
					}
				}
				if( tmp.length == 1 ) {
					tmp = tmp.join();
				}
				return tmp;
			};

			for( var i = 0, len = dataArray.length; i < len; i++) {
				field = dataArray[i];
				switch( field.type ) {
					case 'select-one':
					case 'select-multiple':
						name = field.name;
						o[name] = handOpt(field);
						break;
					case undefined:
					case 'file':
					case 'submit':
					case 'reset':
					case 'button':
						break;
					case 'radio':
					case 'checkbox':
						if( !field.checked ) {
							break
						}
					default:
						if( rbracket.test( field.name ) ) {
							name = field.name.replace(/\[|\]/g, '');
							if(  !o[name] ){
								o[name] = [];
							}
							o[name].push( field.value );
						} else {
							o[field.name] = field.value;
						}
				}
			}

		return o;
	}

	return getField;
}());