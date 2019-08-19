@if($status==1)
    <a href="javascript:;" class="btn btn-primary btn-sm btn-status" title="Colocar Offline?" data-id="{{ $id }}" data-status="1"><i class="fa fa-refresh" aria-hidden="true"></i>
    </a>
@else
    <a href="javascript:;" class="btn btn-default btn-sm btn-status" title="Colocar Online?" data-id="{{ $id }}" data-status="0"><i class="fa fa-refresh" aria-hidden="true"></i>
    </a>
@endif

