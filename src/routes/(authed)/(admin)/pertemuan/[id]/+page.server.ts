import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    try {
        const dataAbsensi = await db.query.absensi_santri.findMany({
            where: eq(table.absensi_santri.pertemuanId, id),
            with: { santri: { columns: {}, with: { user: { columns: { name: true } } } } }
        });
        const dataPertemuan = await db.query.pertemuan.findFirst({
            where: eq(table.pertemuan.id, id),
            with: {
                jadwal: {
                    columns: { hari: true, jamMulai: true, jamSelesai: true },
                    with: {
                        kitab: { columns: { namaKitab: true } },
                        kelas: { columns: { namaKelas: true } }
                    }
                }
            }
        });
        return { dataPertemuan, dataAbsensi };
    } catch (err) {
        console.error(err);
        error(500, 'Error Saat memuat data halaman pertemuan');
    }
};
