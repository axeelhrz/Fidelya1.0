<?php
// Redirigir a la imagen de Google Play sin mostrar el enlace en el código fuente
$imageUrl = 'https://play-lh.googleusercontent.com/4gGthV-_h7-6rv2QsZOQrsd6iGfveFjkX5wlVKtMpexXkhj9PgwWOGafoR1tUbEdyhx2';

// Headers para indicar que es una imagen
header('Content-Type: image/png');
header('Location: ' . $imageUrl);
exit();
?>