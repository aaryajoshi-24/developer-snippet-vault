"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodePreviewProps = {
  code: string;
  language: string;
};

export default function CodePreview({
  code,
  language,
}: CodePreviewProps) {
  const supportedLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "cpp",
    "csharp",
    "css",
    "html",
    "json",
    "bash",
    "sql",
    "jsx",
    "tsx",
    "markdown",
  ];

  const normalizedLanguage = language.toLowerCase().trim();
  const safeLanguage = supportedLanguages.includes(normalizedLanguage)
    ? normalizedLanguage
    : "text";

  return (
    <SyntaxHighlighter
      language={safeLanguage}
      style={vscDarkPlus}
      showLineNumbers
      wrapLongLines
      customStyle={{
        margin: 0,
        padding: "16px",
        maxHeight: "256px",
        overflow: "auto",
        background: "#14231F",
        fontSize: "13px",
        lineHeight: "1.5",
      }}
      codeTagProps={{
        style: {
          fontFamily: "Consolas, Monaco, monospace",
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}