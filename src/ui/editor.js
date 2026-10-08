import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  drawSelection,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { StreamLanguage, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { r } from '@codemirror/legacy-modes/mode/r';

// Keep editor configuration separate from lesson navigation and answer checking.
export function createCodeEditor({ parent, code, onChange, onRun }) {
  return new EditorView({
    state: EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        history(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange();
        }),
        drawSelection(),
        highlightActiveLine(),
        StreamLanguage.define(r),
        syntaxHighlighting(defaultHighlightStyle),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          'aria-label': 'R code editor',
          'aria-describedby': 'editor-shortcuts',
          spellcheck: 'false',
        }),
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              onRun();
              return true;
            },
          },
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        EditorView.theme({
          '&': { fontSize: '14px' },
          '.cm-scroller': {
            fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
            lineHeight: '1.8',
          },
          '.cm-content': { padding: '16px 0' },
          '.cm-gutters': { backgroundColor: '#fafbf8', border: 'none', color: '#687167' },
          '.cm-line': { padding: '0 18px 0 12px' },
          '&.cm-focused': { outline: 'none' },
          '.cm-activeLine': { backgroundColor: '#edf1e980' },
        }),
      ],
    }),
    parent,
  });
}
