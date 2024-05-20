import { defaultOptions, FTitemVisibility, handleFreeTransform } from "@/components/Utils/vectorFunction";
import { usePaper } from "@/context/PaperContext";
import { addedToHistory } from "@/redux/features/historySlice";
import { updateElementAttributes, updateImages } from "@/redux/features/imagePreviewSlice";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const FreeTransform = () => {
    const { paper, selectedItem, setSelectedItem, lastAddedElement, elementActive, setElementActive } = usePaper();
    
    const History = useAppSelector((state) => state.history);  
    const dispatch = useDispatch();    

    // useEffect(() => {
    //     if (paper) {
    //         paper?.forEach((el: any) => {
    //             if (el) {
    //                 const { data } = el.data();
    //                 if (data === "image" || data === "text") {
    //                     const dragStart = function (this: any) {                                                        
    //                         setSelectedItem(this)
    //                     };

    //                     const dragMove = function (this: any, dx: number, dy: number) {
    //                     };

    //                     const dragEnd = function (this: any) {      
    //                         // console.log("drag end", this);  
    //                         console.log('test');                                        
    //                     };

    //                     el?.drag(dragMove, dragStart, dragEnd)


    //                 }
    //             }
    //         });

    //     }
    //     // console.log('lastAddedElement', lastAddedElement);
    // }, [paper, setSelectedItem, dispatch]);

    // useEffect(() => {

    //     const handleTransform = (ft: any, events: any) => {
    //     //     const transformedItem = handleFreeTransform(ft, events);
            
    //     //    if(transformedItem) {
    //     //         const itemID =  transformedItem.subject.id;
    //     //         const category =  transformedItem.subject.data().data;

    //     //         // console.log('transformedItem', itemID, category);
    //     //         // dispatch(updateElementAttributes( {id: itemID, attributes: {...transformedItem.attrs}}))
    //     //         // dispatch(addedToHistory({
    //     //         //     objectId: itemID,
    //     //         //     category: category || '',
    //     //         //     position: {...transformedItem.attrs}
    //     //         // }));
    //     //         console.log('transformedItem', transformedItem.subject.getBBox());
    //     //         console.log('transformedItem', transformedItem.subject.getBBox());

    //     //         transformedItem && setSelectedItem(transformedItem.subject)
    //     //    }

    //     const itemID =  ft.subject.id;
    //             const category =  ft.subject.data().data;

    //         if (events.includes('drag start')) {
    //             ft.subject.paper.forEach((el: any) => {
    //                 if (el.node.classList.contains('freeTransform')) {
    //                     el.node.style.visibility = "hidden"
    //                 }
    //             })
    //         }

    //         if(events.includes("drag end")) {
    //             console.log('transformedItem', ft.subject.getBBox(), ft.subject);
    //                     console.log('transformedItem', itemID, category);
    //             // dispatch(updateElementAttributes( {id: itemID, attributes: {}}))
    //             // dispatch(addedToHistory({
    //             //     objectId: itemID,
    //             //     category: category || '',
    //             //     position: {...transformedItem.attrs}
    //             // }));
    //             FTitemVisibility(ft.subject, "visible")
    //             ft?.updateHandles();
    //             ft.subject && setSelectedItem(ft.subject)
    //         }

    //         if(events.includes("scale end") || events.includes("rotate end")) {
    //             console.log('transformedItem', ft.subject);
    //                     console.log('transformedItem', itemID, category);
    //             // dispatch(updateElementAttributes( {id: itemID, attributes: {...transformedItem.attrs}}))
    //             // dispatch(addedToHistory({
    //             //     objectId: itemID,
    //             //     category: category || '',
    //             //     position: {...transformedItem.attrs}
    //             // }));
    //             FTitemVisibility(ft.subject, "visible")
    //             ft?.updateHandles();
    //             ft.subject && setSelectedItem(ft.subject)
    //         }
    //     }

    //     elementActive && elementActive?.map((el: any) => {
    //         if(el.freeTransform) {
    //             const oldFt = el.freeTransform
    //             oldFt.unplug()
    //         }
               
    //         const ft = paper?.freeTransform(el, `freeTransform stickerHandle-${el.id}`, defaultOptions, handleTransform)
            
    //         ft?.showHandles();


    //         if (ft && ft.handles && typeof window !== "undefined" && document) {

    //             const items = document.querySelectorAll(`.stickerHandle-${el.id}`);
    //             items?.forEach((item: any) => item.style.visibility = "hidden")
    //             console.log(items);

    //             if (ft.handles) {
    //                 if (ft.handles.x.line) ft.handles.x.line.hide();

    //                 if (ft.handles.x.disc) ft.handles.x.disc.hide();
    //             }

    //             const svgNS = "http://www.w3.org/2000/svg";
    //             const svgElement = document.querySelector("svg");

    //             if (svgElement) {
    //                 const pattern = document.createElementNS(svgNS, "pattern");
    //                 // Pattern attributes
    //                 pattern.setAttribute("id", "rotateImageFill");
    //                 pattern.setAttribute("patternUnits", "objectBoundingBox");
    //                 pattern.setAttribute("width", "100%");
    //                 pattern.setAttribute("height", "100%");

    //                 const image = document.createElementNS(svgNS, "image");
    //                 // Image attributes
    //                 image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/rotateIcon.svg");
    //                 image.setAttribute("width", "22");
    //                 image.setAttribute("height", "22");

    //                 pattern.appendChild(image);

    //                 // Append pattern to defs
    //                 let defs = svgElement.querySelector("defs");
    //                 if (!defs) {
    //                     defs = document.createElementNS(svgNS, "defs");
    //                     svgElement.appendChild(defs);
    //                 }
    //                 defs.appendChild(pattern);
    //             }
    //         }

    //         ft?.updateHandles();

    //         ft?.apply();
    //     });

    // }, [paper, elementActive, setSelectedItem, dispatch])

    // useEffect(() => {
    //     if (selectedItem) {
    //         FTitemVisibility(selectedItem, "visible")
    //     }

    // }, [selectedItem]);
    
//    useEffect(() => {
//     console.log(History);
//     paper && console.log(paper);        
//    })

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