import * as React from 'react'
import { render } from '@react-email/components'
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Heading,
    Button,
    Img,
    Hr,
} from '@react-email/components'
import { EmailComponent } from './types'

// Recursive component renderer
function RenderEmailComponent({ component }: { component: EmailComponent }) {
    const { type, props } = component

    switch (type) {
        case 'text':
            return (
                <Text
                    style={{
                        margin: '8px 0',
                        ...props.style,
                    }}
                >
                    {props.content || 'Add your text here...'}
                </Text>
            )

        case 'heading': {
            const level = props.level || 2
            return (
                <Heading
                    as={`h${level}` as any}
                    style={{
                        margin: '16px 0',
                        ...props.style,
                    }}
                >
                    {props.content || 'Your Heading'}
                </Heading>
            )
        }

        case 'button':
            return (
                <Button
                    href={props.href || '#'}
                    style={{
                        backgroundColor: props.backgroundColor || '#3b82f6',
                        color: props.color || '#ffffff',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '500',
                        display: 'inline-block',
                        ...props.style,
                    }}
                >
                    {props.content || 'Click me'}
                </Button>
            )

        case 'image':
            return (
                <Img
                    src={props.src || 'https://via.placeholder.com/600x300'}
                    alt={props.alt || 'Image'}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        ...props.style,
                    }}
                />
            )

        case 'divider':
            return (
                <Hr
                    style={{
                        margin: '24px 0',
                        borderColor: props.color || '#e5e7eb',
                        ...props.style,
                    }}
                />
            )

        case 'spacer':
            return (
                <div
                    style={{
                        height: props.height || '24px',
                        ...props.style,
                    }}
                />
            )

        case 'container':
            return (
                <Container
                    style={{
                        padding: props.padding || '16px',
                        backgroundColor: props.backgroundColor,
                        ...props.style,
                    }}
                >
                    {component.children?.map((child) => (
                        <RenderEmailComponent key={child.id} component={child} />
                    ))}
                </Container>
            )

        case 'section':
            return (
                <Section
                    style={{
                        padding: props.padding || '16px',
                        backgroundColor: props.backgroundColor || '#f9fafb',
                        borderRadius: '8px',
                        margin: '24px 0',
                        ...props.style,
                    }}
                >
                    {component.children?.map((child) => (
                        <RenderEmailComponent key={child.id} component={child} />
                    ))}
                </Section>
            )

        default:
            return null
    }
}

// Main email template component
function EmailTemplate({ components }: { components: EmailComponent[] }) {
    return (
        <Html>
            <Head />
            <Body
                style={{
                    margin: 0,
                    padding: 0,
                    fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                }}
            >
                <Container
                    style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '40px',
                    }}
                >
                    {components.map((component) => (
                        <RenderEmailComponent key={component.id} component={component} />
                    ))}
                </Container>
            </Body>
        </Html>
    )
}

// Export function to render to HTML string
export async function renderToReactEmail(components: EmailComponent[]): Promise<string> {
    return await render(<EmailTemplate components={components} />)
}
