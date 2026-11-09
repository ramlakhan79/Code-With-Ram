import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { common, createLowlight } from 'lowlight';
import {
  Bold, Italic, Underline as UnderlineIcon, Code, Link2, List, ListOrdered, Quote, Minus, Table2, ImagePlus,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Heading2, Heading3, Heading4, SquareCode,
} from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import { EDITOR_LANGUAGES } from '../utils/highlight';

const lowlight = createLowlight(common);

function Btn({ label, active, onClick, disabled, children }) {
  return (
    <button
      type="button" aria-label={label} title={label} aria-pressed={active} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} onClick={onClick}
      className={`rounded-md p-1.5 hover:bg-raised disabled:opacity-40 ${active ? 'bg-raised text-ink' : 'text-muted'}`}
    >
      {children}
    </button>
  );
}
const Sep = () => <span aria-hidden className="mx-1 h-5 w-px bg-line" />;

export default function ArticleEditor({ initialHtml, onChange, editable = true, images = true }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false, heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } }),
      Image,
      Table.configure({ resizable: false }), TableRow, TableHeader, TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder: 'Start writing. Use headings to organise your article; they become the table of contents.' }),
    ],
    content: initialHtml || '',
    editable,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: { attributes: { class: 'prose-article tiptap min-h-[360px] p-4 focus:outline-none', 'aria-label': 'Article content', role: 'textbox', 'aria-multiline': 'true' } },
  });
  if (!editor) return null;

  const run = (fn) => () => fn(editor.chain().focus()).run();
  const applyLink = (e) => {
    e.preventDefault();
    const url = linkUrl.trim();
    if (!url) editor.chain().focus().unsetLink().run();
    else if (/^(https?:\/\/|mailto:)/i.test(url)) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    else return toast.error('Links must start with https://, http:// or mailto:');
    setLinkOpen(false);
    setLinkUrl('');
  };
  const onImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Images must be 5 MB or smaller.');
    const form = new FormData();
    form.append('image', file);
    setUploading(true);
    try {
      const res = await api.post('/uploads/image', form);
      const alt = window.prompt('Describe this image for people using screen readers (optional):') || '';
      editor.chain().focus().setImage({ src: res.data.data.url, alt }).run();
    } catch (err) { toast.error(getErrorMessage(err)); } finally { setUploading(false); }
  };
  const inTable = editor.isActive('table');

  return (
    <div className="rounded-xl border border-line bg-surface">
      <div role="toolbar" aria-label="Formatting" className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-line bg-surface p-1.5">
        <Btn label="Undo" onClick={run((c) => c.undo())} disabled={!editor.can().undo()}><Undo2 className="h-4 w-4" /></Btn>
        <Btn label="Redo" onClick={run((c) => c.redo())} disabled={!editor.can().redo()}><Redo2 className="h-4 w-4" /></Btn>
        <Sep />
        {[[2, Heading2], [3, Heading3], [4, Heading4]].map(([level, Icon]) => (
          <Btn key={level} label={`Heading ${level}`} active={editor.isActive('heading', { level })} onClick={run((c) => c.toggleHeading({ level }))}><Icon className="h-4 w-4" /></Btn>
        ))}
        <Sep />
        <Btn label="Bold" active={editor.isActive('bold')} onClick={run((c) => c.toggleBold())}><Bold className="h-4 w-4" /></Btn>
        <Btn label="Italic" active={editor.isActive('italic')} onClick={run((c) => c.toggleItalic())}><Italic className="h-4 w-4" /></Btn>
        <Btn label="Underline" active={editor.isActive('underline')} onClick={run((c) => c.toggleUnderline())}><UnderlineIcon className="h-4 w-4" /></Btn>
        <Btn label="Inline code" active={editor.isActive('code')} onClick={run((c) => c.toggleCode())}><Code className="h-4 w-4" /></Btn>
        <Btn label="Link" active={editor.isActive('link') || linkOpen} onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setLinkOpen((o) => !o); }}><Link2 className="h-4 w-4" /></Btn>
        <Sep />
        <Btn label="Bulleted list" active={editor.isActive('bulletList')} onClick={run((c) => c.toggleBulletList())}><List className="h-4 w-4" /></Btn>
        <Btn label="Numbered list" active={editor.isActive('orderedList')} onClick={run((c) => c.toggleOrderedList())}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn label="Quote" active={editor.isActive('blockquote')} onClick={run((c) => c.toggleBlockquote())}><Quote className="h-4 w-4" /></Btn>
        <Btn label="Horizontal rule" onClick={run((c) => c.setHorizontalRule())}><Minus className="h-4 w-4" /></Btn>
        <Sep />
        <Btn label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={run((c) => c.setTextAlign('left'))}><AlignLeft className="h-4 w-4" /></Btn>
        <Btn label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={run((c) => c.setTextAlign('center'))}><AlignCenter className="h-4 w-4" /></Btn>
        <Btn label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={run((c) => c.setTextAlign('right'))}><AlignRight className="h-4 w-4" /></Btn>
        <Sep />
        <Btn label="Code block" active={editor.isActive('codeBlock')} onClick={run((c) => c.toggleCodeBlock())}><SquareCode className="h-4 w-4" /></Btn>
        {editor.isActive('codeBlock') && (
          <select
            aria-label="Code language" className="h-8 rounded-md border border-line bg-surface px-2 text-xs"
            value={editor.getAttributes('codeBlock').language || ''}
            onChange={(e) => editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value || null }).run()}
          >
            <option value="">Plain text</option>
            {EDITOR_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        )}
        <Btn label="Insert table" onClick={run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }))}><Table2 className="h-4 w-4" /></Btn>
        {images && (<>
        <Btn label={uploading ? 'Uploading image' : 'Insert image'} disabled={uploading} onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" /></Btn>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" aria-label="Choose an image to insert" onChange={onImage} />
        </>)}
      </div>

      {linkOpen && (
        <form onSubmit={applyLink} className="flex items-center gap-2 border-b border-line p-2">
          <input aria-label="Link address" autoFocus value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="h-9 flex-1 rounded-lg border border-line bg-surface px-3 text-sm" />
          <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink">{linkUrl.trim() ? 'Apply' : 'Remove'}</button>
        </form>
      )}
      {inTable && (
        <div className="flex flex-wrap gap-1 border-b border-line p-1.5 text-xs">
          {[['Add row', (c) => c.addRowAfter()], ['Add column', (c) => c.addColumnAfter()], ['Delete row', (c) => c.deleteRow()], ['Delete column', (c) => c.deleteColumn()], ['Delete table', (c) => c.deleteTable()]].map(([l, fn]) => (
            <button key={l} type="button" onMouseDown={(e) => e.preventDefault()} onClick={run(fn)} className="rounded-md border border-line px-2 py-1 hover:bg-raised">{l}</button>
          ))}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
