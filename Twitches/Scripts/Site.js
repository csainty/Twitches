var viewModel = {
	firstTime: ko.observable(true),
	loaded: ko.observable(true),
	searchTerm: ko.observable(""),
	lastSearchTerm: ko.observable(""),
	twitter_since_id: ko.observable(""),
	tweets: ko.observableArray([]),
	search: searchTwitter
}
ko.applyBindings(viewModel);
ko.linkObservableToUrl(viewModel.searchTerm, "q", "");
viewModel.searchTerm.subscribe(function (value) {
	searchTwitter();
});

function searchTwitter() {
	if (viewModel.searchTerm() === '') {
		viewModel.firstTime(true);
		clearTweets();
		return;
	}

	viewModel.firstTime(false);
	if (viewModel.lastSearchTerm() != viewModel.searchTerm()) {
		clearTweets();
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
}

function handleTwitterResponse(result) {
	viewModel.twitter_since_id(result.max_id);
	for (var index = result.results.length - 1; index >= 0; index--) {
		if (result.results[index].text.substring(0, 2) !== "RT") {
			viewModel.tweets.unshift(result.results[index]);
		}
	}
}

function clearTweets() {
	viewModel.tweets.removeAll();
	viewModel.twitter_since_id('');
}