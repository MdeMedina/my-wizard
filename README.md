# 3D Custom Product Wizard - Integración Shopify

### **Configurador Interactivo de Productos en Tiempo Real (WebGL)**

Este repositorio contiene un configurador 3D avanzado construido con **React** y **Three.js**, diseñado para integrarse de forma nativa en tiendas **Shopify**. Permite a los usuarios visualizar, personalizar e interactuar con modelos de productos (como chaquetas Varsity) en tiempo real, inyectando las configuraciones personalizadas directamente en el carrito de compras.

---

## 🚀 Retos de Ingeniería y Soluciones Aplicadas

El desarrollo de interfaces 3D para la web requiere un balance perfecto entre rendimiento visual e interactividad fluida. Se aplicaron metodologías de **Bases de Innovación** e **Ingeniería de Software** para lograrlo:

* **Optimización de Renderizado WebGL:** Uso de **React Three Fiber (R3F)** y `<Suspense>` para la carga asíncrona de modelos `.glb` y fuentes personalizadas (`.ttf`), garantizando que la escena no bloquee el hilo principal del navegador.
* **Gestión de Estado y Performance:** Implementación de *Custom Hooks* como `useDebounce` (300ms) para los *inputs* de texto. Esto evita re-renderizados innecesarios en el motor 3D mientras el usuario escribe, manteniendo una experiencia UI/UX fluida en dispositivos móviles.
* **Integración Directa con E-commerce:** Desarrollo de un adaptador de datos que mapea los estados de la aplicación (colores, tallas, textos) hacia el endpoint `/cart/add.js` de **Shopify**, transformando una experiencia visual en metadatos estructurados (`line-item properties`) listos para el checkout.
* **Tipografía Dinámica en 3D:** Implementación de algoritmos de cálculo radial y angular para adaptar dinámicamente el texto bordado (nombres, números) a las curvaturas del modelo 3D según la longitud del texto.

---

## 🛠️ Stack Tecnológico

* **Core:** React 19, Vite.
* **Motor 3D:** [Three.js](https://threejs.org/) y [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber).
* **Utilidades 3D:** `@react-three/drei` para controles de órbita y renderizado de texto nativo en la escena.
* **UI y Estilos:** React Bootstrap y React-Select para componentes de formulario accesibles y responsivos.
* **Integración:** Shopify AJAX Cart API.

---

## 📦 Características Principales

* **Visualización 3D Interactiva:** Rotación controlada mediante `OrbitControls` restringiendo los ejes polares para mantener al usuario enfocado en el diseño.
* **Personalización en Tiempo Real:** Cambio dinámico de materiales y colores independientes (Cuerpo, Mangas, Botones).
* **Parches y Bordados Personalizados:** Soporte para tipografías personalizadas (Block, Fancy) renderizadas con propiedades de *outline* y *fill*.
* **Responsive Design:** Detección de dispositivos mediante `react-responsive` para adaptar los tamaños de fuente, el *layout* del panel de configuración y el FOV de la cámara.

---

## ⚙️ Configuración y Desarrollo

### Requisitos Previos
* Node.js 18+
* npm o yarn

### Instalación Local

1. Clonar el repositorio:
```bash
git clone [https://github.com/mdemedina/my-wizard.git](https://github.com/mdemedina/my-wizard.git)
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

### Compilación para Producción (Shopify)
Para generar el *bundle* que se inyectará en el ecosistema de Shopify (liquid templates):
```bash
npm run build
```
El resultado en la carpeta `dist/` contendrá los *assets* optimizados listos para ser alojados en el CDN de la tienda.

---

## 🛠️ Estructura del Proyecto

```text
my-wizard/
├── src/
│   ├── Wizard.jsx      # Componente principal de la app (UI + Canvas)
│   ├── App.css         # Estilos globales y específicos del Wizard
│   └── main.jsx        # Punto de entrada de React
├── public/             # Fuentes tipográficas y assets estáticos
├── vite.config.js      # Configuración de empaquetado para Shopify
└── package.json        # Gestión de dependencias
```
