"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { useCanvas } from "@/context/CanvasContext";
import { useEditorI18n } from "@/context/EditorI18nContext";
import { getArtworkObjects } from "@/lib/sticker-contour/StickerContourEngine";

type Quote={currency:string;total:number;unitPrice:number;quantity:number;selection:{material:string;laminate:string;dimensions:string}};
export default function OrderReviewModal(){
 const [open,setOpen]=useState(false),[quote,setQuote]=useState<Quote|null>(null),[busy,setBusy]=useState(false),[reference,setReference]=useState("");
 const form=useAppSelector(s=>s.formValues), canvasState=useAppSelector(s=>s.canvas); const {fabricCanvasRef}=useCanvas(); const {t}=useEditorI18n();
 useEffect(()=>{const handler=()=>setOpen(true);window.addEventListener("sticker:open-order",handler);return()=>window.removeEventListener("sticker:open-order",handler)},[]);
 useEffect(()=>{if(!open)return;setBusy(true);fetch("/api/v1/quote",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({widthCm:canvasState.bredd,heightCm:canvasState.hojd,materialId:form.materialLastSelected,laminateId:form.laminatingLastSelected,quantityId:form.antalLastSelected})}).then(r=>r.ok?r.json():Promise.reject()).then(setQuote).finally(()=>setBusy(false))},[open,canvasState.bredd,canvasState.hojd,form]);
 if(!open)return null;
 const artwork=fabricCanvasRef.current?getArtworkObjects(fabricCanvasRef.current).length:0;
 const createOrder=async()=>{setBusy(true);const response=await fetch("/api/v1/orders",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({widthCm:canvasState.bredd,heightCm:canvasState.hojd,materialId:form.materialLastSelected,laminateId:form.laminatingLastSelected,quantityId:form.antalLastSelected,artworkObjects:artwork})});const data=await response.json();setReference(data.orderId||"");setBusy(false)};
 return <div className="order-overlay" role="dialog" aria-modal="true" aria-label="Order review" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><section className="order-modal"><header><div><small>PRODUCTION CHECKOUT</small><h2>{t('review')}</h2></div><button onClick={()=>setOpen(false)} aria-label="Close">×</button></header>{reference?<div className="order-success"><span>✓</span><h3>Order draft created</h3><p>Reference <strong>{reference}</strong></p><p>Your print file stays private and is released only after verified payment. Connect a payment provider before public launch.</p></div>:<><div className="order-checks"><p className={artwork?"ok":"warn"}>Artwork objects <b>{artwork}</b></p><p className="ok">Die-cut contour ready</p><p className="ok">Server-validated price</p></div>{busy?<div className="order-loading">Calculating production price…</div>:quote&&<div className="order-quote"><div><small>{quote.selection.material} · {quote.selection.laminate}</small><strong>{quote.selection.dimensions}</strong></div><div><small>{quote.quantity} pcs · {quote.unitPrice} {quote.currency}/pc</small><strong>{quote.total.toLocaleString()} {quote.currency}</strong></div></div>}<div className="order-notice"><b>Protected production workflow</b><p>Previewing is free. Editable SVG and print-ready assets are generated server-side and released after payment—not downloaded from the browser.</p></div><button disabled={busy||!quote||!artwork} onClick={createOrder} className="order-primary">Create secure order draft</button></>}</section></div>
}
