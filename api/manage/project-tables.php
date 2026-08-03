<?php
declare(strict_types=1);

require_once __DIR__ . '/../common/response.php';

json_response(false, 'Deprecated API. Use /api/manage/admin-tables.php and /api/manage/admin-columns.php.', [], ['DEPRECATED_API'], 410);
