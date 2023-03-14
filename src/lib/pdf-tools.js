
import PdfPrinter from "pdfmake"


export const  getPDFReadableStream=(product)=>{
    const fonts={
     Helvetica:{
        normal:"Helvetica",
        bold:"Helvetica-Bold",
        italics:"Helvetica-Oblique",
        bolditalics:"Helvetica BoldOblique"

     }
    }
    const printer=new PdfPrinter(fonts)

    const dd = {
        content: [
            product.title,product.category
        ],
        defaultStyle:{
            font:"Helvetica"
        }
        
    }
    const pdfReadableStream=printer.createPdfKitDocument(dd,{})
    pdfReadableStream.end()

    return pdfReadableStream
}