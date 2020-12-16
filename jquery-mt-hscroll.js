(function($){
	$.fn.mt_hscroll = function(_options){
		var _settings = $.extend({
			wrapper:'.mt-hscroll-wrapper',
			container:'.mt-hscroll-container',
			item:'.mt-hscroll-item',
			scrollbar:'.mt-hscroll-scrollbar',
			scrollbar_handler_name:'mt-hscroll-scrollbar-handler',
			scrollbar_scrolling_name:'scrolling'
		},_options);				
		var _this = this;

		var _direction = $('body').css('direction');
		var _container = _this.children(_settings.container);
		var _is_down = false;
		var _start_x, _horizontal_scroll;

		var _outer_width = function(_elm){
			return _elm.outerWidth()+parseFloat(_elm.css('margin-left'))+parseFloat(_elm.css('margin-right'));
		};

		var _scrollbar_handler = $('<div>').addClass(_settings.scrollbar_handler_name).appendTo(_this.children(_settings.scrollbar));
		if(_direction==='ltr'){
			_scrollbar_handler.addClass('ltr');
		}
		_container.scrollLeft(0);
		var _set_scrollbar = function(){
			var _calc_width = 0;
			_container.find(_settings.item).each(function(){
				_calc_width += _outer_width($(this));
			});
			var _scrollbar_width = _outer_width(_this.children(_settings.scrollbar));
			_scrollbar_handler.css({'width':(_scrollbar_width*100/_calc_width)+'%'})
		};
		_set_scrollbar();

		_container.on('mousedown',function(e){
			_is_down = true;
			_container.addClass(_settings.scrollbar_scrolling_name);
			_start_x = e.pageX - _container.offset().left;
			_horizontal_scroll = _container.scrollLeft();
		});

		_container.on('mouseleave mouseup',function(){
			_is_down = false;
			_container.removeClass(_settings.scrollbar_scrolling_name);
		});

		_container.on('mousemove',function(e){
			if(!_is_down){
				return;
			}else{
				e.preventDefault();
				var x = e.pageX - _container.offset().left;
				var walk = (x - _start_x) * 3;
				var _horizontal_scroll_temp = _horizontal_scroll - walk;
				_container.scrollLeft(_horizontal_scroll_temp);

				var _full_width = 0;
				_container.find(_settings.item).each(function(){
					_full_width += _outer_width($(this));
				});
				var _handler_width = _scrollbar_handler.width();
				var _max_scroll = _full_width-_outer_width(_container);

				if(_horizontal_scroll_temp<=0){
					_horizontal_scroll_temp = Math.abs(_horizontal_scroll_temp);
				}else{
					_horizontal_scroll_temp = 0;
				}
				if(_horizontal_scroll_temp>_max_scroll){
					_horizontal_scroll_temp = _max_scroll;
				}

				var _horizontal_scroll_temp_percent = _horizontal_scroll_temp*100/_max_scroll;
				var _zarib = 1-(_scrollbar_handler.width()/_this.children(_settings.scrollbar).width());
				if(_direction==='rtl'){
					_scrollbar_handler.css({'right':(_horizontal_scroll_temp_percent*_zarib)+'%'});
				}else{
					_scrollbar_handler.css({'left':(_horizontal_scroll_temp_percent*_zarib)+'%'});
				}
			}
		});

		$(window).on('resize',function(){
			_set_scrollbar();
			_container.mousemove();
		});
	};
}(jQuery));
