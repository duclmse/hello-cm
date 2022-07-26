import {autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap} from "@codemirror/autocomplete";
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
import {javascript} from "@codemirror/lang-javascript";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import {lintKeymap} from "@codemirror/lint";
import {highlightSelectionMatches, searchKeymap} from "@codemirror/search";
import {EditorState} from "@codemirror/state";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import React from "react";
import {useSearchParams} from "react-router-dom";

import "./App.css";
import CodeMirror, {breakpointGutter, emptyLineGutter} from "./components/cm";
import {helpPanel, wordCounter} from "./components/cm/ext-statusbar";

export default function CodeEditor() {
  const extensions = [
    breakpointGutter(),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter({
      openText: "\u2BC6",
      closedText: "\u2BC8",
    }),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
    javascript({jsx: true, typescript: true}),
    emptyLineGutter,
    helpPanel(),
    wordCounter(),
  ];

  const [searchParams] = useSearchParams();
  let themeParam = searchParams.get("theme");
  let theme: "light" | "dark" = themeParam === "light" || themeParam === "dark" ? themeParam : "light"
  return (
      <CodeMirror
          height={"100vh"}
          theme={theme}
          extensions={extensions}
      >
      </CodeMirror>
  );
}
