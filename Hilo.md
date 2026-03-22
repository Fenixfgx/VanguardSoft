# 🧵 Hilo de Progreso — Vanguard Soft Website

## Registro de avances de alta calidad

---

### ✅ 2026-03-22 — Estructura HTML completa (index.html)

**Decisiones clave:**
- Estructura semántica completa con 9 secciones: Hero, About, Services, Portfolio, Technologies, Differentiators, CTA, Contact, Footer
- SEO optimizado: title, meta description, Open Graph tags, theme-color
- Tipografía Inter (Google Fonts) — limpia, moderna, tecnológica
- Todos los íconos inline SVG (cero dependencias externas)
- Sistema de loader con barra de progreso animada
- Hero con partículas canvas, grid de fondo, badge animado, estadísticas con contadores
- Servicios con 5 tarjetas (la de IA destacada con `span 2`)
- Portafolio con mockups CSS (browser, phone, dashboard) — sin imágenes
- Formulario con validación accesible y feedback visual
- Navbar responsive con menú mobile full-screen
- Todos los elementos con clase `.reveal` para scroll animations
- Accesibilidad: aria-labels, aria-hidden, aria-expanded, semántica correcta

---

### ✅ 2026-03-22 — Diseño CSS premium (styles.css)

**Decisiones clave:**
- Custom Properties completas: colores, gradientes, tipografía, espaciado, transiciones, radios
- Paleta: Negro #050505/#0A0A0A, Azul eléctrico #00AEEF, Gradiente accent 3 colores (azul + violeta)
- Estética inspirada en Apple: espacios generosos, tipografía con tracking negativo, pesos variados
- Estética inspirada en Tesla: impacto visual, hero full-screen, storytelling vertical
- Animaciones: reveal con translateY, floating cards, pulse, dot-pulse, scroll-line
- Cursor glow radial siguiendo el mouse (solo desktop)
- Tilt effect en service cards (perspective 3D)
- Microinteracciones: hover en tech-chips, service arrows, social links, botones
- Grid background con mask radial en el hero
- Mockups en CSS puro (browser window, phone frame, dashboard layout)
- Responsive completo: 1024px (tablet), 768px (mobile), 480px (small mobile)
- prefers-reduced-motion respetado
- No frameworks, no librerías — CSS3 puro

---

### ✅ 2026-03-22 — JavaScript funcional (script.js)

**Decisiones clave:**
- IIFE para encapsulamiento, 'use strict'
- Loader con fallback de seguridad (4s max)
- Cursor glow con interpolación suave (lerp 0.08) via requestAnimationFrame
- Navbar: scroll detection, mobile menu toggle, Escape key close
- IntersectionObserver para scroll reveal con stagger delay automático
- Counter animation con easeOutExpo custom
- Canvas particles: 60 partículas con conexiones (líneas entre cercanas), wrap-around
- Optimización: particles solo se animan cuando hero es visible (IntersectionObserver)
- Tilt 3D en service cards (solo pointer:fine devices)
- Active nav link tracking on scroll
- Formulario: validación en submit + validación en blur + limpieza en input
- Validación de email con regex estándar
- Simulación de envío con loading state y mensaje de éxito
- Tech chips stagger animation por grupo
- Todos los listeners con `{ passive: true }` donde aplica
- Resize debounce para canvas
- Fallbacks para navegadores sin IntersectionObserver

---

### 📋 Arquitectura de archivos

```
├── index.html     — Estructura semántica completa
├── styles.css     — ~1100 líneas, diseño premium responsive
├── script.js      — ~350 líneas, interactividad rica
├── Context.md     — Documento de contexto del proyecto
└── Hilo.md        — Este archivo de seguimiento
```

---

### 🎨 Stack visual

| Elemento | Implementación |
|----------|---------------|
| Fondo | Negro profundo con grid sutil |
| Acento | Azul eléctrico #00AEEF + gradiente |
| Tipografía | Inter (300-900) |
| Íconos | SVG inline |
| Animaciones | CSS + JS (IntersectionObserver) |
| Partículas | Canvas 2D |
| Mockups | CSS puro |
| 3D Effect | CSS perspective + JS mousemove |

---

### ✅ 2026-03-22 — Migración a tema claro estilo Apple

**Decisión:** El usuario solicitó un cambio de paleta de colores oscura a clara, inspirada en apple.com/co.

**Cambios realizados:**
- **Paleta completa rediseñada:** Fondos blancos (#FFFFFF) y grises claros (#F5F5F7), texto oscuro (#1D1D1F, #515154, #6E6E73)
- **Accent color:** Cambiado de #00AEEF (azul neón) a #0071E3 (azul Apple) con gradiente a #2997FF y #6C5CE7
- **Variables de texto:** Nuevas `--color-text-primary/secondary/tertiary/quaternary` para jerarquía tipográfica
- **Navbar:** Glassmorphism blanco translúcido (rgba 255,255,255,0.72) con blur
- **Mobile menu:** Fondo blanco translúcido
- **Sombras:** Todas reducidas de 0.3-0.4 a 0.06-0.08 (estilo Apple)
- **Footer:** Se mantiene oscuro (#1D1D1F) como contraste — igual que Apple. Overrides para logo/marca dentro del footer
- **Formulario:** Wrapper blanco con shadow sutil
- **Partículas canvas:** Color actualizado a nuevo accent
- **Meta theme-color:** Actualizado a #0071E3

**Filosofía:** Limpieza extrema — fondos blancos, texto oscuro con jerarquía, bordes sutiles, sombras apenas perceptibles, accent con moderación.
