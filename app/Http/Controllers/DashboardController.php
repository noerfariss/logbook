<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\PengajuanDeadline;
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
        $dates = $request->dates;
        $from = $dates['from'];
        $to = $dates['to'];
        $search = $request->search;

        $data = Pengajuan::query()
            ->with([
                'logs',
                'logs.user:id,name',
                'ppn',
                'faktur',
                'deadline'
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
            ->whereBetween('pengajuan.tanggal', [$from, $to])
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
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }

    public function updateDeadline(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'deadline' => ['required', 'date'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        try {
            $pengajuan = PengajuanDeadline::updateOrCreate(
                [
                    'pengajuan_id' => $request->pengajuan_id,
                ],
                [
                    'deadline' => $request->deadline
                ]
            );

            return redirect()->back()->with('item', $pengajuan);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }
}
