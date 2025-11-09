お疲れ様です。ベテランコーダーとして、ご依頼いただいた研修資料の追記を承りました。
中高生の皆さんにもReactとNext.jsの強力な機能を理解してもらえるよう、各項目の説明を十分な量で、かつ「である」調で統一して追記しました。

以下が完成した資料です。

-----

# 第8回研修 28-29

React hooks/api

## 目的

  - ReactのhooksとAPIの基礎を理解する
  - Next.jsのAPIの基礎を理解する

## 環境

**OS:** Windows11

```cmd
node -v
v22.16.0
npm -v
11.4.1
firefox
```

## React hooks/API

### useState

> **[useState – React](https://ja.react.dev/reference/react/useState)**  
> useState は、コンポーネントに state 変数 を追加するための React フックです。  

もっとも基本的なhook。ただほぼ全員が理解しているため今回説明は割愛.

### useRef

> **[useRef - React](https://ja.react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents)**  
> useRef は、レンダー時には不要な値を参照するための React フックです。  

```typescript
import { useRef } from 'react';
   function MyComponent() {
   const intervalRef = useRef(0);
   const inputRef = useRef(null);
   // ...
```

useRefには大きく分けて2つの使い方がある。

#### 1\. 値の参照  

```typescript
function MyComponent() {
  const intervalRef  = useRef(0);
  // ...
  const intervald = setInterval(() => {
    //...
  }, 7000); //(setInterval を実行して関数を設定すると、毎回識別のためのidが発行される)
  intervalRef.current = intervalId;
```

`useRef` で作成されたオブジェクトの `.current` プロパティは変更可能であり、この値を変更してもコンポーネントは**再レンダーされない**。これが `useState` との最大の違いである。レンダーに影響を与えずに、コンポーネントのライフサイクル（マウントからアンマウントまで）を通じて一貫した値を保持したい場合に最適である。

#### 2\. DOM操作

`useRef` は、特定のDOM要素への参照を保持するためにも使われる。

```typescript
function MyComponent() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    // inputRef.current には実際の <input> 要素が格納されている
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus Input</button>
    </>
  );
}
```

JSXの `ref` 属性に `useRef` から返されたオブジェクトを渡すことで、ReactがDOMノードを構築した後に `.current` プロパティへそのDOM要素を自動的にセットする。これにより、イベントハンドラなどから直接DOM API（`.focus()` や `.value` など）にアクセスできるようになる。

#### テクニック ref の値の再生成を防ぐ

`useRef` の初期値は、コンポーネントの初期レンダー時にのみ使用される。しかし、`useRef(someExpensiveFunction())` のように初期値を指定すると、`someExpensiveFunction()` は**再レンダーのたびに実行されてしまう**。初期レンダー以外ではその結果は無視されるため、この計算は無駄なコストとなる。

これを防ぐには、**Lazy initialization（遅延初期化）** というテクニックを使う。

**方法:**

```typescript
function MyComponent() {
  // 1. まずは null で初期化する
  const myRef = useRef(null);

  // 2. 実際に値が必要になるまで .current への代入を遅らせる
  function getMyValue() {
    if (myRef.current === null) {
      // 最初の呼び出し時だけ、高コストな計算やインスタンス生成を行う
      myRef.current = new SomeExpensiveClass();
    }
    return myRef.current;
  }
  // ...
}
```

**なぜこれでよいのか:**
`useRef(null)` は非常に低コストである。`.current` プロパティへのアクセスや代入は再レンダーを引き起こさないため、本当にその値が必要になった最初のタイミング（例えば、イベントハンドラ内や `useEffect` 内）で一度だけ高コストな初期化処理を実行できる。これにより、コンポーネントのレンダーパフォーマンスへの影響を最小限に抑えつつ、必要な値を確実に保持することが可能となる。

-----

### useEffect

> **[useEffect – React](https://ja.react.dev/reference/react/useEffect)**  
> useEffect は、コンポーネントを外部システムと同期させるための React フックです。

`useEffect` は、コンポーネントの**副作用 (Side Effect)** を扱うためのフックである。副作用とは、コンポーネントのレンダー（UIの描画）とは直接関係のない処理、例えば以下のようなものを指す。

  * APIサーバーへのデータフェッチ (fetch)
  * `setTimeout` や `setInterval` によるタイマーの設定
  * DOMの直接的な操作（`useRef` で管理していないものや、外部ライブラリによるもの）
  * `window` や `document` へのイベントリスナーの登録

**基本的な使い方:**

```typescript
import { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  // useEffect(setup, dependencies?)
  useEffect(() => {
    // この関数（setup）は、コンポーネントがDOMにレンダーされた後に実行される
    document.title = `Count is ${count}`;

    // クリーンアップ関数（オプション）
    return () => {
      // このコンポーネントがアンマウントされる時、
      // または依存配列の変更により再実行される「前」に実行される
      document.title = 'React App';
    };
  }, [count]); // 依存配列 (Dependency Array)

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`useEffect` の第二引数に渡す**依存配列**が非常に重要である。

  * **`[count]` のように指定**: 配列内の値（この場合は `count`）が前回のレンダー時と変更された場合のみ、`useEffect` の中の関数（`setup`）が再実行される。
  * **`[]` (空の配列) を指定**: コンポーネントが**マウントされた時（初回レンダー時）にのみ**実行される。APIの初期データ取得などによく使われる。
  * **指定しない (undefined)**: **毎回のレンダー後**に必ず実行される。意図しない無限ループ（内部でstateを更新する場合など）を引き起こす可能性があり、通常は避けるべきである。

### memo

> **[memo – React](https://ja.react.dev/reference/react/memo)**  
> memo は、コンポーネントが同じ props を受け取った場合に、React にレンダーをスキップするよう指示するためのものです。

`memo` はフックではなく、**高階コンポーネント (Higher-Order Component, HOC)** である。コンポーネントを `memo()` でラップすることで、そのコンポーネントのレンダーを最適化できる。

Reactは通常、親コンポーネントが再レンダーされると、子コンポーネントも（propsが変更されていなくても）再レンダーする。しかし、`memo` でラップされたコンポーネントは、**受け取るpropsが前回のレンダー時と浅い比較 (shallow comparison) の結果、同一である場合、再レンダーをスキップ**し、前回のレンダー結果を再利用（メモ化）する。

```typescript
import { memo, useState } from 'react';

// このコンポーネントは高コストな描画処理を含むと仮定する
const HeavyComponent = memo(function HeavyComponent({ value }) {
  console.log('HeavyComponent rendered');
  // ... 重い処理 ...
  return <div>Value: {value}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);

  return (
    <div>
      <button onClick={() => setOtherState(otherState + 1)}>
        Rerender Parent (otherState)
      </button>
      <button onClick={() => setCount(count + 1)}>
        Change value
      </button>
      {/* otherStateが変更されてAppが再レンダーされても、
        HeavyComponentに渡る `value` (count) が変わらなければ、
        HeavyComponent は再レンダーされない。
      */}
      <HeavyComponent value={count} />
    </div>
  );
}
```

`memo` はパフォーマンスのボトルネックが明確な場合にのみ使用するべきである。むやみに使うと、propsの比較コストが逆にパフォーマンスを低下させる可能性もある。

### useMemo

> **[useMemo – React](https://ja.react.dev/reference/react/useMemo)**  
> useMemo は、レンダー間の**計算結果**をキャッシュするための React フックです。

`useMemo` は、`memo` がコンポーネント全体をメモ化するのに対し、**「値」や「高コストな計算の結果」** をメモ化するために使われるフックである。

```typescript
import { useMemo, useState } from 'react';

function MyComponent({ list }) {
  const [filter, setFilter] = useState('');

  // このフィルタリング処理が非常に高コストだと仮定する
  const filteredList = useMemo(() => {
    console.log('Filtering run...');
    return list.filter(item => item.includes(filter));
  }, [list, filter]); // list または filter が変更された時だけ再計算される

  // ...
  return (
    <div>
      {/* filteredList を使った描画 */}
    </div>
  );
}
```

`useMemo` の第一引数には計算を行う関数を、第二引数には依存配列を渡す。依存配列内の値が変更された場合のみ、第一引数の関数が再実行され、新しい値が返される。依存配列の値が変わらなければ、前回の計算結果をそのまま再利用する。

これにより、コンポーネントが再レンダーされても、`list` や `filter` が変わらない限り、重いフィルタリング処理の再実行を防ぐことができる。

### useCallback

> **[useCallback – React](https://ja.react.dev/reference/react/useCallback)**  
> useCallback は、レンダー間で**関数定義**をキャッシュするための React フックです。

`useCallback` は `useMemo` と非常に似ているが、こちらは **「関数」** そのものをメモ化するために特化している。

```typescript
import { useCallback, useState } from 'react';
import { memo } from 'react';

// memo化された子コンポーネント
const ChildComponent = memo(function ChildComponent({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Click me</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  // コンポーネントが再レンダーされるたび、
  // この関数は「新しいインスタンス」として再生成される
  const handleClick = () => {
    console.log('Clicked');
  };

  // useCallback で関数をメモ化する
  const memoizedHandleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // 依存配列が空なので、この関数は初回レンダー時のインスタンスがずっと使われる

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {/* handleClick を渡すと、Parentが再レンダーされるたび
        Childも「新しい関数」が渡されたと判断し再レンダーされる。
      */}
      <ChildComponent onClick={handleClick} /> 
      
      {/* memoizedHandleClick を渡すと、Parentが再レンダーされても
        Childには「同じ関数」が渡されるため、再レンダーがスキップされる。
      */}
      <ChildComponent onClick={memoizedHandleClick} />
    </div>
  );
}
```

JavaScriptでは、関数はオブジェクトの一種である。そのため、`function() {}` と `function() {}` は、中身が同じでも別々のインスタンス（別物）として扱われる。

`memo` 化されたコンポーネント（`ChildComponent`）にpropsとして関数（`onClick`）を渡す場合、親（`ParentComponent`）が再レンダーされるたびに新しい関数インスタンスが生成され、`memo` のprops比較が失敗し、`ChildComponent` は再レンダーされてしまう。

`useCallback` を使うことで、関数のインスタンスを依存配列の値が変わるまで再利用できる。これにより、`memo` と組み合わせた際の不要な再レンダーを効果的に防ぐことができる。

> **`useCallback(fn, deps)` は `useMemo(() => fn, deps)` と等価である。**

-----

### useActionState

> **[useActionState – React](https://ja.react.dev/reference/react/useActionState)**  
> useActionState は、フォームアクションの結果に基づいて state を更新するためのフックです。(React 19 / React Canary 以降)

`useActionState` は、特にフォームの送信と、その結果（成功、失敗、ローディング中）を扱うために設計された新しいフックである。以前の `useFormState` をより汎用的にしたものである。

これは **Server Actions** と密接に関連しているが、クライアントサイドの非同期処理にも使用できる。

```typescript
import { useActionState } from 'react';

// サーバーアクションまたは非同期関数
async function updateUser(previousState, formData) {
  const name = formData.get('name');
  if (name.length < 3) {
    return { success: false, message: 'Name is too short' };
  }
  // ... 実際の更新処理 ...
  return { success: true, message: 'User updated!' };
}

function UserProfileForm() {
  // useActionState(action, initialState)
  // state: 現在の状態 (actionの戻り値)
  // formAction: フォームのaction属性に渡す関数
  // isPending: actionが実行中かどうか
  const [state, formAction, isPending] = useActionState(updateUser, { success: false, message: '' });

  return (
    <form action={formAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update'}
      </button>
      {!state.success && <p style={{ color: 'red' }}>{state.message}</p>}
      {state.success && <p style={{ color: 'green' }}>{state.message}</p>}
    </form>
  );
}
```

`useActionState` は、フォームの `action` が実行されると、自動的に `isPending` を `true` にし、`action` が完了するとその戻り値で `state` を更新する。これにより、ローディング状態の管理やエラーメッセージの表示を宣言的に記述できる。

### useOptimistic

> **[useOptimistic – React](https://ja.react.dev/reference/react/useOptimistic)**  
> useOptimistic は、非同期アクションの実行中に state を楽観的に更新 (optimistic update) するための React フックです。(React 19 / React Canary 以降)  

**楽観的更新**とは、サーバーへのリクエストが「どうせ成功するだろう」と仮定して、サーバーからの応答を待たずにUIを即座に更新するテクニックである。ユーザーの体感速度を大幅に向上させることができる。

`useOptimistic` は、この楽観的更新を安全かつ簡単に実装するために使われる。

```typescript
import { useOptimistic, useState } from 'react';

async function sendMessageAPI(message) {
  // ... サーバーにメッセージを送信する処理 (わざと遅延させる)
  await new Promise(res => setTimeout(res, 2000));
  // サーバーが失敗したと仮定
  // return { error: 'Failed to send' };
  return { success: true, sentMessage: message };
}

function ChatRoom() {
  const [messages, setMessages] = useState([
    { text: 'Hello', sending: false },
  ]);

  // useOptimistic(state, updateFn)
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (currentState, newMessageText) => [
      ...currentState,
      { text: newMessageText, sending: true } // UIに先行表示する「楽観的な」データ
    ]
  );

  async function handleSubmit(formData) {
    const newMessageText = formData.get('message');
    
    // 1. 楽観的UIを更新 (UIに "New message" (sending: true) が即座に追加される)
    addOptimisticMessage(newMessageText);
    
    // 2. 実際のサーバーリクエストを実行
    const result = await sendMessageAPI(newMessageText);
    
    // 3. サーバーからの「本当の」データで state を更新
    if (result.success) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: result.sentMessage, sending: false }
      ]);
    } else {
      // もし失敗した場合、Reactは自動的に楽観的更新を
      // 元の state (messages) にロールバック（巻き戻し）する。
      console.error(result.error);
    }
  }

  return (
    <div>
      {/* 描画には optimisticMessages を使う */}
      {optimisticMessages.map((msg, i) => (
        <div key={i}>
          {msg.text} {msg.sending && '(Sending...)'}
        </div>
      ))}
      <form action={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

`addOptimisticMessage` を呼ぶと、UIは即座に更新される（`optimisticMessages` が変わる）。その後、`await` していたサーバー処理が完了し、`setMessages`（元の state）が更新されると、Reactは `optimisticMessages` を自動的に `messages` の最新状態に同期させる。もしサーバー処理が失敗しても、`setMessages` が呼ばれないため、Reactは楽観的更新を取り消し、UIを元の状態に戻す。

### createContext / useContext

> **[useContext – React](https://ja.react.dev/reference/react/useContext)**  
> useContext は、コンポーネントが親の context を読み取り、サブスクライブするための React フックです。

Reactのコンポーネントツリーでは、データは通常、親から子へ `props` を通じて渡される。しかし、コンポーネントの階層が深くなると、中間のコンポーネントは使わないデータでも、ただ子に渡すためだけに `props` を受け取らなければならなくなる（**Prop Drilling: プロップスのバケツリレー**）。

`Context` は、この問題を解決し、コンポーネントツリー全体で「グローバル」なデータを共有する仕組みを提供する。

**1. Context の作成 (`createContext`)**
まず、共有したいデータの「バケツ」を作成する。

```typescript
// theme-context.js
import { createContext } from 'react';

// デフォルト値 (Provider が見つからなかった場合に使われる)
export const ThemeContext = createContext('light'); 
```

**2. Context の提供 (`Provider`)**
作成した「バケツ」に値を入れ、ツリーの一部（または全体）に供給する。

```typescript
// App.js
import { ThemeContext } from './theme-context';
import { useState } from 'react';
import Toolbar from './Toolbar';

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    // ThemeContext.Provider で囲んだ内部のコンポーネントは、
    // value プロパティで指定された値 (theme) にアクセスできる
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}
```

**3. Context の消費 (`useContext`)**
`Provider` の内部にあるコンポーネントは、`useContext` フックを使ってその値にアクセスできる。

```typescript
// Toolbar.js (App.js の子)
import ThemedButton from './ThemedButton';

export default function Toolbar() {
  // Toolbar は props を受け取る必要がない
  return <ThemedButton />;
}

// ThemedButton.js (Toolbar.js の子)
import { useContext } from 'react';
import { ThemeContext } from './theme-context';

export default function ThemedButton() {
  // useContext で、最も近い Provider の value を読み取る
  const theme = useContext(ThemeContext); 

  // theme (この場合は 'dark') に基づいてスタイルを変更
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#FFF', color: theme === 'dark' ? '#FFF' : '#333' }}>
      I am a {theme} button
    </button>
  );
}
```

`ThemedButton` は、`App` コンポーネントから `Toolbar` を経由して `theme` を `props` で受け取ることなく、`useContext(ThemeContext)` を呼び出すだけで直接 `theme` の値を取得できる。

-----

### コンポーネントで私たちは何を書いていたのか

私たちは関数という形でコンポーネントを記述してきた。状態保存が必要な時は `useState`, レンダリングに影響されない数値を保存するために `useRef`, 特定の変化やコンポーネントの初回レンダー時に外部システムへの接続のために `useEffect`, コンポーネントのパフォーマンスを最適化するために `useMemo` で高コストな計算結果を、`useCallback` で関数定義をメモ化し、`memo` と組み合わせて不要な再レンダーを防いできた。また、`useContext` を使ってコンポーネントツリーの深い場所へも効率的にデータを渡してきた。

UIとして表示するためにReactは私たちの関数を読み込み、必要な時に実行している。一見hookをReactはどの関数から呼びだされたかわからないように思えるが、Reactは**フックが呼び出される順序**に依存している。

Reactはコンポーネント（関数）が初めて実行される際、そのコンポーネント内でフックが呼び出された順序を（内部の配列のようなものに）記憶する。

**初回レンダー時:**

1.  `useState` (name) -\> 内部配列 [0] に name の状態を保存
2.  `useState` (age) -\> 内部配列 [1] に age の状態を保存
3.  `useEffect` (...) -\> 内部配列 [2] に Effect を保存

**2回目以降のレンダー時:**
Reactは再びコンポーネント関数を実行し、フックが同じ順序で呼び出されることを期待する。

1.  `useState` (name) -\> 内部配列 [0] を見て、name の現在の状態を返す
2.  `useState` (age) -\> 内部配列 [1] を見て、age の現在の状態を返す
3.  `useEffect` (...) -\> 内部配列 [2] を見て、Effect を処理する

この「順序への依存」こそが、 **「フックはコンポーネントのトップレベルで呼び出さなければならない」** というルールの理由である。もし条件分岐 (`if`) やループ (`for`) の中でフックを呼び出すと、レンダーごとに呼び出される順序が変わってしまう可能性があり、Reactは内部配列のどの状態がどのフックに対応するのかわからなくなってしまう。

```typescript
// やってはいけない例 (The Rules of Hooks 違反)
function MyComponent({ shouldShowAge }) {
  const [name, setName] = useState('Taro');
  
  if (shouldShowAge) {
    // 2回目のレンダーで shouldShowAge が false になると、
    // このフックは呼び出されず、順序が崩れる！
    const [age, setAge] = useState(16); 
  }
  
  useEffect(() => { /* ... */ }); // 順序が 2番目 or 3番目 になり、Reactが混乱する
}
```

-----

## Next.js Routing

Next.js 13以降の**App Router**におけるルーティングは、**ファイルシステムベース**の考え方を採用している。
これは、`app` ディレクトリ内に作成した**フォルダの階層構造**が、そのままWebサイトの **URLパス（ルート）**に対応するという意味である。

例えば、以下のようなファイル構造は、

```
app/
├── page.js         (URL: /)
├── layout.js       (URL: /)
└── blog/
    ├── page.js     (URL: /blog)
    └── [slug]/
        ├── page.js (URL: /blog/post-1, /blog/react-hooks など)
```

`/`、`/blog`、`/blog/[slug]`（動的ルート）というURLパスを自動的に生成する。

このApp Routerの最大の特徴は、フォルダ内に特定の名前のファイル（`page.js` や `layout.js` など）を配置することで、そのルートのUIや機能を定義できる点にある。

-----

### `page.js` (Page)

`page.js` は、そのルートで **実際に表示されるUI（Reactコンポーネント）** を定義するファイルである。
このファイルが（`app` 直下を含め）特定のディレクトリに存在することで、そのディレクトリが公開されたルート（URL）としてアクセス可能になる。
`page.js` からは `default export` でコンポーネントをエクスポートする必要がある。

```typescript
// app/dashboard/page.js
// ブラウザで /dashboard にアクセスするとこのコンポーネントが表示される
export default function DashboardPage() {
  return <h1>My Dashboard</h1>;
}
```

### `layout.js` (Layout)

`layout.js` は、複数のページ（そのセグメントと子セグメント）で**共通して使用されるUI**（ヘッダー、フッター、ナビゲーションバーなど）を定義するファイルである。
`layout.js` は、そのディレクトリとすべての子ディレクトリの `page.js` や、さらにネストされた `layout.js` を `children` propとして受け取り、ラップする。

```typescript
// app/layout.js (ルートレイアウト)
// すべてのページに適用される
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header>My Website Header</header>
        <main>
          {children} {/* ⬅︎ ここに page.js の内容が挿入される */}
        </main>
        <footer>My Website Footer</footer>
      </body>
    </html>
  );
}
```

`app` ディレクトリ直下の `layout.js`（ルートレイアウト）は必須であり、`<html>` タグや `<body>` タグを含める必要がある。

### `loading.js` (Loading UI)

`loading.js` は、そのルートのコンテンツがロード中（例: サーバーコンポーネントでのデータフェッチ中）に、**フォールバックとして表示されるUI**（ローディングスピナーなど）を定義するファイルである。

Next.jsは、`loading.js` をReactの **`Suspense`** バウンダリと自動的に連携させる。

```typescript
// app/dashboard/loading.js
// /dashboard/page.js のデータロード中にこれが表示される
export default function Loading() {
  return <p>Loading dashboard data...</p>;
}
```

`page.js` と同じ階層に `loading.js` を置くと、`page.js` とそのすべての子コンポーネントが `Suspense` でラップされ、`fallback` として `loading.js` の内容が使われる。

### Dynamic Route Segments (動的ルートセグメント)

固定のパス（`/blog`）だけでなく、動的な値（ブログ記事のIDやユーザー名など）をURLに含めたい場合がある。
ディレクトリ名を**角括弧 `[]`** で囲むことで、動的ルートセグメントを作成できる。

例えば、`app/blog/[slug]/page.js` というファイルを作成する。

  * `[slug]` の部分は「スラグ」と呼ばれる変数名である。
  * これにより、`/blog/first-post` や `/blog/hello-world` といったURLが、すべてこの `page.js` にマッチするようになる。

コンポーネント内では、`params` propを通じて、URLの動的な部分（`slug` の値）を受け取ることができる。

```typescript
// app/blog/[slug]/page.js
export default function BlogPostPage({ params }) {
  // URLが /blog/react-hooks の場合、
  // params は { slug: 'react-hooks' } となる
  const { slug } = params;

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
      {/* ここで slug を使って記事データをフェッチする */}
    </div>
  );
}
```

-----

## Next.js API

Next.jsは、Webアプリケーション開発を最適化するための強力な組み込みコンポーネント（API）を提供している。これらは単なるReactコンポーネントではなく、Next.jsのバックエンドと連携して高度な最適化を行う。

### `next/image` (Image Component)

`next/image` は、HTMLの `<img>` タグを強力に拡張したコンポーネントである。Webサイトのパフォーマンス、特に**Core Web Vitals**を劇的に改善するために設計されている。

```typescript
import Image from 'next/image';
import profilePic from '../public/me.png'; // ローカル画像

function MyPage() {
  return (
    <>
      {/* ローカル画像 (import が必要) */}
      <Image
        src={profilePic}
        alt="Profile picture"
        width={500} // CLS防止のためサイズ指定が重要
        height={500}
        priority // 重要な画像（LCP）の場合、優先的に読み込む
      />
      
      {/* 外部画像 (ドメインの許可設定が next.config.js に必要) */}
      <Image
        src="https://example.com/images/hero.jpg"
        alt="Hero image"
        width={1200}
        height={600}
        quality={80} // 画質 (デフォルト 75)
      />
    </>
  );
}
```

**主な機能:**

  * **自動的な画像最適化**: リクエストに応じて、デバイスに最適化されたサイズで、**WebP**のようなモダンな画像形式に自動変換する（元の画像ファイルは変更されない）。
  * **CLS (Cumulative Layout Shift) の防止**: `width` と `height` を指定することで、画像が読み込まれる前からレイアウト上のスペースを確保し、読み込み完了時にレイアウトがずれる（ガタつく）のを防ぐ。
  * **遅延読み込み (Lazy Loading)**: デフォルトで有効。画像がユーザーのビューポート（画面表示領域）に入るまで、画像の読み込みを遅延させる。これにより、ページの初期ロード速度が向上する。
  * **`priority` (優先度) 指定**: ページのメイン画像（LCP: Largest Contentful Paint）など、すぐに表示したい画像に `priority` を設定すると、遅延読み込みが無効化され、優先的に読み込まれる。

-----

### `next/link` (Link Component)

`next/link` は、Next.jsアプリケーション内のページ間を遷移するためのコンポーネントである。HTMLの `<a>` タグをラップして使用する。

```typescript
import Link from 'next/link';

function Navbar() {
  return (
    <nav>
      {/* href 属性に遷移先のパスを指定する。
        内部で <a> タグがレンダリングされる。
      */}
      <Link href="/">Home</Link>
      <Link href="/about">About Us</Link>
      <Link href="/blog/my-post">Blog Post</Link>
    </nav>
  );
}
```

**主な機能:**

  * **クライアントサイドナビゲーション**: `Link` を使うと、ページ全体をリロードする（サーバーにHTMLを取りに行く）のではなく、 **クライアントサイド（ブラウザ）** でページ遷移が行われる。必要なJavaScriptとJSONデータのみをフェッチするため、SPA（Single Page Application）のような非常に高速な画面遷移が実現できる。
  * **プリフェッチ (Prefetching)**: デフォルトで有効。`Link` コンポーネントがユーザーのビューポートに入ると、Next.jsはバックグラウンドで遷移先のページのデータを **自動的にプリフェッチ（事前読み込み）** する。これにより、ユーザーがリンクをクリックした際の待ち時間がほぼゼロになり、体感速度が劇的に向上する。

-----

### `next/script` (Script Component)

`next/script` は、サードパーティのスクリプト（Google Analytics, Google Tag Manager, 広告タグ, 外部のチャットウィジェットなど）を効率的に読み込むためのコンポーネントである。

HTMLの `<script>` タグを直接使うと、スクリプトの読み込みや実行がページの初期描画（FCPやLCP）をブロックし、パフォーマンスを低下させる原因となる。`next/script` は、読み込みのタイミング（`strategy`）を制御することで、この問題を解決する。

```typescript
import Script from 'next/script';

function MyLayout({ children }) {
  return (
    <html>
      <body>
        {/*
          strategy="afterInteractive" (デフォルト):
          ページのハイドレーション（Reactが対話可能になること）が完了した後に
          読み込まれ、実行される。GTMやAnalyticsなど、
          すぐには必要ないが早めに欲しいスクリプトに適している。
        */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" 
          strategy="afterInteractive" 
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXX');
          `}
        </Script>

        {children}

        {/*
          strategy="lazyOnload":
          ブラウザのアイドル時間（すべてのリソースが読み終わった後）に
          読み込まれる。チャットウィジェットやSNSボタンなど、
          優先度が低いスクリプトに適している。
        */}
        <Script 
          src="https://connect.facebook.net/en_US/sdk.js" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  );
}
// ※ strategy="beforeInteractive" というオプションもあるが、
// 非常に稀なケース（ハイドレーション前に必須のスクリプト）でのみ使用される。
```

-----

## Next.js Functions

App Routerでは、React Server Components (RSC) の導入により、サーバーサイドの機能をReactコンポーネント内でより直接的に扱えるようになった。

### 非同期コンポーネント (Async Components)

App Router内のコンポーネント（`page.js` や `layout.js` を含む）は、デフォルトで**React Server Components (RSC)** である。

RSCの最大の特徴は、コンポーネント関数自体を **`async`** として定義し、内部で **`await`** を使って非同期処理（特にデータフェッチ）を直接実行できることである。

```typescript
// app/blog/[slug]/page.js

// データベースやAPIからデータを取得する非同期関数
async function getPostData(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  return res.json();
}

// コンポーネント自体を async にできる！
export default async function BlogPostPage({ params }) {
  // コンポーネントのレンダー処理の中で直接データフェッチを待つ
  const post = await getPostData(params.slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

**利点:**

  * **`useEffect` が不要**: 従来のクライアントサイドフェッチ（CSR）では、コンポーネントがマウントされた後に `useEffect` 内でデータをフェッチし、`useState` で状態を更新する必要があった。RSCではこの定型的な処理が不要になる。
  * **サーバーサイドで完結**: データフェッチがサーバーサイドで行われ、データを含んだ完全なHTMLが生成されてからクライアントに送信される。
  * **バンドルサイズの削減**: データフェッチライブラリ（`axios`など）がクライアントに送信されるJavaScriptバンドルに含まれなくなる。
  * **セキュリティ**: DBの認証情報やAPIキーなどを、クライアントに漏らすことなくサーバーサイドで安全に使用できる。

-----

### `fetch` API の拡張

Next.jsは、標準のWeb APIである `fetch` をサーバーコンポーネント内で使用する際に、独自の機能で拡張している。特に、**データキャッシング**と**再検証 (Revalidation)** の制御が強力である。

```typescript
// fetch(url, options)

async function getMyData() {
  // 1. デフォルト (force-cache): データを永続的にキャッシュする
  // (静的サイト生成(SSG) と同様の動作)
  const res1 = await fetch('https://api.example.com/data');
  
  // 2. キャッシュしない (no-store): 常に最新のデータを取得する
  // (サーバーサイドレンダリング (SSR) と同様の動作)
  const res2 = await fetch('https://api.example.com/data', { 
    cache: 'no-store' 
  });
  
  // 3. ISR (Incremental Static Regeneration): 
  // 60秒間はキャッシュを使い、60秒経過後の次のリクエストでデータを再検証（更新）する
  const res3 = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // 秒数を指定
  });
  
  return res3.json();
}
```

Next.jsは、同じURLとオプションを持つ `fetch` リクエストを自動的に重複排除する。`async` コンポーネント内で `fetch` を使うだけで、データの取得、キャッシュ、再検証の戦略を柔軟に制御できる。

-----

### `cookies` (Cookies Function)

サーバーサイド（サーバーコンポーネント, Route Handlers, Server Actions）でクライアントのHTTPクッキーを読み書きする必要がある場合、`next/headers` から `cookies` 関数をインポートして使用する。

```typescript
// サーバーコンポーネント (例: app/page.js)
import { cookies } from 'next/headers';

export default function Page() {
  // クッキーのインスタンスを取得
  const cookieStore = cookies();
  
  // 1. クッキーの読み取り
  const theme = cookieStore.get('theme'); // { name: 'theme', value: 'dark' } のようなオブジェクトが返る
  const token = cookieStore.get('authToken')?.value;

  // 2. クッキーの存在確認
  if (cookieStore.has('session')) {
    // ...
  }
  
  return (
    <div>
      Current Theme: {theme?.value || 'light'}
    </div>
  );
}

//---
// Server Action や Route Handler (APIルート) でのクッキーの設定・削除
import { cookies } from 'next/headers';

export async function POST(request) {
  // 3. クッキーの設定
  cookies().set('authToken', 'NEW_TOKEN_VALUE', {
    httpOnly: true, // クライアントのJSからアクセス不可にする
    secure: process.env.NODE_ENV === 'production', // HTTPS経由のみ
    maxAge: 60 * 60 * 24, // 1日
    path: '/',
  });

  // 4. クッキーの削除
  cookies().delete('oldToken');
  
  return Response.json({ message: 'Cookie updated' });
}
```

`cookies()` は動的な関数であり、これをサーバーコンポーネント内で使用すると、そのルートは動的レンダリング（`cache: 'no-store'` と同じ）にオプトインされる（静的にキャッシュされなくなる）。