const getKeyFromKeyCode = (value) => {
    if (value) {
        const keyIdentifier = value.toString().replace(/U\+/, '0x');

        return String.fromCodePoint(keyIdentifier);
    } else {
        throw new Error('Invalid keyIdentifier');
    }
};

function autocomplete(input, latInput, lngInput) {
    if (!input)
        return;

    const dropdown = new google.maps.places.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });

    input.on('keydown', (e) => {
        if(e.key === 'Enter'){
            e.preventDefault(); 
        }
    });
}

export default autocomplete;