// opencode enciende el taller
/** Extrae el texto del PDF generado para verificar el formato. */
import fs from "node:fs"
import path from "node:path"
import { PDFParse } from "pdf-parse"

const file = process.argv[2] || "public/design-preview/13-proforma-pdf.pdf"
const buf = fs.readFileSync(path.join(process.cwd(), file))

const parser = new PDFParse({ data: new Uint8Array(buf) })
const result = await parser.getText()

console.log("=".repeat(72))
console.log(result.text)
console.log("=".repeat(72))
console.log("paginas:", result.pages?.length ?? result.total)

await parser.destroy()
