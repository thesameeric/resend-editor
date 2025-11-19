"use client"

import * as React from "react"
import { useDraggable } from "@dnd-kit/core"
import {
    TypeIcon,
    Heading1Icon,
    RectangleHorizontalIcon,
    ImageIcon,
    MinusIcon,
    SpaceIcon,
    BoxIcon,
    LayoutIcon,
    LinkIcon,
    Grid3x3Icon,
    ColumnsIcon,
    Footprints as MailIcon,
    ListIcon,
    CodeIcon,
    FileCodeIcon,
    FileTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Share2Icon,
    PanelTopIcon,
    PanelBottomIcon,
    LayoutTemplateIcon,
    LayoutListIcon
} from "lucide-react"
import { EmailComponentType } from "./types"
import { Button } from "./ui/button"

interface PaletteItemProps {
    type: EmailComponentType
    label: string
    icon: React.ReactNode
}

function PaletteItem({ type, label, icon }: PaletteItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: { type, isNew: true },
    })

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                flex flex-col items-center gap-2 p-4 rounded-lg border border-border
                bg-card hover:bg-accent cursor-grab active:cursor-grabbing
                transition-colors
                ${isDragging ? 'opacity-50' : ''}
            `}
        >
            <div className="text-muted-foreground">{icon}</div>
            <span className="text-xs font-medium">{label}</span>
        </div>
    )
}

export function ComponentPalette() {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const basicComponents: PaletteItemProps[] = [
        { type: 'text', label: 'Text', icon: <TypeIcon className="size-4" /> },
        { type: 'heading', label: 'Heading', icon: <Heading1Icon className="size-4" /> },
        { type: 'button', label: 'Button', icon: <RectangleHorizontalIcon className="size-4" /> },
        { type: 'link', label: 'Link', icon: <LinkIcon className="size-4" /> },
        { type: 'image', label: 'Image', icon: <ImageIcon className="size-4" /> },
        { type: 'divider', label: 'Divider', icon: <MinusIcon className="size-4" /> },
        { type: 'spacer', label: 'Spacer', icon: <SpaceIcon className="size-4" /> },
    ]

    const layoutComponents: PaletteItemProps[] = [
        { type: 'container', label: 'Container', icon: <BoxIcon className="size-4" /> },
        { type: 'section', label: 'Section', icon: <LayoutIcon className="size-4" /> },
        { type: 'grid', label: 'Grid', icon: <Grid3x3Icon className="size-4" /> },
        { type: 'header', label: 'Header', icon: <ColumnsIcon className="size-4" /> },
        { type: 'footer', label: 'Footer', icon: <MailIcon className="size-4" /> },
    ]

    const advancedComponents: PaletteItemProps[] = [
        { type: 'list', label: 'List', icon: <ListIcon className="size-4" /> },
        { type: 'social', label: 'Social', icon: <Share2Icon className="size-4" /> },
        { type: 'code-inline', label: 'Code', icon: <CodeIcon className="size-4" /> },
        { type: 'code-block', label: 'Code Block', icon: <FileCodeIcon className="size-4" /> },
        { type: 'markdown', label: 'Markdown', icon: <FileTextIcon className="size-4" /> },
    ]

    if (isCollapsed) {
        return (
            <div className="border-r bg-muted/30 flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(false)}
                    className="h-12"
                >
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto relative group">
            <div
                className="absolute top-0 right-0 w-1 h-full cursor-pointer hover:bg-blue-500/50 transition-colors"
                onClick={() => setIsCollapsed(true)}
                title="Click to collapse"
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="absolute top-2 right-2 h-8 w-8"
            >
                <ChevronLeftIcon className="size-4" />
            </Button>

            <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Basic</h3>
                <div className="grid grid-cols-2 gap-2">
                    {basicComponents.map((component) => (
                        <PaletteItem key={component.type} {...component} />
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3">Layout</h3>
                <div className="grid grid-cols-2 gap-2">
                    {layoutComponents.map((component) => (
                        <PaletteItem key={component.type} {...component} />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-sm mb-3">Advanced</h3>
                <div className="grid grid-cols-2 gap-2">
                    {advancedComponents.map((component) => (
                        <PaletteItem key={component.type} {...component} />
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <h3 className="font-semibold text-sm mb-3">Blocks</h3>
                <div className="grid grid-cols-1 gap-2">
                    <PaletteItem type="hero" label="Hero Section" icon={<LayoutTemplateIcon className="size-4" />} />
                    <PaletteItem type="features" label="Features Grid" icon={<LayoutListIcon className="size-4" />} />
                    <PaletteItem type="header" label="Header" icon={<PanelTopIcon className="size-4" />} />
                    <PaletteItem type="footer" label="Footer" icon={<PanelBottomIcon className="size-4" />} />
                </div>
            </div>
        </div>
    )
}
