<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel Studio</title>
    @vite(['resources/js/studio/app/main.ts'])
</head>
<body style="margin:0">
    <div id="studio-app"></div>
</body>
</html>
