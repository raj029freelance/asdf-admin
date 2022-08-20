import { useEffect } from 'react';

import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './textEditor.scss';

const TextEditor = ({ htmlText, editorState, setEditorState }) => {
  const onTextChange = (editState) => {
    setEditorState(editState);
  };

  useEffect(() => {
    const contentBlock = htmlToDraft(htmlText);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  return (
    <Editor
      editorState={editorState}
      editorClassName="editor"
      onEditorStateChange={onTextChange}
      toolbar={{
        options: ['inline', 'blockType', 'fontSize', 'list', 'colorPicker', 'link', 'image'],
        inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
        list: { options: ['unordered', 'ordered'] },
        link: { options: ['link'] },
        fontFamily: {
          options: ['Proxima Nova', 'Calibri']
        }
      }}
    />
  );
};

export default TextEditor;
