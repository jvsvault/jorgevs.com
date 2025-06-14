<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$backgroundDir = __DIR__ . '/assets/images/background';
$geometryDir = __DIR__ . '/assets/images/geometry';

function getImages($dir) {
    $images = [];
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && !is_dir($dir . '/' . $file)) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                    $images[] = $file;
                }
            }
        }
    }
    return $images;
}

echo json_encode([
    'background' => getImages($backgroundDir),
    'geometry' => getImages($geometryDir)
]);
?>