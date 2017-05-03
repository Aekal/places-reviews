var map, service;

$(function() {
	//Get places info from json file
	$.getJSON("js/places.json", function(data) {
		var avgLat = 0,
				avgLng = 0,
				mapPos = 0;
		//Set markers position
		for (var i = 0; i < data.dominos.length; i++) {
			avgLat += data.dominos[i].lat;
			avgLng += data.dominos[i].lng;
		}
		//Set average position for center map
		mapPos = {
			lat: avgLat/data.dominos.length,
			lng: avgLng/data.dominos.length
		};
		initMap(mapPos, data.dominos);
	});
});

function initMap(mapPos, dominos) {
	var styles = [
		{
			featureType: "road",
			elementType: "geometry",
			stylers: [
				{ lightness: -30 },
				{ visibility: "simplified" }
			]
		}
	];
	function createMap (mapPos) {
		map = new google.maps.Map(document.getElementById("map"), {
			center: mapPos,
			zoom: 5,
			disableDefaultUI: true,
			styles: styles
		});
	}
	function createMarker (data) {
		var markerPos = {
			lat: data.lat,
			lng: data.lng
		};
		var marker = new google.maps.Marker({
			position: markerPos,
			map: map
		});
		marker.addListener("click", function() {
			service = new google.maps.places.PlacesService(map);
			var request = {placeId: data.placeId};
			service.getDetails(request, function(place, status) {
				showReviews(place);
			});
		});
	}
	createMap(mapPos);
	for (var i = 0; i < dominos.length; i++) {
		createMarker(dominos[i]);
	}
}

function showReviews (place) {
	var $review, $author, $authorName, $authorPhoto,
	$reviewDate, $reviewText, shortText, $readMore, $reviewItems,
	reviewRating, $star, $starEmpty, $reviewStars;

	var $reviews = $(".reviews");
	$reviews.empty();

	for (var i = 0; i < place.reviews.length; i++) {
		$review = $("<div class='review'></div>");
		//Author info
		$author = $("<div class='author'></div>");
		$authorName = $("<p class='author-name'>" + place.reviews[i].author_name + "</p>");
		$authorPhoto = $("<img class='author-photo' src=" + place.reviews[i].profile_photo_url + "></img>");
		$author.append([$authorPhoto, $authorName]);
		//Star ratings
		reviewRating = place.reviews[i].rating;
		$reviewStars = $("<div class='review-stars'></div>");
		//Create bootstrap star icons
		for (var j = 0; j < place.reviews.length; j++) {
			if (j < reviewRating) {
				$star = $("<span class='glyphicon glyphicon-star' aria-hidden='true'></span>");
				$reviewStars.append($star);
			} else {
				$starEmpty = $("<span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span>");
				$reviewStars.append($starEmpty);
			}
		}
		$reviewDate = $("<p class='review-date'>" + place.reviews[i].relative_time_description + "</p>");
		//Shorten visible text and add button to expand
		if (place.reviews[i].text.length > 230) {
			shortText = place.reviews[i].text.substr(0, 230) + "...";
			$readMore = $("<a href=" + i + "> read more</a>");
			$reviewText = $("<p class='review-text'>" + shortText + "</p>").append($readMore);
		} else {
			$reviewText = $("<p class='review-text'>" + place.reviews[i].text + "</p>");
		}

		//Put review components to one array
		$reviewItems = [$author, $reviewDate, $reviewStars, $reviewText];
		$review.append($reviewItems).appendTo($reviews);
	}

	//Expand text by clicking on the button
	$(".review-text a").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);
		var i = $(this).attr("href");
		shortText = place.reviews[i].text;
		$this.parent().text(shortText);
	});
}
