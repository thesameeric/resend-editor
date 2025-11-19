# Resend Email Editor

A drag-and-drop email editor for React applications, built with `@dnd-kit` and `@react-email/components`.

## Installation

```bash
npm install resend-editor
# or
yarn add resend-editor
# or
pnpm add resend-editor
```

## Usage

```tsx
import { EmailEditor, EmailTemplate } from 'resend-editor';
import 'resend-editor/styles.css'; // Import the styles

function App() {
  const handleChange = (template: EmailTemplate) => {
    console.log('Template changed:', template);
  };

  return (
    <div style={{ height: '100vh' }}>
      <EmailEditor 
        onChange={handleChange}
        // Option 1: Provide a URL to upload images to
        imageUploadUrl="/api/upload"
        // Option 2: Provide a custom upload function
        // onUpload={async (file) => {
        //   const url = await uploadFile(file);
        //   return url;
        // }}
      />
    </div>
  );
}
```

## Image Upload

You can enable image uploads by providing either `imageUploadUrl` or `onUpload`.

### `imageUploadUrl` (string)

A URL to POST the image file to. The editor will send a `POST` request with the file in a `FormData` object under the key `file`.

The endpoint should return either:
- A JSON object with a `url`, `secure_url`, or `data.url` property.
- A plain text response containing the URL.

### `onUpload` (function)

A function that receives a `File` object and returns a Promise that resolves to the image URL string.

```tsx
<EmailEditor
  onUpload={async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    return data.url;
  }}
/>
```

## Features

- Drag and drop components
- Rich text editing
- Layout management (Grid, Container, Section)
- Pre-built components (Header, Footer, Hero, Features)
- Export to React Email code
- Export to HTML

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Build: `npm run build`

### Development Example

To see the editor in action while developing:

```bash
npm run dev:example
```

This will start a Vite development server at `http://localhost:5173` with hot-module-replacement enabled. You can make changes to the source code and see them reflected immediately in the browser.

