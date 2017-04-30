var map;

$(function() {
	//Get places info from json file
	$.getJSON("js/places.json", function(data) {
		var avgLat, avgLng, mapPos, markerPos, markerPosArray;
		mapPos = 0;
		avgLat = 0;
		avgLng = 0;
		markerPosArray = [];
		//Set markers position
		for (var i = 0; i < data.dominos.length; i++) {
			markerPos = {
				lat: data.dominos[i].lat,
				lng: data.dominos[i].lng
			}
			markerPosArray.push(markerPos);
			avgLat += markerPos.lat;
			avgLng += markerPos.lng;
		}
		//Set average position for center map
		mapPos = {
			lat: avgLat/data.dominos.length,
			lng: avgLng/data.dominos.length
		}
		initMap(mapPos, markerPosArray);
	});
});

function initMap(mapPos, markerPosArray) {
	createMap(mapPos);
	for (var i = 0; i < markerPosArray.length; i++) {
		createMarker(markerPosArray[i]);
	};
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
	function createMarker (markerPos) {
		new google.maps.Marker({
			position: markerPos,
			map: map
		});
	}
}
