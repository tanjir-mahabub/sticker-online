declare module 'imagetracer' {
    interface Color {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    interface ImageTracerOptions {
        corsenabled?: boolean;
        ltres?: number;
        qtres?: number;
        pathomit?: number;
        rightangleenhance?: boolean;
        colorsampling?: number;
        numberofcolors?: number;
        mincolorratio?: number;
        colorquantcycles?: number;
        layering?: number;
        strokewidth?: number;
        linefilter?: boolean;
        scale?: number;
        roundcoords?: number;
        viewbox?: boolean;
        desc?: boolean;
        lcpr?: number;
        qcpr?: number;
        blurradius?: number;
        blurdelta?: number;
        pal?: Color[];
    }

    interface ImageTracerPreset {
        corsenabled?: boolean;
        ltres?: number;
        qtres?: number;
        pathomit?: number;
        rightangleenhance?: boolean;
        colorsampling?: number;
        numberofcolors?: number;
        mincolorratio?: number;
        colorquantcycles?: number;
        layering?: number;
        strokewidth?: number;
        linefilter?: boolean;
        scale?: number;
        roundcoords?: number;
        viewbox?: boolean;
        desc?: boolean;
        lcpr?: number;
        qcpr?: number;
        blurradius?: number;
        blurdelta?: number;
        pal?: Color[];
    }

    interface ImageTracerPresets {
        [key: string]: ImageTracerPreset;
    }

    interface ImageTracer {
        versionnumber: string;
        optionpresets: ImageTracerPresets;
    }

    interface ImageTracerData {
        Colorsampling: {
            [key: string]: string | number;
        };
        GKS: number[][];
        OPTION_PRESETS: ImageTracerPresets;
        PATHSCAN_COMBINED_LOOKUP: number[][][];
        SPECPALETTE: Color[];
        VERSION_NUMBER: string;
        imageTracer: ImageTracer;
    }

    export function imageToSVG(base64Data: string | ArrayBuffer, options?: ImageTracerOptions): Promise<string>;

    const data: ImageTracerData;

    export default data;
}
