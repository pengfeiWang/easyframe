// 缓存系统

var globalCache = {
	
	guid: {
		__eventCache  : 1,
		__animateCache: 1,
		__dataCache   : 1
	},
	//事件缓存前置
	eventName  : '__eventCache',
	//动画缓存前置
	animateName: '__animateCache',
	//data缓存前置
	dateName   : '__dataCache',
	//缓存对象
	eventCache  : {},
	animateCache: {},
	dataCache   : {},
	//
	elemOldStatus: {},
	getGid       : function ( elem, typeName ) {

		typeName = typeName || globalCache[ 'eventName' ];

		return elem[ '__$gid' + typeName ] || ( elem[ '__$gid' + typeName ] = globalCache.guid[ typeName ]++ );
	}
};