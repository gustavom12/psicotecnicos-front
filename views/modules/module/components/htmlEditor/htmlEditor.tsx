"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import apiConnection from "@/pages/api/api";
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
  // MediaEmbed, // Removido para evitar subida de videos
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

// Adaptador personalizado para subida de imágenes
class CustomUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        // Validar que el archivo sea una imagen (bloquear videos y otros tipos)
        const allowedImageTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/bmp',
          'image/svg+xml'
        ];

        if (!file.type.startsWith('image/') || file.type.startsWith('video/')) {
          console.error('Tipo de archivo no válido:', file.type);
          reject('Solo se permiten archivos de imagen. No se pueden subir videos.');
          return;
        }

        if (!allowedImageTypes.includes(file.type)) {
          console.error('Formato de imagen no soportado:', file.type);
          reject(`Formato de imagen no soportado: ${file.type}. Formatos permitidos: JPEG, PNG, GIF, WebP, BMP, SVG`);
          return;
        }

        // Validar tamaño del archivo (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          console.error('Archivo demasiado grande:', file.size);
          reject('El archivo es demasiado grande. Máximo 10MB permitido');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        apiConnection.post('/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => {
            const result = response.data;
            if (result.url) {
              resolve({
                default: result.url
              });
            } else {
              console.error('URL no encontrada en respuesta:', result);
              reject('Error al subir la imagen: URL no encontrada en la respuesta');
            }
          })
          .catch(error => {
            console.error('Error al subir imagen:', error);
            console.error('Error response:', error.response);
            const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
            reject(`Error al subir la imagen: ${errorMessage}`);
          });
      });
    });
  }

  abort() {
    // Implementar lógica de cancelación si es necesario
  }
}

function CustomUploadAdapterPlugin(editor: any) {

  try {
    const fileRepository = editor.plugins.get('FileRepository');

    fileRepository.createUploadAdapter = (loader: any) => {
      return new CustomUploadAdapter(loader);
    };
  } catch (error) {
    console.error('Error al configurar el adaptador de subida:', error);
  }
}

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

  const onReady = (editor: any) => {

    // Verificar si FileRepository está disponible
    try {
      const fileRepository = editor.plugins.get('FileRepository');
    } catch (error) {
      console.error('FileRepository no disponible:', error);
    }
  };
  return (
    <CKEditor
      onChange={onChange}
      onReady={onReady}
      editor={ClassicEditor}
      data={value}
      config={{
        licenseKey: "GPL",
        extraPlugins: [CustomUploadAdapterPlugin],
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
          // MediaEmbed, // Removido para evitar subida de videos
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
          upload: {
            types: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'bmp', 'svg']
          }
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
