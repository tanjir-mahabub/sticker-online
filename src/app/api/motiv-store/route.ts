import { NextResponse } from 'next/server';
import { motiveStore } from "@/store/motiveStore";

export async function GET() {
    return NextResponse.json({ newMotiveStore: motiveStore });
}