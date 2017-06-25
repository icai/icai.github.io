$(function(){

var doc = document;
var win = window;
var Dom = {};

var utils = {
    isMob : (function() {
      var ua = navigator.userAgent.toLowerCase();
      var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      var result = false;
      for(var i = 0; i < agents.length; i++) {
        if(ua.indexOf(agents[i].toLowerCase()) > -1) {
          result = true;
        }
      }
      return result;
    })()
  }


  try{
  	var Dom = {
		$sidebar : $('#sidebar'),
		$sidebar_mask : $('#sidebar-mask'),
		$body : $(doc.body),
		$btn_side : $('#topbar .btn-bar'),
	};

	Dom.bindEvent = function() {

	    var me = this,
	      body_class_name = 'side',
	      eventFirst = 'click',
	      eventSecond = 'click';

	    if(utils.isMob) {
	      eventFirst = 'touchstart';
	      eventSecond = 'touchend';
	    }

	    this.$btn_side.on(eventSecond, function() {
	      if(me.$body.hasClass(body_class_name)) {
	        me.$body.removeClass(body_class_name);
	        me.$sidebar_mask.hide();
	      }else{
	        me.$body.addClass(body_class_name);
	        me.$sidebar_mask.show();
	      }
	    });

	    this.$sidebar_mask.on(eventFirst, function(e) {
	      me.$body.removeClass(body_class_name);
	      me.$sidebar_mask.hide();
	      e.preventDefault();
	    });
	    $(win).on('resize', function() {
	      me.$body.removeClass(body_class_name);
	      me.$sidebar_mask.hide();
	    });
	}
	Dom.bindEvent();
  }catch(e){}


	// Open external links in new window
	var externalLinks = function(){
		var host = location.host;

		$('body').on('click', 'a', function(e){
			var href = this.href,
				link = href.replace(/https?:\/\/([^\/]+)(.*)/, '$1');

			if (link != '' && link != host && !$(this).hasClass('fancybox')){
				window.open(href);
				e.preventDefault();
			}
		});
	};
	// Append caption after pictures
	var appendCaption = function(){
		$('.entry-content').each(function(i){
			var _i = i;
			$(this).find('img:not(.only)').each(function(){
				var alt = this.alt;

				if (alt != ''){
					$(this).after('<span class="caption">'+alt+'</span>');
				}

				$(this).wrap('<a href="'+this.src+'" title="'+alt+'" class="fancybox" rel="gallery'+_i+'" />');
			});
		});
	};
	// externalLinks(); // Delete or comment this line to disable opening external links in new window
	appendCaption(); // Delete or comment this line to disable caption
	
	$('.fancybox').fancybox();
})