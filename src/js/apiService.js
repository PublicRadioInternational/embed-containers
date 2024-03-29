var EntityEmbed = EntityEmbed || {};

(function(){

	var defaultConfig = {
		data: {},
		debug: 0,
		auth_token: '',
		domainName: '',
		filesDomainName: '',
		path: '',
		timeout: 15000
	};

	function ajaxWrapper(config){
		config = $.extend(true, {}, defaultConfig, config);

		var ajaxOptions = {
			timeout: config.timeout,
			crossDomain: true,
			type: config.methodType,
			dataType: 'json',
			jsonp: false,
			url: config.domainName + config.path,
		};

		if (!!config.headers) // this is a file upload
		{
			config.headers['x-auth-token'] = config.auth_token;
			config.headers['x-debug'] = config.debug;

			ajaxOptions.headers = config.headers;

			ajaxOptions.processData = false;
			ajaxOptions.contentType = false;
			ajaxOptions.data = config.data;

			if (typeof config.xhr === 'function')
			{
				ajaxOptions.xhr = config.xhr;
			}
		}
		else
		{
			config.data.debug = config.debug;
			config.data.auth_token = config.auth_token;
			ajaxOptions.data = JSON.stringify(config.data);
		}

		return $.ajax(ajaxOptions);
	};

	function set(config){
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function get(config){
		config.methodType = 'POST';
		return ajaxWrapper(config);
	};

	function uploadFile(config){
		config.methodType = 'POST';
		config.timeout = 0;
		return ajaxWrapper(config);
	};

	function getAuthToken(){
		return defaultConfig.auth_token;
	};

	function getDomainName(){
		return defaultConfig.domainName;
	};

	function getFilesDomainName(){
		return defaultConfig.filesDomainName;
	};

	function setAuthToken(token){
		defaultConfig.auth_token = token;
	};

	function setDomainName(d){
		defaultConfig.domainName = d;
		if (!defaultConfig.domainName.endsWith('/'))
		{
			defaultConfig.domainName += '/';
		}
	};

	function setFilesDomainName(d){
		defaultConfig.filesDomainName = d;
		if (!defaultConfig.filesDomainName.endsWith('/'))
		{
			defaultConfig.filesDomainName += '/';
		}
	};

	// determine debug level
	var rgxDevEnv = /^[^.]*staging[^.]*\.|\.dev$/;
	var isDevEnv = rgxDevEnv.test(window.location.host);
	if (isDevEnv){
		defaultConfig.auth_token = 'abc123';
		defaultConfig.debug = 1;
	}

	// expose necesary functionality
	EntityEmbed.apiService = {
		set: set,
		get: get,
		uploadFile: uploadFile,
		getAuthToken: getAuthToken,
		setAuthToken: setAuthToken,
		getDomainName: getDomainName,
		setDomainName: setDomainName,
		getFilesDomainName: getFilesDomainName,
		setFilesDomainName: setFilesDomainName
	};
})();