// Tokenización BPE real compatible con codificaciones OpenAI.
// Biblioteca independiente; no modifica el tokenizador del modelo español.
const modules={
 o200k_base:'https://esm.sh/gpt-tokenizer@3.4.0/encoding/o200k_base?bundle',
 cl100k_base:'https://esm.sh/gpt-tokenizer@3.4.0/encoding/cl100k_base?bundle'
};
const loaded=new Map();
export async function tokenizeOpenAI(text,encoding='o200k_base'){
 if(!modules[encoding])throw new Error('Codificación no reconocida');
 let lib=loaded.get(encoding);
 if(!lib){lib=await import(modules[encoding]);loaded.set(encoding,lib)}
 if(typeof lib.encode!=='function'||typeof lib.decode!=='function')throw new Error('La biblioteca no expuso encode/decode');
 const ids=lib.encode(text);
 // Decodificación incremental por prefijos para preservar secuencias UTF-8
 // que atraviesan límites de token; algunos fragmentos pueden ser vacíos.
 let previous='',parts=[];
 for(let i=1;i<=ids.length;i++){
   const current=lib.decode(ids.slice(0,i));
   parts.push({id:ids[i-1],text:current.slice(previous.length)});
   previous=current;
 }
 return {ids,parts,encoding};
}
