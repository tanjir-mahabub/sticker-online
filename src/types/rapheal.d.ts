declare module 'raphael' {
  const Raphael: any;

  interface Element {
    freeTransform: (options?: any) => any;
    toSVG: () => any;
    group: (f?: any, g?: any) => any;
  }

  export default Raphael;
}
