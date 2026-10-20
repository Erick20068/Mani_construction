// opencode enciende el taller
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const instant = false

export const metadata: Metadata = {
  title: "Nueva proforma",
  description: "Crea una proforma de presupuesto.",
}

/** Atajo: el constructor de proformas vive en /proformas */
export default function NuevaProformaPage() {
  redirect("/proformas")
}
