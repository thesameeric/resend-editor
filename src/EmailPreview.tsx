"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { EmailComponent } from "./types"
import { SortableEmailComponent } from "./SortableEmailComponent"

interface EmailPreviewProps {
    components: EmailComponent[]
    selectedId: string | null
    onSelect: (id: string) => void
    onUpdateContent: (id: string, content: string) => void
    viewMode?: 'desktop' | 'mobile'
}

export function EmailPreview({ components, selectedId, onSelect, onUpdateContent, viewMode = 'desktop' }: EmailPreviewProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'email-canvas',
    })

    return (
        <div className="flex-1 bg-muted/20 p-8 overflow-y-auto flex justify-center items-start" onClick={() => onSelect('')}>
            <div
                ref={setNodeRef}
                className={`
                    bg-white shadow-sm min-h-[800px] transition-all duration-300 text-black relative
                    ${viewMode === 'mobile' ? 'w-[375px] rounded-3xl border-8 border-neutral-800' : 'w-[600px]'}
                    ${isOver ? 'ring-4 ring-blue-500/50' : ''}
                `}
                style={{
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                {isOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 z-20 pointer-events-none rounded-lg">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-base font-medium shadow-lg">
                            Drop component here
                        </div>
                    </div>
                )}
                {components.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed border-muted m-4 rounded-lg">
                        <p>Drag and drop components here</p>
                    </div>
                ) : (
                    <SortableContext
                        items={components.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {components.map((component) => (
                            <SortableEmailComponent
                                key={component.id}
                                component={component}
                                isSelected={selectedId === component.id}
                                selectedId={selectedId || undefined}
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
