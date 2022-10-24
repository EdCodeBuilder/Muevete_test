<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Modules\CitizenPortal\src\Models\AttendanceActivity;
use Faker\Generator as Faker;

$factory->define(AttendanceActivity::class, function (Faker $faker) {
    return [
        'id'            =>rand(23, 26),
        'fecha'         =>$faker->date($format = 'Y-m-d'),
        // 'date'       =>null,
        'institucion'   =>$faker->word(),
        'actividad'     =>$faker->sentence(),
        'contenido'     =>$faker->paragraph(),
        'hora_inicio'   =>$faker->dateTime(),
        'hora_fin'      =>$faker->dateTime()
        /*
        'start_time'    =>null,
        'end_time'      =>null,
        'deleted_at'    =>null
        */
    ];
});
