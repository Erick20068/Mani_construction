// opencode enciende el taller
/**
 * Componente de PDF de proforma.
 *
 * Replica el formato del app Android de referencia (PdfMaker.kt):
 *   - A4 595 x 842 pt
 *   - BLUE rgb(26,58,92) = #1A3A5C   TEAL rgb(42,143,181) = #2A8FB5
 *   - Columnas en x = [36, 96, 376, 446, 559]
 *   - Cabecera con logo o nombre, lema, servicios, caja RUC, gerente
 *   - "PROFORMA 00001" en rojo serif 15pt
 *   - Tabla: CANT. | DESCRIPCION + MATERIAL(subrayado) | Precio Unitario | VALOR TOTAL
 *   - Minimo 8 filas, salto de pagina, nota y totales encuadrados
 *   - Firmas: "f). {empresa}" y "f). Cliente"
 *   - Importes con formato aleman: 1.261,07
 */
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
  Svg,
  Rect,
  Line,
} from "@react-pdf/renderer"

const BLUE = "#1A3A5C"
const TEAL = "#2A8FB5"
const RED = "#C80000"
const BLACK = "#000000"

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingLeft: 36,
    paddingRight: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: BLACK,
  },
  // ---------- cabecera ----------
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  logo: { objectFit: "contain" },
  companyName: { fontSize: 26, color: TEAL, fontFamily: "Helvetica-Bold" },
  lema: { fontSize: 9, color: BLUE, fontFamily: "Helvetica-Bold", marginTop: 4 },
  offers: { fontSize: 8.5, color: BLUE, marginTop: 12 },
  offerLine: { fontSize: 8.5, color: BLUE, marginTop: 2 },
  rucBox: {
    backgroundColor: BLUE,
    width: 149,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rucText: { fontSize: 10, color: "#FFFFFF" },
  rightCenter: { alignItems: "center" },
  gerente: { fontSize: 9.5, color: BLUE, fontFamily: "Helvetica-Bold" },
  email: { fontSize: 7.5, color: BLUE, fontFamily: "Helvetica-Bold", marginTop: 6 },
  telefono: { fontSize: 9.5, color: BLUE, fontFamily: "Helvetica-Bold", marginTop: 8 },
  garantia: { fontSize: 9, color: BLUE, fontFamily: "Helvetica-Bold", marginTop: 14 },

  proformaTitle: {
    fontSize: 15,
    color: RED,
    fontFamily: "Times-Bold",
    marginTop: 12,
  },
  fecha: { fontSize: 10, color: BLUE, marginTop: 12, textAlign: "right" },

  // ---------- datos del cliente ----------
  datosGrid: { marginTop: 12 },
  datoFila: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  datoFilaMitad: { flexDirection: "row", marginTop: 5 },
  label: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  value: { fontSize: 10 },

  // ---------- tabla ----------
  table: { marginTop: 14 },
  thead: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: BLACK,
    height: 34,
    alignItems: "center",
  },
  thCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    textAlign: "center",
    paddingTop: 4,
  },
  thMaterial: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    textAlign: "center",
    textDecoration: "underline",
  },
  trow: {
    flexDirection: "row",
    height: 20,
    alignItems: "center",
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: BLACK,
  },
  trowLast: {
    flexDirection: "row",
    height: 20,
    alignItems: "center",
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: BLACK,
  },
  tcellCant: { width: 60, fontSize: 10, textAlign: "right", paddingRight: 4 },
  tcellDesc: { width: 280, fontSize: 10, paddingLeft: 4 },
  tcellPrice: { width: 70, fontSize: 10, textAlign: "right", paddingRight: 4 },
  tcellTotal: { width: 113, fontSize: 10, textAlign: "right", paddingRight: 4 },

  // ---------- nota y totales ----------
  bottomRow: { flexDirection: "row", marginTop: 16 },
  nota: { width: 280, fontSize: 10 },
  notaTitle: { fontSize: 10 },
  totals: { width: 183 },
  totalBox: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: BLACK,
    height: 22,
    alignItems: "center",
  },
  totalLabel: {
    width: 70,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    paddingLeft: 4,
  },
  totalValue: {
    flex: 1,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    paddingRight: 4,
    borderLeftWidth: 1.5,
    borderColor: BLACK,
  },

  firmas: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
    fontSize: 9,
  },
})

/* ------------------------------------------------------------------ */
/* Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface PdfCompany {
  name: string
  tagline: string
  ruc: string
  city: string
  manager_name: string
  manager_title: string
  email: string
  phone: string
  services: string
  guarantee: string
  material_label: string
  default_notes: string
  logo_url?: string | null
}

export interface PdfProforma {
  number: number
  date: string
  client_name: string
  client_ruc: string
  client_phone: string
  client_address: string
  client_email: string
  material_label: string
  deposit: number
  notes: string
  items: Array<{
    quantity: number
    description: string
    unit_price: number
    total_price: number
  }>
}

export interface PdfTotals {
  total: number
  deposit: number
  saldo: number
}

/* ------------------------------------------------------------------ */
/* Formato de importes (1.261,07) y fecha larga                       */
/* ------------------------------------------------------------------ */

