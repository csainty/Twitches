var viewModel = {
	firstTime: ko.observable(true),
	isLoggedIn: ko.observable(false),
	loaded: ko.observable(true),
	userName: ko.observable(""),
	searchTerm: ko.observable(""),
	lastSearchTerm: ko.observable(""),
	twitter_since_id: ko.observable(""),
	tweets: ko.observableArray([]),
	messages: ko.observableArray([]),
	signIn: signIn,
	search: searchTwitter
}
viewModel.welcomeMessage = ko.dependentObservable(function () {
	return this.isLoggedIn() ? this.userName() : "Sign In";
}, viewModel);
ko.applyBindings(viewModel);

function signIn() {
	viewModel.isLoggedIn(true);
	viewModel.userName("testing");
}

function searchTwitter() {
	viewModel.firstTime(false);
	if (viewModel.lastSearchTerm() != viewModel.searchTerm()) {
		viewModel.tweets.removeAll();
		viewModel.twitter_since_id('');
		viewModel.lastSearchTerm(viewModel.searchTerm());
	}
	$.ajax({
		url: 'http://search.twitter.com/search.json',
		dataType: 'jsonp',
		data: {
			q: viewModel.searchTerm(),
			result_type: 'recent',
			since_id: viewModel.twitter_since_id(),
			rpp: 20,
			lang: 'en'
		},
		success: handleTwitterResponse
	});
	$.ajax({
		url: '/Api/SendMessage',
		dataType: 'json',
		data: {
			channel: viewModel.searchTerm(),
			message: 'Hello World'
		},
		success: function (result) {
			$.ajax({
				url: '/Api/GetMessages',
				dataType: 'json',
				data: {
					channel: viewModel.searchTerm()
				},
				success: handleMessageResponse
			});
		}
	});
}

function handleTwitterResponse(result) {
	viewModel.twitter_since_id(result.max_id);
	for (var index = result.results.length - 1; index >= 0; index--) {
		if (result.results[index].text.substring(0, 2) !== "RT") {
			viewModel.tweets.unshift(result.results[index]);
		}
	}
}

function handleMessageResponse(result) {
	for (var index = result.messages.length - 1; index >= 0; index--) {
		viewModel.messages.unshift(result.messages[index]);
	}
}