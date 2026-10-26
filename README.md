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

## Iteración 0.2.1 — flujo visual (26 de octubre de 2026)

Se añade una representación sincronizada de contexto visible → candidatos con probabilidades finales → unidad seleccionada. Los datos provienen del mismo motor didáctico que alimenta las barras, evitando gráficos ficticios de atención. El flujo se recalcula al editar texto, cambiar parámetros, generar, reiniciar o deshacer. Se adapta a pantallas pequeñas.

**Investigación del motor real:** `onnx-community/LFM2-700M-ONNX` declara compatibilidad con Transformers.js y español, pero es un modelo híbrido, no un Transformer clásico puro. Requiere evaluar tamaño, licencia, compatibilidad en navegadores y acceso a logits antes de incorporarlo. No se integra como motor por defecto ni se declara validado. Alternativas LLM multilingües pueden exceder la memoria disponible en equipos docentes. Referencia: https://huggingface.co/onnx-community/LFM2-700M-ONNX .

## Versión 0.3 experimental — Transformer español en navegador

Se incorpora un motor optativo `real-engine.js` que intenta cargar [bnicenboim/gpt2-spanish-onnx](https://huggingface.co/bnicenboim/gpt2-spanish-onnx), exportación ONNX de DeepESP/gpt2-spanish bajo licencia MIT. Es un modelo causal entrenado sobre textos españoles, no un chat ni un sistema de instrucciones. La carga usa Transformers.js desde CDN y descarga pesos ONNX externos; no requiere servidor propio. El simulador existente sigue siendo el modo predeterminado.

Al elegir **Cargar modelo real**, la aplicación solicita el tokenizador y el modelo, calcula logits del último paso, aplica softmax estable, temperatura, Top-k/Top-p y realiza muestreo, mostrando probabilidades originales y finales del vocabulario. En el modo real, las unidades generadas pueden ser fragmentos subléxicos en vez de palabras completas.

**Estado:** código integrado en GitHub, pero la descarga del modelo, el formato exacto de salida del grafo ONNX, la compatibilidad de `dtype=q8` y la ejecución completa en navegadores aún **no están validados experimentalmente**. Si falla, el usuario debe regresar al simulador y el fallo se mostrará en la interfaz. Los recursos del modelo son de terceros y su disponibilidad puede variar.

**Pruebas necesarias:** Chrome de escritorio, primer arranque sin caché, generación de una unidad, comparación de probabilidades, temperatura, Top-k y Top-p, y degradación elegante sin conectividad. No declarar el motor real operativo hasta completar dichas pruebas.

## Versión 0.4 — Tokenización OpenAI (26 octubre 2026)

- Sección **05 / TOKENIZACIÓN**, completamente en español, para analizar texto libre o reutilizar el prompt de generación.
- Tokenización BPE real compatible con las codificaciones `o200k_base` y `cl100k_base` a través de la biblioteca abierta `gpt-tokenizer@3.4.0` (cargada bajo demanda desde CDN ESM).
- Presentación de fragmentos con colores, IDs al pasar el cursor, número de tokens y caracteres.
- Enlace al [tokenizador oficial de OpenAI](https://platform.openai.com/tokenizer) e **iframe opcional** activado por el usuario; el sitio externo puede prohibir ser incrustado mediante políticas de seguridad. El tokenizador integrado es independiente y no depende del iframe.
- No confundir las codificaciones OpenAI con el tokenizador del motor GPT-2 español: sus IDs y segmentaciones no son intercambiables.
- Estado: cambios guardados en GitHub; carga dinámica desde CDN y visualización del iframe no verificadas aún mediante prueba integral en navegador.

## Versión 0.5 — Ayuda contextual (26 octubre 2026)

Se incorpora `tooltips.js`, con explicaciones en español para controles, parámetros, gráficos probabilísticos, contexto, motores de generación y tokenización OpenAI. Botones de ayuda ⓘ con `aria-label`, `aria-expanded`, teclado, Escape y cierre al pulsar fuera. El panel se reposiciona según el espacio disponible y se cierra al desplazarse o cambiar el tamaño de la ventana. Los contenidos distinguen simulación de inferencia real y tokens BPE de unidades didácticas.

Pruebas manuales recomendadas: abrir ⓘ de temperatura; cambiar Top-k/Top-p; abrir ayuda con Enter/Espacio y cerrar con Escape; revisar paneles en móviles; comprobar que la ayuda no interfiere en los botones de generación; verificar sección 05. Los commits se han realizado en `main`, pero aún no existe una prueba automatizada en navegador para esta iteración.
