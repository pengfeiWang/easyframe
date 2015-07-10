utils =  {
	globalCache : globalCache
	,doT              : _doT
	,browser          : _browser
	,isArray          : _isArray
	,isFunction       : _isFunction
	,isWindow         : _isWindow
	,isPlainObject    : _isPlainObject
	,isObject         : _isObject
	,isEmptyObject    : _isEmptyObject
	,unique           : _unique
	,each             : _each
	,getType          : _getType
	,extend           : _extend
	,getEle           : _getElement
	,getElement       : _getElement
	,css3Prefix       : _css3Prefix

	,on               : __event._on
	,off              : __event._off
	,one              : __event._one
	,trigger          : __event._trigger
	,eventStop        : __event._evtStop
	,preventDefault   : __event._preventDefault
	,stopPropagation  : __event._stopPropagation

	,attr             : _attr
	,data             : _data
	,css              : _css
	,hasClass         : __class._hasClass
	,addClass         : __class._addClass
	,removeClass      : __class._removeClass
	,_classAnimate    : __class._classAnimate
	,getField         : _getField
	,serialize        : _serialize
	,ajax             : _ajax
	,post             : _post
	,get              : _get
	,animate          : __animate._animate
	,stop             : __animate._stop
	
	,ui               : window._ui
}
window.utils = utils;
return utils;
