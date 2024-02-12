
// export const drawImage = async (img: HTMLImageElement, thickness: number, color: string) => {
//     return new Promise<HTMLImageElement>((resolve, reject) => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         if (!ctx) {
//             reject(new Error("Canvas context is not supported."));
//             return;
//         }

//         const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]; // offset array

//         // Calculate canvas size based on image dimensions and additional offset
//         const canvasWidth = img.width + (thickness * 5);
//         const canvasHeight = img.height + (thickness * 5);

//         // Set canvas dimensions
//         canvas.width = canvasWidth;
//         canvas.height = canvasHeight;

//         // Calculate image position to center it on the canvas
//         const imgX = (canvasWidth - img.width) / 2;
//         const imgY = (canvasHeight - img.height) / 2;

//         const drawImages = () => {
//             // Draw images at offsets from the array scaled by thickness
//             for (let i = 0; i < dArr.length; i += 2) {
//                 ctx.drawImage(img, imgX + dArr[i] * thickness, imgY + dArr[i + 1] * thickness);
//             }

//             // fill with color
//             ctx.globalCompositeOperation = "source-in";
//             ctx.fillStyle = color;
//             ctx.fillRect(0, 0, canvas.width, canvas.height);

//             // draw original image in normal mode
//             ctx.globalCompositeOperation = "source-over";
//             ctx.drawImage(img, imgX, imgY);

//             // Convert canvas to data URL and create a new image element
//             const imageData = canvas.toDataURL();
//             const newImage = new window.Image();
//             newImage.onload = () => resolve(newImage);
//             newImage.onerror = () => reject(new Error("Failed to load image data."));
//             newImage.src = imageData;
//         };

//         if (img.complete) {
//             drawImages();
//         } else {
//             img.onload = drawImages;
//             img.onerror = () => reject(new Error("Failed to load image."));
//         }
//     });
// };


export const drawImage = async (img: HTMLImageElement, grow: number, color: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
      const canvas1 = document.createElement("canvas");
      const ctx1 = canvas1.getContext("2d");
      const canvas2 = document.createElement("canvas");
      const ctx2 = canvas2.getContext("2d");

      canvas1.width = canvas2.width = img.width + grow * 2;
      canvas1.height = canvas2.height = img.height + grow * 2;

      if (ctx1 && ctx2) {
          ctx1.drawImage(img, grow, grow);
          ctx2.shadowColor = color;
          ctx2.shadowBlur = 1;          

          for (let i = 0; i < grow; i++) {
              ctx2.drawImage(canvas1, 0, 0);
              ctx1.drawImage(canvas2, 0, 0);
          }

          ctx2.shadowColor = 'rgba(0,0,0,0)';
          ctx2.drawImage(img, grow, grow);

          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = canvas2.toDataURL();
      } else {
          reject(new Error("Failed to get canvas context"));
      }
  });
};


export const drawImageRectangle = async (img: HTMLImageElement, grow: number, color: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
      const canvas1 = document.createElement("canvas");
      const ctx1 = canvas1.getContext("2d");
      const canvas2 = document.createElement("canvas");
      const ctx2 = canvas2.getContext("2d");

      canvas1.width = canvas2.width = img.width + grow * 2;
      canvas1.height = canvas2.height = img.height + grow * 2;

      if (ctx1 && ctx2) {
          // Draw the background rectangle
          ctx1.fillStyle = color;
          ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

          // Draw the image on top of the background rectangle
          ctx1.drawImage(img, grow, grow);

          // Apply shadow effect
          ctx2.shadowColor = color;
          ctx2.shadowBlur = 1;

          // Draw the image with shadow multiple times to create a stronger shadow effect
          for (let i = 0; i < grow; i++) {
              ctx2.drawImage(canvas1, 0, 0);
              ctx1.drawImage(canvas2, 0, 0);
          }

          // Reset shadow and draw the image without shadow
          ctx2.shadowColor = 'rgba(0,0,0,0)';
          ctx2.drawImage(img, grow, grow);

          // Create a new image element and set its source to the canvas data URL
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = canvas2.toDataURL();
      } else {
          reject(new Error("Failed to get canvas context"));
      }
  });
};


