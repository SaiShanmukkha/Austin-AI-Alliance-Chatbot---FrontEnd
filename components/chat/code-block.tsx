"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { php } from "@codemirror/lang-php";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { yaml } from "@codemirror/lang-yaml";
import { sql } from "@codemirror/lang-sql";
import { markdown } from "@codemirror/lang-markdown";
import hljs from "highlight.js"; 
import "highlight.js/styles/github-dark.css";

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: any;
}

export function CodeBlock({
  node,
  inline = false,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const codeContent = String(children).replace(/\n$/, "");
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect language with highlight.js
    const detected = hljs.highlightAuto(codeContent).language;
    setDetectedLang(detected || "plaintext");
  }, [codeContent]);

  // Map detected language to CodeMirror extensions
  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case "javascript":
      case "js":
        return javascript();
      case "typescript":
      case "ts":
        return javascript();
      case "python":
      case "py":
        return python();
      case "java":
        return java();
      case "cpp":
      case "c++":
        return cpp();
      case "rust":
        return rust();
      case "go":
        return go();
      case "php":
        return php();
      case "html":
        return html();
      case "css":
        return css();
      case "json":
        return json();
      case "yaml":
      case "yml":
        return yaml();
      case "sql":
        return sql();
      case "markdown":
      case "md":
        return markdown();
      default:
        return [];
    }
  };

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        <CodeMirror
          value={codeContent}
          extensions={[getLanguageExtension(detectedLang || "plaintext")]}
          theme={githubDark}
          editable={false}
          className="border border-zinc-200 dark:border-zinc-700 rounded-xl"
        />
        <p className="text-xs text-gray-500 mt-1 ml-2">
          {detectedLang || ""}
        </p>
      </div>
    );
  } else {
    return (
      <code
        className="text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md"
        {...props}
      >
        {children}
      </code>
    );
  }
}
