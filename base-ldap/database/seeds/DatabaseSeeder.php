<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        // factory(App\Modules\CitizenPortal\src\Models\UsersAssistance::class,50)->create();
        factory(App\Modules\CitizenPortal\src\Models\AttendanceActivity::class,30)->create();
    }
}
