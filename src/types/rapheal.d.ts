declare module 'raphael' {
  const Raphael: any;

  interface Element {
    freeTransform: (options?: any) => any;
    toSVG: () => any;
  }

  export default Raphael;
}
