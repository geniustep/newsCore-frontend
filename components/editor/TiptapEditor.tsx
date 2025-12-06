'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import { useState, useCallback, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Highlighter,
  Youtube as YoutubeIcon,
  Palette,
  Type,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-primary text-white shadow-md'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />;
}

const COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#DC2626', '#EA580C', '#D97706', '#CA8A04',
  '#16A34A', '#059669', '#0D9488', '#0891B2',
  '#2563EB', '#4F46E5', '#7C3AED', '#9333EA',
  '#C026D3', '#DB2777', '#E11D48',
];

const HIGHLIGHT_COLORS = [
  '#FEF08A', '#FDE047', '#FACC15',
  '#BBF7D0', '#86EFAC', '#4ADE80',
  '#BAE6FD', '#7DD3FC', '#38BDF8',
  '#DDD6FE', '#C4B5FD', '#A78BFA',
  '#FBCFE8', '#F9A8D4', '#F472B6',
];

export default function TiptapEditor({
  content,
  onChange,
  placeholder = 'اكتب محتوى المقالة هنا...',
  className,
  editable = true,
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto mx-auto my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-xl overflow-hidden mx-auto my-4',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg dark:prose-invert max-w-none',
          'focus:outline-none min-h-[400px] px-4 py-3',
          'prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white',
          'prose-p:text-gray-700 dark:prose-p:text-gray-300',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
          'prose-blockquote:border-r-4 prose-blockquote:border-primary prose-blockquote:pr-4 prose-blockquote:border-l-0',
          'prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
          'prose-pre:bg-gray-900 prose-pre:text-gray-100',
          'prose-img:rounded-xl prose-img:shadow-lg'
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setLinkUrl('');
    setShowLinkModal(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageModal(false);
  }, [editor, imageUrl]);

  const addYoutubeVideo = useCallback(() => {
    if (!editor || !youtubeUrl) return;

    editor.commands.setYoutubeVideo({ src: youtubeUrl });
    setYoutubeUrl('');
    setShowYoutubeModal(false);
  }, [editor, youtubeUrl]);

  const setTextColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  }, [editor]);

  const setHighlightColor = useCallback((color: string) => {
    if (!editor) return;
    editor.chain().focus().toggleHighlight({ color }).run();
    setShowHighlightPicker(false);
  }, [editor]);

  if (!editor) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-96" />
    );
  }

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="border-b border-gray-100 dark:border-gray-700 p-2 bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex flex-wrap items-center gap-0.5">
          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="تراجع"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="إعادة"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="غامق"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="مائل"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="تسطير"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="يتوسطه خط"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="كود"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Color */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="لون النص"
            >
              <Palette className="w-4 h-4" />
            </ToolbarButton>
            {showColorPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)} />
                <div className="absolute top-full right-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 w-48">
                  <div className="grid grid-cols-5 gap-1">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                    className="w-full mt-2 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    إزالة اللون
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Highlight */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              isActive={editor.isActive('highlight')}
              title="تمييز"
            >
              <Highlighter className="w-4 h-4" />
            </ToolbarButton>
            {showHighlightPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowHighlightPicker(false)} />
                <div className="absolute top-full right-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 w-48">
                  <div className="grid grid-cols-5 gap-1">
                    {HIGHLIGHT_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setHighlightColor(color)}
                        className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
                    className="w-full mt-2 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    إزالة التمييز
                  </button>
                </div>
              </>
            )}
          </div>

          <ToolbarDivider />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="عنوان 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="عنوان 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="عنوان 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive('paragraph')}
            title="فقرة"
          >
            <Type className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="قائمة نقطية"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="قائمة مرقمة"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="اقتباس"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="خط فاصل"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="محاذاة لليمين"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="توسيط"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="محاذاة لليسار"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="ضبط"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkModal(true);
              }
            }}
            isActive={editor.isActive('link')}
            title="رابط"
          >
            {editor.isActive('link') ? <Unlink className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          </ToolbarButton>

          {/* Image */}
          <ToolbarButton
            onClick={() => setShowImageModal(true)}
            title="صورة"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>

          {/* Youtube */}
          <ToolbarButton
            onClick={() => setShowYoutubeModal(true)}
            title="فيديو يوتيوب"
          >
            <YoutubeIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-gray-900 rounded-xl shadow-xl px-2 py-1 flex items-center gap-0.5"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn('p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10', editor.isActive('bold') && 'bg-white/20')}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn('p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10', editor.isActive('italic') && 'bg-white/20')}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn('p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10', editor.isActive('underline') && 'bg-white/20')}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button
            onClick={() => setShowLinkModal(true)}
            className={cn('p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10', editor.isActive('link') && 'bg-white/20')}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إضافة رابط</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
              dir="ltr"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={setLink}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إضافة صورة</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
              dir="ltr"
            />
            {imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover" />
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={addImage}
                disabled={!imageUrl}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Youtube Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">إضافة فيديو يوتيوب</h3>
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
              dir="ltr"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              أدخل رابط فيديو يوتيوب كامل
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={addYoutubeVideo}
                disabled={!youtubeUrl}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          direction: rtl;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: right;
          color: #9CA3AF;
          pointer-events: none;
          height: 0;
        }
        
        .ProseMirror:focus {
          outline: none;
        }
        
        .ProseMirror > * + * {
          margin-top: 0.75em;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          padding-right: 1.5rem;
          padding-left: 0;
        }
        
        .ProseMirror blockquote {
          border-right: 4px solid var(--primary, #3B82F6);
          border-left: 0;
          padding-right: 1rem;
          padding-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #6B7280;
        }
        
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #E5E7EB;
          margin: 2rem 0;
        }
        
        .dark .ProseMirror hr {
          border-color: #374151;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1rem auto;
          display: block;
        }
        
        .ProseMirror iframe {
          border-radius: 0.75rem;
          margin: 1rem auto;
          display: block;
          max-width: 100%;
        }
        
        .ProseMirror pre {
          background: #1F2937;
          color: #F3F4F6;
          font-family: 'JetBrains Mono', monospace;
          padding: 1rem;
          border-radius: 0.75rem;
          overflow-x: auto;
        }
        
        .ProseMirror code {
          background: #F3F4F6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.875em;
        }
        
        .dark .ProseMirror code {
          background: #374151;
        }
        
        .ProseMirror mark {
          border-radius: 0.25rem;
          padding: 0 0.25rem;
        }
      `}</style>
    </div>
  );
}

