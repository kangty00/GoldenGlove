import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 사용자가 인증 쿠키(24시간 유지)를 가지고 있는지 확인합니다.
  const hasAuth = request.cookies.has('goldenglove_auth');
  
  // 사용자가 대시보드 내부 경로로 접속하려고 할 때
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // 쿠키가 없다면 (즉, PIN 로그인을 거치지 않았거나 만료되었다면)
    if (!hasAuth) {
      // 얄짤없이 쫓겨나서 무조건 PIN 번호를 입력하는 메인 화면으로 돌아갑니다.
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 인증이 확인된 사용자는 화면에 정상 접속됩니다.
  return NextResponse.next();
}

// 이 파일이 감시할 '접속 경로'를 지정합니다.
export const config = {
  matcher: ['/dashboard/:path*'], // 대시보드 내부의 모든 폴더 및 페이지 보호
};
