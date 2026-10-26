// Motor experimental: inferencia ONNX real en el navegador.
// Se carga únicamente por petición explícita del usuario.
const MODEL_ID='bnicenboim/gpt2-spanish-onnx';
let tokenizer=null,model=null;
export async function loadModel(progress){
  progress('Cargando biblioteca de inferencia…');
  const {AutoTokenizer,AutoModelForCausalLM,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
  env.allowRemoteModels=true;
  progress('Descargando tokenizador español…');
  tokenizer=await AutoTokenizer.from_pretrained(MODEL_ID);
  progress('Descargando modelo ONNX (puede ocupar más de 100 MB)…');
  model=await AutoModelForCausalLM.from_pretrained(MODEL_ID,{dtype:'q8',device:'wasm',progress_callback:p=>{if(p.status==='progress'&&p.progress!=null)progress('Descargando modelo: '+Math.round(p.progress)+'%')}});
  progress('Modelo español preparado.');
  return {model:MODEL_ID};
}
export async function predict(text,temperature,mode,parameter){
  if(!model||!tokenizer)throw Error('Modelo no cargado');
  const inputs=await tokenizer(text,{add_special_tokens:false});
  const outputs=await model(inputs);
  const logits=outputs.logits;
  const shape=logits.dims;
  if(!shape||shape.length!==3)throw Error('No se recibieron logits de dimensión esperada');
  const vocab=shape[2],offset=(shape[1]-1)*vocab;
  const data=logits.data;
  // Log-sum-exp estable; la probabilidad original se calcula sobre el vocabulario completo.
  let max=-Infinity;
  for(let i=0;i<vocab;i++)if(data[offset+i]>max)max=data[offset+i];
  const rawWeights=new Float64Array(vocab);
  let rawSum=0;
  for(let i=0;i<vocab;i++){const x=Math.exp(data[offset+i]-max);rawWeights[i]=x;rawSum+=x}
  const scaled=new Float64Array(vocab);let scaledSum=0;
  const t=Math.max(.1,temperature);
  for(let i=0;i<vocab;i++){const x=Math.pow(rawWeights[i],1/t);scaled[i]=x;scaledSum+=x}
  const order=Array.from({length:vocab},(_,i)=>i).sort((a,b)=>scaled[b]-scaled[a]);
  let accepted=[];
  if(mode==='topk')accepted=order.slice(0,Math.max(1,parameter));
  else{let s=0;const threshold=parameter/100;for(const id of order){accepted.push(id);s+=scaled[id]/scaledSum;if(s>=threshold)break}}
  let filterSum=0;for(const id of accepted)filterSum+=scaled[id];
  let draw=Math.random()*filterSum,chosen=accepted[accepted.length-1];
  for(const id of accepted){draw-=scaled[id];if(draw<=0){chosen=id;break}}
  const shown=new Set(order.slice(0,10));shown.add(chosen);
  const values=[];
  for(const id of shown){const token=tokenizer.decode([id],{skip_special_tokens:false});values.push({id,token,raw:rawWeights[id]/rawSum,pre:scaled[id]/scaledSum,post:accepted.includes(id)?scaled[id]/filterSum:0,allowed:accepted.includes(id)})}
  values.sort((a,b)=>b.raw-a.raw);
  const next=tokenizer.decode([chosen],{skip_special_tokens:true});
  return {next,values,chosen:chosen,model:MODEL_ID,contextLength:shape[1],acceptedCount:accepted.length};
}
