# DomP - Web Corporativa

Sitio web corporativo de DomP, empresa de construcción en México.

## 🚀 Tecnologías

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Instala las dependencias:

```bash
npm install
```

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
domp/
├── app/                    # App Router de Next.js
│   ├── contacto/          # Página de contacto
│   ├── nosotros/          # Página sobre nosotros
│   ├── proyectos/         # Página de proyectos + [slug]
│   ├── servicios/         # Página de servicios
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ServiceCard.tsx
│   ├── ProjectCard.tsx
│   └── ...
├── lib/                   # Utilidades y datos
│   └── data.ts           # Datos de ejemplo (servicios, proyectos)
└── public/               # Archivos estáticos
```

## 📝 Páginas

- `/` - Página de inicio con Hero, Servicios, Proyectos destacados
- `/servicios` - Lista detallada de todos los servicios
- `/proyectos` - Grid de todos los proyectos
- `/proyectos/[slug]` - Detalle de cada proyecto
- `/nosotros` - Historia, misión, visión, valores, proceso y equipo
- `/contacto` - Formulario de contacto con validación

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint

## 📧 Integración de Backend

El formulario de contacto actualmente solo hace `console.log` de los datos. Para integrar un backend real:

1. Crea una ruta API en `/app/api/contacto/route.ts`
2. Descomenta el código de integración en `/app/contacto/page.tsx` (líneas comentadas con `// TODO`)
3. Configura el endpoint según tu backend (REST API, GraphQL, etc.)

Ejemplo de estructura de API route:

```typescript
// app/api/contacto/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  // Aquí integrarías con tu servicio de email, base de datos, etc.
  // Ejemplo: await sendEmail(data);
  return NextResponse.json({ success: true });
}
```

## 📊 CMS / Base de Datos

Los datos actuales están en `/lib/data.ts`. Para integrar un CMS:

1. **Contentful/Sanity**: Crear componentes que fetchen datos desde el CMS
2. **Base de datos**: Crear API routes que consulten tu BD
3. **Markdown**: Usar archivos `.md` y procesarlos con `remark`

Ejemplo de migración:
- Reemplazar `import { services } from '@/lib/data'` por `await fetchServices()`
- Crear funciones async en server components o API routes

## 🎨 Personalización

- **Colores**: Edita `tailwind.config.ts` (colores `primary`)
- **Fuentes**: Cambia la fuente en `app/layout.tsx`
- **Contenido**: Modifica `/lib/data.ts` o integra con CMS

## 📱 Responsive Design

El sitio está optimizado para:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## ✅ Funcionalidades

- ✅ Diseño responsive completo
- ✅ Navegación con menú mobile
- ✅ Formulario de contacto con validación
- ✅ SEO básico (metadata por página)
- ✅ Páginas dinámicas para proyectos
- ✅ Componentes reutilizables
- ✅ Estilos con Tailwind CSS
- ✅ TypeScript en todo el proyecto

## 📄 Licencia

Este proyecto es privado para DomP.

