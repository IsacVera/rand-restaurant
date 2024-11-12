fetch('/api/mapbox-key')
    .then(response => response.json())
    .then(data => {
        mapboxgl.accessToken = data.token;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9, // starting zoom
            doubleClickZoom: false,
        });

        const geocoder = new mapboxsearch.MapboxGeocoder()
        geocoder.accessToken = data.token
        geocoder.options = {
            language: 'en',
            country: 'US', 
        }

        // set the mapboxgl library to use for markers and enable the marker functionality
        geocoder.mapboxgl = mapboxgl
        geocoder.marker = true

        geocoder.bindMap(map)

        // add the geocoder instance to the DOM
        document.getElementById('geocoder-container').appendChild(geocoder)

       
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let lat = position.coords.latitude;
                    let long = position.coords.longitude;
                    map.setCenter([long, lat]);
                    const userLocation = new mapboxgl.Marker({
                        color: "#0000ff",
                        draggable: true
                    }).setLngLat([long, lat])
                        .addTo(map);
                }
            )
        } 

        const clickLocation = new mapboxgl.Marker({
            color: "#FF0000",
            draggable: true,
        })

        map.on('click', (e) => {
            clickLocation.setLngLat(e.lngLat).addTo(map);
        });
    })
    .catch(error => console.error("Error fetching mapbox token: ", error));
