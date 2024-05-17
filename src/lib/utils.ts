/** @module lib/utils */

/**
 * A utility function that waits for a specified amount of time.
 * This function will NOT work in a production environment.
 */
export async function debugTimeout(ms: number): Promise<void> {
    // Return early if we are in a prod environment
    if (import.meta.env.PROD) return;

    await new Promise((resolve) => setTimeout(resolve, ms));
}
