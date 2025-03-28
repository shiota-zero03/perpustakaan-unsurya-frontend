import {
  Bold,
  Essentials,
  Heading,
  Image,
  ImageUpload,
  SimpleUploadAdapter,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  Undo
} from 'ckeditor5';

export const ckPlugins = [
    Bold,
    Essentials,
    Heading,
    Image,
    Indent,
    IndentBlock,
    ImageUpload,
    SimpleUploadAdapter,
    Italic,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    Table,
    Undo
];

export const ckToolbar = [
    'undo', 'redo', '|',
    'heading', '|', 'bold', 'italic', '|',
    'link', 'insertTable', 'mediaEmbed', 'imageUpload', '|',
    'bulletedList', 'numberedList', 'indent', 'outdent', '|'
];