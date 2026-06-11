import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { PaginatedData } from '@/types/pagination';

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: PaginatedData<T>;
    columns: ColumnDef<T>[];
    emptyMessage?: string;
}

export function DataTable<T>({ data, columns, emptyMessage = "Aucune donnée trouvée." }: DataTableProps<T>) {
    const hasData = data.data.length > 0;

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground border-b border-border">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} className={`p-4 font-semibold whitespace-nowrap ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {hasData ? (
                            data.data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-muted/50 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className={`p-4 text-card-foreground ${col.className || ''}`}>
                                            {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey]) : null)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Inbox size={32} className="opacity-50" />
                                        <p>{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination Laravel Intégrée */}
            {data.last_page > 1 && (
                <div className="border-t border-border bg-muted/30 p-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Affichage de <span className="font-medium text-foreground">{data.from}</span> à <span className="font-medium text-foreground">{data.to}</span> sur <span className="font-medium text-foreground">{data.total}</span> résultats
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {data.links.map((link, index) => {
                            const isPrevious = link.label.includes('Previous');
                            const isNext = link.label.includes('Next');
                            
                            if (!link.url) {
                                return (
                                    <span key={index} className="px-3 py-1 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                                        {isPrevious ? <ChevronLeft size={16} /> : isNext ? <ChevronRight size={16} /> : link.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                        link.active 
                                            ? 'bg-primary text-primary-foreground font-bold shadow-sm' 
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {isPrevious ? <ChevronLeft size={16} /> : isNext ? <ChevronRight size={16} /> : link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}