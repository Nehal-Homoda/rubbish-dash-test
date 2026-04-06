// src/types/pdfmake.d.ts
import "pdfmake/build/pdfmake";

declare module "pdfmake/build/pdfmake" {
    interface TFontDictionary {
        [key: string]: any;
    }

    interface PdfMakeStatic {
        vfs: { [key: string]: string };
        fonts: { [fontName: string]: TFontDictionary };
    }
}
