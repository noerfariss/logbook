<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\PengajuanLog;
use App\Models\PurchaseOrder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia()->render('Dashboard');
    }

    public function pengajuan(Request $request)
    {
        // $data = PurchaseOrder::query()
        //     ->join('pengajuan as b', 'b.idpengajuan', '=', 'purchaseorder.idpengajuan')
        //     ->join('jenis_pengajuan as c', 'c.idjnspengajuan', '=', 'b.idjnspengajuan')
        //     ->join('supplier as d', 'd.idsupplier', '=', 'purchaseorder.idsupplier')
        //     ->join('subdivisi as e', 'e.idsubdivisi', '=', 'b.idsubdivisi')
        //     ->join('divisi as f', 'f.id_divisi', '=', 'e.id_divisi')
        //     ->orderBy('purchaseorder.idpo', 'desc')
        //     ->select(
        //         'purchaseorder.nopo',
        //         'purchaseorder.idsupplier',
        //         'purchaseorder.keterangan',
        //         'purchaseorder.tanggal',
        //         'purchaseorder.nominal',
        //         'purchaseorder.grandtotal',
        //         'purchaseorder.time_closing',
        //         'b.nopengajuan',
        //         'b.tanggal as tanggal_pengajuan',
        //         'b.idjnspengajuan',
        //         'b.idstatus_pe',
        //         'b.statustagih',
        //         'b.sumberdana',
        //         'b.time_input as input_pengajuan',
        //         'b.user_input as user_pengajuan',
        //         'c.pengajuan as jenis_pengajuan',
        //         'd.supplier',
        //         'd.alamat as supplier_alamat',
        //         'd.kota as supplier_kota',
        //         'd.contactperson1 as supplier_cp1',
        //         'd.contactperson2 as supplier_cp2',
        //         'd.email as supplier_email',
        //         'f.nama as divisi',
        //         'f.keterangan as divisi_keterangan',
        //         'e.subdivisi'
        //     )
        //     ->where('time_input', '>=', '2025-01-01:23:59:59')
        //     ->paginate(10);

        // $data->getCollection()->transform(function ($item) {
        //     $item->input_pengajuan = Carbon::parse($item->input_pengajuan)->timezone('Asia/Jakarta')->isoFormat('dddd, DD MMM YYYY HH:mm');
        //     return $item;
        // });

        $search = $request->search;

        $data = Pengajuan::query()
            ->with([
                'logs',
                'logs.user:id,name'
            ])
            ->join('subdivisi as b', 'b.idsubdivisi', '=', 'pengajuan.idsubdivisi')
            ->join('divisi as c', 'c.id_divisi', '=', 'b.id_divisi')
            ->leftJoin('klien as d', 'd.id', '=', 'pengajuan.idklien')
            ->when($search, function ($e, $search) {
                $e->where(function ($e) use ($search) {
                    $e->where('pengajuan.nopengajuan', 'like', "%{$search}%")->orWhere('pengajuan.keterangan', 'like', "%{$search}%");
                });
            })
            ->where('pengajuan.bayarorder', '=', 'O')
            ->where('pengajuan.tanggal', '>=', '2025-06-01')
            ->select(
                // 'pengajuan.*',
                'pengajuan.idpengajuan',
                'pengajuan.nopengajuan',
                'pengajuan.tanggal',
                'pengajuan.time_input',
                'pengajuan.user_input',
                'pengajuan.nominal',
                'pengajuan.keterangan',
                'b.subdivisi',
                'c.nama as divisi',
                'd.nama as klien',
                'd.alias as klien_alias',
                'd.kota as klien_kota'
            )
            ->orderBy('pengajuan.tanggal', 'desc')
            ->orderBy('pengajuan.idpengajuan', 'desc')
            ->paginate(10);

        return response()->json($data);
    }

    public function updateLog(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keterangan' => ['required', 'min:3'],
            'status' => ['required']
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        try {
            PengajuanLog::create([
                'pengajuan_id' => $request->pengajuan_id,
                'keterangan' => $request->keterangan,
                'status' => $request->status,
                'user_id' => Auth::id()
            ]);

            return redirect()->back()->with('message', 'Log berhasil ditambahkan');
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }
}
