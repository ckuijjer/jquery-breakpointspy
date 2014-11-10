/*
 *  jQuery Breakpoint Spy - v0.0.1
 *  A plugin that moves content when a Bootstrap breakpoint change occurs
 *  https://github.com/ckuijjer/jquery-breakpointspy/
 *
 *  Made by Casper Kuijjer
 *  Under MIT License
 */
;(function ($, window, document, undefined) {
		var pluginName = "breakpointSpy",
			defaults = {},
			breakpoints = ["xs","sm","md","lg"],
			BreakpointDetector;

		BreakpointDetector = (function() {
			var initialized = false,
				detector,
				current,
				previous;

			function createDetector() {
				detector = $("<div />");

				$(breakpoints).each(function() {
					var className = "visible-" + this + "-block";

					detector.append($("<div />")
						.addClass(className));
				});

				$("body").append(detector);
			}

			function resize() {
				current = getSize();
				if (current !== previous) {
					previous = current;

					detector.trigger("change.breakpointDetector", current);
				}
			}

			function getSize() {
				var el = detector.find(":visible"),
					className = el.attr("class"),
					size = className.split("-")[1];

				return size;
			}

			return {
				init: function() {
					createDetector();

					$(window).resize(resize);
					previous = current = getSize();

					initialized = true;
				},

				getSize: function() {
					return getSize();
				}
			};
		})();

		// The actual plugin constructor
		function BreakpointSpy(element, options) {
			this.element = element;
			this.$element = $(element);
			this.options = $.extend({}, defaults, options, this._getDataAttributes());
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		BreakpointSpy.prototype = {
			init: function () {
				BreakpointDetector.init();

				// add a event listener to the document as the custom events bubbles up
				// todo: make sure that as the element is removed this event handler is also
				// removed.
				$(document).on("change.breakpointDetector", $.proxy(this._move, this));

				// do the first one manually
				this._move(null, BreakpointDetector.getSize());
			},

			_move: function(e, size) {
				// walk through the breakpoints
				// xs sm and input lg should return sm
				// this should be cached yada yada
				var self = this,
					selector;

				$(breakpoints).each(function(i, current) {
					// if a selector is set for the current breakpoint remember it
					if (self.options[current]) {
						selector = self.options[current];
					}

					// exit with looking for the size
					if (current === size) {
						return false;
					}
				});

				if (selector) {
					// todo: check if it's already there (or does jQuery handle that?)
					self.$element.appendTo($(selector));
				}
			},

			_getDataAttributes: function() {
				var self = this,
					dataAttributes = {};

				$(breakpoints).each(function(i, size) {
					dataAttributes[size] = self.$element.data("target-" + size);
				});
				return dataAttributes;
			}
		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new BreakpointSpy(this, options) );
						}
				});
		};

})(jQuery, window, document);
