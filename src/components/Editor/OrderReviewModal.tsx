"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { useCanvas } from "@/context/CanvasContext";
import { useEditorI18n } from "@/context/EditorI18nContext";
import { getArtworkObjects } from "@/lib/sticker-contour/StickerContourEngine";

type Quote={currency:string;total:number;unitPrice:number;quantity:number;selection:{material:string;laminate:string;dimensions:string}};
export default function OrderReviewModal(){
 const [open,setOpen]=useState(false),[quote,setQuote]=useState<Quote|null>(null),[busy,setBusy]=useState(false),[reference,setReference]=useState("");
 const form=useAppSelector(s=>s.formValues), canvasState=useAppSelector(s=>s.canvas); const {fabricCanvasRef}=useCanvas(); const {t,formatCurrency,formatNumber}=useEditorI18n();
 useEffect(()=>{const handler=()=>setOpen(true);window.addEventListener("sticker:open-order",handler);return()=>window.removeEventListener("sticker:open-order",handler)},[]);
 useEffect(()=>{if(!open)return;setBusy(true);fetch("/api/v1/quote",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({widthCm:canvasState.bredd,heightCm:canvasState.hojd,materialId:form.materialLastSelected,laminateId:form.laminatingLastSelected,quantityId:form.antalLastSelected})}).then(r=>r.ok?r.json():Promise.reject()).then(setQuote).finally(()=>setBusy(false))},[open,canvasState.bredd,canvasState.hojd,form]);
 if(!open)return null;
 const artwork=fabricCanvasRef.current?getArtworkObjects(fabricCanvasRef.current).length:0;
 const createOrder=async()=>{setBusy(true);const response=await fetch("/api/v1/orders",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({widthCm:canvasState.bredd,heightCm:canvasState.hojd,materialId:form.materialLastSelected,laminateId:form.laminatingLastSelected,quantityId:form.antalLastSelected,artworkObjects:artwork})});const data=await response.json();setReference(data.orderId||"");setBusy(false)};
 return <div className="order-overlay" role="dialog" aria-modal="true" aria-label={t('review')} onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><section className="order-modal"><header><div><small>{t('productionCheckout')}</small><h2>{t('review')}</h2></div><button onClick={()=>setOpen(false)} aria-label={t('close')}>×</button></header>{reference?<div className="order-success"><span>✓</span><h3>{t('draftCreated')}</h3><p>{t('reference')} <strong>{reference}</strong></p><p>{t('privateFile')}</p></div>:<><div className="order-checks"><p className={artwork?"ok":"warn"}>{t('artworkObjects')} <b>{artwork}</b></p><p className="ok">{t('contourReady')}</p><p className="ok">{t('validatedPrice')}</p></div>{busy?<div className="order-loading">{t('calculating')}</div>:quote&&<div className="order-quote"><div><small>{quote.selection.material} · {quote.selection.laminate}</small><strong>{quote.selection.dimensions}</strong></div><div><small>{formatNumber(quote.quantity)} {t('pieces')} · {formatCurrency(quote.unitPrice)} {t('perPiece')}</small><strong>{formatCurrency(quote.total)}</strong></div></div>}<div className="order-notice"><b>{t('protectedWorkflow')}</b><p>{t('protectedCopy')}</p></div><button disabled={busy||!quote||!artwork} onClick={createOrder} className="order-primary">{t('createDraft')}</button></>}</section></div>
}
