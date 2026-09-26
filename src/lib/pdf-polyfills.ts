// src/lib/pdf-polyfills.ts
// Must be imported before "pdf-parse" anywhere it's used.
class DOMMatrixStub {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor(_init?: string | number[]) { }
    multiply() { return new DOMMatrixStub(); }
    translate() { return new DOMMatrixStub(); }
    scale() { return new DOMMatrixStub(); }
    inverse() { return new DOMMatrixStub(); }
    toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
}

const g = globalThis as any;
if (typeof g.DOMMatrix === "undefined") g.DOMMatrix = DOMMatrixStub;
if (typeof g.ImageData === "undefined") {
    g.ImageData = class ImageData {
        data: Uint8ClampedArray;
        width: number;
        height: number;
        constructor(dataOrWidth: any, widthOrHeight: number, height?: number) {
            if (typeof dataOrWidth === "number") {
                this.width = dataOrWidth;
                this.height = widthOrHeight;
                this.data = new Uint8ClampedArray(this.width * this.height * 4);
            } else {
                this.data = dataOrWidth;
                this.width = widthOrHeight;
                this.height = height ?? 0;
            }
        }
    };
}
if (typeof g.Path2D === "undefined") {
    g.Path2D = class Path2D { };
}