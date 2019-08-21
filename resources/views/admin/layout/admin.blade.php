<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>OL - Administrador</title>
    <!-- STYLE -->
    <link href="{{asset('assets/theme-admin/css/bootstrap.min.css')}}" rel="stylesheet">
    <link href="{{asset('assets/theme-admin/css/font-awesome.css')}}" rel="stylesheet">
    <link href="{{asset('assets/theme-admin/css/animate.css')}}" rel="stylesheet">
    <link href="{{asset('assets/theme-admin/css/style.css')}}" rel="stylesheet">
    <link href="{{asset('assets/theme-admin/css/main.css')}}" rel="stylesheet"> @stack('style')
    <style>
    .padding-btn-header{
        padding-top: 35px;
        text-transform: uppercase
    }
    </style>
</head>
<body class="pace-done mini-navbar">
    <div id="wrapper">
        <!-- navbar -->
        <nav class="navbar-default navbar-static-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav metismenu" id="side-menu">
                    <li class="nav-header">
                        <!-- profile -->
                        <div class="dropdown profile-element text-center">
                            <img src="{{ asset('assets/theme-admin/images/logo_120x120.png') }}">
                        </div>
                        <!--profile -->
                        <div class="logo-element">
                            <img src="{{ asset('assets/theme-admin/images/logo.png') }}">
                        </div>
                    </li>
                    @inject('pages', 'OrlandoLibardi\OlCms\AdminCms\app\Admin')
                    @include('admin.includes.menu', ['pages' => $pages->where('parent_id', 0)->orderBy('order_at', 'ASC')->get(), 'all_permissions' => Auth::user()->getAllPermissions()->pluck('name','name')])
                    <li class="divider">
                        <a class="navbar-minimalize btn-toogle" href="javascript:;">
                            <i class="fa fa-bars"></i>
                        </a>
                    </li>
                </ul>

            </div>
        </nav>
        <!-- ./navbar -->
        <div id="page-wrapper" class="gray-bg dashbard-1">
            <div class="row border-bottom">
                <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom:0">
                    <div class="navbar-header">
                    </div>
                    <ul class="nav navbar-top-links navbar-right">
                        <li>
                            <span class="m-r-sm text-muted welcome-message">Olá <a href="{{ Route('users.edit', ['id' => Auth::user()->id ])}}" style="padding:0px; color:#2f4050">{{Auth::user()->name}}</a>, seja bem-vindo.</span>
                        </li>
                        <li class="dropdown">
                            <a href="" class=" count-info">
                                <i class="fa fa-envelope"></i>
                                <span class="label label-primary" id="contatos-count"></span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                <i class="fa fa-sign-out"></i>
                                <span class="hidden-xs">Sair</span>
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;"> @csrf </form>
                        </li>
                    </ul>
                </nav>
            </div>
            @yield('breadcrumbs')
            <!-- Content -->
            <div class="wrapper wrapper-content animated fadeInRight">
                @yield('content')
            </div>
            <!-- ./Content page -->
        </div>
    </div>
</div>
@yield('modal')
<!-- scripts -->
<script src="{{asset('assets/theme-admin/js/jquery-3.1.1.min.js')}}"></script>
<script src="{{asset('assets/theme-admin/js/bootstrap.min.js')}}"></script>
<script src="{{asset('assets/theme-admin/js/plugins/metisMenu/jquery.metisMenu.js')}}"></script>
<script src="{{asset('assets/theme-admin/js/plugins/slimscroll/jquery.slimscroll.min.js')}}"></script>
<script src="{{asset('assets/theme-admin/js/inspinia.js')}}"></script>
@stack('script')
</body>

</html>
