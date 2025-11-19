"use client"

import * as React from "react"
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    pointerWithin,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers"
import { arrayMove } from "@dnd-kit/sortable"
import { ComponentPalette } from "./ComponentPalette"
import { EmailPreview } from "./EmailPreview"
import { PropertiesPanel } from "./PropertiesPanel"
import { SortableEmailComponent, ComponentRenderer } from "./SortableEmailComponent"
import { EmailComponent, EmailComponentType, EmailTemplate } from "./types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { renderToReactEmail } from "./renderToReactEmail"
import { generateReactEmailCode } from "./generateReactEmailCode"
import { Editor } from '@monaco-editor/react'
import { Button } from "./ui/button"
import { RotateCcwIcon, RotateCwIcon, MonitorIcon, SmartphoneIcon } from "lucide-react"

const MonacoEditor = ({ ...props }: React.ComponentProps<typeof Editor>) => {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    if (!mounted) return null
    return <Editor {...props} />
}

interface EmailEditorProps {
    initialTemplate?: EmailTemplate
    onChange?: (template: EmailTemplate) => void
    onUpload?: (file: File) => Promise<string>
    imageUploadUrl?: string
}

function createDefaultComponent(type: EmailComponentType): Omit<EmailComponent, 'id'> {
    const defaults: Record<EmailComponentType, any> = {
        text: { content: 'Your text here...', style: {} },
        heading: { content: 'Your Heading', level: 2, style: {} },
        button: { content: 'Click me', href: '#', backgroundColor: '#3b82f6', color: '#ffffff', style: {} },
        link: { content: 'Link', href: '#', style: { color: '#3b82f6', textDecoration: 'underline' } },
        image: { src: 'https://via.placeholder.com/600x300', alt: 'Image', style: {} },
        divider: { color: '#e5e7eb', style: {} },
        spacer: { height: '24px', style: {} },
        container: { padding: '16px', style: {}, children: [] },
        section: { padding: '16px', backgroundColor: '#f9fafb', style: {}, children: [] },
        grid: {
            columns: 2,
            style: {},
            // Create default columns as children
            children: [
                { id: `col-${Date.now()}-1`, type: 'container' as const, props: { style: {}, children: [] }, children: [] },
                { id: `col-${Date.now()}-2`, type: 'container' as const, props: { style: {}, children: [] }, children: [] },
            ]
        },
        header: {
            style: { padding: '20px', backgroundColor: '#ffffff', textAlign: 'center' },
            children: [
                {
                    id: `header-img-${Date.now()}`,
                    type: 'image',
                    props: {
                        src: 'https://via.placeholder.com/150x50?text=Logo',
                        alt: 'Company Logo',
                        style: { margin: '0 auto 10px auto', maxWidth: '150px' },
                        containerStyle: { textAlign: 'center' }
                    }
                },
                {
                    id: `header-h-${Date.now()}`,
                    type: 'heading',
                    props: {
                        content: 'Company Name',
                        level: 3,
                        style: { margin: '0', color: '#333333' }
                    }
                }
            ]
        },
        footer: {
            style: { padding: '30px 20px', backgroundColor: '#f3f4f6', textAlign: 'center' },
            children: [
                {
                    id: `footer-soc-${Date.now()}`,
                    type: 'social',
                    props: {
                        networks: [
                            { name: 'twitter', href: '#' },
                            { name: 'facebook', href: '#' },
                            { name: 'instagram', href: '#' }
                        ],
                        style: { justifyContent: 'center', marginBottom: '20px' }
                    }
                },
                {
                    id: `footer-copy-${Date.now()}`,
                    type: 'text',
                    props: {
                        content: '© 2024 Company Name. All rights reserved.',
                        style: { fontSize: '12px', color: '#6b7280', margin: '0 0 10px 0' }
                    }
                },
                {
                    id: `footer-addr-${Date.now()}`,
                    type: 'text',
                    props: {
                        content: '123 Business Street, Suite 100<br>City, State 12345',
                        style: { fontSize: '12px', color: '#9ca3af', margin: '0' }
                    }
                }
            ]
        },
        list: { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false, style: {} },
        'code-inline': { content: 'code', style: {} },
        'code-block': { content: 'console.log("Hello")', language: 'javascript', style: {} },
        markdown: { content: '# Markdown content', style: {} },
        social: {
            networks: [
                { name: 'facebook', href: '#' },
                { name: 'twitter', href: '#' },
                { name: 'instagram', href: '#' }
            ],
            style: { justifyContent: 'center' }
        },
        hero: {
            padding: '40px 20px',
            backgroundColor: '#f3f4f6',
            style: { textAlign: 'center' },
            children: [
                { id: `hero-h-${Date.now()}`, type: 'heading', props: { level: 1, content: 'Welcome to Our Service', style: { textAlign: 'center' } } },
                { id: `hero-t-${Date.now()}`, type: 'text', props: { content: 'The best way to manage your emails.', style: { textAlign: 'center', fontSize: '18px', color: '#4b5563' } } },
                { id: `hero-s-${Date.now()}`, type: 'spacer', props: { height: '20px' } },
                { id: `hero-b-${Date.now()}`, type: 'button', props: { content: 'Get Started', href: '#', style: { display: 'inline-block' } } }
            ]
        },
        features: {
            padding: '40px 20px',
            backgroundColor: '#ffffff',
            style: {},
            children: [
                { id: `feat-h-${Date.now()}`, type: 'heading', props: { level: 2, content: 'Key Features', style: { textAlign: 'center' } } },
                { id: `feat-s-${Date.now()}`, type: 'spacer', props: { height: '30px' } },
                {
                    id: `feat-g-${Date.now()}`,
                    type: 'grid',
                    props: { columns: 2, style: {} },
                    children: [
                        {
                            id: `feat-c1-${Date.now()}`,
                            type: 'container',
                            props: { style: { textAlign: 'center' } },
                            children: [
                                { id: `feat-c1-h-${Date.now()}`, type: 'heading', props: { level: 3, content: 'Feature 1', style: { textAlign: 'center' } } },
                                { id: `feat-c1-t-${Date.now()}`, type: 'text', props: { content: 'Description of feature 1.', style: { textAlign: 'center' } } }
                            ]
                        },
                        {
                            id: `feat-c2-${Date.now()}`,
                            type: 'container',
                            props: { style: { textAlign: 'center' } },
                            children: [
                                { id: `feat-c2-h-${Date.now()}`, type: 'heading', props: { level: 3, content: 'Feature 2', style: { textAlign: 'center' } } },
                                { id: `feat-c2-t-${Date.now()}`, type: 'text', props: { content: 'Description of feature 2.', style: { textAlign: 'center' } } }
                            ]
                        }
                    ]
                }
            ]
        }
    }

    const containerTypes = ['container', 'section', 'grid', 'header', 'footer', 'hero', 'features']
    const defaultProps = defaults[type] || { style: {} }

    return {
        type,
        props: { ...defaultProps, children: undefined }, // Remove children from props
        children: containerTypes.includes(type) ? (defaultProps.children || []) : undefined,
    }
}

