import { NextRequest,NextResponse } from "next/server";
import { findCatalogItem,stickerCatalog } from "@/data/stickerCatalog";
export async function POST(request:NextRequest){
 const body=await request.json().catch(()=>null);
 if(!body||![body.widthCm,body.heightCm].every((n:unknown)=>typeof n==="number"&&Number.isFinite(n)&&n>0)||body.artworkObjects<1)return NextResponse.json({error:"A valid design is required."},{status:400});
 const material=findCatalogItem(stickerCatalog.materials,Number(body.materialId)),laminate=findCatalogItem(stickerCatalog.laminates,Number(body.laminateId)),quantity=findCatalogItem(stickerCatalog.antals,Number(body.quantityId));
 if(!material||!laminate||!quantity)return NextResponse.json({error:"Invalid production option."},{status:422});
 const orderId=`SO-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`;
 return NextResponse.json({orderId,status:"awaiting_payment",productionFileStatus:"locked",paymentConfigured:false,createdAt:new Date().toISOString()},{status:201});
}
