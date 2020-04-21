var IC_UI = {
	Support: {
		_fixed: function() {
			var container = document.body;
			
			if (document.createElement && container && container.appendChild && container.removeChild) {
				var el = document.createElement('div');
				
				if (!el.getBoundingClientRect) return null;
				
				el.innerHTML = 'x';
				el.style.cssText = 'position:fixed;top:100px;';
				container.appendChild(el);
				
				var originalHeight = container.style.height,
				originalScrollTop = container.scrollTop;
				
				container.style.height = '3000px';
				container.scrollTop = 500;
				
				var elementTop = el.getBoundingClientRect().top;
				container.style.height = originalHeight;
				
				var isSupported = (elementTop === 100);
				container.removeChild(el);
				container.scrollTop = originalScrollTop;
				
				return isSupported;
			}
			return null;
		},
		_ios: function(){
			var ua = navigator.userAgent;
			return ua.match(/iPhone/i) || ua.match(/iPod/i) || ua.match(/iPad/i);
		},
		init: function() {
			for(var i in this) {
				if(i.substring(0,1) == '_') {
					this[i.replace('_','')] = this[i]();
				}
			}
		}
	},
	
	Toggleable: {
		_p: {
			ctx: null,
			hd: null,
			tg: null,
			speed: 150,
			tclass: 'toggleable',
			tgclass: 'toggleable-target',
			opclass: 'toggleable-open',
			hidecond: true,
			title: ''
		},
		hide: function()
		{
			$(this._p.hd, this._p.ctx).slideUp(this._p.speed);
			$(this._p.ctx).removeClass(this._p.opclass);
		},
		show: function()
		{
			$(this._p.hd, this._p.ctx).slideDown(this._p.speed);
			$(this._p.ctx).addClass(this._p.opclass);
		},
		_setEvents: function()
		{
			if(this._p.hidecond) this.hide();
			var self = this;
			$(this._p.ctx).addClass(this._p.tclass);
			$(this._p.tg, this._p.ctx).click( function(e){
				e.preventDefault();
				if( $(self._p.hd, self._p.ctx).is(':hidden') ) self.show();
				else self.hide();
			}).attr('title', this._p.title).addClass(this._p.tgclass);
		},
		init: function(params) {
			var toggler = $.extend(true, {}, IC_UI.Toggleable, {_p: params});
			toggler._setEvents();
			return toggler;
		}
	},
		
	Staff: {
		prefs: {
			autoHeight: false,
			navigation: true,
			collapsible: true,
			active: false
		},
		init: function() {
			if($('.post-4590').length > 0) {
				$('.post-4590 .entry-content').accordion(IC_UI.Staff.prefs);
			}
		}
	},
	
	iOS: {
		init: function() {
			if (IC_UI.Support.ios) {
				$('body').addClass('platform-ios');
				if ($('body').hasClass('home')) {
					document.title = 'insertcredit';
				}
			}
		}
	},

	Paginator: {
		_p: '.entry-paginator',
		_ec: '.entry-content',
		_t: 0,
		_s: function() {
			if ($(window).scrollTop() > IC_UI.Paginator._t) {
				IC_UI.Paginator._p.addClass('paginator-float');
				if (IC_UI.Support.fixed) {
					IC_UI.Paginator._p.css({
						position: 'fixed',
						top: '0px'
					});
				} 
				else {
					IC_UI.Paginator._p.css({
						position: 'absolute',
						top: $(window).scrollTop() + 'px'
					});
					IC_UI.Paginator._ec.css({
						paddingTop: (IC_UI.Paginator._p.height() + 10) + 'px'
					});
				}
			}
			else {
				IC_UI.Paginator._p.css({
					position: 'static',
					top: '0px'
				}).removeClass('paginator-float');
				
				if (!IC_UI.Support.fixed) {
					IC_UI.Paginator._ec.css({
						paddingTop: '0px'
					});
				}
			}
		},
		init: function() {
			IC_UI.Paginator._p = $(IC_UI.Paginator._p);
			IC_UI.Paginator._ec = $(IC_UI.Paginator._ec);
			
			if (IC_UI.Paginator._p.length > 0) {
				IC_UI.Paginator._t = $('.entry-paginator').offset().top;
				$(window).scroll( IC_UI.Paginator._s );
			}
		}
	},
	
	Antimoire: {
		_to: null,
		_t: '#featured-posts a .overlay',
		_speed: 400,
		_am: function() {
			IC_UI.Antimoire._t.addClass('antimoire');
			IC_UI.Antimoire._to = setTimeout(function(){
				IC_UI.Antimoire._t.removeClass('antimoire');
				removeTimeout(IC_UI.Antimoire._to);
			}, IC_UI.Antimoire._speed);
		},
		init: function() {
			IC_UI.Antimoire._t = $(IC_UI.Antimoire._t);
			
			if (IC_UI.Antimoire._t.length > 0) {
				$(window).bind({
					scroll: IC_UI.Antimoire._am,
					mousewheel: IC_UI.Antimoire._am
				});
			}
		}
	}
};

$(document).ready( function(){
	var PageToggle = IC_UI.Toggleable.init({
		ctx: '.entry-paginator',
		hd: 'ul',
		tg: 'h3',
		title: 'Toggle paginator display',
		opclass: 'toggleable-open'
	});	
	IC_UI.Support.init();
	IC_UI.Staff.init();
	IC_UI.Paginator.init();
	IC_UI.iOS.init();
});