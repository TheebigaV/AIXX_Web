"use client";

import React, {useEffect, useRef} from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: boolean;
    hint?: string;
    height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
                                                           value,
                                                           onChange,
                                                           placeholder,
                                                           error,
                                                           hint,
                                                           height = "200px",
                                                       }) => {
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || editorRef.current) return;

        // @ts-ignore: comes from CDN
        const ClassicEditor = (window as any).ClassicEditor;
        if (!ClassicEditor) {
            console.error("ClassicEditor not loaded from CDN!");
            return;
        }

        ClassicEditor.create(containerRef.current, {
            placeholder: placeholder || "Start typing here...",
            toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "|",
                "fontSize",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "alignment",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "insertTable",
                "link",
                "undo",
                "redo",
            ],
            table: {
                contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
            },
        })
            .then((editor: any) => {
                editorRef.current = editor;

                editor.setData(value || "");

                editor.model.document.on("change:data", () => {
                    onChange(editor.getData());
                });
            })
            .catch((error: any) => console.error("CKEditor init error:", error));

        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    // Update editor content when value prop changes
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.getData()) {
            editorRef.current.setData(value || "");
        }
    }, [value]);

    return (
        <div className="space-y-1">
            <div
                ref={containerRef}
                style={{minHeight: height, border: "1px solid #ddd", borderRadius: "8px", padding: "8px"}}
            />
            {/* Global Styles for CKEditor */}
            <style jsx global>{`
                /* Editable area */
                .ck-editor__editable,
                .ck-editor__editable_inline {
                    min-height: ${height};
                    padding: 10px 12px;
                    box-sizing: border-box;
                    overflow-wrap: break-word;
                    word-break: break-word;
                }

                /* Lists */
                .ck-editor__editable ul,
                .ck-editor__editable ol,
                .ck-editor__editable_inline ul,
                .ck-editor__editable_inline ol {
                    padding-left: 30px;
                }

                /* Paragraphs */
                .ck-editor__editable p,
                .ck-editor__editable_inline p {
                    margin: 0;
                }
            `}</style>

            {error && <p className="text-red-500 text-sm">{hint}</p>}
        </div>
    );
};

export default RichTextEditor;
