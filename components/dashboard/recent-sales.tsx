import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Transaksi #1234</p>
          <p className="text-sm text-muted-foreground">14:32 - Shift Siang</p>
        </div>
        <div className="ml-auto font-medium">+Rp 250.000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Transaksi #1233</p>
          <p className="text-sm text-muted-foreground">14:15 - Shift Siang</p>
        </div>
        <div className="ml-auto font-medium">+Rp 175.000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>TP</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Transaksi #1232</p>
          <p className="text-sm text-muted-foreground">13:45 - Shift Siang</p>
        </div>
        <div className="ml-auto font-medium">+Rp 320.000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Transaksi #1231</p>
          <p className="text-sm text-muted-foreground">13:22 - Shift Siang</p>
        </div>
        <div className="ml-auto font-medium">+Rp 195.000</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Transaksi #1230</p>
          <p className="text-sm text-muted-foreground">12:48 - Shift Siang</p>
        </div>
        <div className="ml-auto font-medium">+Rp 280.000</div>
      </div>
    </div>
  )
}

