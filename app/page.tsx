"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Sparkles,
  Moon,
  Sun,
  Grid3X3,
  ImageIcon,
  FileText,
  Video,
  Music,
  Layers,
  Infinity,
  Zap,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute("data-section")
          if (sectionId) {
            setVisibleSections((prev) => {
              const newSet = new Set(prev)
              if (entry.isIntersecting) {
                newSet.add(sectionId)
              } else {
                newSet.delete(sectionId)
              }
              return newSet
            })
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    // Observe all sections
    const sections = document.querySelectorAll("[data-section]")
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return visibleSections
}

export default function LunchBoxLanding() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [isHoveringDesignElement, setIsHoveringDesignElement] = useState(false)

  const visibleSections = useScrollAnimation()

  // Check system preference on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the last used theme from localStorage
      const lastTheme = localStorage.getItem("lunch-box-theme")
      let newTheme: boolean

      if (lastTheme === null) {
        // First visit - random theme
        newTheme = Math.random() > 0.5
        console.log("🎲 Primera visita - tema aleatorio:", newTheme ? "dark" : "light")
      } else {
        // Alternate from last theme
        newTheme = lastTheme === "light"
        console.log("🔄 Alternando tema - anterior:", lastTheme, "nuevo:", newTheme ? "dark" : "light")
      }

      // Set the theme
      setIsDarkMode(newTheme)

      // Apply theme to document
      if (newTheme) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // Save current theme for next visit
      localStorage.setItem("lunch-box-theme", newTheme ? "dark" : "light")
    }
  }, [])

  // Optimized scroll handler using requestAnimationFrame
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Removed mouse tracking for better performance

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Función para ir al formulario con opción preseleccionada
  const scrollToContactForm = (packageType?: string) => {
    const element = document.getElementById("contact-form")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })

      // Preseleccionar la opción si se proporciona
      if (packageType) {
        setTimeout(() => {
          const selectElement = document.getElementById("project-type") as HTMLSelectElement
          if (selectElement) {
            selectElement.value = packageType
          }
        }, 500) // Pequeño delay para asegurar que el scroll termine
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle("dark")

    // Save the manually selected theme
    localStorage.setItem("lunch-box-theme", newTheme ? "dark" : "light")
    console.log("🎨 Tema cambiado manualmente a:", newTheme ? "dark" : "light")
  }

  // Ultra-optimized morphing progress - minimal calculations
  const getShapeProgress = () => {
    if (typeof window === "undefined" || scrollY === 0) return { borderRadius: "50%", rotation: "0deg" }

    // Simplified single calculation
    const progress = Math.min(scrollY / 2000, 1) // Fixed threshold for consistent performance
    const radius = 50 - (progress * 25) // Smooth transition from 50% to 25%
    const angle = progress * 15 // Reduced rotation for subtlety

    return { 
      borderRadius: `${radius}%`, 
      rotation: `${angle}deg` 
    }
  }

  const { borderRadius, rotation } = getShapeProgress()

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950 text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-500 ${
        isHoveringDesignElement ? "cursor-crosshair" : "cursor-default"
      }`}
    >
      {/* Custom CSS for enhanced UX and animations */}
      <style jsx global>{`
        ::selection {
          background: ${isDarkMode ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.2)"};
          color: ${isDarkMode ? "#ffffff" : "#1f2937"};
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${isDarkMode ? "rgba(15, 23, 42, 0.1)" : "rgba(243, 244, 246, 0.5)"};
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.3)"};
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "rgba(168, 85, 247, 0.5)" : "rgba(147, 51, 234, 0.5)"};
        }

        /* Breathing animation - simplified */
        @keyframes subtle-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        
        .subtle-breathe {
          animation: subtle-breathe 6s ease-in-out infinite;
          will-change: transform;
        }

        /* Hardware acceleration for performance */
        .hw-accelerate {
          transform: translateZ(0);
          will-change: transform;
        }

        /* Optimized scroll-triggered animations - GPU accelerated */
        .animate-fade-in-up {
          opacity: 0;
          transform: translate3d(0, 30px, 0);
          transition: opacity 0.15s ease-out, transform 0.15s ease-out;
          will-change: opacity, transform;
        }

        .animate-fade-in-up.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .animate-fade-in-left {
          opacity: 0;
          transform: translate3d(-30px, 0, 0);
          transition: opacity 0.15s ease-out, transform 0.15s ease-out;
          will-change: opacity, transform;
        }

        .animate-fade-in-left.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .animate-fade-in-right {
          opacity: 0;
          transform: translate3d(30px, 0, 0);
          transition: opacity 0.15s ease-out, transform 0.15s ease-out;
          will-change: opacity, transform;
        }

        .animate-fade-in-right.visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .animate-scale-in {
          opacity: 0;
          transform: scale3d(0.95, 0.95, 1);
          transition: opacity 0.15s ease-out, transform 0.15s ease-out;
          will-change: opacity, transform;
        }

        .animate-scale-in.visible {
          opacity: 1;
          transform: scale3d(1, 1, 1);
        }

        .animate-fade-in {
          opacity: 0;
          transition: opacity 0.15s ease-out;
          will-change: opacity;
        }

        .animate-fade-in.visible {
          opacity: 1;
        }

        /* Fix select options text color in dark mode */
        .dark select#project-type option {
          color: black !important;
          background-color: white !important;
        }

        /* Staggered animations for children */
        .stagger-children > * {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stagger-children.visible > *:nth-child(1) { transition-delay: 0.1s; }
        .stagger-children.visible > *:nth-child(2) { transition-delay: 0.2s; }
        .stagger-children.visible > *:nth-child(3) { transition-delay: 0.3s; }
        .stagger-children.visible > *:nth-child(4) { transition-delay: 0.4s; }
        .stagger-children.visible > *:nth-child(5) { transition-delay: 0.5s; }
        .stagger-children.visible > *:nth-child(6) { transition-delay: 0.6s; }

        .stagger-children.visible > * {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Artistic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.05),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),rgba(0,0,0,0))]" />
      <div className="fixed top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[5%] w-32 md:w-64 h-32 md:h-64 rounded-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 blur-3xl subtle-breathe" />
        <div
          className="absolute top-[40%] right-[10%] w-40 md:w-80 h-40 md:h-80 rounded-full bg-gradient-to-r from-pink-500/5 to-orange-500/5 dark:from-pink-500/10 dark:to-orange-500/10 blur-3xl subtle-breathe"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[15%] left-[15%] w-36 md:w-72 h-36 md:h-72 rounded-full bg-gradient-to-r from-green-500/5 to-cyan-500/5 dark:from-green-500/10 dark:to-cyan-500/10 blur-3xl subtle-breathe"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Responsive Navigation */}
        <nav
          className="fixed top-2 sm:top-4 md:top-8 right-2 sm:right-4 md:right-8 z-50"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="text-xs sm:text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 sm:px-3 md:px-4 rounded-full group"
              aria-label="Toggle between light and dark theme"
            >
              <div className="group-hover:rotate-180 transition-transform duration-500">
                {isDarkMode ? (
                  <Sun className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5" />
                ) : (
                  <Moon className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5" />
                )}
              </div>
            </Button>
            <Button
              variant="ghost"
              className="hidden sm:inline-flex text-xs sm:text-sm md:text-lg font-light text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-300 px-2 sm:px-3 md:px-4"
              onClick={() => scrollToSection("pricing")}
            >
              Paquetes
            </Button>
            <Button
              className="rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-white/90 px-2 sm:px-3 md:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base hover:scale-105 transition-all duration-300 hover:shadow-lg"
              onClick={() => scrollToContactForm()}
            >
              Contactar
            </Button>
          </div>
        </nav>

        {/* Creative Hero Section */}
        <section
          className="min-h-screen flex items-center justify-center px-8 md:px-12 lg:px-16 relative"
          data-section="hero"
        >
          {/* Morphing Circles/Squares - simplified with CSS variables */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] border border-gray-200 dark:border-white/5 transition-all duration-500 ease-out hw-accelerate"
            style={{
              borderRadius,
              transform: `translate(-50%, -50%) rotate(${rotation})`,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] lg:w-[600px] h-[300px] md:h-[450px] lg:h-[600px] border border-gray-200 dark:border-white/10 transition-all duration-500 ease-out hw-accelerate"
            style={{
              borderRadius,
              transform: `translate(-50%, -50%) rotate(${rotation === "0deg" ? "0deg" : `-${rotation}`})`,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[300px] lg:w-[400px] h-[200px] md:h-[300px] lg:h-[400px] border border-gray-300 dark:border-white/20 transition-all duration-500 ease-out hw-accelerate"
            style={{
              borderRadius,
              transform: `translate(-50%, -50%) rotate(${rotation === "0deg" ? "0deg" : `${Number.parseFloat(rotation) * 0.5}deg`})`,
            }}
          />

          <div
            className={`max-w-6xl mx-auto text-center relative animate-fade-in-up ${visibleSections.has("hero") ? "visible" : ""}`}
          >
            <Badge
              variant="outline"
              className="inline-flex mb-6 md:mb-8 lg:mb-12 text-xs md:text-sm font-light border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/80 px-3 md:px-4 py-1.5 md:py-2 items-center"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Presencia digital
            </Badge>

            <h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-bold leading-[0.85] tracking-tighter mb-6 md:mb-8 lg:mb-12 group cursor-default">
              <span className="block text-gray-900 dark:text-white group-hover:tracking-wide transition-all duration-500">
                Tus clientes te
              </span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent group-hover:tracking-wide transition-all duration-500">
                buscan online primero
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 dark:text-white/80 mb-8 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light px-4">
              ¿Apareces cuando te buscan? Diseñamos presencia digital que genera confianza real y convierte visitantes en clientes. Sin esperas largas, sin precios exorbitantes.
            </p>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-500 dark:via-pink-500 dark:to-cyan-500 p-[1px] rounded-full group hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <Button
                className="rounded-full bg-white dark:bg-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-black/90 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-base sm:text-lg md:text-xl group"
                onClick={() => scrollToContactForm()}
              >
                Solicitar Cotización
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </section>

        {/* Creative Showcase */}
        <section className="py-24 md:py-32 relative" aria-labelledby="showcase-heading" data-section="showcase">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Left Column */}
              <div
                className={`xl:col-span-5 text-center xl:text-left mb-12 xl:mb-0 animate-fade-in-left ${visibleSections.has("showcase") ? "visible" : ""}`}
              >
                <h2
                  id="showcase-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 lg:mb-12 leading-tight"
                >
                  Expertos en{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Desarrollo
                  </span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-white/70 mb-6 md:mb-8 lg:mb-12 leading-relaxed max-w-2xl mx-auto xl:mx-0">
                  Creamos sitios web estructurados y optimizados para empresas que buscan presencia digital efectiva.
                  Cada proyecto incluye las herramientas esenciales que tu negocio necesita.
                </p>
                <div className="flex items-center justify-center xl:justify-start gap-4 md:gap-6 lg:gap-8">
                  <div className="w-12 sm:w-16 md:w-20 h-[2px] bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400" />
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-white/50">
                    Perfecto para PyMEs que quieren resultados profesionales
                  </p>
                </div>
              </div>

              {/* Right Column - Bento Preview */}
              <div
                className={`xl:col-span-7 relative max-w-2xl mx-auto xl:max-w-none animate-fade-in-right ${visibleSections.has("showcase") ? "visible" : ""}`}
              >
                <div className="absolute -top-5 sm:-top-10 md:-top-20 -left-5 sm:-left-10 md:-left-20 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl" />
                <div className="absolute -bottom-5 sm:-bottom-10 md:-bottom-20 -right-5 sm:-right-10 md:-right-20 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 blur-3xl" />

                <div
                  className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3 md:gap-4 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative"
                  onMouseEnter={() => setIsHoveringDesignElement(true)}
                  onMouseLeave={() => setIsHoveringDesignElement(false)}
                >
                  {/* Mantener las cajas del bento grid pero con mejor responsividad */}
                  <div className="col-span-2 row-span-2 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/15 dark:to-pink-500/15 backdrop-blur-sm border-2 border-purple-300/50 dark:border-purple-400/30 p-2 sm:p-4 md:p-6 transition-all duration-500 flex flex-col justify-between shadow-lg group hover:scale-[1.02] hover:shadow-xl hover:border-purple-400/70 dark:hover:border-purple-400/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500 animate-pulse" />
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="w-2 sm:w-3 h-2 sm:h-3 text-white" />
                      </div>
                      <span className="text-[8px] sm:text-xs font-medium text-purple-600 dark:text-purple-400">
                        FEATURED
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-xl md:text-3xl font-bold text-gray-900 dark:text-white relative z-10">
                      Empresarial
                    </h3>
                  </div>

                  {/* Resto de las cajas con mejor responsividad */}
                  <div className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-2 sm:p-3 md:p-6 transition-all duration-500 flex items-end shadow-sm group hover:scale-[1.02] hover:shadow-lg hover:bg-white/90 dark:hover:bg-white/10 hover:border-blue-300 dark:hover:border-blue-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-xs sm:text-lg md:text-2xl font-medium text-gray-900 dark:text-white relative z-10">
                      E-commerce
                    </h3>
                  </div>

                  <div className="col-span-1 row-span-1 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-1 sm:p-2 md:p-6 transition-all duration-500 flex items-end shadow-sm group hover:scale-[1.05] hover:shadow-lg hover:bg-white/90 dark:hover:bg-white/10 hover:border-green-300 dark:hover:border-green-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-[8px] sm:text-sm md:text-xl font-medium text-gray-900 dark:text-white relative z-10">
                      Servicios
                    </h3>
                  </div>

                  <div className="col-span-1 row-span-2 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-1 sm:p-2 md:p-6 transition-all duration-500 flex items-end shadow-sm group hover:scale-[1.05] hover:shadow-lg hover:bg-white/90 dark:hover:bg-white/10 hover:border-orange-300 dark:hover:border-orange-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 dark:from-orange-500/10 dark:to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-[8px] sm:text-sm md:text-xl font-medium text-gray-900 dark:text-white relative z-10">
                      Contacto
                    </h3>
                  </div>

                  <div className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-2 sm:p-3 md:p-6 transition-all duration-500 flex items-end shadow-sm group hover:scale-[1.02] hover:shadow-lg hover:bg-white/90 dark:hover:bg-white/10 hover:border-cyan-300 dark:hover:border-cyan-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-xs sm:text-lg md:text-2xl font-medium text-gray-900 dark:text-white relative z-10">
                      Portafolio
                    </h3>
                  </div>

                  <div className="col-span-1 row-span-1 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-1 sm:p-2 md:p-6 transition-all duration-500 flex items-end shadow-sm group hover:scale-[1.05] hover:shadow-lg hover:bg-white/90 dark:hover:bg-white/10 hover:border-pink-300 dark:hover:border-pink-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h3 className="text-[8px] sm:text-sm md:text-xl font-medium text-gray-900 dark:text-white relative z-10">
                      Ventas
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-24 md:py-32 relative"
          aria-labelledby="pricing-heading"
          data-section="pricing"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div
              className={`text-center mb-16 md:mb-20 lg:mb-28 animate-fade-in-up ${visibleSections.has("pricing") ? "visible" : ""}`}
            >
              <h2
                id="pricing-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 lg:mb-12 leading-tight"
              >
                Nuestros{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Paquetes
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-white/70 leading-relaxed max-w-4xl mx-auto px-4">
                Soluciones web profesionales diseñadas para impulsar tu negocio. Elige el paquete perfecto para tus
                necesidades.
              </p>
            </div>

            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto stagger-children ${visibleSections.has("pricing") ? "visible" : ""}`}
            >
              {/* Paquete Empresarial */}
              <div className="relative group h-full">
                <div className="absolute -top-3 sm:-top-5 -left-3 sm:-left-5 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 blur-3xl" />
                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-purple-300 dark:group-hover:border-purple-400/30 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 flex items-center justify-center">
                        <Grid3X3 className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-400/30 text-xs sm:text-sm"
                      >
                        POPULAR
                      </Badge>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                      Presencia Digital Profesional
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        $6,000
                      </span>
                      <span className="text-base sm:text-lg text-gray-600 dark:text-white/60">MXN</span>
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 dark:text-white/70 mb-6 sm:mb-8 leading-relaxed flex-1">
                      Perfecto para empresas de servicios, consultorios, restaurantes y negocios que necesitan presencia
                      digital profesional.
                    </p>

                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Página de inicio profesional
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Sección "Acerca de nosotros"
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Catálogo de servicios detallado
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Formularios de contacto inteligentes
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Mapa de ubicación integrado
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Galería multimedia
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Enlaces directos a WhatsApp
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-purple-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Hosting y dominio por 1 año
                        </span>
                      </li>
                    </ul>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => scrollToContactForm("empresarial")}
                    >
                      Solicitar Este Paquete
                    </Button>
                  </div>
                </div>
              </div>

              {/* Paquete E-commerce */}
              <div className="relative group h-full">
                <div className="absolute -top-3 sm:-top-5 -right-3 sm:-right-5 w-16 sm:w-20 md:w-40 h-16 sm:h-20 md:h-40 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 blur-3xl" />
                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-cyan-300 dark:group-hover:border-cyan-400/30 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-500/30 dark:to-blue-500/30 flex items-center justify-center">
                        <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-400/30 text-xs sm:text-sm"
                      >
                        COMPLETO
                      </Badge>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                      Tienda Online Completa
                    </h3>

                    <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                        $11,000
                      </span>
                      <span className="text-base sm:text-lg text-gray-600 dark:text-white/60">MXN</span>
                    </div>

                    <p className="text-sm sm:text-base text-gray-700 dark:text-white/70 mb-4 sm:mb-6 leading-relaxed">
                      Ideal para tiendas, boutiques, distribuidoras y negocios que quieren vender productos online con
                      sistema completo.
                    </p>

                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-3">
                        Todo lo del paquete anterior PLUS:
                      </p>
                    </div>

                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Catálogo de productos ilimitado
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Carrito de compras funcional
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Sistema de gestión de inventario
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Múltiples métodos de pago
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Calculadora de envíos
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Panel administrativo completo
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-500" />
                        </div>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-white/80">
                          Sistema de cupones y descuentos
                        </span>
                      </li>
                    </ul>

                    <Button
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => scrollToContactForm("ecommerce")}
                    >
                      Solicitar Este Paquete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Helper Section */}
        <section className="py-24 md:py-32 relative bg-gray-50/50 dark:bg-gray-900/50" data-section="decision">
          <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
            <div className={`text-center mb-16 md:mb-20 animate-fade-in-up ${visibleSections.has("decision") ? "visible" : ""}`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white leading-tight">
                Te ayudamos a decidir
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                3 preguntas simples para saber exactamente qué necesita tu negocio
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
              {/* Pregunta 1 */}
              <div className={`relative group animate-fade-in-up ${visibleSections.has("decision") ? "visible" : ""}`} style={{ animationDelay: "0.1s" }}>
                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-2xl group-hover:blur-xl transition-all duration-500" />
                <div className="relative text-center">
                  <div className="mb-6 md:mb-8">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
                      <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-white">1</span>
                      </div>
                      <div className="h-px w-8 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      ¿Qué vendes?
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Grid3X3 className="w-4 h-4 text-green-600" />
                        <p className="font-medium text-green-800 dark:text-green-300">SERVICIOS</p>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400">Consultas, reparaciones, asesorías</p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">→ Presencia Digital</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Infinity className="w-4 h-4 text-blue-600" />
                        <p className="font-medium text-blue-800 dark:text-blue-300">PRODUCTOS</p>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Cosas que se compran y llevan</p>
                      <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">→ Tienda Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pregunta 2 */}
              <div className={`relative group animate-fade-in-up ${visibleSections.has("decision") ? "visible" : ""}`} style={{ animationDelay: "0.2s" }}>
                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-2xl group-hover:blur-xl transition-all duration-500" />
                <div className="relative text-center">
                  <div className="mb-6 md:mb-8">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
                      <Zap className="w-8 h-8 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-white">2</span>
                      </div>
                      <div className="h-px w-8 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      ¿Cómo te pagan?
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Grid3X3 className="w-4 h-4 text-green-600" />
                        <p className="font-medium text-green-800 dark:text-green-300">EN PERSONA</p>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400">Efectivo o transferencia</p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">→ Presencia Digital</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Infinity className="w-4 h-4 text-blue-600" />
                        <p className="font-medium text-blue-800 dark:text-blue-300">ONLINE</p>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Tarjeta, PayPal, apps</p>
                      <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">→ Tienda Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pregunta 3 */}
              <div className={`relative group animate-fade-in-up ${visibleSections.has("decision") ? "visible" : ""}`} style={{ animationDelay: "0.3s" }}>
                <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 blur-2xl group-hover:blur-xl transition-all duration-500" />
                <div className="relative text-center">
                  <div className="mb-6 md:mb-8">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-500">
                      <ImageIcon className="w-8 h-8 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-white">3</span>
                      </div>
                      <div className="h-px w-8 bg-gradient-to-r from-orange-600 to-red-600"></div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      ¿Mostrar precios?
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Grid3X3 className="w-4 h-4 text-green-600" />
                        <p className="font-medium text-green-800 dark:text-green-300">PREFIERO QUE ME CONTACTEN</p>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400">Para dar cotización personalizada</p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">→ Presencia Digital</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Infinity className="w-4 h-4 text-blue-600" />
                        <p className="font-medium text-blue-800 dark:text-blue-300">SÍ, PRECIOS FIJOS</p>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Que compren sin hablarme</p>
                      <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">→ Tienda Online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* CTA */}
            <div className={`text-center mt-12 md:mt-16 animate-fade-in-up ${visibleSections.has("decision") ? "visible" : ""}`} style={{ animationDelay: "0.5s" }}>
              <Button
                onClick={() => scrollToSection("contact-form")}
                size="lg"
                className="rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ¿Aún no estás seguro? Solicita asesoría personalizada
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section - Artistic Approach */}
        <section className="py-24 md:py-32 relative" aria-labelledby="features-heading" data-section="features">
          <div className="max-w-6xl mx-auto px-8 md:px-12 lg:px-16">
            <div
              className={`mb-20 md:mb-28 max-w-3xl animate-fade-in-up ${visibleSections.has("features") ? "visible" : ""}`}
            >
              <h2
                id="features-heading"
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 md:mb-12 leading-tight"
              >
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Funcionalidades
                </span>{" "}
                incluidas
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-white/70 leading-relaxed">
                Todo lo que tu sitio web necesita para funcionar correctamente y generar resultados desde el primer día.
              </p>
            </div>

            <div className="relative">
              {/* Artistic Feature Display */}
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 lg:gap-28 stagger-children ${visibleSections.has("features") ? "visible" : ""}`}
              >
                <article className="relative">
                  <div className="absolute -top-5 md:-top-10 -left-5 md:-left-10 w-20 md:w-40 h-20 md:h-40 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 blur-3xl" />
                  <div className="mb-8 md:mb-12 w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    <Grid3X3 className="w-8 md:w-10 h-8 md:h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
                    Sistema de Contacto Inteligente
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-white/70 leading-relaxed mb-8 md:mb-12">
                    Formularios optimizados que llegan directo a tu email y WhatsApp integrado para atención inmediata.
                  </p>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="h-16 md:h-36 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/15 dark:to-pink-500/15 backdrop-blur-sm border border-purple-200 dark:border-purple-400/20 shadow-sm flex items-center justify-center group hover:scale-105 hover:-rotate-1 hover:shadow-lg transition-all duration-500">
                      <div className="grid grid-cols-2 gap-1 group-hover:gap-1.5 transition-all duration-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-sm group-hover:bg-purple-500 transition-colors duration-300" />
                        <div className="w-2 h-2 bg-pink-400 rounded-sm group-hover:bg-pink-500 transition-colors duration-300" />
                        <div className="w-2 h-2 bg-pink-400 rounded-sm group-hover:bg-pink-500 transition-colors duration-300" />
                        <div className="w-2 h-2 bg-purple-400 rounded-sm group-hover:bg-purple-500 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="h-16 md:h-36 rounded-xl md:rounded-2xl bg-gradient-to-br from-pink-500/10 to-orange-500/10 dark:from-pink-500/15 dark:to-orange-500/15 backdrop-blur-sm border border-pink-200 dark:border-pink-400/20 shadow-sm flex items-center justify-center group hover:scale-105 hover:shadow-lg transition-all duration-500 delay-75">
                      <div className="grid grid-cols-3 gap-1 group-hover:gap-1.5 transition-all duration-300">
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-sm group-hover:bg-pink-500 transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-sm group-hover:bg-orange-500 transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-sm group-hover:bg-pink-500 transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-sm group-hover:bg-orange-500 transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-pink-400 rounded-sm group-hover:bg-pink-500 transition-colors duration-300" />
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-sm group-hover:bg-orange-500 transition-colors duration-300" />
                      </div>
                    </div>
                    <div className="h-16 md:h-36 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 dark:from-orange-500/15 dark:to-yellow-500/15 backdrop-blur-sm border border-orange-200 dark:border-orange-400/20 shadow-sm flex items-center justify-center group hover:scale-105 hover:rotate-1 hover:shadow-lg transition-all duration-500 delay-150">
                      <Layers className="w-6 h-6 text-orange-500 group-hover:text-orange-600 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                </article>

                <article className="relative">
                  <div className="absolute -top-5 md:-top-10 -right-5 md:-right-10 w-20 md:w-40 h-20 md:h-40 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 dark:from-cyan-500/10 dark:to-blue-500/10 blur-3xl" />
                  <div className="mb-8 md:mb-12 w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    <Layers className="w-8 md:w-10 h-8 md:h-10 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
                    Presencia Digital Completa
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-white/70 leading-relaxed mb-8 md:mb-12">
                    Mapa de ubicación, galería multimedia y todas las secciones necesarias para mostrar tu negocio
                    profesionalmente.
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="h-24 md:h-36 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/15 dark:to-blue-500/15 backdrop-blur-sm border border-cyan-200 dark:border-cyan-400/20 shadow-sm flex flex-col items-center justify-center gap-2 group hover:scale-105 hover:-rotate-1 hover:shadow-lg transition-all duration-500">
                      <div className="flex gap-2 group-hover:gap-3 transition-all duration-300">
                        <ImageIcon className="w-4 h-4 text-cyan-500 group-hover:text-cyan-600 group-hover:scale-110 transition-all duration-300" />
                        <Video className="w-4 h-4 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300 delay-75" />
                      </div>
                      <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full group-hover:w-10 transition-all duration-300" />
                    </div>
                    <div className="h-24 md:h-36 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15 backdrop-blur-sm border border-blue-200 dark:border-blue-400/20 shadow-sm flex flex-col items-center justify-center gap-2 group hover:scale-105 hover:rotate-1 hover:shadow-lg transition-all duration-500 delay-75">
                      <div className="flex gap-2 group-hover:gap-3 transition-all duration-300">
                        <FileText className="w-4 h-4 text-blue-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
                        <Music className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300 delay-75" />
                      </div>
                      <div className="w-6 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full group-hover:w-8 transition-all duration-300" />
                    </div>
                  </div>
                </article>

                <article className="relative group">
                  <div className="absolute -bottom-5 md:-bottom-10 -left-5 md:-left-10 w-20 md:w-40 h-20 md:h-40 rounded-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 blur-3xl" />
                  <div className="mb-8 md:mb-12 w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    <Infinity className="w-8 md:w-10 h-8 md:h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
                    Soluciones Escalables
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-white/70 leading-relaxed mb-8 md:mb-12">
                    Desde sitios informativos hasta tiendas completas. Elige el paquete que mejor se adapte a tus
                    necesidades actuales.
                  </p>
                  <div className="relative h-32 md:h-40 overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-b from-green-500/10 via-emerald-500/10 to-transparent dark:from-green-500/15 dark:via-emerald-500/15 dark:to-transparent backdrop-blur-sm border border-green-200 dark:border-green-400/20 shadow-sm">
                    {/* Infinite bento grid extending downward */}
                    <div className="absolute inset-0 p-2 md:p-3">
                      <div className="grid grid-cols-4 gap-1 md:gap-1.5 h-full">
                        {/* Row 1 */}
                        <div className="col-span-2 h-6 md:h-8 rounded bg-green-400/60 group-hover:bg-green-500/60 transition-colors duration-300" />
                        <div className="col-span-1 h-6 md:h-8 rounded bg-emerald-400/60 group-hover:bg-emerald-500/60 transition-colors duration-300" />
                        <div className="col-span-1 h-6 md:h-8 rounded bg-teal-400/60 group-hover:bg-teal-500/60 transition-colors duration-300" />

                        {/* Row 2 */}
                        <div className="col-span-1 h-6 md:h-8 rounded bg-emerald-400/50 group-hover:bg-emerald-500/50 transition-colors duration-300" />
                        <div className="col-span-3 h-6 md:h-8 rounded bg-green-400/50 group-hover:bg-green-500/50 transition-colors duration-300" />

                        {/* Row 3 */}
                        <div className="col-span-3 h-6 md:h-8 rounded bg-teal-400/40 group-hover:bg-teal-500/40 transition-colors duration-300" />
                        <div className="col-span-1 h-6 md:h-8 rounded bg-green-400/40 group-hover:bg-green-500/40 transition-colors duration-300" />

                        {/* Row 4 - Fading */}
                        <div className="col-span-2 h-6 md:h-8 rounded bg-emerald-400/30 group-hover:bg-emerald-500/30 transition-colors duration-300" />
                        <div className="col-span-2 h-6 md:h-8 rounded bg-green-400/30 group-hover:bg-green-500/30 transition-colors duration-300" />

                        {/* Row 5 - More fading */}
                        <div className="col-span-1 h-4 md:h-6 rounded bg-teal-400/20 group-hover:bg-teal-500/20 transition-colors duration-300" />
                        <div className="col-span-2 h-4 md:h-6 rounded bg-emerald-400/20 group-hover:bg-emerald-500/20 transition-colors duration-300" />
                        <div className="col-span-1 h-4 md:h-6 rounded bg-green-400/20 group-hover:bg-green-500/20 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Fade out gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none" />

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </article>

                <article className="relative">
                  <div className="absolute -bottom-5 md:-bottom-10 -right-5 md:-right-10 w-20 md:w-40 h-20 md:h-40 rounded-full bg-gradient-to-r from-orange-500/5 to-red-500/5 dark:from-orange-500/10 dark:to-red-500/10 blur-3xl" />
                  <div className="mb-8 md:mb-12 w-16 md:w-20 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 backdrop-blur-sm border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                    <Zap className="w-8 md:w-10 h-8 md:h-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
                    Entrega Garantizada
                  </h3>
                  <p className="text-lg md:text-xl text-gray-700 dark:text-white/70 leading-relaxed mb-8 md:mb-12">
                    Sitios web listos en 15 días con hosting incluido. Tu presencia digital funcionando rápidamente.
                  </p>
                  <div className="h-20 md:h-40 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/15 dark:to-red-500/15 backdrop-blur-sm border border-orange-200 dark:border-orange-400/20 shadow-sm flex items-center justify-center group hover:scale-105 hover:shadow-lg transition-all duration-500">
                    <div className="flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-300">
                        Instant Deploy
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section - How We Work */}
        <section className="py-24 md:py-32 relative" aria-labelledby="process-heading" data-section="process">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div
              className={`text-center mb-16 md:mb-20 lg:mb-28 animate-fade-in-up ${visibleSections.has("process") ? "visible" : ""}`}
            >
              <Badge
                variant="outline"
                className="inline-flex mb-6 md:mb-8 text-xs md:text-sm font-light border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/80 px-3 md:px-4 py-1.5 md:py-2 items-center"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                Nuestro Proceso
              </Badge>

              <h2
                id="process-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 lg:mb-12 leading-tight"
              >
                Proceso{" "}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Simplificado
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-white/70 leading-relaxed max-w-4xl mx-auto px-4">
                Desde la primera conversación hasta el lanzamiento, te acompañamos en cada paso para crear tu presencia
                digital perfecta.
              </p>
            </div>

            <div
              className={`grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 max-w-6xl mx-auto stagger-children ${visibleSections.has("process") ? "visible" : ""}`}
            >
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute -top-5 sm:-top-10 -left-5 sm:-left-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 blur-3xl" />

                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-green-300 dark:group-hover:border-green-400/30 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                  <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                    {/* Number Circle */}
                    <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">01</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                      Primera Revisión
                    </h3>

                    <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-white/70 leading-relaxed flex-1">
                      Conversamos sobre tu proyecto y definimos los objetivos de tu sitio web.
                    </p>

                    {/* Decorative Elements */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-32">
                      <div className="h-2 sm:h-3 rounded-full bg-green-400/60 group-hover:bg-green-500/80 transition-colors duration-300" />
                      <div className="h-2 sm:h-3 rounded-full bg-emerald-400/40 group-hover:bg-emerald-500/60 transition-colors duration-300" />
                      <div className="h-2 sm:h-3 rounded-full bg-green-400/20 group-hover:bg-green-500/40 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute -top-5 sm:-top-10 -right-5 sm:-right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 blur-3xl" />

                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-blue-300 dark:group-hover:border-blue-400/30 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                  <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                    {/* Number Circle */}
                    <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">02</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                      Diseño y Desarrollo
                    </h3>

                    <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-white/70 leading-relaxed flex-1">
                      Creamos tu sitio web con diseño personalizado y todas las funcionalidades que necesitas.
                    </p>

                    {/* Decorative Elements */}
                    <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-r from-blue-400/60 to-cyan-400/60 group-hover:from-blue-500/80 group-hover:to-cyan-500/80 transition-all duration-300 flex items-center justify-center">
                        <Grid3X3 className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                      </div>
                      <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-r from-cyan-400/60 to-blue-400/60 group-hover:from-cyan-500/80 group-hover:to-blue-500/80 transition-all duration-300 flex items-center justify-center">
                        <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute -bottom-5 sm:-bottom-10 -right-5 sm:-right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 blur-3xl" />

                <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-orange-300 dark:group-hover:border-orange-400/30 h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 dark:from-orange-500/10 dark:to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

                  <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                    {/* Number Circle */}
                    <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-6 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">03</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                      Lanzamiento
                    </h3>

                    <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-white/70 leading-relaxed flex-1">
                      Coordinamos detalles y publicamos tu sitio web.
                    </p>

                    {/* Decorative Elements */}
                    <div className="mt-6 sm:mt-8 flex items-center justify-center">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-gradient-to-r from-orange-400/60 to-red-400/60 group-hover:from-orange-500/80 group-hover:to-red-500/80 transition-all duration-300 flex items-center justify-center group-hover:rotate-12">
                        <ArrowRight className="w-6 sm:w-8 h-6 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Lines - Hidden on mobile, visible on larger screens */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl pointer-events-none">
              <div className="relative h-1">
                <div className="absolute top-0 left-1/4 w-1/4 h-0.5 bg-gradient-to-r from-green-400/30 to-blue-400/30 dark:from-green-400/50 dark:to-blue-400/50" />
                <div className="absolute top-0 right-1/4 w-1/4 h-0.5 bg-gradient-to-r from-blue-400/30 to-orange-400/30 dark:from-blue-400/50 dark:to-orange-400/50" />
              </div>
            </div>
          </div>
        </section>

        {/* Creative Call to Action */}
        <section
          className="min-h-screen flex items-center justify-center relative py-32 md:py-48 lg:py-56"
          aria-labelledby="cta-heading"
          data-section="cta"
        >
          {/* Final morphed circles - back to original state */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[300px] md:w-[500px] lg:w-[600px] h-[300px] md:h-[500px] lg:h-[600px] rounded-full border border-gray-200 dark:border-white/10 subtle-breathe" />
            <div
              className="w-[400px] md:w-[650px] lg:w-[800px] h-[400px] md:h-[650px] lg:h-[800px] rounded-full border border-gray-100 dark:border-white/5 absolute subtle-breathe"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="w-[500px] md:w-[800px] lg:w-[1000px] h-[500px] md:h-[800px] lg:h-[1000px] rounded-full border border-gray-300 dark:border-white/3 absolute subtle-breathe"
              style={{ animationDelay: "2s" }}
            />
          </div>

          <div
            className={`max-w-4xl mx-auto text-center px-8 md:px-12 lg:px-16 relative z-10 animate-scale-in ${visibleSections.has("cta") ? "visible" : ""}`}
          >
            <h2
              id="cta-heading"
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-12 md:mb-16 leading-tight text-gray-900 dark:text-white"
            >
              ¿Listo para{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                crecer
              </span>
              ?
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-white/70 mb-16 md:mb-20 leading-relaxed">
              ¿Te gustan los estilos visuales de esta web?
            </p>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-500 dark:via-pink-500 dark:to-cyan-500 p-[1px] rounded-full group hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <Button
                className="rounded-full bg-white dark:bg-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-black/90 px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl group"
                onClick={() => scrollToContactForm()}
              >
                Solicitar Cotización
                <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section
          id="contact-form"
          className="py-24 md:py-32 relative"
          aria-labelledby="contact-heading"
          data-section="contact"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div
              className={`text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in-up ${visibleSections.has("contact") ? "visible" : ""}`}
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-white/70 leading-relaxed max-w-3xl mx-auto px-4">
                Cuéntanos sobre tu proyecto y te enviaremos una propuesta personalizada en menos de 24 horas.
              </p>
            </div>

            <div
              className={`relative max-w-4xl mx-auto animate-scale-in ${visibleSections.has("contact") ? "visible" : ""}`}
            >
              <div className="absolute -top-5 sm:-top-10 -left-5 sm:-left-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 blur-3xl" />
              <div className="absolute -bottom-5 sm:-bottom-10 -right-5 sm:-right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 blur-3xl" />

              <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg">
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Tu nombre"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="correo@ejemplo.com"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2"
                      >
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder="55 1234 5678"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="project-type"
                        className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2"
                      >
                        Tipo de proyecto *
                      </label>
                      <select
                        id="project-type"
                        name="project-type"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base h-[49.6px]"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="empresarial">Presencia Digital Profesional ($6,000)</option>
                        <option value="ecommerce">Tienda Online Completa ($11,000)</option>
                        <option value="asesoria">No estoy seguro, necesito asesoría</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-white/80 mb-2"
                    >
                      Cuéntanos sobre tu negocio *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Describe brevemente tu empresa y qué necesitas..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-white/90 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-medium rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Solicitar Cotización
                    </Button>
                  </div>

                  <div className="text-center pt-2 sm:pt-4">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                        Te contactaremos en las próximas 2 horas
                      </span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
