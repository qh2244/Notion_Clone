"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock
} from "@blocknote/core";
import {
  BlockNoteView,
} from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  onChange,
  initialContent,
  editable = true
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

  // Use the updated useCreateBlockNote hook
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent) as PartialBlock[] 
      : undefined,
    uploadFile: handleUpload
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable} // Move the editable prop here
        onChange={(updatedEditor) => {
          const content = JSON.stringify(updatedEditor.topLevelBlocks, null, 2);
          onChange(content);
        }}
      />
    </div>
  )
}

export default Editor;
