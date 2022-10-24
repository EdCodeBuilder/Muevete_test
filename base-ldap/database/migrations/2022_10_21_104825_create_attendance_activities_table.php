<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttendanceActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mysql_citizen_portal')->create('attendance_activities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('fecha')->nullable();
            // $table->bigInteger('institucion');
            $table->string('institucion');
            // $table->bigInteger('actividad');
            $table->string('actividad');
            $table->string('contenido')->nullable();
            $table->time('hora_inicio')->nullable();
            $table->time('hora_fin')->nullable();
            $table->timestamps();
            $table->timestamp('delete_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attendance_activities');
    }
}
