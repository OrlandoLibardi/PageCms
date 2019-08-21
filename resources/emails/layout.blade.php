<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>E-mails</title>
    <style>
        .footer, .header{
            background:#2f4050;
        }
        .text-footer{
            color:#f7c25a;
            font-size:12px;
            line-height:16px;
            font-family: 'Arial';
            padding: 10px;
        }
        td.line{
            background:#efefef;
            color: #444444;
            font-size: 14px;
            padding: 3px;
            font-family: Arial;
        }
        td.line_two{
            background:#FFF;
            color: #444444;
            font-size: 14px;
            padding: 3px;
            font-family: Arial;
        }
        .title{
            color: #2f4050;
            font-size: 18px;
            font-weight: 100;
            font-family: 'Arial';
        }
        .text {
            color: #2f4050;
            font-size: 15px;
            font-weight: 100;
            font-family: 'Arial';
        }
    </style>
</head>
<body>
<table width="600"  cellpadding="0" cellspacing="0" border="0">
    <tr class="header">
        <td style="text-align:center" align="center"><br/>
            <a href="https://orlandolibardi.com.br" target="_blank" title="Orlando Libardi">
                <img src="{{ asset('assets/theme-admin/images/logo_120x120.png')}}" alt="Orlando Libardi" style="display:block; border:none; background:#2f4050; color:#f7c25a; margin:0 auto;" />
            </a><br/>
        </td>
    </tr>
    <tr>
        <td>
            @yield('content')
        </td>
    </tr>
    <tr class="footer">
        <td>
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="text-footer">contato@orlandolibardi.com.br</td>
                    <td class="text-footer">+55 (11) 9541-20109</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
