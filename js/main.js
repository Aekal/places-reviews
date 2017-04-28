var map;
function initMap() {
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
		center: {lat: 36.8, lng: -83},
    zoom: 6,
		disableDefaultUI: true,
		styles: styles
	});

	
	var marker = new google.maps.Marker({
		position: {lat: 38.9658157, lng: -84.6743774},
		map: map
	});

	var marker = new google.maps.Marker({
		position: {lat: 36.0602014, lng: -88.1158447},
		map: map
	});

	var marker = new google.maps.Marker({
		position: {lat: 34.0958849, lng: -86.8016052},
		map: map
	});
	var marker = new google.maps.Marker({
		position: {lat: 35.3722548, lng: -80.1974487},
		map: map
	});

	var marker = new google.maps.Marker({
		position: {lat: 36.1012669, lng: -78.4657288},
		map: map
	});




}

//ChIJoU6wE7zGQYgRJNDXqvgDTIQ
