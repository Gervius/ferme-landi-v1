<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Document</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table, th, td { border: 1px solid #ddd; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .no-border, .no-border th, .no-border td { border: none !important; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .header { margin-bottom: 40px; }
        .header td { vertical-align: top; }
        .company-info { font-size: 14px; font-weight: bold; }
        .document-title { font-size: 18px; font-weight: bold; text-align: center; background-color: #eee; padding: 10px; margin-bottom: 20px; }
        .footer { position: fixed; bottom: -30px; left: 0px; right: 0px; height: 50px; font-size: 10px; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
        .page-number:before { content: counter(page); }
    </style>
</head>
<body>
    @yield('content')
    <div class="footer">
        Ferme-Landi ERP - Page <span class="page-number"></span>
    </div>
</body>
</html>
