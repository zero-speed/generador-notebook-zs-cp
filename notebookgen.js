const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const through2 = require('through2')
const tmp = require('tmp')
const os = require('os')

const section = ['\\section{', '\\subsection{', '\\subsubsection{']
const extensions = {
  '.cc': 'C++',
  '.cpp': 'C++',
  '.hpp': 'C++',
  '.c': 'C',
  '.java': 'Java',
  '.py': 'Python',
  '.tex': 'Tex',
  '.go': 'Golang',
  '.md': 'Markdown',
  '.markdown': 'Markdown'
}

function parseTableRow (line) {
  // quita | de los extremos, separa por | que NO estén escapados
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split(/(?<!\\)\|/).map(function (cell) {
    return cell.trim().replace(/\\\|/g, '|')
  })
}

function isTableRow (line) {
  return /^\s*\|.*\|\s*$/.test(line)
}

function isSeparatorRow (line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line)
}

function alignmentFromSeparator (line) {
  return parseTableRow(line).map(function (cell) {
    const left = cell.startsWith(':')
    const right = cell.endsWith(':')
    if (left && right) return 'c'
    if (right) return 'r'
    return 'l'
  })
}

function convertMarkdownToLatex (content) {
  const lines = content.split(/\r?\n/)
  const latexLines = []
  let inList = false

  const flushList = function () {
    if (inList) {
      latexLines.push('\\end{itemize}')
      inList = false
    }
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // --- Tabla markdown ---
    if (isTableRow(trimmed) && isSeparatorRow((lines[i + 1] || '').trim())) {
      flushList()
      const header = parseTableRow(trimmed)
      const aligns = alignmentFromSeparator(lines[i + 1].trim())
      const colSpec = aligns.join('|')

      latexLines.push('\\begin{center}')
      latexLines.push('\\begin{tabular}{|' + colSpec + '|}')
      latexLines.push('\\hline')
      latexLines.push(header.join(' & ') + ' \\\\')
      latexLines.push('\\hline')

      i += 2 // saltar encabezado y separador
      while (i < lines.length && isTableRow(lines[i].trim())) {
        latexLines.push(parseTableRow(lines[i].trim()).join(' & ') + ' \\\\')
        i++
      }
      latexLines.push('\\hline')
      latexLines.push('\\end{tabular}')
      latexLines.push('\\end{center}')
      continue
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushList()
      const level = trimmed.match(/^#+/)[0].length
      const heading = trimmed.replace(/^#{1,6}\s+/, '')
      const sectionCommand = level === 1 ? '\\section' : level === 2 ? '\\subsection' : '\\subsubsection'
      latexLines.push(sectionCommand + '{' + heading + '}')
      i++
      continue
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      if (!inList) {
        latexLines.push('\\begin{itemize}')
        inList = true
      }
      latexLines.push('\\item ' + trimmed.replace(/^[-*+]\s+/, ''))
      i++
      continue
    }

    if (trimmed === '') {
      flushList()
      latexLines.push('')
      i++
      continue
    }

    flushList()
    latexLines.push(trimmed)
    i++
  }

  flushList()

  return latexLines
    .join('\n')
    .replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}')
    .replace(/\*(.+?)\*/g, '\\emph{$1}')
    .replace(/`([^`]+)`/g, '\\texttt{$1}')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '\\includegraphics{$2}')
    .replace(/\$\$(.*?)\$\$/gs, '\\[\n$1\\]\n')
    .replace(/\$(.*?)\$/g, '\\($1\\)')
}

function getPdfLatexCommand () {
  const candidates = []

  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local')
    candidates.push(path.join(localAppData, 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64', 'pdflatex.exe'))
    candidates.push(path.join('C:', 'Program Files', 'MiKTeX', 'miktex', 'bin', 'x64', 'pdflatex.exe'))
    candidates.push(path.join('C:', 'Program Files (x86)', 'MiKTeX', 'miktex', 'bin', 'x64', 'pdflatex.exe'))
  } else {
    candidates.push('/usr/bin/pdflatex')
    candidates.push('/bin/pdflatex')
    candidates.push('/usr/local/bin/pdflatex')
  }

  if (process.env.PATH) {
    process.env.PATH.split(path.delimiter).forEach(function (entry) {
      candidates.push(path.join(entry, process.platform === 'win32' ? 'pdflatex.exe' : 'pdflatex'))
    })
  }

  return candidates.find(function (candidate) {
    return fs.existsSync(candidate)
  }) || 'pdflatex'
}

function walk (_path, depth) {
  let ans = ''
  depth = Math.min(depth, section.length - 1)
  fs.readdirSync(_path).forEach(function (file) {
    if (file.startsWith('.')) {
      return // hidden directory
    }
    const f = path.resolve(_path, file)
    const stat = fs.lstatSync(f)
    if (stat.isDirectory()) {
      ans += '\n' + section[depth] + file + '}\n' + walk(f, depth + 1)
    } else if (path.extname(f) in extensions) {
      const ext = path.extname(f)
      ans += '\n' + section[depth] + file.split('.')[0] + '}\n'
      if (ext === '.tex') {
        ans += fs.readFileSync(f, 'utf8')
      } else if (ext === '.md' || ext === '.markdown') {
        ans += '\\noindent\n' + convertMarkdownToLatex(fs.readFileSync(f, 'utf8')) + '\\par\n'
      } else {
        ans += `\\begin{lstlisting}[language=${extensions[ext]}]\n` + fs.readFileSync(f, 'utf8') + '\\end{lstlisting}\n'
      }
    }
  })
  return ans
}

/**
 * pdf must be generated twice in order to generate the table of contents.
 * According to some tests, in windows it must be generated 3 times.
 * */
function genpdf (ans, texPath, tmpobj, iter) {
  const latexCommand = getPdfLatexCommand()
  const tex = spawn(latexCommand, [
    '-interaction=nonstopmode',
    texPath
  ], {
    cwd: tmpobj.name,
    env: process.env
  })

  tex.on('error', function (err) {
    console.error(err)
  })

  tex.on('exit', function (code, signal) {
    const outputFile = texPath.split('.')[0] + '.pdf'
    fs.access(outputFile, function (err) {
      if (err) {
        return console.error('Not generated ' + code + ' : ' + signal)
      }
      if (iter === 0) {
        const s = fs.createReadStream(outputFile)
        s.pipe(ans)
        s.on('close', function () {
          tmpobj.removeCallback()
        })
      } else {
        genpdf(ans, texPath, tmpobj, iter - 1)
      }
    })
  })
}

function pdflatex (doc) {
  const tmpobj = tmp.dirSync({ unsafeCleanup: true })
  const texPath = path.join(tmpobj.name, '_notebook.tex')

  const ans = through2()
  ans.readable = true
  const input = fs.createWriteStream(texPath)
  input.end(doc)
  input.on('close', function () {
    const iters = process.platform === 'win32' ? 2 : 1
    genpdf(ans, texPath, tmpobj, iters)
  })

  return ans
}

function normalizeUnixStyle (currentPath) {
  if (os.type() === 'Windows_NT') {
    return currentPath.replace(/\\/g, '/')
  }
  return currentPath
}

function templateParameter (parameter) {
  return `\${${parameter}}`
}

module.exports = function (_path, options) {
  options.output = options.output || './notebook.pdf'
  options.author = options.author || ''
  options.initials = options.initials || ''

  if (!options.size.endsWith('pt')) options.size += 'pt'
  if (options.image) {
    options.image = normalizeUnixStyle(path.resolve(options.image))
    options.image = '\\centering{\\includegraphics[width=3.5cm]{' + options.image + '}}'
  } else {
    options.image = ''
  }

  let template = fs.readFileSync(path.join(__dirname, 'template_header.tex')).toString()
  template = template
    .replace(templateParameter('author'), options.author)
    .replace(templateParameter('initials'), options.initials)
    .replace(templateParameter('fontSize'), options.size)
    .replace(templateParameter('columns'), options.columns)
    .replace(templateParameter('paper'), options.paper)
    .replace(templateParameter('image'), options.image)

  template += walk(_path, 0)
  template += '\\end{multicols}\n'
  template += '\\end{document}'
  pdflatex(template).pipe(fs.createWriteStream(options.output))
}

module.exports.convertMarkdownToLatex = convertMarkdownToLatex