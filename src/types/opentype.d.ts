declare module 'opentype.js' {
    const opentype: {
        load: (url: string, callback: (err: any, font: any) => void) => void;        
    };

    export default opentype;
}
