<?php

namespace App\Modules\CitizenPortal\src\Resources;


use App\Modules\CitizenPortal\src\Constants\Roles;
use App\Modules\CitizenPortal\src\Models\AttendanceActivity;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'            =>  isset($this->id) ? (int) $this->id : null,
            'fecha'         => isset($this->fecha) ? $this->fecha->format('Y-m-d') : null,
            'institucion'   => isset($this->institucion) ? (string) $this->institucion : null,
            'actividad'     => isset($this->actividad) ? (string) $this->actividad : null,
            'contenido'     => isset($this->contenido) ? (string) $this->contenido : null,
            'created_at'    =>  isset($this->created_at) ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at'    =>  isset($this->updated_at) ? $this->updated_at->format('Y-m-d H:i:s') : null,
            'audits'        => $this->when(
                auth('api')->check() &&
                auth('api')->user()->can(Roles::can(AttendanceActivity::class,'history'), AttendanceActivity::class),
                AuditResource::collection($this->audits()->latest()->get()),
                []
            )
        ];
    }
    public static function headers()
    {
        return [
            [
                'align' => "right",
                'text' => "#",
                'value'  =>  "id",
                'sortable' => false
            ],
            [
                'align' => "left",
                'text' => Str::ucfirst(__('citizen.validations.fecha')),
                'value'  =>  "fecha",
                'sortable' => false
            ],
            [
                'align' => "left",
                'text' => Str::ucfirst(__('citizen.validations.institution')),
                'value'  =>  "institucion",
                'sortable' => false
            ],
            [
                'align' => "left",
                'text' => Str::ucfirst(__('citizen.validations.activity')),
                'value'  =>  "actividad",
                'sortable' => false
            ],
            [
                'align' => "left",
                'text' => Str::ucfirst(__('citizen.validations.content')),
                'value'  =>  "contenido",
                'sortable' => false
            ],
            [
                'align' => "left",
                'text' => Str::ucfirst(__('citizen.validations.created_at')),
                'value'  =>  "created_at",
                'sortable' => false
            ],
            [
                'align' => "left",
                'text' => Str::ucfirst(__('citizen.validations.updated_at')),
                'value'  =>  "updated_at",
                'sortable' => false
            ],
            [
                'align' => "right",
                'text' => Str::ucfirst(__('citizen.validations.actions')),
                'value'  =>  "actions",
                'sortable' => false
            ],
        ];
    }
}
