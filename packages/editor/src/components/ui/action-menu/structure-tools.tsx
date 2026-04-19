'use client'

import NextImage from 'next/image'
import { assetPath } from '../../../lib/asset-path'
import { useContextualTools } from '../../../hooks/use-contextual-tools'

import { cn } from '../../../lib/utils'
import useEditor, {
  type CatalogCategory,
  type StructureTool,
  type Tool,
} from '../../../store/use-editor'
import { ActionButton } from './action-button'

export type ToolConfig = {
  id: StructureTool
  iconSrc: string
  label: string
  catalogCategory?: CatalogCategory
}

export const tools: ToolConfig[] = [
  { id: 'wall', iconSrc: assetPath('/icons/wall.png'), label: 'Wall' },
  // { id: 'room', iconSrc: '/icons/room.png', label: 'Room' },
  // { id: 'custom-room', iconSrc: '/icons/custom-room.png', label: 'Custom Room' },
  { id: 'slab', iconSrc: assetPath('/icons/floor.png'), label: 'Slab' },
  { id: 'ceiling', iconSrc: assetPath('/icons/ceiling.png'), label: 'Ceiling' },
  { id: 'roof', iconSrc: assetPath('/icons/roof.png'), label: 'Gable Roof' },
  { id: 'stair', iconSrc: assetPath('/icons/stairs.png'), label: 'Stairs' },
  { id: 'door', iconSrc: assetPath('/icons/door.png'), label: 'Door' },
  { id: 'window', iconSrc: assetPath('/icons/window.png'), label: 'Window' },
  { id: 'fence', iconSrc: assetPath('/icons/fence.png'), label: 'Fence' },
  { id: 'zone', iconSrc: assetPath('/icons/zone.png'), label: 'Zone' },
]

export function StructureTools() {
  const activeTool = useEditor((state) => state.tool)
  const catalogCategory = useEditor((state) => state.catalogCategory)
  const structureLayer = useEditor((state) => state.structureLayer)
  const setTool = useEditor((state) => state.setTool)
  const setCatalogCategory = useEditor((state) => state.setCatalogCategory)

  const contextualTools = useContextualTools()

  // Filter tools based on structureLayer
  const visibleTools =
    structureLayer === 'zones'
      ? tools.filter((t) => t.id === 'zone')
      : tools.filter((t) => t.id !== 'zone')

  const hasActiveTool = visibleTools.some(
    (t) =>
      activeTool === t.id && (t.catalogCategory ? catalogCategory === t.catalogCategory : true),
  )

  return (
    <div className="flex items-center gap-1.5 px-1">
      {visibleTools.map((tool, index) => {
        // For item tools with catalog category, check both tool and category match
        const isActive =
          activeTool === tool.id &&
          (tool.catalogCategory ? catalogCategory === tool.catalogCategory : true)

        const isContextual = contextualTools.includes(tool.id)

        return (
          <ActionButton
            className={cn(
              'rounded-lg duration-300',
              isActive
                ? 'z-10 scale-110 bg-black/40 hover:bg-black/40'
                : 'scale-95 bg-transparent opacity-60 grayscale hover:bg-black/20 hover:opacity-100 hover:grayscale-0',
            )}
            key={`${tool.id}-${tool.catalogCategory ?? index}`}
            label={tool.label}
            onClick={() => {
              if (!isActive) {
                setTool(tool.id)
                setCatalogCategory(tool.catalogCategory ?? null)

                // Automatically switch to build mode if we select a tool
                if (useEditor.getState().mode !== 'build') {
                  useEditor.getState().setMode('build')
                }
              }
            }}
            size="icon"
            variant="ghost"
          >
            <NextImage
              alt={tool.label}
              className="size-full object-contain"
              height={28}
              src={tool.iconSrc}
              width={28}
            />
          </ActionButton>
        )
      })}
    </div>
  )
}
