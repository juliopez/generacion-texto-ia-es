# Dentro del lenguaje · Generación de texto con IA (MVP 0.1)

Laboratorio visual e interactivo, íntegramente en español, para explicar **cómo se genera texto paso a paso** mediante predicción probabilística y muestreo. Diseñado como recurso didáctico para docentes y estudiantes.

## Abrir

https://juliopez.github.io/generacion-texto-ia-es/

Publicación estática: abrir `index.html` en un navegador o habilitar GitHub Pages con **Settings → Pages → Deploy from a branch → main / (root)**.

## Funcionalidades

- Frases educativas editables en español y ejemplos de inicio.
- Generación de una unidad por clic y reproducción automática configurable.
- Temperatura: 0.1–2.0.
- Selección de muestreo Top-k / Top-p.
- Barras de probabilidades finales, resaltado del candidato seleccionado y exclusión de candidatos.
- Texto acumulativo, historial de elecciones y explicación del ciclo de generación.
- Interfaz responsiva, sin servidor ni API ni almacenamiento de entradas.

## Rigor técnico

**IMPORTANTE: esta primera versión NO ejecuta un Transformer ni un LLM.**

El motor se basa en un corpus pequeño de frases en español y cuenta transiciones de palabras con hasta tres unidades de contexto, recurriendo a una distribución global cuando no hay coincidencias. Calcula probabilidades, aplica escalado de temperatura (`peso^(1/T)` normalizado), filtros Top-k o Top-p y muestrea efectivamente un resultado. Los porcentajes provienen de ese motor, no de un modelo neuronal. Las unidades son palabras y signos, **no tokens subléxicos**.

Las visualizaciones son válidas para describir **conceptualmente** la generación autorregresiva y las estrategias de muestreo, pero no representan atención, embeddings ni activaciones de Transformers. No se deben presentar como resultados de un LLM real. La calidad de las frases finales puede ser limitada por el corpus pequeño.

## Estructura

- `index.html` — interfaz.
- `styles.css` — diseño, barras animadas y adaptación móvil.
- `app.js` — corpus, distribución, control de parámetros y generación.

## Próximos pasos

1. Evaluación de usabilidad y verificación didáctica en español.
2. Mejoras de visualización: mostrar distribución **antes y después** de temperatura y filtrado, y representación explícita del ciclo.
3. Opción de motor Transformer real ligero, con tokenizador y probabilidades calculadas y sin mapas de atención inventados.
4. Comparación español/inglés con advertencias sobre comparabilidad.

## Créditos

Inspirado en el enfoque visual de [Transformer Explainer (Polo Club)](https://poloclub.github.io/transformer-explainer/). Esta aplicación es una implementación didáctica nueva, no una copia del proyecto original.

Versión inicial: 26 de octubre de 2026.

## Versión 0.2 — 26 octubre 2026

- Comparación visual de dos distribuciones: **original** (frecuencias contextuales normalizadas) y **final** (temperatura + Top-k/Top-p). No confundir original con logits de un Transformer.
- Botón **Deshacer token** para recuperar el contexto y volver a experimentar con los controles.
- Barras dobles y porcentajes separados para observar cómo los parámetros modifican las opciones.
- Importante: los resultados siguen procediendo del motor probabilístico didáctico; una integración con un modelo neuronal real se considera un hito posterior y deberá validarse técnicamente.

### Verificación funcional recomendada

1. Ingresar una frase en español y generar tres unidades; deshacer una y comprobar que el contador disminuye.
2. Cambiar temperatura de 0.2 a 1.8; observar cambios en la segunda columna (la distribución original permanece igual para el mismo contexto).
3. Cambiar Top-k de 1 a 5; comprobar que la distribución final excluye menos candidatos.
4. Seleccionar Top-p y modificar p; comprobar que el subconjunto aceptado se ajusta a la masa probabilística acumulada.
5. Confirmar funcionamiento en móvil y escritorio.
