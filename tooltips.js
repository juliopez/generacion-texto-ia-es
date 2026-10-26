/* Ayuda contextual accesible. No modifica la inferencia ni los controles. */
(()=>{'use strict';
const help=[
['#prompt','Texto de inicio','Escribe aquí la frase que quieres continuar. El siguiente token se predice a partir del contexto disponible.'],
['#next','Generar token','Calcula una distribución de candidatos, elige uno mediante muestreo y lo agrega a la secuencia.'],
['#undo','Deshacer token','Elimina la última unidad generada para comparar otras elecciones con el contexto anterior.'],
['#reset','Reiniciar','Elimina la continuación generada sin borrar tu texto inicial.'],
['#engine','Motor de generación','El simulador utiliza un modelo estadístico pequeño. El motor experimental intenta ejecutar un Transformer español real en tu navegador. No confundas sus resultados.'],
['#loadReal','Cargar modelo real','Descarga el tokenizador y los pesos de un modelo neuronal español. Requiere conexión, memoria y puede tardar o fallar según el dispositivo.'],
['#temperature','Temperatura','Modifica la concentración de las probabilidades antes de elegir: valores bajos favorecen candidatos más probables; valores altos aumentan la diversidad. No añade conocimientos al modelo.'],
['input[name="sampling"][value="topk"]','Top-k','Deja participar solamente a los k candidatos más probables. Con k = 1, se selecciona el candidato de mayor probabilidad.'],
['input[name="sampling"][value="topp"]','Top-p','Ordena los candidatos por probabilidad y conserva el conjunto mínimo cuya suma alcanza p. Cuanto menor es p, menos alternativas participan.'],
['#sampleValue','Valor de muestreo','Ajusta cuántos candidatos sobreviven (k) o la masa acumulada aceptada (p). Se aplica después de la temperatura.'],
['#auto','Generación automática','Genera sucesivamente varias unidades. Cada elección pasa a formar parte del contexto para la siguiente predicción.'],
['#stop','Detener generación','Detiene la reproducción automática sin eliminar el texto generado.'],
['#speed','Velocidad','Solo modifica la velocidad visual de la reproducción; no altera las probabilidades.'],
['.compareheader span:first-child','Distribución original','Probabilidades del motor elegido antes de modificar la temperatura y de aplicar Top-k o Top-p.'],
['.compareheader span:last-child','Después de filtros','Probabilidades renormalizadas tras aplicar temperatura y el filtro de muestreo. Los candidatos excluidos quedan con probabilidad final cero.'],
['#bars','Barras de probabilidad','Cada fila corresponde a un candidato. Compara sus probabilidades iniciales con las finales. Las barras del simulador no son resultados de un Transformer.'],
['#output','Texto acumulado','Muestra el texto inicial y la continuación elegida paso a paso. Una unidad del simulador puede ser una palabra; en el modelo real puede ser parte de una palabra.'],
['#tokenCount','Unidades generadas','Cantidad de selecciones realizadas durante esta generación. No equivale necesariamente al número de palabras.'],
['#contextCount','Unidades del contexto','Conteo de unidades de la representación didáctica. No lo interpretes como el conteo exacto de tokens del Transformer ni del tokenizador OpenAI.'],
['#history','Historial de decisiones','Lista cronológica de las unidades escogidas. Puedes deshacer la última y probar otros parámetros.'],
['#stage0','Contexto','Información textual disponible al calcular la siguiente predicción.'],
['#stage1','Predicción','Se calcula una puntuación para cada candidato y se transforma en probabilidades.'],
['#stage2','Muestreo','La temperatura y Top-k o Top-p transforman la distribución desde la que se elige el candidato.'],
['#stage3','Nuevo token','La unidad seleccionada se agrega al texto y modifica el contexto del siguiente paso.'],
['#flowContext','Contexto visible','Fragmento del texto disponible que se representa en la visualización didáctica.'],
['#flowCandidates','Candidatos','Opciones que quedan después de los filtros; sus porcentajes corresponden a la distribución final.'],
['#flowChosen','Última selección','Unidad elegida en el último paso; no tiene por qué ser la más probable.'],
['#openaiEncoding','Codificación OpenAI','Cada codificación usa su propio vocabulario y reglas BPE. El mismo texto puede producir diferentes fragmentos e identificadores.'],
['#tokenizerText','Texto para tokenizar','Escribe cualquier texto en español y observa cómo se divide en unidades BPE de la codificación OpenAI seleccionada.'],
['#copyToTokenizer','Reutilizar el texto','Copia la frase del laboratorio de generación al analizador, sin modificar el motor generativo.'],
['#analyzeTokens','Analizar tokens','Ejecuta un tokenizador BPE compatible con OpenAI. Sus resultados son distintos de los tokens del modelo español.'],
['#openaiTokenCount','Número de tokens BPE','Cuenta los tokens del texto según la codificación OpenAI seleccionada, no según el modelo generador.'],
['#openaiCharCount','Número de caracteres','Cuenta caracteres Unicode del texto. Un carácter, una palabra y un token no son lo mismo.'],
['#openaiTokenSegments','Fragmentos coloreados','Cada color señala un fragmento de la codificación BPE. Coloca el cursor sobre un fragmento para consultar su identificador.'],
['#loadIframe','Tokenizador oficial','Intenta mostrar el sitio oficial en la página. OpenAI puede bloquear su inserción mediante políticas de seguridad; el enlace externo sigue disponible.']
];
const box=document.createElement('div');box.className='help-popover';box.id='help-popover';box.setAttribute('role','tooltip');box.hidden=true;document.body.append(box);
let current=null;
const close=()=>{box.hidden=true;current?.setAttribute('aria-expanded','false');current=null};
const show=(button,title,description)=>{if(current===button&&!box.hidden){close();return}close();current=button;box.replaceChildren();const head=document.createElement('strong');head.textContent=title;const p=document.createElement('p');p.textContent=description;box.append(head,p);box.hidden=false;button.setAttribute('aria-expanded','true');const rect=button.getBoundingClientRect();const maxWidth=Math.min(340,window.innerWidth-24);box.style.width=maxWidth+'px';const left=Math.max(12,Math.min(rect.left-12,window.innerWidth-maxWidth-12));box.style.left=left+'px';const height=box.getBoundingClientRect().height;const top=(window.innerHeight-rect.bottom>height+12)?rect.bottom+8:Math.max(8,rect.top-height-8);box.style.top=top+'px'};
for(const [selector,title,description] of help){const target=document.querySelector(selector);if(!target)continue;const btn=document.createElement('button');btn.type='button';btn.className='help-trigger';btn.textContent='ⓘ';btn.setAttribute('aria-label','Ayuda: '+title);btn.setAttribute('aria-controls','help-popover');btn.setAttribute('aria-expanded','false');btn.title='Explicación de '+title;btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(btn,title,description)});
const isControl=target.matches('input,textarea,select,button');
if(isControl){const parent=target.closest('label');if(parent&&parent.contains(target)&&target.matches('input[type=radio]')){parent.after(btn)}else if(target.matches('input[type=range],textarea,select')){const label=target.id?document.querySelector('label[for="'+target.id+'"]'):null;if(label)label.append(btn);else target.insertAdjacentElement('afterend',btn)}else target.insertAdjacentElement('afterend',btn)}
else if(target.matches('.compareheader span,.stage,.flowbox'))target.append(btn);
else if(target.matches('.bars,.generated,.history,.tokensegments')){const heading=target.previousElementSibling;if(heading&&heading.matches('p,h2,h3'))heading.append(btn);else target.parentElement.querySelector('h2,h3')?.append(btn)}
else target.append(btn);
}
document.addEventListener('click',e=>{if(!box.hidden&&!box.contains(e.target)&&!e.target.closest('.help-trigger'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden){const prev=current;close();prev?.focus()}});
window.addEventListener('resize',close);window.addEventListener('scroll',close,{passive:true,capture:true});
})();