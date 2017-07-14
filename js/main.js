$(function() {
	var map, mapLoaded = false, service, infoWindow, markers = [], json,
			iconImg = "img/dominos-icon.png",
			$mapMask = $(".map-container").find(".mask"),
			$dLabel = $("#dLabel"),
			$reviews = $("#reviews");
	function initMap(places) {
		var i = 0;
		if (!map) {
			createMap(places);
		}
		if (mapLoaded === true) {
			for (i = 0; i < places.length; i++) {
				createMarker(places, i);
			}
		}
	}
	function createMap (places) {
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
			center: getCenterPos(places),
			zoom: getScale(places),
			disableDefaultUI: true,
			styles: styles
		});
		google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
			mapLoaded = true;
			initMap(places);
			$mapMask.removeClass("visible");
		});
	}
	function createMarker (data, iterator) {
		var currentPlace = data[iterator++],
				markerPos = {
					lat: currentPlace.lat,
					lng: currentPlace.lng
				},
				marker = new google.maps.Marker({
					position: markerPos,
					map: map,
					animation: google.maps.Animation.DROP,
					icon: iconImg
				}),
				request = {
					placeId: currentPlace.placeId
				};
		service = new google.maps.places.PlacesService(map);
		marker.addListener("click", function() {
			service.getDetails(request, function(place, status) {
				showInfoWindow(place, marker);
				showReviews(place);
			});
		});
		markers.push(marker);
	}
	function showReviews (place) {
		var $review, $reviewCache = [],
				$author, $authorName, $authorPhoto,
				$reviewDate, $reviewText, shortText, $readMore, $reviewItems,
				reviewRating, $star, $starEmpty, $reviewStars,
				//Loader animation
				$reviewMask = $("<div class='mask visible'></div>"),
				$reviewLoader = $("<div class='loader'></div>"),
				i = 0,
				j = 0,
				photosLoaded = 0;
				$reviews.empty().addClass("animate");
				$reviewMask.append($reviewLoader).appendTo($reviews);
		function loadPhotos() {
			photosLoaded++;
			if (photosLoaded === place.reviews.length) {
				$reviews.removeClass("animate").append($reviewCache);
				$reviewMask.removeClass("visible");
			}
		}
		function expandText(e) {
			var $this = $(this),
			i = $this.attr("href");
			e.preventDefault();
			shortText = place.reviews[i].text;
			$this.parent().text(shortText);
		}
		//Create review components
		for (i = 0; i < place.reviews.length; i++) {
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
			for (j = 0; j < place.reviews.length; j++) {
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
				//Expand text by clicking on the button
				$readMore.on("click", expandText);
				$reviewText = $("<p class='review-text'>" + shortText + "</p>").append($readMore);
			} else {
				$reviewText = $("<p class='review-text'>" + place.reviews[i].text + "</p>");
			}
			//Put review components to one array
			$reviewItems = [$author, $reviewDate, $reviewStars, $reviewText];
			$review.append($reviewItems);
			//Loader
			$reviewCache.push($review);
			$authorPhoto.on("load", loadPhotos);
		}
	}
	function showInfoWindow (place, marker) {
		var contentText = "<p class='place-name'>" + place.name + "</p>" + "<p class='place-adress'>" + place.formatted_address + "</p>";
		contentText += "<a href='#reviews' class='scroll-btn visible-sm visible-xs'>Scroll to reviews <span class='glyphicon glyphicon-circle-arrow-down'></span></a>";
		if (infoWindow) {
			infoWindow.close();
		}
		infoWindow = new google.maps.InfoWindow({
			content: contentText
		});
		infoWindow.open(map, marker);
	}
	function getCenterPos(places) {
		var i = 0, avgLat = 0, avgLng = 0, mapPos;
		for (i = 0; i < places.length; i++) {
			avgLat += places[i].lat;
			avgLng += places[i].lng;
		}
		mapPos = {
			lat: avgLat/places.length,
			lng: avgLng/places.length
		};
		return mapPos;
	}
	function getScale(places) {
		var i = 0,
				maxLat = 0,
				maxLng = 0,
				maxDifference = 0,
				minLat = Math.abs(places[0].lat),
				minLng = Math.abs(places[0].lng),
				scale = 5;
		if ($(window).width() < 500) {
			for (i = 0; i < places.length; i++) {
				if (minLat > Math.abs(places[i].lat)) {
					minLat = Math.abs(places[i].lat);
				}
				if (maxLat < Math.abs(places[i].lat)) {
					maxLat = Math.abs(places[i].lat);
				}
				if (minLng > Math.abs(places[i].lng)) {
					minLng = Math.abs(places[i].lng);
				}
				if (maxLng < Math.abs(places[i].lng)) {
					maxLng = Math.abs(places[i].lng);
				}
			}
			if ((maxLat - minLat) > (maxLng - minLng)) {
				maxDifference = maxLat - minLat;
			} else {
				maxDifference = maxLng - minLng;
			}
			if (maxDifference > 10) {
				scale = 4;
			}
		}
		return scale;
	}
	function changeMap(selectedPlace) {
		//Center map in new location
		var path = json[selectedPlace],
				i = 0;
		iconImg = "img/" + selectedPlace + "-icon.png";
		map.setCenter(getCenterPos(path));
		map.setZoom(getScale(path));
		//Remove old markers
		for (i = 0; i < markers.length; i++) {
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
		var $this = $(this),
				selectedPlace = $this.attr("href").slice(1),
				placeName = $this.text();
		//Set button text to selected option
		$dLabel.text(placeName).append(" <span class='caret'></span>");
		changeMap(selectedPlace);
	});
});
