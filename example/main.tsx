import React from 'react';
import ReactDOM from 'react-dom/client';
import { EmailEditor, EmailTemplate } from '../src/index';
import '../src/styles.css';

function App() {
    const [template, setTemplate] = React.useState<EmailTemplate>({
        components: []
    });

    const [darkMode, setDarkMode] = React.useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const handleChange = React.useCallback((newTemplate: EmailTemplate) => {
        setTemplate(newTemplate);
        console.log('Template updated:', newTemplate);
    }, []);

    return (
        <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000,
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
            }}>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: darkMode ? '#374151' : '#ffffff',
                        color: darkMode ? '#f3f4f6' : '#111827',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                >
                    {darkMode ? '🌙' : '☀️'}
                    {darkMode ? 'Dark' : 'Light'}
                </button>
            </div>
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
