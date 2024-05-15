import { defaultOptions, handleFreeTransform } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { addedToHistory } from "@/redux/features/historySlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const FreeTransform = () => {
    const { paper, selectedItem, setSelectedItem, lastAddedElement, elementActive } = usePaper();
    
    const History = useAppSelector((state) => state.history);  
    const dispatch = useDispatch();

    useEffect(() => {
        if (paper) {
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
                            // console.log("drag end", this);  
                            console.log('test');                                        
                        };

                        el?.drag(dragMove, dragStart, dragEnd)


                    }
                }
            });

        }
        // console.log('lastAddedElement', lastAddedElement);
    }, [paper, setSelectedItem, dispatch]);

    useEffect(() => {

        const handleTransform = (ft: any, events: any) => {
            const transformedItem = handleFreeTransform(ft, events);

            //console.log('main drag area', transformedItem?.getBBox());
           if(transformedItem) {
            // const bbox: any = transformedItem?.getBBox();

            // const matrix = transformedItem?.transform();

            // let x = bbox.x;
            // let y = bbox.y;
            // let scaleX = 1;
            // let scaleY = 1;
            // let width = bbox.width;
            // let height = bbox.height;
            // let rotate = 0;

            // // Capture initial position before any transformation
            // const initialPosition = { x: bbox.x, y: bbox.y };
            // // console.log('initialPosition', initialPosition);

            // // Extract transformation values from the transformation matrix
            // matrix.forEach(([operation, ...params]: any) => {
            //     switch (operation) {
            //         case "T":
            //             x = params[0];
            //             y = params[1];
            //             break;
            //         case "S":
            //             scaleX = params[0];
            //             scaleY = params[1];
            //             break;
            //         case "R":
            //             // If rotation is present, extract the angle from params[0]
            //             rotate = params[0];
            //             break;
            //     }
            // });

            // // Calculate width and height based on original dimensions and scaling
            // const originalWidth = 651; // Example original width
            // const originalHeight = 416; // Example original height
            // width = originalWidth * scaleX;
            // height = originalHeight * scaleY;

            // // Log transformation values
            // console.log(transformedItem?.id);

            // console.log("Drag end X:", bbox.x);
            // console.log("Drag end Y:", bbox.y);
            // console.log("Drag end ScaleX:", scaleX);
            // console.log("Drag end ScaleY:", scaleY);
            // console.log("Drag end Width:", width);
            // console.log("Drag end Height:", height);
            // console.log("Drag end Rotate:", rotate);

            // dispatch(addedToHistory({
            //     objectId: transformedItem.id,
            //     category: transformedItem.data().data || '',
            //     position: {
            //         x: bbox.x, // Use initial position instead of bbox.x
            //         y: bbox.y, // Use initial position instead of bbox.y
            //         width: width,
            //         height: height,
            //         scaleX: scaleX,
            //         scaleY: scaleY,
            //         rotation: rotate
            //     }
            // }));

            transformedItem && setSelectedItem(transformedItem)
           }
        }

        elementActive && elementActive?.map((el: any) => {
            if(el.freeTransform) {
                const oldFt = el.freeTransform
                oldFt.unplug()
            }
               
            const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, handleTransform)
            
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
                console.log('newft', ft);                          
            }                                
        }

    }, [selectedItem]);
    
   

//     useEffect(() => {
//       elementActive?.forEach((el: any) => {
//         const {data} = el.data();
//         el.mouseup(() => {
//         console.log(data, el);
//         //     dispatch(
//         //     addedToHistory({
//         //       objectId: el?.id, // Provide the unique identifier for the object
//         //       category: category, // Specify the category of the object
//         //       position: {
//         //         x: el.attrs?.x, // Provide the x-coordinate of the object
//         //         y: el.attrs?.y, // Provide the y-coordinate of the object
//         //         width: el.attrs?.width, // Provide the width of the object
//         //         height: el.attrs?.height, // Provide the height of the object
//         //         scaleX: el.attrs?.scale?.x, // Provide the scale factor along the x-axis (optional)
//         //         scaleY: el.attrs?.scale?.y, // Provide the scale factor along the y-axis (optional)
//         //         rotation: el.attrs?.rotate, // Provide the rotation angle of the object (optional)
//         //       },
//         //     })
//           //);    
//        })
//       })     
//     })


// useEffect(() => {
// console.log(History)
// })
   

               

    // useEffect(() => {
    //     if (elementActive && paper) {
    //         const paperCenter: { x: number, y: number } = { x: paper.width / 2, y: paper.height / 2 };
    //         elementActive?.forEach((element: any) => {
    //              const bbox = element.getBBox();
    //                 const elCenter = { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    //                 const translation = { x: paperCenter.x - elCenter.x, y: paperCenter.y - elCenter.y };

    //                 element.attr({ x: translation.x, y: translation.y });

    //                 if(element) {
    //                     const oldFt = element.freeTransform
    //                     oldFt.unplug()
                    
    //                     const handleTransform = (ft: any, events: any) => {
    //                         const transformedItem = handleFreeTransform(ft, events);
                
    //                         transformedItem && setSelectedItem(transformedItem)
    //                     }
    //                     const newFt = paper?.freeTransform(element, `freeTransform stickerHandle-${element.id}`, defaultOptions, handleTransform);
    //                     if (newFt.handles) {
    //                         if (newFt.handles.x.line) newFt.handles.x.line.hide();
        
    //                         if (newFt.handles.x.disc) newFt.handles.x.disc.hide();
    //                     }
    //                 }
                    

    //         })
    //     }

    // }, [elementActive, paper, setSelectedItem]);

    return null;
}

export default FreeTransform