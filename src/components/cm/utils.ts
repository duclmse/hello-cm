import {EditorSelection, Line, SelectionRange} from "@codemirror/state";
import {ViewUpdate} from "@codemirror/view";

export interface Statistics {
  /** total length of the document */
  length: number;
  /** Get the number of lines in the editor. */
  lineCount: number;
  /** Get the current line description around the given position. */
  line: Line;
  /** Get the proper [line-break](https://codemirror.net/docs/ref/#state.EditorState^lineSeparator) string for this state. */
  lineBreak: string;
  /** Returns true when the editor is [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only. */
  readOnly: boolean;
  /** The size (in columns) of tab in the document, determined by the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet. */
  tabSize: number;
  /** Cursor Position */
  selection: EditorSelection;
  /** Make sure the selection only has one range. */
  selectionAsSingle: SelectionRange;
  /** Retrieves a list of all current selections. */
  ranges: readonly SelectionRange[];
  /** Get the currently selected code. */
  selectionCode: string;
  /**
   * The length of the given array should be the same as the number of active selections.
   * Replaces the content of the selections with the strings in the array.
   */
  selections: string[];
  /** Return true if any text is selected. */
  selectedText: boolean;
}

export const getStatistics = (view: ViewUpdate): Statistics => {
  let state = view.state;
  let {doc, doc: {lines, length}, lineBreak, selection, selection: {ranges, main}, readOnly, sliceDoc, tabSize} = state;
  return {
    line: doc.lineAt(main.from),
    lineCount: lines,
    lineBreak,
    length,
    readOnly,
    tabSize,
    selection,
    selectionAsSingle: selection.asSingle().main,
    ranges: ranges,
    selectionCode: sliceDoc(main.from, main.to),
    selections: ranges.map((r) => sliceDoc(r.from, r.to)),
    selectedText: ranges.some((r) => !r.empty),
  };
};
