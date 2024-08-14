export const fetchStickerData = async () => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string);
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch sticker data:', error);
        
        // Provide fallback data
        return {
            options: { dimensions_rate: "1" },
            materials: [],
            antals: [],
            laminates: [],
        };
    }
};
