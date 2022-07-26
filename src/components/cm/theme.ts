import {HighlightStyle, syntaxHighlighting, TagStyle} from "@codemirror/language";
import {Extension} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import {tags as t} from "@lezer/highlight";
import {StyleSpec} from "style-mod";

type Theme = "light" | "dark";

export interface CreateThemeOptions {
  /** Theme inheritance. Determines which styles CodeMirror will apply by default. */
  theme: Theme;
  /** Settings to customize the look of the editor, like background, gutter, selection and others. */
  settings: Settings;
  /** Syntax highlighting styles. */
  styles: TagStyle[];
}

export interface Settings {
  /** Editor background. */
  background: string;
  /** Default text color. */
  foreground: string;
  /** Caret color. */
  caret?: string;
  /** Selection background. */
  selection?: string;
  /** Selection match background. */
  selectionMatch?: string;
  /** Background of highlighted lines. */
  lineHighlight?: string;
  /** Gutter background. */
  gutterBackground?: string;
  /** Gutter background. */
  activeGutterBackground?: string;
  /** Text color inside gutter. */
  gutterForeground?: string;
  /** Gutter right border color. */
  gutterBorder?: string;
}

export const createTheme = ({theme, settings, styles}: CreateThemeOptions): Extension => {
  const themeOptions: Record<string, StyleSpec> = {
    "&": {
      backgroundColor: settings.background,
      color: settings.foreground,
    },
    ".cm-gutters": {},
    ".cm-activeLineGutter": {},
    ".cm-gutters .cm-foldGutter": {},
    ".cm-gutters:hover .cm-foldGutter": {},
    ".cm-foldGutter .cm-activeLineGutter": {},
  };

  if (settings.gutterBackground) {
    themeOptions[".cm-gutters"].backgroundColor = settings.gutterBackground;
    themeOptions[".cm-gutters .cm-foldGutter"].color = settings.gutterBackground;
  }
  if (settings.activeGutterBackground) {
    themeOptions[".cm-activeLineGutter"].backgroundColor = settings.activeGutterBackground;
    themeOptions[".cm-foldGutter .cm-activeLineGutter"].color = settings.activeGutterBackground;
  }

  if (settings.gutterForeground) {
    themeOptions[".cm-gutters"].color = settings.gutterForeground;
    themeOptions[".cm-gutters:hover .cm-foldGutter"].color = settings.gutterForeground;
  }
  if (settings.gutterBorder) {
    themeOptions[".cm-gutters"].borderRightColor = settings.gutterBorder;
  }

  if (settings.caret) {
    themeOptions[".cm-content"] = {
      caretColor: settings.caret,
    };
    themeOptions[".cm-cursor, .cm-dropCursor"] = {
      borderLeftColor: settings.caret,
    };
  }

  if (settings.lineHighlight) {
    themeOptions[".cm-activeLine"] = {
      backgroundColor: settings.lineHighlight,
    };
    themeOptions[".cm-activeLineGutter"] = {
      backgroundColor: settings.lineHighlight,
    };
  }

  if (settings.selection) {
    themeOptions[
        "&.cm-focused .cm-selectionBackground .cm-selectionBackground, & .cm-selectionLayer .cm-selectionBackground, ::selection"
        ] = {
      backgroundColor: settings.selection,
    };
  }
  if (settings.selectionMatch) {
    themeOptions["& .cm-selectionMatch"] = {
      backgroundColor: settings.selectionMatch,
    };
  }
  const themeExtension = EditorView.theme(themeOptions, {
    dark: theme === "dark",
  });

  const highlightStyle = HighlightStyle.define(styles);
  return [themeExtension, syntaxHighlighting(highlightStyle)];
};

export const githubLight = createTheme({
  theme: "light",
  settings: {
    background: "#fff",
    foreground: "#24292e",
    selection: "#bbdfff",
    selectionMatch: "#ffdd66",
    gutterBackground: "#fff",
    gutterForeground: "#556666",
    activeGutterBackground: "#e2f2ff",
  },
  styles: [
    {tag: [t.comment, t.bracket], color: "#6a737d"},
    {tag: [t.className, t.propertyName], color: "#6f42c1"},
    {tag: [t.variableName, t.attributeName, t.number, t.operator], color: "#005cc5"},
    {tag: [t.keyword, t.typeName, t.typeOperator, t.typeName], color: "#d73a49"},
    {tag: [t.string, t.meta, t.regexp], color: "#032f62"},
    {tag: [t.name, t.quote], color: "#22863a"},
    {tag: [t.heading], color: "#24292e", fontWeight: "bold"},
    {tag: [t.emphasis], color: "#24292e", fontStyle: "italic"},
    {tag: [t.deleted], color: "#b31d28", backgroundColor: "ffeef0"},
  ],
});

export const githubDark = createTheme({
  theme: "dark",
  settings: {
    background: "#0d1117",
    foreground: "#c9d1d9",
    caret: "#c9d1d9",
    selection: "#003d73",
    selectionMatch: "#003d73",
    lineHighlight: "#36334280",
  },
  styles: [
    {tag: [t.comment, t.bracket], color: "#8b949e"},
    {tag: [t.className, t.propertyName], color: "#d2a8ff"},
    {tag: [t.variableName, t.attributeName, t.number, t.operator], color: "#79c0ff"},
    {tag: [t.keyword, t.typeName, t.typeOperator, t.typeName], color: "#ff7b72"},
    {tag: [t.string, t.meta, t.regexp], color: "#a5d6ff"},
    {tag: [t.name, t.quote], color: "#7ee787"},
    {tag: [t.heading], color: "#d2a8ff", fontWeight: "bold"},
    {tag: [t.emphasis], color: "#d2a8ff", fontStyle: "italic"},
    {tag: [t.deleted], color: "#ffdcd7", backgroundColor: "ffeef0"},
  ],
});
