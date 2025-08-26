<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\PengajuanDeadline;
use App\Models\PengajuanFaktur;
use App\Models\PengajuanLog;
use App\Models\PengajuanPpn;
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
        $status = $request->statusFilter;

        $data = DB::connection('alternative')->table('pengajuan as p')
            ->join('subdivisi as b', 'b.idsubdivisi', '=', 'p.idsubdivisi')
            ->join('divisi as c', 'c.id_divisi', '=', 'b.id_divisi')
            ->leftJoin('klien as d', 'd.id', '=', 'p.idklien')
            ->leftJoin('logbook_pengajuan_deadlines as e', 'e.pengajuan_id', '=', 'p.idpengajuan')
            ->leftJoin('logbook_pengajuan_ppns as f', 'f.pengajuan_id', '=', 'p.idpengajuan')
            ->leftJoin('logbook_pengajuan_fakturs as g', 'g.pengajuan_id', '=', 'p.idpengajuan')
            ->where('p.bayarorder', '=', 'O')
            ->whereBetween('p.tanggal', [$from, $to])
            ->when($status, function ($q) use ($status) {
                $q->where(function ($sub) use ($status) {
                    if (in_array('new', $status)) {
                        $sub->orWhereNotExists(function ($sq) {
                            $sq->select(DB::raw(1))
                                ->from('logbook_pengajuan_logs as l')
                                ->whereColumn('l.pengajuan_id', 'p.idpengajuan');
                        });
                    }
                    if (in_array('done', $status)) {
                        $sub->orWhereExists(function ($sq) {
                            $sq->select(DB::raw(1))
                                ->from('logbook_pengajuan_logs as l')
                                ->whereColumn('l.pengajuan_id', 'p.idpengajuan')
                                ->where('l.status', 1);
                        });
                    }
                    if (in_array('process', $status)) {
                        $sub->orWhere(function ($s) {
                            $s->whereExists(function ($sq) {
                                $sq->select(DB::raw(1))
                                    ->from('logbook_pengajuan_logs as l')
                                    ->whereColumn('l.pengajuan_id', 'p.idpengajuan')
                                    ->where('l.status', 0);
                            })
                                ->whereNotExists(function ($sq) {
                                    $sq->select(DB::raw(1))
                                        ->from('logbook_pengajuan_logs as l')
                                        ->whereColumn('l.pengajuan_id', 'p.idpengajuan')
                                        ->where('l.status', 1);
                                });
                        });
                    }
                });
            })
            ->select(
                'p.idpengajuan',
                'p.nopengajuan',
                'p.tanggal',
                'p.time_input',
                'p.user_input',
                'p.nominal',
                'p.keterangan',
                'b.subdivisi',
                'c.nama as divisi',
                'd.nama as klien',
                'd.alias as klien_alias',
                'd.kota as klien_kota',
                'e.deadline',
                'f.status as ppn',
                'g.status as faktur',
                DB::raw("
                    CASE
                        WHEN NOT EXISTS (
                            SELECT 1 FROM logbook_pengajuan_logs l
                            WHERE l.pengajuan_id = p.idpengajuan
                        ) THEN 'new'
                        WHEN EXISTS (
                            SELECT 1 FROM logbook_pengajuan_logs l
                            WHERE l.pengajuan_id = p.idpengajuan
                            AND l.status = 1
                        ) THEN 'done'
                        ELSE 'process'
                    END as status_pengajuan
                ")
            )
            ->orderBy('p.tanggal', 'desc')
            ->orderBy('p.idpengajuan', 'desc')
            ->paginate(10);

        return response()->json($data);
    }

    public function pengajuanSingle($pengajuanID)
    {
        $data = DB::connection('alternative')->table('pengajuan as p')
            ->join('subdivisi as b', 'b.idsubdivisi', '=', 'p.idsubdivisi')
            ->join('divisi as c', 'c.id_divisi', '=', 'b.id_divisi')
            ->leftJoin('klien as d', 'd.id', '=', 'p.idklien')
            ->leftJoin('logbook_pengajuan_deadlines as e', 'e.pengajuan_id', '=', 'p.idpengajuan')
            ->leftJoin('logbook_pengajuan_ppns as f', 'f.pengajuan_id', '=', 'p.idpengajuan')
            ->leftJoin('logbook_pengajuan_fakturs as g', 'g.pengajuan_id', '=', 'p.idpengajuan')
            ->where('p.bayarorder', '=', 'O')
            ->where('p.idpengajuan', $pengajuanID)
            ->select(
                'p.idpengajuan',
                'p.nopengajuan',
                'p.tanggal',
                'p.time_input',
                'p.user_input',
                'p.nominal',
                'p.keterangan',
                'b.subdivisi',
                'c.nama as divisi',
                'd.nama as klien',
                'd.alias as klien_alias',
                'd.kota as klien_kota',
                'e.deadline',
                'f.status as ppn',
                'g.status as faktur',
                DB::raw("
                    CASE
                        WHEN NOT EXISTS (
                            SELECT 1 FROM logbook_pengajuan_logs l
                            WHERE l.pengajuan_id = p.idpengajuan
                        ) THEN 'new'
                        WHEN EXISTS (
                            SELECT 1 FROM logbook_pengajuan_logs l
                            WHERE l.pengajuan_id = p.idpengajuan
                            AND l.status = 1
                        ) THEN 'done'
                        ELSE 'process'
                    END as status_pengajuan
                ")
            )
            ->first();

        return $data;
    }

    public function getLogs(Request $request)
    {
        $data = PengajuanLog::with('user:id,name')->where('pengajuan_id', $request->pengajuan_id)->get();

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

            $data = $this->pengajuanSingle($request->pengajuan_id);

            return redirect()->back()->with([
                'message' => 'Log berhasil ditambahkan',
                'item' => $data
            ]);
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

    public function updatePpn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        try {
            $pengajuan = PengajuanPpn::updateOrCreate(
                [
                    'pengajuan_id' => $request->pengajuan_id,
                ],
                [
                    'status' => $request->status
                ]
            );

            return redirect()->back()->with('item', $pengajuan);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }

    public function updateFaktur(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required'],
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator->errors());
        }

        try {
            $pengajuan = PengajuanFaktur::updateOrCreate(
                [
                    'pengajuan_id' => $request->pengajuan_id,
                ],
                [
                    'status' => $request->status
                ]
            );

            return redirect()->back()->with('item', $pengajuan);
        } catch (\Throwable $th) {
            info($th->getMessage());
            return redirect()->back()->withErrors('Terjadi kesalahan');
        }
    }
}
