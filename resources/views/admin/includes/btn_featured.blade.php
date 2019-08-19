@if($featured==1)
<a href="javascript:;" class="btn btn-primary btn-sm btn-featured" title="Remover destaque?" data-id="{{ $id }}" data-featured="1"><i class="fa fa-star" aria-hidden="true"></i>
</a>
@else
<a href="javascript:;" class="btn btn-default btn-sm btn-featured" title="Destacar?" data-id="{{ $id }}" data-featured="0"><i class="fa fa-star" aria-hidden="true"></i>
</a>
@endif
