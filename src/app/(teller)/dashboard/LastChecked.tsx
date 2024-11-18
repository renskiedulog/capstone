import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data for demonstration
const boats = [
  { id: 1, name: "Sea Breeze", lastInspection: "2023-05-15", daysUntilInspection: 5 },
  { id: 2, name: "Wave Rider", lastInspection: "2023-04-30", daysUntilInspection: -10 },
  { id: 3, name: "Coastal Explorer", lastInspection: "2023-06-01", daysUntilInspection: 22 },
  { id: 4, name: "Ocean Voyager", lastInspection: "2023-05-20", daysUntilInspection: 10 },
  { id: 5, name: "Harbor Master", lastInspection: "2023-05-10", daysUntilInspection: 0 },
]

export default function LastChecked() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Boats Approaching Inspection Date</CardTitle>
        <CardDescription>You can view the boat details by clickin on their profile image or name.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boat Name</TableHead>
              <TableHead>Last Inspection</TableHead>
              <TableHead>Days Until Inspection</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boats.map((boat) => (
              <TableRow key={boat.id}>
                <TableCell className="font-medium">{boat.name}</TableCell>
                <TableCell>{boat.lastInspection}</TableCell>
                <TableCell>{boat.daysUntilInspection}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      boat.daysUntilInspection <= 0
                        ? "destructive"
                        : boat.daysUntilInspection <= 7
                        ? "warning"
                        : "default"
                    }
                  >
                    {boat.daysUntilInspection <= 0
                      ? "Overdue"
                      : boat.daysUntilInspection <= 7
                      ? "Due Soon"
                      : "On Track"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}