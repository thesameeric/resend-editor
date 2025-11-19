/* eslint-disable */
// @ts-nocheck
import { EmailComponent } from "./types"

export function generateReactEmailCode(components: EmailComponent[]): string {
    const indent = (level: number) => '  '.repeat(level)

    const componentToJSX = (component: EmailComponent, level: number): string => {
        const { type, props, children } = component
        const ind = indent(level)

        switch (type) {
            case 'text':
                return `${ind}<Text style={{ margin: '8px 0', ...${JSON.stringify(props.style || {})} }}>\n${ind}  ${props.content || ''}\n${ind}</Text>`

            case 'heading': {
                const headingLevel = props.level || 2
                return `${ind}<Heading as="h${headingLevel}" style={${JSON.stringify(props.style || {})}}>\n${ind}  ${props.content || ''}\n${ind}</Heading>`
            }

            case 'button':
                return `${ind}<Button href="${props.href || '#'}" style={{ backgroundColor: '${props.backgroundColor || '#3b82f6'}', color: '${props.color || '#ffffff'}', padding: '12px 24px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block', ...${JSON.stringify(props.style || {})} }}>\n${ind}  ${props.content || ''}\n${ind}</Button>`

            case 'link':
                return `${ind}<Link href="${props.href || '#'}" style={${JSON.stringify(props.style || {})}}>\n${ind}  ${props.content || ''}\n${ind}</Link>`

            case 'image':
                return `${ind}<Img src="${props.src || ''}" alt="${props.alt || ''}" style={${JSON.stringify(props.style || {})}} />`

            case 'divider':
                return `${ind}<Hr style={{ borderColor: '${props.color || '#e5e7eb'}', margin: '16px 0', ...${JSON.stringify(props.style || {})} }} />`

            case 'spacer':
                return `${ind}<div style={{ height: '${props.height || '24px'}' }} />`

            case 'container':
            case 'section':
            case 'hero':
            case 'features': {
                const Tag = (type === 'section' || type === 'hero' || type === 'features' || type === 'header' || type === 'footer') ? 'Section' : 'Container'
                const childrenJSX = children && children.length > 0
                    ? '\n' + children.map(child => componentToJSX(child, level + 1)).join('\n') + '\n' + ind
                    : ''
                return `${ind}<${Tag} style={{ padding: '${props.padding || '16px'}', backgroundColor: '${props.backgroundColor || (type === 'section' ? '#f9fafb' : 'transparent')}', ...${JSON.stringify(props.style || {})} }}>${childrenJSX}</${Tag}>`
            }

            case 'grid': {
                const columns = children || []
                const columnsJSX = columns.length > 0
                    ? '\n' + columns.map((col, idx) => {
                        const colChildren = col.children || []
                        const colChildrenJSX = colChildren.length > 0
                            ? '\n' + colChildren.map(child => componentToJSX(child, level + 2)).join('\n') + '\n' + indent(level + 1)
                            : `\n${indent(level + 2)}{/* Column ${idx + 1} */}\n${indent(level + 1)}`
                        return `${indent(level + 1)}<Column style={{ verticalAlign: 'top' }}>${colChildrenJSX}</Column>`
                    }).join('\n') + '\n' + ind
                    : ''
                return `${ind}<Row>${columnsJSX}</Row>`
            }

            case 'header':
            case 'footer': {
                const childrenJSX = children && children.length > 0
                    ? '\n' + children.map(child => componentToJSX(child, level + 1)).join('\n') + '\n' + ind
                    : `\n${ind}  ${props.content || ''}\n${ind}`
                return `${ind}<Section style={${JSON.stringify(props.style || {})}}>${childrenJSX}</Section>`
            }

            case 'list': {
                const items = props.items || []
                const listItems = items.map((item: string) => `${indent(level + 1)}<li>${item}</li>`).join('\n')
                const tag = props.ordered ? 'ol' : 'ul'
                return `${ind}<${tag} style={${JSON.stringify(props.style || {})}}>\n${listItems}\n${ind}</${tag}>`
            }

            case 'code-inline':
                return `${ind}<Code style={${JSON.stringify(props.style || {})}}>${props.content || ''}</Code>`

            case 'code-block':
                return `${ind}<CodeBlock language="${props.language || 'javascript'}" style={${JSON.stringify(props.style || {})}}>\n${ind}  ${props.content || ''}\n${ind}</CodeBlock>`

            case 'markdown':
                return `${ind}<Markdown style={${JSON.stringify(props.style || {})}}>\n${ind}  ${props.content || ''}\n${ind}</Markdown>`

            case 'social': {
                const networks = props.networks || []
                const networksJSX = networks.map((net: any) =>
                    `${indent(level + 1)}<SocialIcon url="${net.href}" network="${net.name}" />`
                ).join('\n')

                return `${ind}<Container style={${JSON.stringify(props.style || {})}}>\n${networksJSX}\n${ind}</Container>`
            }

            default:
                return `${ind}<!-- Unknown component type: ${type} -->`
        }
    }

    const componentsJSX = components.map(comp => componentToJSX(comp, 3)).join('\n')

    return `import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Link,
  Img,
  Hr,
  Row,
  Column,
  Code,
  CodeBlock,
  Markdown,
} from '@react-email/components'

export default function Email() {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
${componentsJSX}
      </Body>
    </Html>
  )
}
`
}
