"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  /* núcleo */
  Essentials,
  Paragraph,
  /* formato */
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Code,
  CodeBlock,
  Highlight,
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Alignment,
  Heading,
  HorizontalLine,
  PageBreak,
  /* listas */
  List,
  TodoList,
  ListProperties,
  Indent,
  IndentBlock,
  /* enlaces & citas */
  Link,
  BlockQuote,
  /* imágenes */
  Image,
  ImageInsert,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageResize,
  /* multimedia */
  MediaEmbed,
  /* tablas */
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  /* varios */
  SpecialCharacters,
  FindAndReplace,
  RemoveFormat,
  Autoformat,
  Autosave,
} from "ckeditor5";

export default function HtmlEditor({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const onChange = (event: any, editor: any) => {
    const data = editor.getData();
    console.log("onChange: ", data);

    setValue(data);
  };
  return (
    <CKEditor
      onChange={onChange}
      editor={ClassicEditor}
      data={value}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Paragraph,
          /* formato */
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Subscript,
          Superscript,
          Code,
          CodeBlock,
          Highlight,
          FontFamily,
          FontSize,
          FontColor,
          FontBackgroundColor,
          Alignment,
          Heading,
          HorizontalLine,
          PageBreak,
          /* listas */
          List,
          TodoList,
          ListProperties,
          Indent,
          IndentBlock,
          /* enlaces & citas */
          Link,
          BlockQuote,
          /* imágenes */
          Image,
          ImageInsert,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          ImageResize,
          /* multimedia */
          MediaEmbed,
          /* tablas */
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          /* varios */
          SpecialCharacters,
          FindAndReplace,
          RemoveFormat,
          Autoformat,
          Autosave,
        ],
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "code",
          "highlight",
          "removeFormat",
          "|",
          "fontFamily",
          "fontSize",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
          "|",
          "link",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "imageInsert",
          "horizontalLine",
          "pageBreak",
          "|",
          "findAndReplace",
          "specialCharacters",
        ],
        image: {
          resizeUnit: "%",
          toolbar: [
            "imageTextAlternative",
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "linkImage",
          ],
        },
        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },
      }}
    />
  );
}
