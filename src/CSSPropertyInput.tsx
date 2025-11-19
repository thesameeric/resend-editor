"use client"

import * as React from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip"
import { UnfoldHorizontalIcon } from "lucide-react"

type CSSUnit = 'px' | '%' | 'em' | 'rem' | 'auto'

interface CSSPropertyInputProps {
    label: string
    value: string
    onChange: (value: string) => void
    allowIndividual?: boolean
    sides?: ['top', 'right', 'bottom', 'left'] | ['top-left', 'top-right', 'bottom-right', 'bottom-left']
}

export function CSSPropertyInput({ label, value, onChange, allowIndividual = false, sides }: CSSPropertyInputProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [unit, setUnit] = React.useState<CSSUnit>('px')

    // Parse the value to extract number and unit
    const parseValue = (val: string): { num: string, unit: CSSUnit } => {
        if (!val || val === 'auto') return { num: '', unit: 'auto' }
        const match = val.match(/^([\d.]+)(.*)$/)
        if (match) {
            return { num: match[1], unit: (match[2] || 'px') as CSSUnit }
        }
        return { num: '', unit: 'px' }
    }

    // Parse individual values for expanded mode
    const parseIndividualValues = (val: string): Record<string, string> => {
        if (!val) return {}
        const parts = val.split(' ').filter(Boolean)
        if (!sides) return {}

        if (parts.length === 1) {
            return sides.reduce((acc, side) => ({ ...acc, [side]: parts[0] }), {})
        } else if (parts.length === 2) {
            // vertical horizontal
            return {
                [sides[0]]: parts[0],
                [sides[1]]: parts[1],
                [sides[2]]: parts[0],
                [sides[3]]: parts[1],
            }
        } else if (parts.length === 4) {
            return {
                [sides[0]]: parts[0],
                [sides[1]]: parts[1],
                [sides[2]]: parts[2],
                [sides[3]]: parts[3],
            }
        }
        return {}
    }

    const [individualValues, setIndividualValues] = React.useState<Record<string, string>>(() =>
        parseIndividualValues(value)
    )

    const handleExpand = React.useCallback(() => {
        setIsExpanded(true)
        setIndividualValues(parseIndividualValues(value))
    }, [value])

    React.useEffect(() => {
        const parsed = parseValue(value)
        setUnit(parsed.unit)
    }, [value])

    const handleValueChange = (newValue: string) => {
        if (unit === 'auto') {
            onChange('auto')
        } else {
            onChange(newValue ? `${newValue}${unit}` : '')
        }
    }

    const handleUnitChange = (newUnit: CSSUnit) => {
        setUnit(newUnit)
        if (newUnit === 'auto') {
            onChange('auto')
        } else {
            const parsed = parseValue(value)
            if (parsed.num) {
                onChange(`${parsed.num}${newUnit}`)
            }
        }
    }

    const handleIndividualChange = (side: string, val: string) => {
        const newValues = { ...individualValues, [side]: val }
        setIndividualValues(newValues)

        if (!sides) return

        const values = sides.map(s => newValues[s] || '0px')
        // Check if all values are the same
        if (values.every(v => v === values[0])) {
            onChange(values[0])
        } else {
            onChange(values.join(' '))
        }
    }

    const currentValue = parseValue(value)

    if (isExpanded && allowIndividual && sides) {
        return (
            <TooltipProvider>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">{label}</Label>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsExpanded(false)}
                                    className="h-6 px-2 cursor-pointer"
                                >
                                    <UnfoldHorizontalIcon className="size-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Collapse to single value</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {sides.map(side => {
                            const sideValue = parseValue(individualValues[side] || '0px')
                            return (
                                <div key={side} className="flex gap-1">
                                    <Input
                                        type="number"
                                        value={sideValue.num}
                                        onChange={(e) => handleIndividualChange(side, e.target.value ? `${e.target.value}${sideValue.unit}` : '')}
                                        placeholder="0"
                                        className="h-8 text-xs"
                                    />
                                    <select
                                        value={sideValue.unit}
                                        onChange={(e) => handleIndividualChange(side, sideValue.num ? `${sideValue.num}${e.target.value}` : '')}
                                        className="h-8 w-16 rounded-md border border-input bg-background px-2 text-xs"
                                    >
                                        <option value="px">px</option>
                                        <option value="%">%</option>
                                        <option value="em">em</option>
                                        <option value="rem">rem</option>
                                    </select>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1 text-[10px] text-muted-foreground">
                        {sides.map(side => (
                            <div key={side} className="text-center capitalize">{side.replace('-', ' ')}</div>
                        ))}
                    </div>
                </div>
            </TooltipProvider>
        )
    }

    return (
        <TooltipProvider>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">{label}</Label>
                    {allowIndividual && sides && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleExpand}
                                    className="h-6 px-2 cursor-pointer"
                                >
                                    <UnfoldHorizontalIcon className="size-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Set individual values</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                <div className="flex gap-1">
                    <Input
                        type={unit === 'auto' ? 'text' : 'number'}
                        value={unit === 'auto' ? 'auto' : currentValue.num}
                        onChange={(e) => handleValueChange(e.target.value)}
                        placeholder={unit === 'auto' ? 'auto' : '0'}
                        disabled={unit === 'auto'}
                        className="flex-1"
                    />
                    <select
                        value={unit}
                        onChange={(e) => handleUnitChange(e.target.value as CSSUnit)}
                        className="w-20 rounded-md border border-input bg-background px-2 text-sm"
                    >
                        <option value="px">px</option>
                        <option value="%">%</option>
                        <option value="em">em</option>
                        <option value="rem">rem</option>
                        <option value="auto">auto</option>
                    </select>
                </div>
            </div>
        </TooltipProvider>
    )
}
