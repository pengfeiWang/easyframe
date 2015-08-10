var oproto = Object.prototype,
	oToString = oproto.toString,
	ohasOwn = oproto.hasOwnProperty;
// 缓存系统
var globalCache = {
	eventCache   : {},
	guid         : 1,
	sName        : '__eventCache',
	elemOldStatus: {},
	dataCache    : {},
	getGid       : function ( elem ) {
		return elem[ '__$gid' + globalCache.sName ] || ( elem[ '__$gid' + globalCache.sName ] = globalCache.guid++ )
	}
};