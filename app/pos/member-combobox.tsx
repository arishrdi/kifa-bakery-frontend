// components/CustomerComboBox.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Member } from "@/types/member";
import { getAllMembers } from "@/services/member-service";

// Type untuk data member
// interface Customer {
//   id: string;
//   name: string;
//   email?: string;
//   phone?: string;
// }

interface MemberComboBoxProps {
  onMemberSelect: (member: Member) => void;
}

export function MemberComboBox({ onMemberSelect }: MemberComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedCustomer] = useState<Member | null>(null);
  const [query, setQuery] = useState("");

  const {data: members} = getAllMembers()

  if (!members) {
    return null
  }

  const filteredMembers = members.data.filter((member) =>
    member.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (member: Member) => {
    // setSelectedCustomer(member);
    // setOpen(false);
    // setQuery("");
    // onMemberSelect(member); 

    if (selectedMember?.id === member.id) {
      setSelectedCustomer(undefined);
      onMemberSelect(null); // Kirim nilai null ke parent
    } else {
      setSelectedCustomer(member);
      onMemberSelect(member);
    }
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedMember ? (
            <span className="truncate">{selectedMember.name}</span>
          ) : (
            "Pilih member..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari member..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>Tidak ditemukan member.</CommandEmpty>
            <CommandGroup>
              {filteredMembers.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.name}
                  onSelect={() => handleSelect(member)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMember?.id === member.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{member.name}</span>
                    {member.member_code && (
                      <span className="text-xs text-gray-500">
                        {member.member_code}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}