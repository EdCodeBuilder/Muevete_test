<?php

namespace App\Modules\Passport\src\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class PassportView extends Model
{
    const SUPER_CADE_INTERNET = 8;

    /**
     * The connection name for the model.
     *
     * @var string|null
     */
    protected $connection = 'mysql_passport';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nuevos_pasaportes_view';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user',
        'full_name',
        'first_name',
        'middle_name',
        'first_last_name',
        'second_last_name',
        'card_name',
        'document',
        'document_type',
        'document_type_name',
        'birthday',
        'gender',
        'gender_name',
        'country',
        'country_name',
        'state_id',
        'state',
        'city',
        'city_name',
        'location',
        'location_name',
        'address',
        'stratum',
        'mobile',
        'phone',
        'email',
        'retired',
        'hobbies',
        'hobbies_name',
        'eps',
        'eps_name',
        'supercade',
        'supercade_name',
        'observations',
        'file',
        'question_1',
        'question_2',
        'question_3',
        'question_4',
        'downloads',
        'created_at',
        'user_cade',
        'user_cade_id',
        'user_cade_name',
        'user_cade_document',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['birthday', 'created_at'];

    /*
     * ---------------------------------------------------------
     * Accessors and Mutators
     * ---------------------------------------------------------
     */

    public function getFileAttribute($value)
    {
        if (!is_null($value) && $value != '' && Storage::disk('local')->exists("passport-files/$value")) {
            return url()->route('passport.files', ['file' => $value]);
        }
        return null;
    }

    /*
     * ---------------------------------------------------------
     * Eloquent Relationships
     * ---------------------------------------------------------
     */

    public function renewals()
    {
        return $this->hasMany(RenewalView::class, 'passport_id', 'id');
    }
}
