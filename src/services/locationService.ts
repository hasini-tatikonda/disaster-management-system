import { LocationInfo } from '../types';

export async function requestGPSLocation(): Promise<{ success: boolean; location?: LocationInfo; error?: string }> {
  if (!navigator.geolocation) {
    return {
      success: false,
      error: 'Browser Geolocation is not supported on this device. Please enter your location manually.'
    };
  }

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        resolve({
          success: true,
          location: {
            type: 'gps',
            lat,
            lng,
            address: `GPS Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
            area: 'Approximate GPS Position',
            city: 'Detected Location',
            state: 'India'
          }
        });
      },
      error => {
        let errorMsg = 'Location permission was denied or signal was lost.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location access was denied. You can enter your location manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable. Please type your location manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please type your location manually.';
        }

        resolve({
          success: false,
          error: errorMsg,
          location: {
            type: 'skipped',
            rawError: errorMsg
          }
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
