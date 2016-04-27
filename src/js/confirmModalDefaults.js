var EntityEmbed = EntityEmbed || {};

;(function(){

	// PRIVATE

	var defaultOptions = {
			modalId: 'leave-confirmation-modal', // the HTML id of the element which contains the modal
			viewPath: 'modal_confirmation.html', // path to modal HTML file
			abortElId: 'btn-cancel-leave',
			completeElId: 'btn-confirm-leave'
		};

	function confirmModalDefaults(options) {
		var self = this;
		if (!options)
		{
			options = {};
		}
		self.options = $.extend(true, {}, defaultOptions, options);
		self.init();
	};


	confirmModalDefaults.prototype.init = function(){
		var self = this;

		self.$abortEl = $('#' + self.options.abortElId);
		self.$completeEl = $('#' + self.options.completeElId);
	};

	confirmModalDefaults.prototype.functions = {
		init: {
			before: function(scope){
				/*
				 * assume that these are already defined:
				 *		scope.modalCtrl			(default for all modals from modal.js)
				 *		scope.parentModalCtrl
				 */
			},
			after: function(scope){
			}
		},
		open: {
			before: function(scope){},
			after: function(scope){},
		},
		abort: {
			before: function(scope){
				return true;
			},
			after: function(scope){}
		},
		complete: {
			before: function(scope){
				scope.parentModalCtrl.$el.abortModal({ confirmedLeave: true });
				return true;
			},
			after: function(scope){}
		}
	};

	EntityEmbed.confirmModalDefaults = confirmModalDefaults;
}());
