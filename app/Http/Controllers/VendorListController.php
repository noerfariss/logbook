<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Toko;
use App\Models\VendorList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VendorListController extends Controller
{
    public function index()
    {
        return inertia()->render('VendorList/Index');
    }

    /**
     * Pengajuan yang punya barang Implementasi (320) dan/atau Survei (321) di
     * detail_pengajuan, dalam rentang tanggal tertentu. Ini rule yang menggantikan
     * "Sur / S + I / Im" di sheet fisik, divalidasi cocok dengan 13/13 baris sheet Juni 2026.
     */
    public function ajax(Request $request)
    {
        $dates = $request->dates;
        $from = $dates['from'];
        $to = $dates['to'];
        $search = $request->search;
        $doneFilter = $request->doneFilter;

        $data = DB::connection('alternative')->table('pengajuan as p')
            ->join('subdivisi as sd', 'sd.idsubdivisi', '=', 'p.idsubdivisi')
            ->join('divisi as dv', 'dv.id_divisi', '=', 'sd.id_divisi')
            ->leftJoin('klien as k', 'k.id', '=', 'p.idklien')
            ->leftJoin('kota as kt', 'kt.idkota', '=', 'p.idkota')
            ->leftJoin('logbook_pengajuan_deadlines as dl', 'dl.pengajuan_id', '=', 'p.idpengajuan')
            ->leftJoin('logbook_vendor_lists as vl', 'vl.pengajuan_id', '=', 'p.idpengajuan')
            ->leftJoin('supplier as sv', 'sv.idsupplier', '=', 'vl.suggest_vendor_id')
            ->leftJoin('supplier as vd', 'vd.idsupplier', '=', 'vl.vendor_id')
            ->leftJoin('prd_toko as tk', 'tk.idtoko', '=', 'vl.toko_id')
            ->whereNull('p.time_delete')
            ->whereBetween('p.tanggal', [$from, $to])
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('detail_pengajuan as dp')
                    ->whereColumn('dp.idpengajuan', 'p.idpengajuan')
                    ->whereIn('dp.idbarang', [320, 321]);
            })
            ->when($search, function ($e) use ($search) {
                $e->where(function ($e) use ($search) {
                    $e->where('p.nopengajuan', 'like', "%{$search}%")
                        ->orWhere('p.keterangan', 'like', "%{$search}%");
                });
            })
            ->when($doneFilter === 'done', fn ($q) => $q->where('vl.done', 1))
            ->when($doneFilter === 'pending', fn ($q) => $q->where(function ($q) {
                $q->where('vl.done', 0)->orWhereNull('vl.done');
            }))
            ->select(
                'p.idpengajuan',
                'p.nopengajuan',
                'p.tanggal',
                'p.keterangan',
                'sd.subdivisi',
                'dv.nama as divisi',
                'k.nama as klien',
                'kt.kota as area',
                'dl.deadline',
                DB::raw('EXISTS (SELECT 1 FROM detail_pengajuan dp WHERE dp.idpengajuan = p.idpengajuan AND dp.idbarang = 321) as has_survei'),
                DB::raw('EXISTS (SELECT 1 FROM detail_pengajuan dp WHERE dp.idpengajuan = p.idpengajuan AND dp.idbarang = 320) as has_implementasi'),
                'vl.id as vendor_list_id',
                'vl.po_msb',
                'vl.toko_id',
                'vl.toko_manual',
                'vl.jenis_kerja',
                'vl.suggest_vendor_id',
                'sv.supplier as suggest_vendor_name',
                'vl.vendor_id',
                'vd.supplier as vendor_name',
                'vl.tanggal_vendor',
                'vl.dp',
                'vl.biaya_lain',
                'vl.biaya_fee',
                'vl.kelengkapan_dokumen',
                'vl.tgl_tf',
                'vl.done',
                'tk.toko as toko_name'
            )
            ->orderBy('p.tanggal', 'desc')
            ->orderBy('p.idpengajuan', 'desc')
            ->paginate(15)
            ->withQueryString();

        return response()->json($data);
    }

    public function tokoOptions(Request $request)
    {
        $search = $request->search;

        $data = Toko::query()
            ->when($search, fn ($q) => $q->where('toko', 'like', "%{$search}%"))
            ->orderBy('toko')
            ->limit(30)
            ->get(['idtoko as id', 'toko as label']);

        return response()->json(['data' => $data]);
    }

    public function vendorOptions(Request $request)
    {
        $search = $request->search;

        $data = Supplier::query()
            ->where('status', '1')
            ->when($search, fn ($q) => $q->where('supplier', 'like', "%{$search}%"))
            ->orderBy('supplier')
            ->limit(30)
            ->get(['idsupplier as id', 'supplier as label']);

        return response()->json(['data' => $data]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pengajuan_id' => ['required', 'integer'],
            'po_msb' => ['nullable', 'string', 'max:255'],
            'toko_id' => ['nullable', 'integer'],
            'toko_manual' => ['nullable', 'string', 'max:255'],
            'jenis_kerja' => ['nullable', 'in:survei,implementasi,survei_implementasi'],
            'suggest_vendor_id' => ['nullable', 'integer'],
            'vendor_id' => ['nullable', 'integer'],
            'tanggal_vendor' => ['nullable', 'date'],
            'dp' => ['nullable', 'numeric'],
            'biaya_lain' => ['nullable', 'numeric'],
            'biaya_fee' => ['nullable', 'numeric'],
            'kelengkapan_dokumen' => ['boolean'],
            'tgl_tf' => ['nullable', 'date'],
            'done' => ['boolean'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        try {
            $vendorList = VendorList::updateOrCreate(
                ['pengajuan_id' => $request->pengajuan_id],
                [
                    'po_msb' => $request->po_msb,
                    'toko_id' => $request->toko_id,
                    'toko_manual' => $request->toko_manual,
                    'jenis_kerja' => $request->jenis_kerja,
                    'suggest_vendor_id' => $request->suggest_vendor_id,
                    'vendor_id' => $request->vendor_id,
                    'tanggal_vendor' => $request->tanggal_vendor,
                    'dp' => $request->dp,
                    'biaya_lain' => $request->biaya_lain,
                    'biaya_fee' => $request->biaya_fee,
                    'kelengkapan_dokumen' => $request->boolean('kelengkapan_dokumen'),
                    'tgl_tf' => $request->tgl_tf,
                    'done' => $request->boolean('done'),
                    'user_id' => Auth::id(),
                ]
            );

            return redirect()->back()->with('message', 'Data berhasil disimpan')->with('item', $vendorList);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }
}
