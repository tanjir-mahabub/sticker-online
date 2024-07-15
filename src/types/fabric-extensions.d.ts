// src/fabric-extensions.d.ts
import 'fabric';

declare module 'fabric' {
  namespace fabric {
    interface IObjectOptions {
      id?: string;
    }

    interface Rect {
      id?: string;
    }

    interface IRectOptions extends IObjectOptions {
      id?: string;
    }
  }
}
