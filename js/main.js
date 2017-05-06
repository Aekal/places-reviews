$(function() {
	var map, service, infoWindow, iterator, markers = [], json, timer,
	$dLabel = $("#dLabel"),
	$reviews = $(".reviews");
	function initMap(path) {
		if (!map) {
			createMap(getCenterPos(path));
		}
		timer = 0;
		clearTimeout(timer);
		//Create markers with drop animation
		iterator = 0;
		for (var i = 0; i < path.length; i++) {
			timer = setTimeout(function() {
				createMarker(path);
			}, i*400);
		}
	}
	function createMap (mapPos) {
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
		map = new google.maps.Map(document.getElementById("map"), {
			center: mapPos,
			zoom: 5,
			disableDefaultUI: true,
			styles: styles
		});
	}
	function createMarker (data) {
		var marker, markerPos, request, loc, image;
		loc = data[iterator++];
		image = "img/dominos-icon.png";
		markerPos = {
			lat: loc.lat,
			lng: loc.lng
		};
		marker = new google.maps.Marker({
			position: markerPos,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: image
		});
		request = {
			placeId: loc.placeId
		};
		marker.addListener("click", function() {
			service = new google.maps.places.PlacesService(map);
			service.getDetails(request, function(place, status) {
				showInfoWindow(place, marker);
				showReviews(place);
			});
		});
		markers.push(marker);
	}
	function showReviews (place) {
		var $review, $author, $authorName, $authorPhoto,
		$reviewDate, $reviewText, shortText, $readMore, $reviewItems,
		reviewRating, $star, $starEmpty, $reviewStars;

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
	function showInfoWindow (place, marker) {
		var contentText = "<p class='place-name'>" + place.name + "</p>" + "<p class='place-adress'>" + place.formatted_address + "</p>";
		if (infoWindow) {
			infoWindow.close();
		}
		infoWindow = new google.maps.InfoWindow({
			content: contentText
		});
		infoWindow.open(map, marker);
	}
	function getCenterPos(path) {
		var avgLat = 0, avgLng = 0, mapPos;
		for (var i = 0; i < path.length; i++) {
			avgLat += path[i].lat;
			avgLng += path[i].lng;
		}
		mapPos = {
			lat: avgLat/path.length,
			lng: avgLng/path.length
		};
		return mapPos;
	}
	function changeMap(selectedPlace) {
		//Center map in new location
		var path = eval("json." + selectedPlace);
		map.setCenter(getCenterPos(path));
		//Remove old markers
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		initMap(path);
		$reviews.empty().text("Click on marker to show clients reviews!");
	}
	//Get places info from json file
	$.getJSON("js/places.json", function(data) {
		json = data;
		initMap(data.dominos);
	});
	$(".dropdown-menu").on("click", "a", function(e) {
		e.preventDefault();
		var selectedPlace, placeName, $this = $(this);
		//Remove '#' from href
		selectedPlace = $this.attr("href").slice(1);
		//Set button text to selected option
		placeName = $this.text();
		$dLabel.text(placeName);
		$dLabel.append(" <span class='caret'></span>");
		changeMap(selectedPlace);
	});
});
