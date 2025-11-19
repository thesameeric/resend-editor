"use client"

import * as React from "react"
import { BoldIcon, ItalicIcon, UnderlineIcon, TypeIcon, PaletteIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface InlineToolbarProps {
    onFormat: (command: string, value?: string) => void
}

export function InlineToolbar({ onFormat }: InlineToolbarProps) {
    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault() // Prevent focus loss
        e.stopPropagation()
        action()
    }

    return (
        <div data-inline-toolbar="true" className="absolute -top-12 left-0 z-50 flex items-center gap-1 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-md shadow-lg p-1 animate-in fade-in slide-in-from-bottom-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                onMouseDown={(e) => handleAction(e, () => onFormat('bold'))}
                title="Bold"
            >
                <BoldIcon className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                onMouseDown={(e) => handleAction(e, () => onFormat('italic'))}
                title="Italic"
            >
                <ItalicIcon className="size-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                onMouseDown={(e) => handleAction(e, () => onFormat('underline'))}
                title="Underline"
            >
                <UnderlineIcon className="size-4" />
            </Button>

            <div className="w-px h-4 bg-border dark:bg-neutral-700 mx-1" />

            <div className="relative flex items-center group">
                <TypeIcon className="absolute left-2 size-3 text-muted-foreground pointer-events-none" />
                <select
                    className="h-8 w-14 pl-7 pr-1 text-xs bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md appearance-none outline-none cursor-pointer text-neutral-700 dark:text-neutral-200 focus:ring-0 border-none"
                    onChange={(e) => onFormat('fontSize', e.target.value)}
                    defaultValue="3"
                    title="Font Size"
                >
                    {[1, 2, 3, 4, 5, 6, 7].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon className="absolute right-1 size-3 text-muted-foreground pointer-events-none opacity-50 group-hover:opacity-100" />
            </div>

            <div className="relative flex items-center justify-center w-8 h-8 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer">
                <PaletteIcon className="absolute size-4 text-neutral-700 dark:text-neutral-200 pointer-events-none" />
                <input
                    type="color"
                    className="opacity-0 w-full h-full cursor-pointer"
                    onChange={(e) => onFormat('foreColor', e.target.value)}
                    title="Text Color"
                />
            </div>
        </div>
    )
}
