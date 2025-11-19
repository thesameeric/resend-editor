"use client"

import * as React from "react"
import { EmailComponent } from "./types"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { CSSPropertyInput } from "./CSSPropertyInput"
import { ImageUploader } from "./ImageUploader"

interface PropertiesPanelProps {
    component: EmailComponent | null
    onUpdate: (id: string, updates: Partial<EmailComponent>) => void
    onDelete: (id: string) => void
    onUpload?: (file: File) => Promise<string>
    imageUploadUrl?: string
}

export function PropertiesPanel({ component, onUpdate, onDelete, onUpload, imageUploadUrl }: PropertiesPanelProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const updateProp = (key: string, value: any) => {
        if (!component) return
        onUpdate(component.id, {
            props: { ...component.props, [key]: value },
        })
    }

    const updateStyleProp = (key: string, value: any) => {
        if (!component) return
        onUpdate(component.id, {
            props: {
                ...component.props,
                style: { ...component.props.style, [key]: value },
            },
        })
    }

    if (isCollapsed) {
        return (
            <div className="border-l bg-muted/30 flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(false)}
                    className="h-12"
                >
                    <ChevronLeftIcon className="size-4" />
                </Button>
            </div>
        )
    }

    if (!component) {
        return (
            <div className="w-80 border-l bg-muted/30 p-4 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(true)}
                    className="absolute top-2 right-2 h-8 w-8"
                >
                    <ChevronRightIcon className="size-4" />
                </Button>
                <p className="text-sm text-muted-foreground">
                    Select a component to edit its properties
                </p>
            </div>
        )
    }

    return (
        <div className="w-80 border-l bg-muted/30 p-4 overflow-y-auto relative group">
            <div
                className="absolute top-0 left-0 w-1 h-full cursor-pointer hover:bg-blue-500/50 transition-colors z-10"
                onClick={() => setIsCollapsed(true)}
                title="Click to collapse"
            />
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold capitalize">{component.type} Properties</h3>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(component.id)}
                        className="text-destructive hover:text-destructive"
                        title="Delete Component"
                    >
                        <TrashIcon className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(true)}
                        title="Collapse Panel"
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Common properties based on type */}
                {component.type === 'heading' && (
                    <>
                        <div>
                            <Label>Content</Label>
                            <Textarea
                                value={component.props.content || ''}
                                onChange={(e) => updateProp('content', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>Heading Level</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={component.props.level || 2}
                                onChange={(e) => updateProp('level', parseInt(e.target.value))}
                            >
                                <option value="1">H1</option>
                                <option value="2">H2</option>
                                <option value="3">H3</option>
                                <option value="4">H4</option>
                                <option value="5">H5</option>
                                <option value="6">H6</option>
                            </select>
                        </div>
                    </>
                )}

                {component.type === 'text' && (
                    <>
                        <div>
                            <Label>Content</Label>
                            <Textarea
                                value={component.props.content || ''}
                                onChange={(e) => updateProp('content', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Label>Text Color</Label>
                            <Input
                                type="color"
                                value={component.props.color || '#000000'}
                                onChange={(e) => updateProp('color', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {component.type === 'button' && (
                    <>
                        <div>
                            <Label>Button Text</Label>
                            <Input
                                value={component.props.content || ''}
                                onChange={(e) => updateProp('content', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Link URL</Label>
                            <Input
                                value={component.props.href || ''}
                                onChange={(e) => updateProp('href', e.target.value)}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div>
                            <Label>Background Color</Label>
                            <Input
                                type="color"
                                value={component.props.backgroundColor || '#3b82f6'}
                                onChange={(e) => updateProp('backgroundColor', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Text Color</Label>
                            <Input
                                type="color"
                                value={component.props.color || '#ffffff'}
                                onChange={(e) => updateProp('color', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {component.type === 'image' && (
                    <>
                        <div>
                            <Label>Image URL</Label>
                            <div className="space-y-2">
                                <Input
                                    value={component.props.src || ''}
                                    onChange={(e) => updateProp('src', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                                <ImageUploader
                                    onUpload={onUpload}
                                    imageUploadUrl={imageUploadUrl}
                                    onUrlChange={(url) => updateProp('src', url)}
                                    currentUrl={component.props.src}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Alt Text</Label>
                            <Input
                                value={component.props.alt || ''}
                                onChange={(e) => updateProp('alt', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {component.type === 'spacer' && (
                    <div>
                        <Label>Height (px)</Label>
                        <Input
                            type="number"
                            value={parseInt(component.props.height) || 24}
                            onChange={(e) => updateProp('height', `${e.target.value}px`)}
                        />
                    </div>
                )}

                {component.type === 'divider' && (
                    <div>
                        <Label>Color</Label>
                        <Input
                            type="color"
                            value={component.props.color || '#e5e7eb'}
                            onChange={(e) => updateProp('color', e.target.value)}
                        />
                    </div>
                )}

                {(component.type === 'container' || component.type === 'section' || component.type === 'hero' || component.type === 'features' || component.type === 'header' || component.type === 'footer') && (
                    <>
                        <div>
                            <Label>Padding</Label>
                            <Input
                                value={component.props.padding || '16px'}
                                onChange={(e) => updateProp('padding', e.target.value)}
                                placeholder="16px"
                            />
                        </div>
                        <div>
                            <Label>Background Color</Label>
                            <Input
                                type="color"
                                value={component.props.backgroundColor || '#ffffff'}
                                onChange={(e) => updateProp('backgroundColor', e.target.value)}
                            />
                        </div>
                    </>
                )}

                {component.type === 'grid' && (
                    <div>
                        <Label>Number of Columns</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            value={component.props.columns || 2}
                            onChange={(e) => {
                                const newColumnCount = parseInt(e.target.value)
                                const currentColumns = component.children || []
                                const currentCount = currentColumns.length

                                // Add or remove columns as needed
                                let updatedColumns = [...currentColumns]

                                if (newColumnCount > currentCount) {
                                    // Add new columns
                                    for (let i = currentCount; i < newColumnCount; i++) {
                                        updatedColumns.push({
                                            id: `col-${Date.now()}-${i + 1}`,
                                            type: 'container' as const,
                                            props: { style: {}, children: [] },
                                            children: []
                                        })
                                    }
                                } else if (newColumnCount < currentCount) {
                                    // Remove excess columns
                                    updatedColumns = updatedColumns.slice(0, newColumnCount)
                                }

                                onUpdate(component.id, {
                                    props: { ...component.props, columns: newColumnCount },
                                    children: updatedColumns
                                })
                            }}
                        >
                            <option value="1">1 Column</option>
                            <option value="2">2 Columns</option>
                            <option value="3">3 Columns</option>
                            <option value="4">4 Columns</option>
                        </select>
                    </div>
                )}

                {component.type === 'social' && (
                    <div>
                        <Label className="mb-2 block">Networks</Label>
                        <div className="space-y-2">
                            {(component.props.networks || []).map((network: any, index: number) => (
                                <div key={index} className="flex gap-2 items-start border p-2 rounded">
                                    <div className="flex-1 space-y-2">
                                        <select
                                            className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs"
                                            value={network.name}
                                            onChange={(e) => {
                                                const newNetworks = [...(component.props.networks || [])]
                                                newNetworks[index] = { ...network, name: e.target.value }
                                                updateProp('networks', newNetworks)
                                            }}
                                        >
                                            <option value="facebook">Facebook</option>
                                            <option value="twitter">Twitter</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="github">GitHub</option>
                                        </select>
                                        <Input
                                            className="h-8 text-xs"
                                            value={network.href}
                                            onChange={(e) => {
                                                const newNetworks = [...(component.props.networks || [])]
                                                newNetworks[index] = { ...network, href: e.target.value }
                                                updateProp('networks', newNetworks)
                                            }}
                                            placeholder="URL"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() => {
                                            const newNetworks = (component.props.networks || []).filter((_: any, i: number) => i !== index)
                                            updateProp('networks', newNetworks)
                                        }}
                                    >
                                        <TrashIcon className="size-3" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                    const newNetworks = [...(component.props.networks || []), { name: 'facebook', href: '#' }]
                                    updateProp('networks', newNetworks)
                                }}
                            >
                                Add Network
                            </Button>
                        </div>

                        <div className="mt-4">
                            <Label>Alignment</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={component.props?.style?.justifyContent || 'center'}
                                onChange={(e) => updateStyleProp('justifyContent', e.target.value)}
                            >
                                <option value="flex-start">Left</option>
                                <option value="center">Center</option>
                                <option value="flex-end">Right</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Common style properties */}
                {component.type !== 'spacer' && component.type !== 'divider' && component.type !== 'image' && (
                    <>
                        <div>
                            <Label>Text Align</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                value={component.props?.style?.textAlign || 'left'}
                                onChange={(e) => updateStyleProp('textAlign', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Universal style properties */}
                <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase">Spacing</h4>

                    <div className="space-y-3">
                        <CSSPropertyInput
                            label="Margin"
                            value={component.props?.style?.margin || ''}
                            onChange={(val) => updateStyleProp('margin', val)}
                            allowIndividual
                            sides={['top', 'right', 'bottom', 'left']}
                        />
                        <CSSPropertyInput
                            label="Padding"
                            value={component.props?.style?.padding || ''}
                            onChange={(val) => updateStyleProp('padding', val)}
                            allowIndividual
                            sides={['top', 'right', 'bottom', 'left']}
                        />
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase">Dimensions</h4>

                    <div className="space-y-3">
                        <CSSPropertyInput
                            label="Width"
                            value={component.props?.style?.width || ''}
                            onChange={(val) => updateStyleProp('width', val)}
                        />
                        <CSSPropertyInput
                            label="Height"
                            value={component.props?.style?.height || ''}
                            onChange={(val) => updateStyleProp('height', val)}
                        />
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase">Typography</h4>

                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs mb-1 block">Font Family</Label>
                            <select
                                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs"
                                value={component.props?.style?.fontFamily || 'Arial, sans-serif'}
                                onChange={(e) => updateStyleProp('fontFamily', e.target.value)}
                            >
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                                <option value="'Courier New', Courier, monospace">Courier New</option>
                                <option value="Georgia, serif">Georgia</option>
                                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                                <option value="Verdana, sans-serif">Verdana</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs mb-1 block">Line Height</Label>
                                <Input
                                    className="h-8 text-xs"
                                    value={component.props?.style?.lineHeight || '1.5'}
                                    onChange={(e) => updateStyleProp('lineHeight', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="text-xs mb-1 block">Font Weight</Label>
                                <select
                                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs"
                                    value={component.props?.style?.fontWeight || 'normal'}
                                    onChange={(e) => updateStyleProp('fontWeight', e.target.value)}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="bold">Bold</option>
                                    <option value="500">Medium</option>
                                    <option value="300">Light</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase">Border</h4>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs mb-1 block">Width</Label>
                                <Input
                                    className="h-8 text-xs"
                                    value={component.props?.style?.borderWidth || ''}
                                    onChange={(e) => updateStyleProp('borderWidth', e.target.value)}
                                    placeholder="0px"
                                />
                            </div>
                            <div>
                                <Label className="text-xs mb-1 block">Color</Label>
                                <Input
                                    type="color"
                                    className="h-8"
                                    value={component.props?.style?.borderColor || '#e5e7eb'}
                                    onChange={(e) => updateStyleProp('borderColor', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs mb-1 block">Style</Label>
                            <select
                                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs"
                                value={component.props?.style?.borderStyle || 'solid'}
                                onChange={(e) => updateStyleProp('borderStyle', e.target.value)}
                            >
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                                <option value="none">None</option>
                            </select>
                        </div>

                        <CSSPropertyInput
                            label="Border Radius"
                            value={component.props?.style?.borderRadius || ''}
                            onChange={(val) => updateStyleProp('borderRadius', val)}
                            allowIndividual
                            sides={['top-left', 'top-right', 'bottom-right', 'bottom-left']}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
