import axios from './axios';

export async function getLocation(options) {
    if (options && options.showLoc) return await getReverseGeocoding();

    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async position => {

                    resolve({
                        position
                    });
                },
                error => {
                    reject(new Error(`Geolocation error: ${error.message}`));
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

async function getReverseGeocoding() {
    try {
        const { position } = await getLocation();
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        const response = await axios.get(url);

        if (!response.data) {
            throw new Error('Indobenua');
        }
        const loc = response.data
        return {position, loc}

    } catch (error) {
        throw new Error(`Failed to fetch location details: ${error.message}`);
    }
}

