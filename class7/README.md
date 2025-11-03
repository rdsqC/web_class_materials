# 第7回研修資料

## 目次
26.	**React/ React・Render**
27.	**Next.js/ start**
28.	**Next.js/ React hook api**
29.	 **Next.js/Next.js API**
30. **~~Git/ repository,branch,comit,push,pull,fetch,merge,ローカルリポジトリ~~**  
    _(Gitは次回第8回研修資料にて実施予定)_

## 26. React/ React・Render

### 目的
 - Reactの考え方を理解する
 - Reactの流儀(命名規則)を理解する
 - Reactのコンポーネントの記述方法を理解する
 - コンポーネントのエクスポートとインポートについて理解する
 - ReactのJSX記法を理解する
 - 条件付きレンダー、リストレンダーを理解する
 - Reactでの保守性の高いコードの書き方を理解する

それでは、始めましょう！
### React公式のドキュメント
- [UIの記述 - 章](https://ja.react.dev/learn/describing-the-ui)を理解する
- [React の流儀](https://ja.react.dev/learn/thinking-in-react)を理解する

以上です。次章はNext.jsの基礎から始めます。

## 27. Next.js/ start

### 目的
 - Next.jsのセットアップ方法を理解する
 - Next.jsのプロジェクト構成を理解する
 - Next.jsの基本的な使い方を理解する
 - Next.jsのルーティングについて理解する
  - 　Next.jsのページコンポーネントについて理解する
  -  Next.jsのスタイリング方法を理解する(Tailwind CSS)
それでは、始めましょう！

### Next.jsのセットアップ
 1. [Next.js公式 - Installation](https://nextjs.org/docs/app/getting-started/installation)の**Manual installation**の通りに実行してください。  
#### **陥った問題1** 'JSX.IntrinsicElements' が存在しない
 - JSX関連の型パッケージを追加でインストールする。ことで解決
  ```cmd
   npm i @types/node @types/react @types/react-dom
  ```
#### **陥った問題2** tsconfig.jsonでエラー　(moduleResolution)
  - tsconfig.jsonでエラー　(moduleResolution)
    tsconfig.jsonのcompilerOptionsに以下のように書き換える。ことで解決
  ```json
  moduleResolution: "bundler"
  ```
#### **陥った問題3** Set up Absolute Imports and Module Path Aliases でtypescritpのバージョンエラー
 - 代わりに、tsconfig.jsonのcompilerOptionsに以下のように追記。
  ```json 
  "paths": {
      "@app/*": [
        "./app/*"
      ],
      "@component/*": [
        "./component/*"
      ],
    },
  ```

## 参考文献
 - [Next.js公式ドキュメント](https://nextjs.org/docs)
 - [Next.js公式 - Installation](https://nextjs.org/docs/app/getting-started/installation)
- [UIの記述 - 章](https://ja.react.dev/learn/describing-the-ui)
- [React の流儀](https://ja.react.dev/learn/thinking-in-react)
- [JSX.IntrinsicElements ts(7026) が存在しない場合の対処法 - zenn](https://zenn.dev/w4_3nd0/articles/af273a3496f8f3)
- [【エラー】インターフェイス'JSX.IntrinsicElements'が存在しないため暗黙的にJSXの要素の型は'any'になります - Qiita](https://qiita.com/Akihiro0711/items/d223fe4aac4e92660dd0)
- [Deprecate, remove support for `baseUrl` · Issue #62207 · microsoft/TypeScript](https://github.com/microsoft/TypeScript/issues/62207)