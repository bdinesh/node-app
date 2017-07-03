import axios from 'axios';
import { $ } from './bling';

const loadPlaces = (map, lat = 43.2, lng = -79.8) => {
    axios
        .get(`/api/stores/near?lat=${lat}&lng=${lng}`)
        .then(res => {
            const places = res.data;

            if (!places.length) {
                alert('No places found!');

                return;
            }

            // create bounds to fit markers on the map 
            const bounds = new google.maps.LatLngBounds();
            const infoWindow = new google.maps.InfoWindow();
            const markers = places.map(place => {
                const [ placeLng, placeLat ] = place.location.coordinates;
                const position = {
                    lat: placeLat,
                    lng: placeLng
                };

                bounds.extend(position);

                const marker = new google.maps.Marker({
                    map,
                    position
                });

                marker.place = place;
                
                return marker;
            });

            // show details of the place in info window when a marker is clicked
            markers.forEach(marker => marker.addListener('click', () => {
                const html = `
                    <div class="popup">
                        <a href="/stores/${marker.place.slug}">
                            <img src="/uploads/${marker.place.photo || 'store.png'}" alt="${marker.place.name}" />
                            <p>${marker.place.name} - ${marker.place.location.address}</p>
                        </a>
                    </div>
                `;

                infoWindow.setContent(html);
                infoWindow.open(map, marker);
            }));

            // zoom the map to fit all markers
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        });
};

const mapOptions = {
    center: { 
        lat: 43.2,
        lng: -79.8 
    },
    zoom: 10
};

const makeMap = (mapDiv) => {
    if (!mapDiv) return;

    const map = new google.maps.Map(mapDiv, mapOptions);

    loadPlaces(map);

    const input = $('[name="geolocate"]');
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
    });
};

export default makeMap;

// navigator.geolocation.getCurrentPosition()