export function money(value: number): string {
  const n = Number(value) || 0
  const fixed = Math.abs(n).toFixed(2)
  const [int, dec] = fixed.split(".")
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${n < 0 ? "-" : ""}${withDots},${dec}`
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

export function fechaLarga(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

export function padNumber(n: number): string {
  return String(n).padStart(5, "0")
}

/* ------------------------------------------------------------------ */
/* Logo vectorial (evita depender de un binario externo)               */
/* ------------------------------------------------------------------ */

function BrandMark({ size = 70 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Rect x="0" y="0" width="64" height="64" rx="8" fill={BLUE} />
      <Line x1="14" y1="46" x2="50" y2="46" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" />
      <Line x1="20" y1="44" x2="20" y2="22" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <Line x1="20" y1="22" x2="31" y2="22" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <Line x1="33" y1="27" x2="43" y2="34" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="43" y1="34" x2="33" y2="38" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  )
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export function ProformaDocument({
  company,
  proforma,
  totals,
}: {
  company: PdfCompany
  proforma: PdfProforma
  totals: PdfTotals
}) {
  const materialLabel = proforma.material_label || company.material_label || "MATERIAL"
  const notes = proforma.notes || company.default_notes || ""
  const services = (company.services || "")
    .split("\n")
    .filter(Boolean)

  // Como en el original: minimo 8 filas
  const rows = proforma.items.slice(0, 26)
  const padded = rows.length < 8 ? 8 - rows.length : 0

  const headerBlock = (
    <View>
      {/* fila superior: logo / nombre + caja RUC */}
      <View style={styles.headerRow}>
        <View>
          {company.logo_url ? (
            <Image src={company.logo_url} style={styles.logo} />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BrandMark />
              <Text style={{ ...styles.companyName, marginLeft: 10 }}>
                {company.name}
              </Text>
            </View>
          )}
          {company.tagline && <Text style={styles.lema}>{company.tagline}</Text>}
          {services.length > 0 && (
            <View>
              <Text style={styles.offers}>Ofrece a sus clientes todo tipo de:</Text>
              {services.map((s, i) => (
                <Text key={i} style={styles.offerLine}>
                  {s}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.rightCenter}>
          <View style={styles.rucBox}>
            <Text style={styles.rucText}>RUC {company.ruc}</Text>
          </View>
          {company.manager_name && (
            <Text style={[styles.gerente, { marginTop: 14 }]}>
              {company.manager_name}
            </Text>
          )}
          {company.manager_title && (
            <Text style={styles.gerente}>{company.manager_title}</Text>
          )}
          {company.email && <Text style={styles.email}>{company.email}</Text>}
          {company.phone && <Text style={styles.telefono}>{company.phone}</Text>}
        </View>
      </View>

      {company.guarantee && (
        <Text style={styles.garantia}>{company.guarantee}</Text>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={styles.proformaTitle}>
          PROFORMA {padNumber(proforma.number)}
        </Text>
        <Text style={styles.fecha}>
          {company.city}, {fechaLarga(proforma.date)}
        </Text>
      </View>

      {/* datos del cliente */}
      <View style={styles.datosGrid}>
        <View style={styles.datoFila}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{proforma.client_name}</Text>
          <View style={{ flexDirection: "row", marginLeft: 40 }}>
            <Text style={styles.label}>R.U.C.:</Text>
            <Text style={styles.value}>{proforma.client_ruc}</Text>
          </View>
        </View>
        <View style={styles.datoFila}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.value}>{proforma.client_address}</Text>
        </View>
        <View style={styles.datoFila}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{proforma.client_email}</Text>
          <View style={{ flexDirection: "row", marginLeft: 40 }}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{proforma.client_phone}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const tableHeader = (
    <View style={styles.thead}>
      <View style={{ width: 60, alignItems: "center" }}>
        <Text style={styles.thCell}>CANT.</Text>
      </View>
      <View style={{ width: 280, alignItems: "center" }}>
        <Text style={styles.thCell}>DESCRIPCION</Text>
        <Text style={styles.thMaterial}>{materialLabel}</Text>
      </View>
      <View style={{ width: 70, alignItems: "center" }}>
        <Text style={styles.thCell}>Precio</Text>
        <Text style={styles.thCell}>Unitario</Text>
      </View>
      <View style={{ width: 113, alignItems: "center" }}>
        <Text style={styles.thCell}>VALOR</Text>
        <Text style={styles.thCell}>TOTAL</Text>
      </View>
    </View>
  )

  const row = (item: PdfProforma["items"][number] | null, last: boolean) => (
    <View style={last ? styles.trowLast : styles.trow}>
      <View style={styles.tcellCant}>
        {item ? <Text>{item.quantity}</Text> : null}
      </View>
      <View style={styles.tcellDesc}>
        {item ? <Text>{item.description}</Text> : null}
      </View>
      <View style={styles.tcellPrice}>
        {item && item.unit_price ? (
          <Text>{money(item.unit_price)}</Text>
        ) : null}
      </View>
      <View style={styles.tcellTotal}>
        <Text>{item ? `$ ${money(item.total_price)}` : "$ -"}</Text>
      </View>
    </View>
  )

  return (
    <Document
      title={`Proforma ${padNumber(proforma.number)}`}
      author={company.name}
      subject={`Proforma para ${proforma.client_name}`}
    >
      <Page size="A4" style={styles.page}>
        {headerBlock}

        <View style={styles.table}>
          {tableHeader}
          {rows.map((item, i) => row(item, false))}
          {Array.from({ length: padded }).map((_, i) => row(null, i === padded - 1))}
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.nota}>
            <Text style={styles.notaTitle}>NOTA:</Text>
            {notes.split("\n").map((line, i) => (
              <Text key={i} style={styles.nota}>
                {line}
              </Text>
            ))}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>TOTAL $</Text>
              <Text style={styles.totalValue}>{money(totals.total)}</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>ABONO $</Text>
              <Text style={styles.totalValue}>
                {totals.deposit > 0 ? money(totals.deposit) : ""}
              </Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>SALDO $</Text>
              <Text style={styles.totalValue}>{money(totals.saldo)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.firmas}>
          <Text>f). {company.name}</Text>
          <Text>f). Cliente</Text>
        </View>
      </Page>
    </Document>
  )
}
