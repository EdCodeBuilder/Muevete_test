<?php

namespace App\Modules\CitizenPortal\src\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use OwenIt\Auditing\Contracts\Auditable;

class AttendanceActivity extends Model implements Auditable
{
    use SoftDeletes, \OwenIt\Auditing\Auditable;

    /**
     * The connection name for the model.
     *
     * @var string|null
     */
    protected $connection = "mysql_citizen_portal";

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = "attendance_activities";

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = "id";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fecha',
        'institucion',
        'actividad',
        'contenido',
        'hora_inicio',
        'hora_fin',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [ 'actividad' ];

    /*
    * ---------------------------------------------------------
    * Data Change Auditor
    * ---------------------------------------------------------
    */

    /**
     * Attributes to include in the Audit.
     *
     * @var array
     */
    protected $auditInclude = [
        'fecha',
        'institucion',
        'actividad',
        'contenido',
        'hora_inicio',
        'hora_fin',
    ];

    /**
     * Generating tags for each model audited.
     *
     * @return array
     */
    public function generateTags(): array
    {
        return ['citizen_portal_attendanceActivity'];
    }

    /*
     * ---------------------------------------------------------
     * Accessors and Mutator
     * ---------------------------------------------------------
     */

    /**
     * @return mixed|string|null
     */
    public function getNameAttribute()
    {
        return toUpper( $this->actividad );
    }

    /**
     * @param array $data
     * @return array
     */
    public function fillModel(array $data)
    {
        return [
            'fecha' => Arr::get($data, 'fecha'),
            'institucion' => Arr::get($data, 'institucion'),
            'actividad' => Arr::get($data, 'actividad'),
            'contenido' => Arr::get($data, 'contenido'),
            'hora_inicio' => Arr::get($data, 'hora_inicio'),
            'hora_fin' => Arr::get($data, 'hora_fin'),
        ];
    }

    /*
     * ---------------------------------------------------------
     * Eloquent Relationship
     * ---------------------------------------------------------
     */

    /**
     * @return BelongsTo
     */
    public function scenarios()
    {
        return $this->belongsTo(Stage::class, 'institucion', 'id');
    }

     /**
     * @return BelongsTo
     */
    public function profiles()
    {
        return $this->belongsTo(Program::class, 'program_id', 'id');
    }

    /**
     * @return BelongsTo
     */
    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id', 'id');
    }

    /**
     * @return BelongsTo
     */
    public function schedules()
    {
        return $this->belongsTo(Schedule::class, 'id', 'activity_id');
    }

    /**
     * @param $column
     * @return string
     */
    public function getSortableColumn($column)
    {
        switch ($column) {
            case 'actividad':
                return 'actividad';
            case 'created_at':
            case 'updated_at':
            case 'deleted_at':
                return $column;
            default:
                return in_array($column, $this->fillable)
                    ? $column
                    : $this->primaryKey;
        }
    }
}
