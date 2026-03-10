import { createClient } from '@supabase/supabase-js'

// 環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 1. 開発中の早期発見のためにチェックを追加
if (!supabaseUrl || !supabaseAnonKey) {
    // ブラウザのコンソールとサーバーのログ両方に出力される
    const errorMessage =
        "Supabaseの環境変数が設定されていません。.env.local ファイルに " +
        "NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定し、" +
        "サーバーを再起動してください。"

    console.error(errorMessage)
}

// 2. 空文字をフォールバックとして渡すことで、初期化時の即死を防ぐ
// （ただし、値がない場合は後のAPIコールでエラーになります）
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
)