export function EmailEditor({ initialTemplate, onChange, onUpload, imageUploadUrl }: EmailEditorProps) {
    const [components, setComponents] = React.useState<EmailComponent[]>(
        initialTemplate?.components || []
    )
    const [history, setHistory] = React.useState<EmailComponent[][]>([initialTemplate?.components || []])
    const [historyIndex, setHistoryIndex] = React.useState(0)
    const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop')

    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [activeId, setActiveId] = React.useState<string | null>(null)
    const [htmlPreview, setHtmlPreview] = React.useState<string>('')
    const [reactEmailCode, setReactEmailCode] = React.useState<string>('')
    const [isLoadingHtml, setIsLoadingHtml] = React.useState(false)

    const updateComponents = (newComponents: EmailComponent[] | ((prev: EmailComponent[]) => EmailComponent[])) => {
        setComponents((prev) => {
            const next = typeof newComponents === 'function' ? newComponents(prev) : newComponents

            // Add to history if different
            if (JSON.stringify(prev) !== JSON.stringify(next)) {
                const newHistory = history.slice(0, historyIndex + 1)
                newHistory.push(next)
                setHistory(newHistory)
                setHistoryIndex(newHistory.length - 1)
            }

            return next
        })
    }

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setComponents(history[newIndex])
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setComponents(history[newIndex])
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    // Notify parent of changes
    React.useEffect(() => {
        if (onChange) {
            onChange({ components })
        }
    }, [components, onChange])

    // Handle delete key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                // Don't delete if user is typing in an input/textarea
                const target = e.target as HTMLElement
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return
                }
                handleDeleteComponent(selectedId)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedId])

    // Find selected component recursively
    const findComponentById = (comps: EmailComponent[], id: string): EmailComponent | null => {
        for (const comp of comps) {
            if (comp.id === id) return comp
            if (comp.children) {
                const found = findComponentById(comp.children, id)
                if (found) return found
            }
        }
        return null
    }

    const selectedComponent = findComponentById(components, selectedId || '')

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        setActiveId(null)

        if (!over) return

        const overId = over.id as string
        const overData = over.data.current

        // Check if dropping into a container/section
        if (overId.endsWith('-dropzone') && overData?.parentId) {
            const parentId = overData.parentId as string

            // Check if dragging from palette (new component)
            if (active.data.current?.isNew) {
                const type = active.data.current.type as EmailComponentType
                const newComponent: EmailComponent = {
                    id: `component-${Date.now()}`,
                    ...createDefaultComponent(type),
                }

                // Add to parent's children
                updateComponents((prev) => addToParent(prev, parentId, newComponent))
                setSelectedId(newComponent.id)
                return
            }

            // Moving existing component into container
            const activeId = active.id as string
            updateComponents((prev) => moveToParent(prev, activeId, parentId))
            return
        }

        // Check if dragging from palette (new component to root)
        if (active.data.current?.isNew) {
            // Only add if dropped on the email canvas
            if (overId === 'email-canvas' || !overId.startsWith('palette-')) {
                const type = active.data.current.type as EmailComponentType
                const newComponent: EmailComponent = {
                    id: `component-${Date.now()}`,
                    ...createDefaultComponent(type),
                }

                updateComponents((prev) => [...prev, newComponent])
                setSelectedId(newComponent.id)
            }
            return
        }

        // Moving existing component to root canvas
        if (overId === 'email-canvas') {
            const activeId = active.id as string
            updateComponents((prev) => moveToRoot(prev, activeId))
            return
        }

        // Reordering existing components
        if (active.id !== over.id) {
            updateComponents((items) => {
                // Try to find and reorder within the entire tree
                return reorderComponents(items, active.id as string, over.id as string)
            })
        }
    }

    // Helper to reorder components recursively
    const reorderComponents = (comps: EmailComponent[], activeId: string, overId: string): EmailComponent[] => {
        // Check if both items are at root level
        const activeRootIndex = comps.findIndex(c => c.id === activeId)
        const overRootIndex = comps.findIndex(c => c.id === overId)

        if (activeRootIndex !== -1 && overRootIndex !== -1) {
            return arrayMove(comps, activeRootIndex, overRootIndex)
        }

        // Otherwise, search recursively in children
        return comps.map(comp => {
            if (!comp.children || comp.children.length === 0) return comp

            // Check if both active and over are in this container's children
            const activeChildIndex = comp.children.findIndex(c => c.id === activeId)
            const overChildIndex = comp.children.findIndex(c => c.id === overId)

            if (activeChildIndex !== -1 && overChildIndex !== -1) {
                // Both are siblings in this container, reorder them
                return {
                    ...comp,
                    children: arrayMove(comp.children, activeChildIndex, overChildIndex)
                }
            }

            // Recursively search deeper
            return {
                ...comp,
                children: reorderComponents(comp.children, activeId, overId)
            }
        })
    }

    // Helper to add component to parent's children
    const addToParent = (comps: EmailComponent[], parentId: string, newComp: EmailComponent): EmailComponent[] => {
        return comps.map(comp => {
            if (comp.id === parentId) {
                return {
                    ...comp,
                    children: [...(comp.children || []), newComp]
                }
            }
            if (comp.children) {
                return {
                    ...comp,
                    children: addToParent(comp.children, parentId, newComp)
                }
            }
            return comp
        })
    }

    // Helper to move component to root level
    const moveToRoot = (comps: EmailComponent[], compId: string): EmailComponent[] => {
        let movedComp: EmailComponent | null = null

        // First, remove the component from wherever it is
        const removeComponent = (items: EmailComponent[]): EmailComponent[] => {
            return items.reduce((acc: EmailComponent[], item) => {
                if (item.id === compId) {
                    movedComp = item
                    return acc
                }
                if (item.children && item.children.length > 0) {
                    const updatedChildren = removeComponent(item.children)
                    return [...acc, { ...item, children: updatedChildren }]
                }
                return [...acc, item]
            }, [])
        }

        const withoutMoved = removeComponent(comps)

        if (!movedComp) return comps

        // Add it to root level
        return [...withoutMoved, movedComp]
    }

    // Helper to move component to parent's children
    const moveToParent = (comps: EmailComponent[], compId: string, parentId: string): EmailComponent[] => {
        let movedComp: EmailComponent | null = null

        // First, remove the component from wherever it is
        const removeComponent = (items: EmailComponent[]): EmailComponent[] => {
            return items.reduce((acc: EmailComponent[], item) => {
                if (item.id === compId) {
                    movedComp = item
                    return acc
                }
                if (item.children && item.children.length > 0) {
                    const updatedChildren = removeComponent(item.children)
                    return [...acc, { ...item, children: updatedChildren }]
                }
                return [...acc, item]
            }, [])
        }

        const withoutMoved = removeComponent(comps)

        if (!movedComp) return comps

        // Then add it to the parent
        return addToParent(withoutMoved, parentId, movedComp)
    }

    const handleUpdateComponent = (id: string, updates: Partial<EmailComponent>) => {
        const updateRecursive = (comps: EmailComponent[]): EmailComponent[] => {
            return comps.map(c => {
                if (c.id === id) {
                    return { ...c, ...updates }
                }
                if (c.children) {
                    return { ...c, children: updateRecursive(c.children) }
                }
                return c
            })
        }
        updateComponents((prev) => updateRecursive(prev))
    }

    const handleUpdateContent = (id: string, content: string) => {
        handleUpdateComponent(id, {
            props: {
                ...findComponentById(components, id)?.props,
                content,
            }
        })
    }

    const handleDeleteComponent = (id: string) => {
        const deleteRecursive = (comps: EmailComponent[]): EmailComponent[] => {
            return comps.filter(c => {
                if (c.id === id) return false
                if (c.children) {
                    c.children = deleteRecursive(c.children)
                }
                return true
            })
        }
        updateComponents((prev) => deleteRecursive(prev))
        if (selectedId === id) {
            setSelectedId(null)
        }
    }

    // Generate React Email code
    const generateReactEmailPreview = React.useCallback(() => {
        const code = generateReactEmailCode(components)
        setReactEmailCode(code)
    }, [components])

    // Generate HTML preview when switching to HTML tab
    const generateHtmlPreview = React.useCallback(async () => {
        setIsLoadingHtml(true)
        try {
            const html = await renderToReactEmail(components)
            setHtmlPreview(html)
        } catch (error) {
            console.error('Error generating HTML:', error)
            setHtmlPreview('<p>Error generating HTML preview</p>')
        } finally {
            setIsLoadingHtml(false)
        }
    }, [components])

    // Update HTML preview when React Email code changes
    const handleCodeChange = React.useCallback((value: string | undefined) => {
        if (value) {
            setReactEmailCode(value)
            // Note: Parsing code back to components would require a full parser
            // For now, we'll just update the code view
        }
    }, [])

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[]}
        >
            <div className="flex h-full">
                <ComponentPalette />
                <div className="flex-1 flex flex-col">
                    <Tabs defaultValue="preview" className="h-full flex flex-col">
                        <div className="flex items-center justify-between p-2 border-b bg-muted/10">
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex === 0} title="Undo">
                                    <RotateCcwIcon className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex === history.length - 1} title="Redo">
                                    <RotateCwIcon className="size-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-md">
                                <Button
                                    variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setViewMode('desktop')}
                                    title="Desktop View"
                                >
                                    <MonitorIcon className="size-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => setViewMode('mobile')}
                                    title="Mobile View"
                                >
                                    <SmartphoneIcon className="size-4" />
                                </Button>
                            </div>
                            <div className="w-20" /> {/* Spacer for balance */}
                        </div>
                        <TabsList className="w-full justify-start rounded-none border-b">
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="react-email" onClick={generateReactEmailPreview}>
                                React Email Code
                            </TabsTrigger>
                            <TabsTrigger value="html" onClick={generateHtmlPreview}>
                                HTML Output
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="preview" className="flex-1 mt-0">
                            <EmailPreview
                                components={components}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onUpdateContent={handleUpdateContent}
                                viewMode={viewMode}
                            />
                        </TabsContent>

                        <TabsContent value="react-email" className="flex-1 mt-0">
                            <div className="h-full">
                                <MonacoEditor
                                    height="100%"
                                    language="typescript"
                                    theme="vs-dark"
                                    value={reactEmailCode}
                                    onChange={handleCodeChange}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 2,
                                    }}
                                    beforeMount={(monaco) => {
                                        // Disable all diagnostics/linting
                                        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                                            noSemanticValidation: true,
                                            noSyntaxValidation: true,
                                        })
                                    }}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="html" className="flex-1 mt-0">
                            <div className="h-full">
                                {isLoadingHtml ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-muted-foreground">Generating HTML...</p>
                                    </div>
                                ) : (
                                    <MonacoEditor
                                        height="100%"
                                        language="html"
                                        theme="vs-dark"
                                        value={htmlPreview}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            readOnly: true,
                                            tabSize: 2,
                                        }}
                                    />
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
                <PropertiesPanel
                    component={selectedComponent}
                    onUpdate={handleUpdateComponent}
                    onDelete={handleDeleteComponent}
                    onUpload={onUpload}
                    imageUploadUrl={imageUploadUrl}
                />
            </div>
            <DragOverlay dropAnimation={{
                duration: 250,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
                {activeId ? (
                    <div className="opacity-80 rotate-2 cursor-grabbing pointer-events-none">
                        {activeId.startsWith('palette-') ? (
                            (() => {
                                const type = activeId.replace('palette-', '') as EmailComponentType
                                const tempComponent: EmailComponent = {
                                    id: 'temp',
                                    ...createDefaultComponent(type)
                                }
                                return (
                                    <div className="bg-white shadow-xl rounded-lg border border-blue-500 overflow-hidden" style={{ width: '600px' }}>
                                        <div className="p-4 pointer-events-none">
                                            <ComponentRenderer
                                                component={tempComponent}
                                                onUpdateContent={() => { }}
                                                onSelect={() => { }}
                                                isSelected={false}
                                            />
                                        </div>
                                    </div>
                                )
                            })()
                        ) : (
                            (() => {
                                const comp = findComponentById(components, activeId)
                                if (!comp) return null
                                return (
                                    <div className="bg-white shadow-xl rounded-lg border border-blue-500 overflow-hidden" style={{ width: '600px' }}>
                                        <div className="p-4 pointer-events-none">
                                            <ComponentRenderer
                                                component={comp}
                                                onUpdateContent={() => { }}
                                                onSelect={() => { }}
                                                isSelected={false}
                                            />
                                        </div>
                                    </div>
                                )
                            })()
                        )}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
