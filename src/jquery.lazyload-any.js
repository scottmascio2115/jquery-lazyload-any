/*
 * jQuery-lazyload-any v0.1.1
 * https://github.com/emn178/jquery-lazyload-any
 *
 * Copyright 2014, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function($, window, document, undefined) {

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1), 
          fToBind = this, 
          fNOP = function () {},
          fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                                   ? this
                                   : oThis,
                                 aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  var Lazyloader = function(element, options) {
    this.options = options || {};
    this.options.threshold = options.threshold || 0;
    if(this.options.threshold < 0)
      this.options.threshold = 0;
    this.element = $(element);
    this.resizeHandler = this.calculate.bind(this);
    this.scrollHandler = this.test.bind(this);
    $(window).bind('resize', this.resizeHandler);
    $(window).bind('scroll', this.scrollHandler);
  };

  Lazyloader.prototype.test = function() {
    if(!this.satisfied())
      return;
    this.show();
  };

  Lazyloader.prototype.calculate = function() {
    this.test();
  };

  Lazyloader.prototype.satisfied = function() {
    var rect = this.element[0].getBoundingClientRect();
    var x1 = y1 = -this.options.threshold;
    var y2 = screenHeight - y1;
    var x2 = screenWidth - x1;
    return (rect.top >= y1 && rect.top <= y2 || rect.bottom >= y1 && rect.bottom <= y2) &&
      (rect.left >= x1 && rect.left <= x2 || rect.right >= x1 && rect.right <= x2);
  };

  Lazyloader.prototype.show = function() {
    var comment = this.element.contents().filter(function() {
      return this.nodeType === 8;
    }).get(0);
    this.element.replaceWith(comment && comment.data);
    $(window).unbind('resize', this.resizeHandler);
    $(window).unbind('scroll', this.scrollHandler);
  };

  $.fn.lazyload = function(options) {
    var opts = {};
    $.extend(opts, options);
    this.each(function() {
      new Lazyloader(this, opts).test();
    });
  };

  var screenHeight, screenWidth;
  function resize()
  {
    screenHeight = window.innerHeight || document.documentElement.clientHeight;
    screenWidth = window.innerWidth || document.documentElement.clientWidth;
  }
  resize();

  $(document).ready(function() {
    $(window).bind('resize', resize);
  });
})(jQuery, window, document);
