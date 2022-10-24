<?php

namespace App\Modules\CitizenPortal\src\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CitizenPortal\src\Models\AttendanceActivity;
use App\Modules\CitizenPortal\src\Constants\Roles;
use App\Modules\CitizenPortal\src\Models\CitizenSchedule;
use App\Modules\CitizenPortal\src\Models\Schedule;
use App\Modules\CitizenPortal\src\Request\AttendanceActivityRequest;
use App\Modules\CitizenPortal\src\Resources\AttendanceActivityResource;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class AttendanceActivityController extends Controller
{

    /**
     * Initialise common request params
     */
    public function __construct()
    {
        parent::__construct();
        $this->middleware(
            Roles::canAny([
                [
                    'actions'   => 'view_or_manage',
                    'model'     => AttendanceActivity::class
                ],
                ['model' => CitizenSchedule::class, 'actions' => 'status'],
                ['model' => CitizenSchedule::class, 'actions' => 'view_or_manage'],
                [
                    'actions'   => 'view_or_manage',
                    'model'     => Schedule::class
                ],
            ], true, true)
        )
            ->only('index');
        $this->middleware(Roles::actions(AttendanceActivity::class, 'create_or_manage'))
            ->only('store');
        $this->middleware(Roles::actions(AttendanceActivity::class, 'update_or_manage'))
            ->only('update');
        $this->middleware(Roles::actions(AttendanceActivity::class, 'destroy_or_manage'))
            ->only('destroy');
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $query = $this->setQuery(AttendanceActivity::query(), (new AttendanceActivity)->getSortableColumn($this->column))
            ->when(isset($this->query), function ($query) {
                return $query->where('activity_name', 'like', "%$this->query%");
            })
            ->orderBy((new AttendanceActivity)->getSortableColumn($this->column), $this->order);
        return $this->success_response(
            ActivityResource::collection(
                (int) $this->per_page > 0
                    ? $query->paginate( $this->per_page )
                    : $query->get()
            ),
            Response::HTTP_OK,
            [
                'headers'   => ActivityResource::headers()
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  AttendanceActivityRequest  $request
     * @return JsonResponse
     */
    public function store(AttendanceActivityRequest $request)
    {
        $model = new AttendanceActivity();
        $attrs = $model->fillModel($request->validated());
        $model->fill($attrs);
        $model->save();
        return $this->success_message(
            __('validation.handler.success'),
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\AttendanceActivity  $attendanceActivity
     * @return \Illuminate\Http\Response
     */
    public function show(AttendanceActivity $attendanceActivity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\AttendanceActivity  $attendanceActivity
     * @return \Illuminate\Http\Response
     */
    public function edit(AttendanceActivity $attendanceActivity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\AttendanceActivity  $attendanceActivity
     * @return JsonResponse
     */
    public function update(AttendanceActivityRequest $request, AttendanceActivity $attendanceActivity)
    {
        $attrs = $attendanceActivity->fillModel($request->validated());
        $attendanceActivity->fill($attrs);
        $attendanceActivity->save();
        return $this->success_message(
            __('validation.handler.updated')
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\AttendanceActivity  $attendanceActivity
     * @return JsonResponse
     */

     /**
      * @param AttendanceActivity $attendanceActivity
      * @return JsonResponse
      * @throws Exception
      */
    public function destroy(AttendanceActivity $attendanceActivity)
    {
        $attendanceActivity->delete();
        return $this->success_message(
            __('validation.handler.deleted'),
            Response::HTTP_OK,
            Response::HTTP_NO_CONTENT
        );
    }
}
