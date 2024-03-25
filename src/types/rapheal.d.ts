declare module 'raphael' {
    const Raphael: any; 
    
    interface Element {
      freeTransform: (options?: any) => any; 
    }
      
    export default Raphael;
  }
  