var EntityEmbed = EntityEmbed || {};

(function(){

	// PRIVATE
	function ajaxWrapper(methodType, path, data, doneFunc, failFunc, alwaysFunc){
		// avoid null reference errors
		if (!doneFunc)
		{
			doneFunc = function(){};
		}
		if (!failFunc)
		{
			failFunc = function(){};
		}
		if (!alwaysFunc)
		{
			alwaysFunc = function(){};
		}

		$.support.cors = true;

		data.auth_token='abc123';
		data.debug = 1;

		$.ajax({
			timeout: 15000,
			crossDomain: true,
			
			// TODO : this will not always be the case, but it
			// is how the API we are currently using is set up
			type: 'POST', 
			
			dataType: 'json',
			url: path,
			data: JSON.stringify(data)
		})
			.done(doneFunc)
			.fail(failFunc)
			.always(alwaysFunc);
	};

	function apiService(){};

	apiService.prototype.put = function(path, data, doneFunc, failFunc, alwaysFunc) {
		ajaxWrapper('PUT', path, data, doneFunc, failFunc, alwaysFunc);
	};

	apiService.prototype.post = function(path, data, doneFunc, failFunc, alwaysFunc) {
		ajaxWrapper('POST', path, data, doneFunc, failFunc, alwaysFunc);
	};

	apiService.prototype.get = function(path, data, doneFunc, failFunc, alwaysFunc) {
		ajaxWrapper('GET', path, data, doneFunc, failFunc, alwaysFunc);
	};

	apiService.prototype.del = function() {
		console.log('apiService.delete is not yet implemented');
	};

	EntityEmbed.apiService = new apiService();
})();