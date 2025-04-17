import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a distance value given in miles into a readable string.
 *
 * @param {number} distance - The distance value in miles.
 * @param {number} [decimalPlaces=2] - Number of decimal places to display in the formatted value.
 * @returns {string} The formatted distance string.
 */
export function formatDistanceInMiles(distance: number, decimalPlaces = 2) {
    if (typeof distance !== 'number' || distance < 0) {
        throw new Error('Invalid distance value. Must be a positive number.');
    }

    const milesToFeet = 5280; // 1 mile = 5280 feet
    const feet = distance * milesToFeet;

    // For distances smaller than 0.01 miles, show in feet
    if (distance < 0.01) {
        return `${feet.toFixed(0)} ft`;
    }

    // Otherwise, show in miles
    return `${distance.toFixed(decimalPlaces)} mi`;
}
