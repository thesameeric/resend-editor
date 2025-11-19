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
import 'resend-editor/dist/index.css'; // If you have styles (currently styles are inline/tailwind)

function App() {
  const handleChange = (template: EmailTemplate) => {
    console.log('Template changed:', template);
  };

  return (
    <div style={{ height: '100vh' }}>
      <EmailEditor onChange={handleChange} />
    </div>
  );
}
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
