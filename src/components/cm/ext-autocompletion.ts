import {autocompletion, closeCompletion, startCompletion,} from "@codemirror/autocomplete";
import {EditorView} from "@codemirror/view";
import debounce from "lodash.debounce";
import {
  Completion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";

async function fetchOptions(s: string): Promise<Completion[]> {
  return new Promise(() => {

  });
}

async function completionSource(context: CompletionContext): Promise<CompletionResult | null> {
  // match everything behind the editor cursor position
  const word = context.matchBefore(/.*/);

  // continue with a completion only if there is actual text
  if (word == null || word.from == word.to || word.text.trim().length <= 0) return null;

  // implement your data fetching
  const options: Completion[] = await fetchOptions(word.text.trim());

  return {
    from: word.from,
    options,
    filter: false,
  };
}

const debouncedStartCompletion = debounce(view => startCompletion(view), 300);

function customCompletionDisplay() {
  return EditorView.updateListener.of(({view, docChanged}) => {
    if (docChanged) {
      // when a completion is active each keystroke triggers the completion source function,
      // to avoid it we close any open completion immediately.
      closeCompletion(view);

      debouncedStartCompletion(view);
    }
  });
}

export const extensions = [
  autocompletion({
    activateOnTyping: false,
    override: [completionSource],
  }),
  customCompletionDisplay(),
];