export const drawImageRounded = async (img: HTMLImageElement, grow: number, color: string, cornerRadius = 20): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
      const canvas1 = document.createElement("canvas");
      const ctx1 = canvas1.getContext("2d");
      const canvas2 = document.createElement("canvas");
      const ctx2 = canvas2.getContext("2d");

      canvas1.width = canvas2.width = img.width + grow * 2;
      canvas1.height = canvas2.height = img.height + grow * 2;

      if (ctx1 && ctx2) {
          // Define roundRect method for ctx1
          ctx1.roundRect = function (x: number, y: number, width: number, height: number, radius: number) {
              if (width < 2 * radius) radius = width / 2;
              if (height < 2 * radius) radius = height / 2;
              this.beginPath();
              this.moveTo(x + radius, y);
              this.arcTo(x + width, y, x + width, y + height, radius);
              this.arcTo(x + width, y + height, x, y + height, radius);
              this.arcTo(x, y + height, x, y, radius);
              this.arcTo(x, y, x + width, y, radius);
              this.closePath();
              return this;
          };

          // Define roundRect method for ctx2
          ctx2.roundRect = function (x: number, y: number, width: number, height: number, radius: number) {
              if (width < 2 * radius) radius = width / 2;
              if (height < 2 * radius) radius = height / 2;
              this.beginPath();
              this.moveTo(x + radius, y);
              this.arcTo(x + width, y, x + width, y + height, radius);
              this.arcTo(x + width, y + height, x, y + height, radius);
              this.arcTo(x, y + height, x, y, radius);
              this.arcTo(x, y, x + width, y, radius);
              this.closePath();
              return this;
          };

          // Draw the rounded rectangle on ctx1
          ctx1.fillStyle = color;
          ctx1.roundRect(0, 0, canvas1.width, canvas1.height, cornerRadius);
          ctx1.fill();

          // Draw the image on top of the background rectangle on ctx1
          ctx1.drawImage(img, grow, grow);

          // Apply shadow effect on ctx2
          // ctx2.shadowColor = color;
          // ctx2.shadowBlur = 1;

          // Draw the image with shadow multiple times to create a stronger shadow effect on ctx2
          for (let i = 0; i < grow; i++) {
              ctx2.drawImage(canvas1, 0, 0);
              ctx1.drawImage(canvas2, 0, 0);
          }

          // Reset shadow and draw the image without shadow on ctx2
          ctx2.shadowColor = 'rgba(0,0,0,0)';
          ctx2.drawImage(img, grow, grow);

          // Create a new image element and set its source to the canvas data URL
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = canvas2.toDataURL();
      } else {
          reject(new Error("Failed to get canvas context"));
      }
  });
};

export const drawImageCircle = async (img: HTMLImageElement, grow: number, color: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const canvas1 = document.createElement("canvas");
    const ctx1 = canvas1.getContext("2d");
    const canvas2 = document.createElement("canvas");
    const ctx2 = canvas2.getContext("2d");

    // Calculate the total size of the canvas
    const totalWidth = img.width + grow * 2;
    const totalHeight = img.height + grow * 2;

    // Set the size of the canvases
    canvas1.width = canvas2.width = totalWidth;
    canvas1.height = canvas2.height = totalHeight;

    if (ctx1 && ctx2) {
      // Draw white circle background
      ctx1.fillStyle = "white";
      ctx1.beginPath();
      ctx1.arc(totalWidth / 2, totalHeight / 2, totalWidth / 2.2, 0, Math.PI * 2);
      ctx1.closePath();
      ctx1.fill();

      // Draw image on top of the white circle background
      ctx1.drawImage(img, grow, grow);      

      // Create a new image element and set its source to the canvas data URL
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = canvas1.toDataURL();
    } else {
      reject(new Error("Failed to get canvas context"));
    }
  });
};





// export const  drawImage = (img: HTMLImageElement, grow: number, color: string) => {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   if(!ctx) return false;

//   canvas.width = img.width + grow * 2;
//   canvas.height = img.height + grow * 2;
  
//   // Draw the image onto the canvas
//   ctx.drawImage(img, 0, 0, img.width, img.height);
//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   contrastImage(imageData, 200);
//   processCanvas(canvas, ctx, toFullWhite);
//   ctx.drawImage(img, 0, 0, img.width, img.height);
//   ctx.shadowColor= "red";
//   ctx.shadowBlur =1;
  
   
//   return canvas
// }


const drawCanvas = (id: string, pFunction: (red: number, green: number, blue: number) => number) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    processCanvas(canvas, ctx, pFunction);
  };
  img.src = ''; // Add image source here
};

const processCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pFunction: (red: number, green: number, blue: number) => number): void => {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const newData = processImgData(imgData, pFunction);
  ctx.putImageData(newData, 0, 0);
};

const processImgData = (imgData: ImageData, pFunction: (red: number, green: number, blue: number) => number): ImageData => {
  const { data, width, height } = imgData;
  const newData = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const alpha = data[i + 3];
    const newColor = pFunction(red, green, blue);
    newData[i] = newColor; // Red
    newData[i + 1] = newColor; // Green
    newData[i + 2] = newColor; // Blue
    newData[i + 3] = alpha; // Alpha remains unchanged
  }
  return new ImageData(newData, width, height);
};


const toBlackAndWhite = (red: number, green: number, blue: number): number => {
  const count = red + green + blue;
  const colour = count < 383 ? 0 : 255;
  return colour;
};


const toFullWhite = (red: number, green: number, blue: number): number => {
  return 255; // Return maximum value for white
};

const toBlackWhiteGray = (red: number, green: number, blue: number): number => {
  const count = red + green + blue;
  let colour = 0;
  if (count > 510) colour = 255;
  else if (count > 255) colour = 127.5;
  return colour;
};


function contrastImage(imageData: ImageData, contrast: number) {  // contrast as an integer percent  
  var data = imageData.data;  // original array modified, but canvas not updated
  contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
  var factor = (255 + contrast) / (255.01 - contrast);  //add .1 to avoid /0 error

  for(var i=0;i<data.length;i+=4)  //pixel values in 4-byte blocks (r,g,b,a)
  {
      data[i] = factor * (data[i] - 128) + 128;     //r value
      data[i+1] = factor * (data[i+1] - 128) + 128; //g value
      data[i+2] = factor * (data[i+2] - 128) + 128; //b value

  }
  return imageData;  //optional (e.g. for filter function chaining)
}