import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cbuxmqvkhlampexqbsyx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_uThsQJ5Z_vzStqJrpLVjsA_C19i9JUa';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * [필요한 Supabase 테이블 SQL - 데이터베이스 'SQL Editor'에 복사해서 실행하세요]
 * 
 * -- 1. 전력 분석 테이블 생성
 * CREATE TABLE scouting (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
 *   opponent TEXT NOT NULL,
 *   team_notes TEXT,
 *   pitcher_name TEXT NOT NULL,
 *   pitch_types TEXT,
 *   velocity TEXT,
 *   put_away_pitch TEXT,
 *   strategy TEXT,
 *   date TEXT
 * );
 * 
 * -- 2. 멘탈/만다라트 데이터 테이블 생성
 * CREATE TABLE mandalart (
 *   id TEXT PRIMARY KEY, -- 'goals' 또는 'checks'
 *   data JSONB NOT NULL,
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 * );
 * 
 * -- 3. 실시간(Realtime) 통신 활성화
 * ALTER PUBLICATION supabase_realtime ADD TABLE scouting;
 * ALTER PUBLICATION supabase_realtime ADD TABLE mandalart;
 */
