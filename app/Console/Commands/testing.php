<?php

namespace App\Console\Commands;

use App\Models\Pengajuan;
use App\Models\PengajuanLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class testing extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:testing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $data = DB::table('pengajuan')->first();
        // $data = Pengajuan::query()->first()->toArray();
        $data = PengajuanLog::query()->first()->toArray();
        dd($data);
    }
}
