import fs from 'node:fs'

const file = process.argv[2]
const fromLine = Number(process.argv[3] || 1)
let src = fs.readFileSync(file, 'utf8')
if (fromLine > 1) {
  const lines = src.split('\n')
  src = lines.slice(fromLine - 1).join('\n')
}

const stack = []
const problems = []
let i = 0
let line = 1

function skipBraced(from) {
  // Devuelve el indice justo despues de la expresion {...} balanceada
  let depth = 0
  let j = from
  while (j < src.length) {
    const ch = src[j]
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) return j + 1
    } else if (ch === '`') {
      // template literal
      j++
      while (j < src.length && src[j] !== '`') {
        if (src[j] === '\\') j++
        j++
      }
    }
    j++
  }
  return from
}

function readTagName(pos) {
  const m = /^<\/?([A-Za-z][A-Za-z0-9._-]*)/.exec(src.slice(pos))
  return m ? m[1] : null
}

while (i < src.length) {
  const c = src[i]

  if (c === '\n') { line++; i++; continue }

  // Comentarios
  if (c === '/' && src[i + 1] === '/') {
    while (i < src.length && src[i] !== '\n') i++
    continue
  }
  if (c === '/' && src[i + 1] === '*') {
    i += 2
    while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
      if (src[i] === '\n') line++
      i++
    }
    i += 2
    continue
  }

  // Strings
  if (c === '"' || c === "'" || c === '`') {
    const q = c
    i++
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') i++
      if (src[i] === '\n') line++
      i++
    }
    i++
    continue
  }

  if (c === '<') {
    const name = readTagName(i)
    if (!name) { i++; continue }

    const isClosing = src[i + 1] === '/'

    // Buscar el cierre del tag respetando {} y strings
    let j = i + 1
    let depth = 0
    let selfClosing = false
    while (j < src.length) {
      const ch = src[j]
      if (ch === '{') { j = skipBraced(j); continue }
      if (ch === '"' || ch === "'" || ch === '`') {
        const q = ch
        j++
        while (j < src.length && src[j] !== q) {
          if (src[j] === '\\') j++
          j++
        }
        j++
        continue
      }
      if (ch === '>') {
        if (src[j - 1] === '/') selfClosing = true
        break
      }
      if (ch === '\n') line++
      j++
    }

    if (isClosing) {
      const top = stack.pop()
      if (!top) problems.push(`L${line}: cierre </${name}> sin apertura`)
      else if (top.tag !== name) {
        problems.push(`L${line}: se cierra </${name}> pero estaba abierto <${top.tag}> de L${top.line}`)
      }
    } else if (!selfClosing) {
      stack.push({ tag: name, line })
    }

    i = j + 1
    continue
  }

  i++
}

console.log('=== Tags sin cerrar ===')
if (stack.length === 0) console.log('  (ninguno)')
for (const s of stack) console.log(`  <${s.tag}> abierto en L${s.line}`)

console.log('\n=== Problemas de anidamiento ===')
if (problems.length === 0) console.log('  (ninguno)')
for (const p of problems) console.log('  ' + p)
