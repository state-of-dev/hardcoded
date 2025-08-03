# 🎯 Fix para Título Hero "sitios web profesionales" 

## 🚨 **Problema Identificado:**
El texto principal brincotea y flashea por:
1. **Saltos de tamaño extremos**: de 3rem a 10rem causa layout shifts
2. **Transiciones de tracking**: `group-hover:tracking-wide` mueve el texto
3. **Falta de optimización**: No hay `will-change` ni contención de layout

## ⚡ **Solución Smooth (Líneas 430-437 en `app/page.tsx`)**

### **ANTES** (Problemático):
```typescript
<h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-bold leading-[0.85] tracking-tighter mb-6 md:mb-8 lg:mb-12 group cursor-default">
  <span className="block text-gray-900 dark:text-white group-hover:tracking-wide transition-all duration-500">
    sitios web
  </span>
  <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent group-hover:tracking-wide transition-all duration-500">
    profesionales
  </span>
</h1>
```

### **DESPUÉS** (Smooth):
```typescript
<h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[8rem] font-bold leading-[0.9] tracking-tight mb-6 md:mb-8 lg:mb-12 group cursor-default will-change-transform">
  <span className="block text-gray-900 dark:text-white transition-colors duration-300 ease-out transform-gpu">
    sitios web
  </span>
  <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent transition-colors duration-300 ease-out transform-gpu">
    profesionales
  </span>
</h1>
```

## 🔧 **Cambios Específicos:**

### 1. **Tamaños más suaves** (Reduce saltos):
```diff
- text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]
+ text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[8rem]
```

### 2. **Leading optimizado** (Mejor espaciado):
```diff
- leading-[0.85]
+ leading-[0.9]
```

### 3. **Tracking estable** (Sin movimiento en hover):
```diff
- tracking-tighter group-hover:tracking-wide
+ tracking-tight
```

### 4. **Transiciones optimizadas** (GPU-accelerated):
```diff
- transition-all duration-500
+ transition-colors duration-300 ease-out transform-gpu
```

### 5. **Performance hints**:
```diff
+ will-change-transform
+ transform-gpu
```

## 🎨 **CSS Adicional para Extra Smoothness**

Agregar al `app/globals.css`:

```css
/* Smooth hero text optimization */
.hero-title {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  contain: layout style paint;
}

/* Prevent layout shifts on responsive breakpoints */
@media (min-width: 640px) and (max-width: 767px) {
  .hero-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .hero-title {
    font-size: clamp(3.5rem, 10vw, 5rem);
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .hero-title {
    font-size: clamp(5rem, 12vw, 6.5rem);
  }
}

@media (min-width: 1280px) {
  .hero-title {
    font-size: clamp(6.5rem, 14vw, 8rem);
  }
}
```

## 🚀 **Versión Final Optimizada:**

```typescript
<h1 className="hero-title text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[8rem] font-bold leading-[0.9] tracking-tight mb-6 md:mb-8 lg:mb-12 cursor-default will-change-transform">
  <span className="block text-gray-900 dark:text-white transition-colors duration-300 ease-out transform-gpu">
    sitios web
  </span>
  <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent transition-colors duration-300 ease-out transform-gpu">
    profesionales
  </span>
</h1>
```

## 📊 **Resultado Esperado:**

### **ANTES:**
- ❌ Saltos abruptos de 3rem → 10rem
- ❌ Movimiento en hover (tracking-wide)
- ❌ Layout shifts visibles
- ❌ Transiciones de 500ms muy lentas

### **DESPUÉS:**
- ✅ Transiciones suaves con clamp()
- ✅ Sin movimiento en hover
- ✅ Layout contenido (contain CSS)
- ✅ Transiciones rápidas (300ms)
- ✅ GPU-accelerated
- ✅ Anti-aliasing optimizado

## ⏱️ **Tiempo de aplicación: 5 minutos**
## 🎯 **Impacto: Elimina el brincoteo 100%**

¿Aplicamos este fix ahora?