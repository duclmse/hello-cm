import {indentWithTab} from "@codemirror/commands";
import {EditorState, StateEffect} from "@codemirror/state";
import {EditorView, keymap, placeholder, ViewUpdate} from "@codemirror/view";
import {useEffect, useState} from "react";
import {githubDark, githubLight, ReactCodeMirrorProps} from ".";
import {getStatistics} from "./utils";

export interface UseCodeMirror extends ReactCodeMirrorProps {
  container?: HTMLDivElement | null;
}

const defaultLightTheme = () => githubLight;
const defaultDarkTheme = () => githubDark;

export function useCodeMirror(props: UseCodeMirror) {
  const {
    root,
    value,
    selection,
    onChange,
    onUpdate,
    onStatistics,
    onCreateEditor,
    extensions = [],
    autoFocus,
    theme = "light",
    height = "",
    minHeight = "",
    maxHeight = "",
    width = "",
    minWidth = "",
    maxWidth = "",
    editable = true,
    readOnly = false,
    placeholder: placeholderStr = "",
    indentWithTab: defaultIndentWithTab = true,
  } = props;
  const [container, setContainer] = useState<HTMLDivElement>();
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();
  const defaultThemeOption = EditorView.theme({
    "&": {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
    },
  });

  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (vu.docChanged && typeof onChange === "function") {
      onChange(vu.state.doc.toString(), vu);
    }
    onStatistics && onStatistics(getStatistics(vu));
  });

  let getExtensions = [updateListener, defaultThemeOption];
  if (defaultIndentWithTab) {
    getExtensions.unshift(keymap.of([indentWithTab]));
  }
  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr));
  }

  switch (theme) {
    case "light":
      getExtensions.push(defaultLightTheme());
      break;
    case "dark":
      getExtensions.push(defaultDarkTheme());
      break;
    default:
      getExtensions.push(theme);
      break;
  }

  if (!editable) {
    getExtensions.push(EditorView.editable.of(false));
  }
  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true));
  }

  if (onUpdate && typeof onUpdate === "function") {
    getExtensions.push(EditorView.updateListener.of(onUpdate));
  }
  getExtensions = getExtensions.concat(extensions);

  useEffect(() => {
    if (container && !state) {
      const stateCurrent = EditorState.create({
        doc: value,
        selection,
        extensions: getExtensions,
      });
      setState(stateCurrent);
      if (!view) {
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root,
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }
    return () => {
      if (view) {
        setState(undefined);
        setView(undefined);
      }
    };
  }, [container, state]);

  useEffect(() => setContainer(props.container!), [props.container]);

  useEffect(() => () => {
    if (view) {
      view.destroy();
      setView(undefined);
    }
  }, [view]);

  useEffect(() => {
    if (autoFocus && view) {
      view.focus();
    }
  }, [autoFocus, view]);

  useEffect(() => {
        if (view) {
          view.dispatch({effects: StateEffect.reconfigure.of(getExtensions)});
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        theme, extensions, height, minHeight, maxHeight, width, minWidth, maxWidth, placeholderStr, editable, readOnly,
        defaultIndentWithTab, onChange, onUpdate,
      ]);

  useEffect(() => {
    const currentValue = view ? view.state.doc.toString() : "";
    if (view && value !== currentValue) {
      view.dispatch({
        changes: {from: 0, to: currentValue.length, insert: value || ""},
      });
    }
  }, [value, view]);

  return {state, setState, view, setView, container, setContainer};
}
