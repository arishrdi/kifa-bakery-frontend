"use client"

import { useOutlet } from "@/contexts/outlet-context"
import { Check, ChevronsUpDown, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

export function OutletSwitcher() {
  const { outlets, currentOutlet, setCurrentOutlet, isLoading } = useOutlet()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-start">
        <Store className="mr-2 h-4 w-4" />
        <span className="truncate">Loading outlets...</span>
      </Button>
    )
  }

  if (!currentOutlet) {
    return (
      <Button variant="outline" className="w-full justify-start">
        <Store className="mr-2 h-4 w-4" />
        <span className="truncate">No outlets available</span>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center truncate">
            <Store className="mr-2 h-4 w-4" />
            <span className="truncate">{currentOutlet.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cari outlet..." />
          <CommandList>
            <CommandEmpty>Outlet tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {outlets.map((outlet) => (
                <CommandItem
                  key={outlet.id}
                  value={outlet.name}
                  onSelect={() => {
                    setCurrentOutlet(outlet)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", currentOutlet.id === outlet.id ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{outlet.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

