import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ),
  {
    rules: {
      // 未使用変数のエラー化（型定義は除外）
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // console.logの警告
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // importの順序ルール
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // 明示的なany型の禁止
      '@typescript-eslint/no-explicit-any': 'error',

      // 関数の戻り値の型を必須に
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // Reactのルール
      'react/prop-types': 'off', // TypeScriptを使用する場合は不要
      'react/react-in-jsx-scope': 'off', // Next.jsではReactのimportが不要
      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
        },
      ],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],

      // 追加の TypeScript ルール
      '@typescript-eslint/no-unused-expressions': 'error', // 未使用の式を禁止
      '@typescript-eslint/consistent-type-imports': [
        // type importを強制
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error', // Promiseの未ハンドルを禁止
      '@typescript-eslint/naming-convention': [
        // 命名規則
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
      ],

      // 追加の React ルール
      'react/jsx-no-useless-fragment': 'error', // 不要なフラグメントを禁止
      'react/jsx-pascal-case': 'error', // コンポーネント名はパスカルケース
      'react/jsx-no-bind': [
        // JSX内でのbind禁止
        'error',
        {
          allowArrowFunctions: true,
          allowFunctions: false,
        },
      ],
      'react/function-component-definition': [
        // 関数コンポーネントの定義方法を統一
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],

      // パフォーマンス関連
      'react/jsx-no-constructed-context-values': 'error', // コンテキスト値の再生成を防ぐ
      'react/no-array-index-key': 'error', // 配列のインデックスをkeyに使用することを禁止

      // アクセシビリティ追加ルール
      'jsx-a11y/no-autofocus': 'error', // autoFocusの使用を禁止
      'jsx-a11y/no-onchange': 'error', // onChangeの代わりにonBlurを推奨

      // その他
      'no-nested-ternary': 'error', // ネストされた三項演算子を禁止
      'no-duplicate-imports': 'error', // 重複したインポートを禁止
      'sort-imports': [
        // import文のソート
        'error',
        {
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
    },
  },
];

export default eslintConfig;
