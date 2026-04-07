import { NextResponse } from 'next/server';

// 💡 메모리에 최신 심박수를 저장할 변수 (실제 서비스에선 DB나 Redis를 씀)
let latestHeartRate = 0;

// src/app/api/heartrate/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("워치에서 온 전체 데이터:", body); // 데이터 전체 구조 확인용

    // 워치가 'heartRate'로 보내는지 'bpm'으로 보내는지 확인이 필요합니다.
    // 로그에 찍힌 키 값에 맞춰 아래 코드를 수정하세요.
    latestHeartRate = body.heartRate || body.bpm || 0; 
    
    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
}

// 💡 프론트엔드에서 "최신 데이터 있어?"라고 물어볼 때 답해주는 GET 함수
export async function GET() {
  return NextResponse.json({ bpm: latestHeartRate });
}