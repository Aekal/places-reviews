var map, service;

$(function() {
	//Get places info from json file
	$.getJSON("js/places.json", function(data) {
		var avgLat, avgLng, mapPos, markerPosArray;
		mapPos = 0;
		avgLat = 0;
		avgLng = 0;
		markerPosArray = [];
		//Set markers position
		for (var i = 0; i < data.dominos.length; i++) {
			avgLat += data.dominos[i].lat;
			avgLng += data.dominos[i].lng;
		}
		//Set average position for center map
		mapPos = {
			lat: avgLat/data.dominos.length,
			lng: avgLng/data.dominos.length
		}
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
		}
		var marker = new google.maps.Marker({
			position: markerPos,
			map: map
		});
		marker.addListener("click", function() {
			service = new google.maps.places.PlacesService(map);
			var request = {placeId: data.placeId}
			service.getDetails(request, function(place, status) {
				showReviews(place);
			});
		})
	}
	createMap(mapPos);
	for (var i = 0; i < dominos.length; i++) {
		createMarker(dominos[i]);
	};
}

function showReviews (place) {
	var $reviews = $(".reviews");
	$reviews.empty();
	console.log(place);
	for (var i = 0; i < place.reviews.length; i++) {
		var text = "<p>" + place.reviews[i].text + "</p>";
		$reviews.append(text);
	}
}
