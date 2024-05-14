import { usePaper } from "@/context/PaperContext";
import { useEffect } from "react";


const FreeTransform = () => {
    const { paper, selectedItem, setSelectedItem, lastAddedElement, elementActive } = usePaper();
    

    useEffect(() => {
        if (paper && lastAddedElement) {
            paper?.forEach((el: any) => {
                if (el) {
                    const { data } = el.data();
                    if (data === "image" || data === "text") {
                        const dragStart = function (this: any) {
                            setSelectedItem(this)
                        };

                        const dragMove = function (this: any, dx: number, dy: number) {
                        };

                        const dragEnd = function (this: any) {
                            
                            // console.log('this is : ', this);
                        };

                        el?.drag(dragMove, dragStart, dragEnd)


                    }
                }
            });

        }
        // console.log('lastAddedElement', lastAddedElement);
    }, [paper, lastAddedElement, setSelectedItem]);

    useEffect(() => {

        const defaultOptions = {
            keepRatio: true,
            rotate: true,
            scale: true,
            drag: true,
            distance: 1.35,
            size: 7,
            round: 100,
            draw: ['bbox'],
            attrs: {
                fill: '#fff',
                stroke: '#000'
            },
        };

        const handleFreeTransform = (ft: any, events: any) => {
            // console.log(ft, events);          
            if (events.includes('drag start')) {
                ft.subject.paper.forEach((el: any) => {
                    if (el.node.classList.contains('freeTransform')) {
                        el.node.style.visibility = "hidden"
                    }
                })
            }
            if (events.includes('drag end')) {
                ft.handles.center.disc.node.style.visibility = "visible"
                ft.handles.x.disc.node.style.visibility = "visible"
                ft.handles.x.line.node.style.visibility = "visible"
                ft.handles.y.disc.node.style.visibility = "visible"
                ft.handles.y.line.node.style.visibility = "visible"
                ft.bbox.node.style.visibility = "visible"
                ft.handles.bbox.forEach((item: any) => {
                    item.element.node.style.visibility = "visible";
                    item.element.node.style.opacity = "0.5"
                })
                setSelectedItem(ft.subject);
            }
        }

        elementActive?.map((el: any) => {
            const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, handleFreeTransform);

            ft?.showHandles();


            if (ft && ft.handles && typeof window !== "undefined" && document) {

                const items = document.querySelectorAll(`.stickerHandle-${el.id}`);
                items?.forEach((item: any) => item.style.visibility = "hidden")

                if (ft.handles) {
                    if (ft.handles.x.line) ft.handles.x.line.hide();

                    if (ft.handles.x.disc) ft.handles.x.disc.hide();
                }

                const svgNS = "http://www.w3.org/2000/svg";
                const svgElement = document.querySelector("svg");

                if (svgElement) {
                    const pattern = document.createElementNS(svgNS, "pattern");
                    // Pattern attributes
                    pattern.setAttribute("id", "rotateImageFill");
                    pattern.setAttribute("patternUnits", "objectBoundingBox");
                    pattern.setAttribute("width", "100%");
                    pattern.setAttribute("height", "100%");

                    const image = document.createElementNS(svgNS, "image");
                    // Image attributes
                    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/rotateIcon.svg");
                    image.setAttribute("width", "22");
                    image.setAttribute("height", "22");

                    pattern.appendChild(image);

                    // Append pattern to defs
                    let defs = svgElement.querySelector("defs");
                    if (!defs) {
                        defs = document.createElementNS(svgNS, "defs");
                        svgElement.appendChild(defs);
                    }
                    defs.appendChild(pattern);
                }
            }

            ft?.updateHandles();

            ft?.apply();
        });

    }, [paper, elementActive, setSelectedItem])

    useEffect(() => {
        if (selectedItem) {
            const ft = selectedItem?.freeTransform
            if (ft) {
                ft.handles.center.disc.node.style.visibility = "visible"
                ft.handles.x.disc.node.style.visibility = "visible"
                ft.handles.x.line.node.style.visibility = "visible"
                ft.handles.y.disc.node.style.visibility = "visible"
                ft.handles.y.line.node.style.visibility = "visible"
                ft.bbox.node.style.visibility = "visible"
                ft.handles.bbox.forEach((item: any) => item.element.node.style.visibility = "visible")
            }
        }

    }, [selectedItem]);

    return null;
}

export default FreeTransform