import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const shiftData = [
  {
    id: 1,
    name: "Pagi",
    time: "06:00 - 14:00",
    staff: "Ahmad, Budi",
    transactions: 45,
    sales: 2250000,
  },
  {
    id: 2,
    name: "Siang",
    time: "14:00 - 22:00",
    staff: "Cindy, Dodi",
    transactions: 62,
    sales: 3100000,
  },
  {
    id: 3,
    name: "Malam",
    time: "22:00 - 06:00",
    staff: "Eko, Fani",
    transactions: 21,
    sales: 1050000,
  },
]

export function ShiftOverview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shift</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead className="text-right">Transaksi</TableHead>
          <TableHead className="text-right">Total Penjualan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shiftData.map((shift) => (
          <TableRow key={shift.id}>
            <TableCell className="font-medium">{shift.name}</TableCell>
            <TableCell>{shift.time}</TableCell>
            <TableCell>{shift.staff}</TableCell>
            <TableCell className="text-right">{shift.transactions}</TableCell>
            <TableCell className="text-right">Rp {shift.sales.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

