export type EmailComponentType =
    // Basic text & layout
    | 'text'
    | 'heading'
    | 'image'
    | 'button'
    | 'divider'
    | 'spacer'
    | 'container'
    | 'section'
    | 'grid'
    | 'social'
    | 'hero'
    | 'features'
    | 'header'
    | 'footer'
    | 'list'
    | 'code-inline'
    | 'code-block'
    | 'markdown'
    | 'link'

export interface SocialNetwork {
    name: string
    href: string
}

export interface EmailComponent {
    id: string
    type: EmailComponentType
    props: Record<string, any>
    children?: EmailComponent[]
}

export interface EmailTemplate {
    components: EmailComponent[]
}
