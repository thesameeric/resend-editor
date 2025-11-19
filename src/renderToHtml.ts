import { EmailComponent } from "./types"

export function renderToHtml(components: EmailComponent[]): string {
    const componentsHtml = components.map(renderComponent).join('\n')

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 40px;">
                            ${componentsHtml}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim()
}

function renderComponent(component: EmailComponent): string {
    const { type, props } = component

    const styleToString = (style: Record<string, any> = {}) => {
        return Object.entries(style)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
                return `${cssKey}: ${value}`
            })
            .join('; ')
    }

    switch (type) {
        case 'text':
            return `<p style="margin: 8px 0; direction: ltr; ${styleToString(props.style)}">${props.content || ''}</p>`

        case 'heading': {
            const level = (props.level || 2) as 1 | 2 | 3 | 4 | 5 | 6
            const fontSizes: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
                1: '32px',
                2: '24px',
                3: '20px',
                4: '18px',
                5: '16px',
                6: '14px',
            }
            const fontSize = fontSizes[level]
            return `<h${level} style="margin: 16px 0; font-size: ${fontSize}; font-weight: bold; direction: ltr; ${styleToString(props.style)}">${props.content || ''}</h${level}>`
        }

        case 'button':
            return `
                <table role="presentation" style="margin: 16px 0;">
                    <tr>
                        <td style="text-align: ${props.style?.textAlign || 'left'};">
                            <a href="${props.href || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${props.backgroundColor || '#3b82f6'}; color: ${props.color || '#ffffff'}; text-decoration: none; border-radius: 6px; font-weight: 500; direction: ltr; ${styleToString(props.style)}">${props.content || ''}</a>
                        </td>
                    </tr>
                </table>
            `

        case 'image':
            return `
                <div style="margin: 16px 0; ${styleToString(props.containerStyle)}">
                    <img src="${props.src || ''}" alt="${props.alt || ''}" style="max-width: 100%; height: auto; ${styleToString(props.style)}" />
                </div>
            `

        case 'divider':
            return `<hr style="margin: 24px 0; border: none; border-top: 1px solid ${props.color || '#e5e7eb'}; ${styleToString(props.style)}" />`

        case 'spacer':
            return `<div style="height: ${props.height || '24px'}; ${styleToString(props.style)}"></div>`

        case 'container':
            const containerChildren = component.children?.map(renderComponent).join('\n') || ''
            return `
                <div style="padding: ${props.padding || '16px'}; background-color: ${props.backgroundColor || 'transparent'}; ${styleToString(props.style)}">
                    ${containerChildren}
                </div>
            `

        case 'section':
            const sectionChildren = component.children?.map(renderComponent).join('\n') || ''
            return `
                <div style="margin: 24px 0; padding: ${props.padding || '16px'}; background-color: ${props.backgroundColor || '#f9fafb'}; border-radius: 8px; ${styleToString(props.style)}">
                    ${sectionChildren}
                </div>
            `

        default:
            return ''
    }
}
