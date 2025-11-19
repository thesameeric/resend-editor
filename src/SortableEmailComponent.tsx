"use client"

import * as React from "react"
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { EmailComponent } from "./types"
import { GripVerticalIcon, PlusIcon } from "lucide-react"
import { InlineToolbar } from "./InlineToolbar"
import DOMPurify from 'dompurify'

interface SortableEmailComponentProps {
    component: EmailComponent
    isSelected: boolean
    selectedId?: string
    onSelect: (id: string) => void
    onUpdateContent: (id: string, content: string) => void
}

export function SortableEmailComponent({ component, isSelected, selectedId, onSelect, onUpdateContent }: SortableEmailComponentProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 250ms ease',
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                relative group pl-10
                ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
            `}
            onClick={(e) => {
                e.stopPropagation()
                onSelect(component.id)
            }}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 p-1 rounded hover:bg-muted/50 transition-all opacity-0 group-hover:opacity-100"
                title="Drag to reorder"
            >
                <GripVerticalIcon className="size-4 text-muted-foreground hover:text-foreground" />
            </div>
            <ComponentRenderer
                component={component}
                onUpdateContent={onUpdateContent}
                onSelect={onSelect}
                isSelected={isSelected}
                selectedId={selectedId}
            />
        </div>
    )
}

interface GridColumnProps {
    column: EmailComponent
    index: number
    isSelected: boolean
    selectedId?: string
    onSelect: (id: string) => void
    onUpdateContent: (id: string, content: string) => void
}

function GridColumn({ column, index, isSelected, selectedId, onSelect, onUpdateContent }: GridColumnProps) {
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `${column.id}-dropzone`,
        data: { parentId: column.id }
    })

    return (
        <div
            className={`border border-dashed rounded cursor-pointer transition-colors ${isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : isOver
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-offset-2'
                    : 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700/50 hover:border-neutral-400 dark:hover:border-neutral-500'
                }`}
            style={{
                flex: 1,
                minHeight: '100px',
                padding: '12px',
            }}
            onClick={(e) => {
                e.stopPropagation()
                onSelect(column.id)
            }}
        >
            <div ref={setDroppableRef}>
                {isOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 z-20 pointer-events-none">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                            Drop here
                        </div>
                    </div>
                )}
                {(!column.children || column.children.length === 0) ? (
                    <div className="flex items-center justify-center h-20 text-xs text-muted-foreground dark:text-neutral-400">
                        <PlusIcon className="size-3 mr-1" />
                        Column {index + 1}
                    </div>
                ) : (
                    <SortableContext
                        items={column.children.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {column.children.map((child) => (
                            <SortableEmailComponent
                                key={child.id}
                                component={child}
                                isSelected={selectedId === child.id}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                onUpdateContent={onUpdateContent}
                            />
                        ))}
                    </SortableContext>
                )}
            </div>
        </div>
    )
}

interface ComponentRendererProps {
    component: EmailComponent
    onUpdateContent: (id: string, content: string) => void
    onSelect: (id: string) => void
    isSelected: boolean
    selectedId?: string
}

interface RendererProps {
    component: EmailComponent
    isEditing?: boolean
    contentRef?: React.RefObject<HTMLElement>
    handleClick?: (e: React.MouseEvent) => void
    handleBlur?: (e: React.FocusEvent) => void
    handleFormat?: (command: string, value?: string) => void
    isSelected?: boolean
}

const TextRenderer = React.memo(({ component, isEditing, contentRef, handleClick, handleBlur, handleFormat }: RendererProps) => (
    <div className="relative" onBlur={handleBlur}>
        {isEditing && <InlineToolbar onFormat={handleFormat!} />}
        <p
            ref={contentRef as React.RefObject<HTMLParagraphElement>}
            onClick={handleClick}
            contentEditable={isEditing}
            suppressContentEditableWarning
            aria-label="Editable text"
            style={{
                margin: 0,
                outline: 'none',
                cursor: isEditing ? 'text' : 'pointer',
                whiteSpace: 'pre-wrap',
                color: component.props.color || '#000000',
                ...component.props.style
            }}
            dir="ltr"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(component.props.content || 'Add your text here...') }}
        />
    </div>
))

const HeadingRenderer = React.memo(({ component, isEditing, contentRef, handleClick, handleBlur, handleFormat }: RendererProps) => {
    const level = (component.props.level || 2) as 1 | 2 | 3 | 4 | 5 | 6
    const fontSizes: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
        1: '32px', 2: '24px', 3: '20px', 4: '18px', 5: '16px', 6: '14px',
    }
    const fontSize = fontSizes[level]
    const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

    return (
        <div className="relative" onBlur={handleBlur}>
            {isEditing && <InlineToolbar onFormat={handleFormat!} />}
            {React.createElement(
                HeadingTag,
                {
                    ref: contentRef as React.RefObject<HTMLHeadingElement>,
                    onClick: handleClick,
                    contentEditable: isEditing,
                    suppressContentEditableWarning: true,
                    dir: 'ltr',
                    'aria-label': 'Editable heading',
                    style: {
                        margin: 0,
                        fontSize,
                        fontWeight: 'bold',
                        outline: 'none',
                        cursor: isEditing ? 'text' : 'pointer',
                        whiteSpace: 'pre-wrap',
                        color: component.props.color || '#000000',
                        ...component.props.style
                    },
                    dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(component.props.content || 'Your Heading') }
                }
            )}
        </div>
    )
})

const ButtonRenderer = React.memo(({ component, isEditing, contentRef, handleClick, handleBlur, handleFormat }: RendererProps) => (
    <div style={{ margin: 0, textAlign: component.props.style?.textAlign || 'left', ...component.props.containerStyle }}>
        <div className="relative inline-block" onBlur={handleBlur}>
            {isEditing && <InlineToolbar onFormat={handleFormat!} />}
            <div
                ref={contentRef as React.RefObject<HTMLDivElement>}
                onClick={handleClick}
                contentEditable={isEditing}
                suppressContentEditableWarning
                dir="ltr"
                role="button"
                aria-label="Editable button"
                style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: component.props.backgroundColor || '#3b82f6',
                    color: component.props.color || '#ffffff',
                    textDecoration: 'none',
                    fontWeight: '500',
                    outline: 'none',
                    cursor: isEditing ? 'text' : 'pointer',
                    whiteSpace: 'pre-wrap',
                    ...component.props.style,
                }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(component.props.content || 'Click me') }}
            />
        </div>
    </div>
))

const ImageRenderer = React.memo(({ component }: RendererProps) => (
    <div style={{ margin: 0, ...component.props.containerStyle }}>
        <img
            src={component.props.src || 'https://via.placeholder.com/600x300'}
            alt={component.props.alt || 'Image'}
            style={{
                maxWidth: '100%',
                height: 'auto',
                ...component.props.style,
            }}
        />
    </div>
))

const DividerRenderer = React.memo(({ component }: RendererProps) => (
    <hr
        style={{
            margin: 0,
            border: 'none',
            borderTop: `1px solid ${component.props.color || '#e5e7eb'}`,
            ...component.props.style,
        }}
    />
))

const SpacerRenderer = React.memo(({ component, isSelected }: RendererProps) => (
    <div
        style={{
            height: component.props.height || '24px',
            backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            ...component.props.style,
        }}
    />
))

const SocialRenderer = React.memo(({ component }: RendererProps) => (
    <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: component.props.style?.justifyContent || 'center',
        ...component.props.style
    }}>
        {(component.props.networks || []).map((network: any, i: number) => (
            <a
                key={i}
                href={network.href}
                aria-label={`Visit our ${network.name} page`}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
                onClick={(e) => e.preventDefault()}
            >
                {network.name[0].toUpperCase()}
            </a>
        ))}
    </div>
))

export function ComponentRenderer({ component, onUpdateContent, onSelect, isSelected, selectedId }: ComponentRendererProps) {
    const { type, props } = component
    const [isEditing, setIsEditing] = React.useState(false)
    const contentRef = React.useRef<HTMLElement>(null)

    const handleBlur = (e: React.FocusEvent) => {
        // Check if the new focus is still within the current component (e.g. toolbar)
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return
        }

        setIsEditing(false)
        if (contentRef.current) {
            const finalContent = contentRef.current.innerHTML || ''
            // Sanitize before saving
            const sanitizedContent = DOMPurify.sanitize(finalContent)
            onUpdateContent(component.id, sanitizedContent)
        }
    }

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        // Save immediately after formatting
        if (contentRef.current) {
            const finalContent = contentRef.current.innerHTML || ''
            const sanitizedContent = DOMPurify.sanitize(finalContent)
            onUpdateContent(component.id, sanitizedContent)
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isEditing && (type === 'text' || type === 'heading' || type === 'button')) {
            setIsEditing(true)
            setTimeout(() => {
                if (contentRef.current) {
                    contentRef.current.focus()
                }
            }, 0)
        }
    }

    // Grid with columns
    if (type === 'grid') {
        const columns = component.children || []
        return (
            <div
                style={{
                    margin: 0,
                    border: isSelected ? '2px dashed #3b82f6' : '2px dashed transparent',
                    padding: '8px',
                    ...props.style,
                }}
            >
                <div style={{ display: 'flex', gap: '16px' }}>
                    {columns.map((column, index) => (
                        <GridColumn
                            key={column.id}
                            column={column}
                            index={index}
                            isSelected={selectedId === column.id}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onUpdateContent={onUpdateContent}
                        />
                    ))}
                </div>
            </div>
        )
    }

    // Container type (can hold other components)
    if (['container', 'section', 'header', 'footer', 'hero', 'features'].includes(type)) {
        const { setNodeRef: setDroppableRef, isOver } = useDroppable({
            id: `${component.id}-dropzone`,
            data: { parentId: component.id }
        })

        return (
            <div
                ref={setDroppableRef}
                style={{
                    margin: 0,
                    border: isSelected ? '2px dashed #3b82f6' : isOver ? '2px dashed #3b82f6' : '2px dashed transparent',
                    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : undefined,
                    minHeight: '50px',
                    padding: '10px',
                    position: 'relative',
                    ...props.style,
                }}
            >
                {isOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 z-20 pointer-events-none rounded">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                            Drop here
                        </div>
                    </div>
                )}
                {(!component.children || component.children.length === 0) ? (
                    <div className="flex items-center justify-center h-20 text-xs text-muted-foreground dark:text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-700 rounded">
                        <PlusIcon className="size-3 mr-1" />
                        Drop components here
                    </div>
                ) : (
                    <SortableContext
                        items={component.children.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {component.children.map((child) => (
                            <SortableEmailComponent
                                key={child.id}
                                component={child}
                                isSelected={selectedId === child.id}
                                selectedId={selectedId}
                                onSelect={onSelect}
                                onUpdateContent={onUpdateContent}
                            />
                        ))}
                    </SortableContext>
                )}
            </div>
        )
    }

    switch (type) {
        case 'text':
            return <TextRenderer component={component} isEditing={isEditing} contentRef={contentRef} handleClick={handleClick} handleBlur={handleBlur} handleFormat={handleFormat} />
        case 'heading':
            return <HeadingRenderer component={component} isEditing={isEditing} contentRef={contentRef} handleClick={handleClick} handleBlur={handleBlur} handleFormat={handleFormat} />
        case 'button':
            return <ButtonRenderer component={component} isEditing={isEditing} contentRef={contentRef} handleClick={handleClick} handleBlur={handleBlur} handleFormat={handleFormat} />
        case 'image':
            return <ImageRenderer component={component} />
        case 'divider':
            return <DividerRenderer component={component} />
        case 'spacer':
            return <SpacerRenderer component={component} isSelected={isSelected} />
        case 'social':
            return <SocialRenderer component={component} />
        default:
            return null
    }
}
