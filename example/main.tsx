import React from 'react';
import ReactDOM from 'react-dom/client';
import { EmailEditor, EmailTemplate } from '../src/index';
import '../src/styles.css';

function App() {
    const [template, setTemplate] = React.useState<EmailTemplate>({
        components: []
    });

    const handleChange = React.useCallback((newTemplate: EmailTemplate) => {
        setTemplate(newTemplate);
        console.log('Template updated:', newTemplate);
    }, []);

    return (
        <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
            <EmailEditor
                initialTemplate={template}
                onChange={handleChange}
            />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
