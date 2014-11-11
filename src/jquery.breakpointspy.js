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

					detector.trigger("breakpointDetected", current);
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


		function getDataAttributes($el) {
			var dataAttributes = {};

			$(breakpoints).each(function(i, size) {
				dataAttributes[size] = $el.data("target-" + size);
			});
			return dataAttributes;
		}

		// The actual plugin constructor
		function BreakpointSpy(element, options) {
			this.element = element;
			this.$element = $(element);
			this.options = $.extend({}, defaults, options, getDataAttributes(this.$element));
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		BreakpointSpy.prototype = {
			init: function () {
				BreakpointDetector.init();

				var self = this,
					breakpointHandler = function(e, size) {
						self.move(size);
					},
					size = BreakpointDetector.getSize();

				self.move(size);
				$(document).on("breakpointDetected", breakpointHandler);
			},

			move: function(size) {
				var self = this,
					selector;

				// ascend through all the sizes and keep the selector for the size smaller or equal to
				// the current size
				$(breakpoints).each(function(i, current) {
					if (self.options[current]) {
						selector = self.options[current];
					}

					if (current === size) {
						return false;
					}
				});

				if (selector) {
					// todo: check if it's already there (or does jQuery handle that?)
					self.$element.appendTo($(selector));
				}
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
