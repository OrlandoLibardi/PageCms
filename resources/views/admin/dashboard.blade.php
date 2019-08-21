@extends('admin.layout.admin')
@section( 'breadcrumbs' )
<!-- breadcrumbs -->
<div class="row wrapper border-bottom white-bg page-heading">
    <div class="col-lg-9">
        <h2>Dashboard</h2>
        <ol class="breadcrumb">
            <li>
                <a href="/admin">Paínel de controle</a>
            </li>
            <li class="active">Dashboard </li>
        </ol>
    </div>
    <div class="col-md-3 padding-btn-header text-right">

    </div>
</div>
<div id="showError"></div>
@endsection
@section('content')
@endsection
@push('style')
<!-- Adicional Styles -->
@endpush
@push('script')
<!-- Adicional Scripts -->
@endpush
