# notebook-generator

(Genera automáticamente) cuadernos a partir de tu código fuente. Útil para ACM-ICPC.

## Dependencias

Este generador funciona en Linux y Windows, así que revisa cómo instalar TeX Live en tu sistema.

TeX Live para Linux:

    aptitude install texlive texlive-latex-extra

TeX Live para Windows:

    descarga el instalador (install-tl-Windows.exe) desde https://www.tug.org/texlive/acquire-netinstall.html

## Instalación

    npm install -g notebook-generator

## Uso

    Uso: notebook-generator <source_dir> [options]

    Genera automáticamente cuadernos a partir de tu código fuente

    Opciones:
        -V, --version             muestra el número de versión
        -a --author <name>        nombre del autor que se añadirá al cuaderno
        -i --initials <initials>  iniciales del autor que se colocarán en la esquina superior derecha de todas las páginas
        -o --output <filename>    archivo de salida del cuaderno. (por defecto: "./notebook.pdf")
        -s --size <size>          el tamaño de fuente puede ser 8, 9, 10, 11, 12, 14, 17, 20 pt (por defecto: "10")
        -c --columns <amount>     el número de columnas puede ser 2 o 3. (por defecto: "2")
        -p --paper <size>         el tamaño de papel puede ser letterpaper, a4paper, a5paper. (por defecto: "letterpaper")
        -h, --help                muestra la ayuda
        -I --image <source>       imagen de portada que se añadirá al cuaderno.

Ejemplo:

    notebook-generator ./ --output /tmp/team_reference.pdf
    notebook-generator ./ --author "Universidad Tecnológica de Pereira" --initials UTP --size 12 --columns 3 --paper a4paper --image ./in-silicon

La segunda opción creará un archivo 'notebook.pdf' en el directorio actual.

## Ejemplo de PDF

Puedes ver un ejemplo aquí: https://github.com/pin3da/Programming-contest/blob/master/codes/notebook.pdf

## Archivos

El generador añadirá tu código fuente con resaltado de sintaxis; además,
podrás incluir archivos .tex que se renderizarán como código LaTeX.

## Notas:

- Intenta usar hasta 3 niveles en tu código fuente.
- Usa espacios en lugar de guiones bajos en los nombres de archivo para obtener una tabla de contenidos más bonita.

----
[Manuel Pineda](https://github.com/pin3da/) & [Diego Restrepo](https://github.com/Diegores14)
node bin/notebookgen ./contenido --output ./notebook.pdf