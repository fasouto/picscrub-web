"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [lightHtml, setLightHtml] = useState<string>("");
  const [darkHtml, setDarkHtml] = useState<string>("");

  useEffect(() => {
    codeToHtml(code, {
      lang: language,
      theme: "github-light",
    }).then(setLightHtml);
    codeToHtml(code, {
      lang: language,
      theme: "github-dark",
    }).then(setDarkHtml);
  }, [code, language]);

  return (
    <div className="not-prose rounded-lg border border-border overflow-hidden my-4">
      {filename && (
        <div className="bg-muted px-4 py-2 text-sm font-mono text-muted-foreground border-b border-border">
          {filename}
        </div>
      )}
      {lightHtml ? (
        <>
          <div
            className="dark:hidden [&_pre]:p-4 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_code]:text-sm [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: lightHtml }}
          />
          <div
            className="hidden dark:block [&_pre]:p-4 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_code]:text-sm [&_code]:font-mono"
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />
        </>
      ) : (
        <pre className="p-4 bg-muted overflow-x-auto">
          <code className="text-sm font-mono">{code}</code>
        </pre>
      )}
    </div>
  );
}
