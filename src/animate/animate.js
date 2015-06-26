// 动画

/*
_animate(obj, {width:100px}, 2000, 'linear', fn)

 */
;var __animate = (function (){
	var Tween = {
		//匀速
		linear: function(t, b, c, d) {
			return c * t / d + b;
		},
		//加速曲线
		easeIn: function(t, b, c, d) {

			return c * (t /= d) * t + b;
		},
		//减速曲线
		easeOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		//加速减速曲线
		easeBoth: function(t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t + b;
			}
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		//加加速曲线
		easeInStrong: function(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		//减减速曲线
		easeOutStrong: function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		//加加速减减速曲线
		easeBothStrong: function(t, b, c, d) {
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t * t + b;
			}
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		//正弦衰减曲线（弹动渐入）
		elasticIn: function(t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		//正弦增强曲线（弹动渐出）
		elasticOut: function(t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d) == 1) {
				return b + c;
			}
			if (!p) {
				p = d * 0.3;
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		elasticBoth: function(t, b, c, d, a, p) {
			if (t === 0) {
				return b;
			}
			if ((t /= d / 2) == 2) {
				return b + c;
			}
			if (!p) {
				p = d * (0.3 * 1.5);
			}
			if (!a || a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else {
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			if (t < 1) {
				return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
					Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			}
			return a * Math.pow(2, -10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
		},
		//回退加速（回退渐入）
		backIn: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		backOut: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 3.70158;
				//回缩的距离
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		backBoth: function(t, b, c, d, s) {
			if (typeof s == 'undefined') {
				s = 1.70158;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		//弹球减振（弹球渐出）
		bounceIn: function(t, b, c, d) {
			return c - Tween['bounceOut'](d - t, 0, c, d) + b;
		},
		bounceOut: function(t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
			}
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		},
		bounceBoth: function(t, b, c, d) {
			if (t < d / 2) {
				return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
			}
			return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
		}
	}


	var createTime = function(){
		return  (+new Date)
	}
	var isSet = {
		display : !0,
		'z-index': !0,
		zIndex: !0
	}
	var duration = 200;
	return {
		_animate: function ( obj, ops, time, easing, fn ) {
			if( !obj || obj.nodeType !== 1 || !ops ) return;

			if( !time && _isFunction( easing ) ) {
				fn = easing;
				time = duration;
				easing = 'linear';
			}
			if( _isFunction( easing ) ) {
				fn = easing;
				easing = 'linear'
			}
			if( !time ) {
				time = duration
			}
			if( !easing ) {
				easing = 'linear'
			}
			time = parseInt( time );
			fn = fn || noop;
			// 缓存
			var id = globalCache.getGid(obj, 'animateName');
			//获取缓存
			var set = globalCache.animateCache[ id ] = globalCache.animateCache[ id ] ? 
						globalCache.animateCache[ id ] : {};
			// 动画开始时间
			var startTime = createTime();
			var animatePre = '' + startTime;	
			// 缓存数据
			set[ animatePre ] = {
				timerId: null,
				status: false
			}

			// 缓存格式, 利用时间戳来做判断依据		
			// animateCache = {
			// 	startTime: {
			// 		timerId: null,
			//  	status: false  执行过程中设为ture
			// 	}
			// }		
			// console.log( set )
			function step () {
				//每次变化的时间 初始时间 + 预设时间 - 当前时间
				var changTime = time - Math.max(0, startTime + time - createTime());
				var value, target;

				if( !set[ animatePre ] ) return;
				
				set[ animatePre ].status = true;
				for( var i in ops ) {
					value = isSet[ i ] ? ops[ i ] : Tween[ easing ]( changTime, tmpJson[ i ], ops[ i ] - tmpJson[ i ], time );
					_css( obj, i, value );
				}
				if( changTime < time ) {
					requestAnimationFrame( step );
				} else {
					cancelAnimationFrame( set[ animatePre ].timerId );
					
					set[ animatePre ].status = false;
					fn&&fn.call(obj);

					// 动画执行结束删除缓存
					delete set[ animatePre ];
				}
			}
			var i, tmpJson = {};
			cancelAnimationFrame( set[ animatePre ].timerId )

			


			for( i in ops ) {
				if( i === 'opacity' ) {
					tmpJson[ i ] = ops[ i ] > 1 ? 0 : 100;
					ops[ i ] = parseFloat( ops[ i ] ) / 100;
				} else {
					tmpJson[ i ] = isSet[ i ] ? _css( obj, i ) : parseFloat( _css( obj, i ) );
					if( isSet[ i ] ) {
						tmpJson[ i ] = _css( obj, i );
					} else {
						tmpJson[ i ]  = parseFloat( _css( obj, i ) );
						ops[ i ] = parseFloat( ops[ i ] );
					}
					// tmpJson[ i ] = _css( obj, i );
				}
			}
			set[ animatePre ].timerId = requestAnimationFrame( step );
			return obj;
		},
		_stop: function ( obj ) {
			var id = globalCache.getGid(obj, 'animateName');
			var set = globalCache.animateCache[ id ];
			var i;
			for( var i in set ) {
				if( set[ i ].status === true ) {
					cancelAnimationFrame( set[ i ].timerId );
					delete set[ i ];
				}
			}
		}
	}
}());
