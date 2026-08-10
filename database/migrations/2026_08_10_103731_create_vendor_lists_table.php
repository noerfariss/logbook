<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendor_lists', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('pengajuan_id')->unique();

            // Permintaan dari Marketing (manual, tidak ada di tabel pengajuan legacy)
            $table->string('po_msb')->nullable();
            $table->unsignedBigInteger('toko_id')->nullable(); // ggvm.prd_toko.idtoko, no FK (beda koneksi)
            $table->string('toko_manual')->nullable(); // fallback kalau toko belum ada di master
            $table->enum('jenis_kerja', ['survei', 'implementasi', 'survei_implementasi'])->nullable();
            $table->unsignedInteger('suggest_vendor_id')->nullable(); // ggvm.supplier.idsupplier

            // Action dari Purchasing
            $table->unsignedInteger('vendor_id')->nullable(); // ggvm.supplier.idsupplier
            $table->date('tanggal_vendor')->nullable();
            $table->decimal('dp', 15, 2)->nullable();
            $table->decimal('biaya_lain', 15, 2)->nullable();
            $table->decimal('biaya_fee', 15, 2)->nullable();
            $table->boolean('kelengkapan_dokumen')->default(false);
            $table->date('tgl_tf')->nullable();
            $table->boolean('done')->default(false);

            $table->unsignedBigInteger('user_id')->nullable(); // logbook_users.id, no FK (beda koneksi)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_lists');
    }
};
