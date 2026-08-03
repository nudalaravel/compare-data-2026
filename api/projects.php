<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/metadata.php';

require_method('GET');
$user = require_auth();
$mysqli = db();
$projects = fetch_compare_projects_for_user($mysqli, $user['username']);

json_response(true, 'projects', ['projects' => $projects]);
