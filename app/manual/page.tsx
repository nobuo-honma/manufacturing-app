<<<<<<< HEAD
const sections = [
  { title: 'ダッシュボード', content: '在庫アラート・当日の製造/入荷/出荷予定・受注状況・お知らせを一覧表示します。' },
  { title: '受注管理', content: ['「新規受注登録」から受注を登録します。', '出荷先は名前・IDで絞り込み検索が可能です。', '製造量(kg)を入力するとBOMシミュレーションが表示されます。'] },
  { title: '製造管理', content: ['受注カード一覧から製造計画を作成する受注を選択します。', '製造予定日・製造量(kg)を入力するとLot番号・賞味期限が自動計算されます。', '通常品: カタカナ(日付) + 月alpha + 年2桁 + 製品ID（例: スB26SB）', 'MA/FD複合製品: yy + MA/FD + 連番2桁（例: 26MA01）', 'YC50/YO50: dd(2桁) + 月alpha + 年2桁 + 製品ID（例: 13B26YC50）', '賞味期限: 製造日 + 5年6ヶ月で自動計算'] },
  { title: '在庫管理', content: ['原材料・資材・製品タブで切り替えます。', 'ステータス: 充足 / 注意（安全在庫×1.5未満）/ 不足（安全在庫未満）', '「棚卸」から実棚卸数を入力すると在庫が更新され調整履歴が記録されます。', '在庫予測タブで製造計画ベースの使用予定量を確認できます。'] },
  { title: '入荷管理', content: ['「入荷予定登録」から品目・発注日・入荷予定日・数量を登録します。', '「入荷処理」をクリックするとステータスが入荷済に変わり品目在庫に自動加算されます。'] },
  { title: '出荷管理', content: ['左の受注カードから出荷対象を選択します。', '製造LotはLot番号一覧から選択し、出荷数をc/s・p（ピース端数）で入力します。', '出荷登録と同時に製品在庫から自動減算されます。'] },
  { title: 'マスタ管理', content: ['製品マスタ / 品目マスタ / 出荷先マスタ / BOMを管理します。', 'セル内の値をクリックするとインライン編集ができます。'] },
]

export default function ManualPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '720px' }}>
      <h1 className="page-title" style={{ marginBottom: '8px' }}>操作マニュアル</h1>
      {sections.map(section => (
        <div key={section.title} className="card" style={{ padding: '20px' }}>
          <div className="section-header">
            <div className="accent-line" />
            <h3>{section.title}</h3>
          </div>
          {Array.isArray(section.content)
            ? <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {section.content.map((c, i) => (
                  <li key={i} style={{ fontSize: '0.8125rem', color: c.startsWith('・') || !c.startsWith('「') && i > 0 ? 'var(--text-secondary)' : 'var(--text-primary)', paddingLeft: c.startsWith('・') ? '8px' : '0' }}>
                    {c}
                  </li>
                ))}
              </ul>
            : <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{section.content}</p>
          }
        </div>
=======
export default function ManualPage() {
  const sections = [
    {
      title: 'ダッシュボード',
      content: '在庫アラート（安全在庫を下回った品目）、本日の製造予定、お知らせを一覧表示します。',
    },
    {
      title: '受注管理',
      items: [
        '「新規受注登録」から受注日・希望出荷日・出荷先・製品・受注数を入力します。',
        '出荷先は名前またはIDで検索できます（451社対応）。',
        '製品を選択すると製造種類が自動フィルタリングされます。',
        '受注数入力後、BOMシミュレーションで原材料・資材の過不足を確認できます。',
      ],
    },
    {
      title: '製造管理',
      items: [
        '受注カードを選択して製造計画を登録します。',
        '製造予定日・製造量(kg)を入力すると、個数・c/s・端数・賞味期限・Lot番号が自動計算されます。',
        '最大8日分の製造予定を1受注に登録できます。',
        '「製造予定表」でカレンダー表示・印刷ができます。',
      ],
    },
    {
      title: 'Lot番号の規則',
      items: [
        '通常品: カタカナ（日付）＋月英字＋年2桁＋製品ID　例: スB26SB',
        'カタカナはア〜ヤのタ行抜き31文字で日付(1〜31日)に対応します。',
        'MA（エコ三味）・FD（オリジナル三味）: 年度＋種別＋連番2桁　例: 26MA01',
        'YC50・YO50（50入）: 日付2桁＋月英字＋年2桁＋製品ID　例: 13B26YC50',
        '同日複数Lot製造時は翌文字を使用します（例: ヌ→ネ）。',
      ],
    },
    {
      title: '在庫管理',
      items: [
        '原材料・資材・製品タブで切り替えて一覧表示します。',
        '安全在庫を下回った品目は「不足」「注意」でステータス表示します。',
        '「棚卸」ボタンから在庫数を修正し、調整履歴に自動記録します。',
        '製品在庫はLot単位（c/s・端数p）で管理します。',
      ],
    },
    {
      title: '入荷管理',
      items: [
        '「入荷予定を登録」から品目・入荷予定日・数量を登録します。',
        'カレンダーで入荷予定を視覚的に確認できます（印刷対応）。',
        '「入荷確認」ボタンでステータスを「未入荷」→「入荷済」に更新します。',
      ],
    },
    {
      title: '出荷管理',
      items: [
        '受注カードを選択して出荷予定を登録します。',
        '出荷日・Lot番号・c/s数・端数p数を最大10Lotまで登録できます。',
        '「出荷確認」ボタンで出荷済みに更新します。',
      ],
    },
    {
      title: 'マスタ管理',
      content: '製品・品目・出荷先・BOMの各マスタを参照・管理します。BOM登録時は計算基準（製造量基準・受注数基準）を必ず指定してください。',
    },
  ]

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">操作マニュアル</h1>

      {sections.map(s => (
        <section key={s.title} className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">{s.title}</h2>
          {s.content && <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>}
          {s.items && (
            <ul className="space-y-1.5">
              {s.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
>>>>>>> e1816c8d6a634c21dc9fa4dcc24eac886aaabbe0
      ))}
    </div>
  )
}
