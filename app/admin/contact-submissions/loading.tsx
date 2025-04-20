import { Skeleton } from "@/components/ui/skeleton"

export default function ContactSubmissionsLoading() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Skeleton className="h-10 w-64 mb-6" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-4 py-3 text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-40" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">
                  <Skeleton className="h-6 w-16 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
          y>
        </table>
      </div>
    </div>
  )
}
