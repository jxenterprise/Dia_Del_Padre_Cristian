# Día del Padre · Cristian

Página web de homenaje para el Día del Padre, dedicada a **Cristian** (esposo/padrastro).
Cuando el usuario diga **"continuemos"** en un chat nuevo, leer este archivo y retomar la edición de la página directamente.

## ¿Qué es esta página?

Una carta/tributo interactivo hecho por la familia de Cristian. Tiene estética **Silent Hill 2** — colores oscuros fríos, niebla, partículas de ceniza flotando y fuentes solemnes. Es una página de una sola pantalla (scroll vertical) sin backend ni dependencias npm.

## Personas que firman

| Carta | Quién | Relación |
|-------|-------|----------|
| 01 | Rossalín | Esposa de Cristian |
| 02 | Hardcoryth | Hija |
| 03 | Axael | Hijo |

## Estructura de archivos

```
index.html                        ← página principal (HTML limpio, sin inline CSS/JS)
css/
  Dia_Del_Padre_Cristian.css      ← todos los estilos
js/
  Dia_Del_Padre_Cristian.js       ← toda la lógica interactiva
img/
  hero-silent-hill.png            ← imagen hero (calle con niebla, estética SH2)
CLAUDE.md                         ← este archivo
```

## Paleta de colores (CSS vars)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--void` | `#090b0c` | Fondo principal |
| `--smoke` | `#14181b` | Paneles elevados |
| `--ash` | `#1c2226` | Bordes |
| `--fog` | `#cdd4d5` | Texto principal |
| `--steel` | `#828d91` | Texto secundario |
| `--steel-dim` | `#525c60` | Texto terciario |
| `--rust` | `#9a4a3a` | Acento óxido (muy poco) |

## Tipografías (Google Fonts)

- **Cinzel** — títulos solemnes (`--f-display`)
- **Spectral** — cuerpo de las cartas (`--f-body`)
- **Special Elite** — etiquetas tipo máquina de escribir (`--f-mono`)

## Efectos y animaciones (JS)

1. **Loader** — pantalla negra con texto "SILENT HILL" que desaparece al cargar
2. **Reveal on scroll** — elementos aparecen con blur+fade al entrar en viewport (IntersectionObserver)
3. **Linterna del cursor** — efecto de linterna radial que sigue el mouse (solo desktop)
4. **Parallax hero** — la imagen de fondo se mueve levemente al hacer scroll (modo paisaje)
5. **Ceniza (canvas)** — partículas blancas que flotan lentamente hacia arriba
6. **Flicker** — título final "Te amamos Cristian" parpadea como un letrero roto

Todo respeta `prefers-reduced-motion`.

## Secciones de la página (orden de scroll)

1. **Hero** — imagen a pantalla completa con título "para Cristian · de Rossalín, Hardcoryth y Axael"
2. **Intro** — frase de apertura sobre la niebla y la familia elegida
3. **Cartas** — tres bloques tipo "expediente húmedo" con las cartas personales
4. **Finale** — "Te amamos Cristian" con efecto flicker, a pantalla completa
5. **Footer** — "Hecho con cariño · 2026"

## Repo GitHub

`https://github.com/jxenterprise/Dia_Del_Padre_Cristian.git`

## Notas importantes

- La página **no tiene framework**, es HTML/CSS/JS puro.
- El CSS usa **escala de tipografía fluida** (`clamp()`) — no cambiar tamaños con px fijos.
- El hero en móvil muestra la imagen completa como banda horizontal; en pantallas apaisadas pasa a modo inmersivo (imagen cubre toda la pantalla).
- Las cartas en desktop se alternan izquierda/derecha con la clase `.letter--alt`.
- El archivo `img/hero-silent-hill.png` es la única imagen del proyecto.
