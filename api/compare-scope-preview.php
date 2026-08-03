<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('POST');
require_auth();

$body = input_json();
$projectId = require_string($body, 'project_id');
$debugEnabled = in_array(strtolower(trim((string)($body['debug'] ?? ($_GET['debug'] ?? '')))), ['1', 'true', 'yes', 'on'], true);

$mysqli = db();
$project = fetch_project($mysqli, $projectId);
$scope = resolve_search_scope($project, $body);
$tables = fetch_project_tables($mysqli, (string)$project['project_id']);

$tablePreviews = [];
$totals = [
    'round1Count' => 0,
    'round2Count' => 0,
    'intersectionCount' => 0,
    'onlyRound1Count' => 0,
    'onlyRound2Count' => 0,
];

foreach ($tables as $table) {
    if (empty($table['allowed'])) {
        continue;
    }

    $tableName = assert_identifier((string)$table['table_name']);
    $ctx = metadata_context($mysqli, $projectId, $tableName);
    $preview = compare_preview($mysqli, $ctx, $scope['search_mode'], $scope['search_id'], false, $debugEnabled);
    $round1Count = (int)($preview['round1Count'] ?? 0);
    $round2Count = (int)($preview['round2Count'] ?? 0);
    $comparePendingCount = (int)($preview['comparePendingCount'] ?? $preview['compare_pending_count'] ?? 0);
    $compareCompletedCount = (int)($preview['compareCompletedCount'] ?? $preview['compare_completed_count'] ?? 0);
    $compareScopeCount = (int)($preview['compareScopeCount'] ?? $preview['compare_scope_count'] ?? ($comparePendingCount + $compareCompletedCount));
    $intersectionCmpCount = (int)($preview['intersectionCmpCount'] ?? $preview['intersection_cmp_count'] ?? 0);
    $compareStatus = (string)($preview['compareStatus'] ?? $preview['compare_status'] ?? 'not_prepared');
    $hasBothRounds = empty($preview['error']) && $round1Count > 0 && $round2Count > 0;
    $hasAnyRound = empty($preview['error']) && ($round1Count > 0 || $round2Count > 0);
    $hasCompareData = $compareScopeCount > 0;
    $rawRoundCountsMatch = $round1Count === $round2Count;
    $cmpScopeMatchesRound2 = $intersectionCmpCount === $round2Count || $compareScopeCount === $round2Count;
    $pendingCmpReady = $comparePendingCount > 0 && ($cmpScopeMatchesRound2 || $rawRoundCountsMatch);
    $hasCompleteRoundPair = $hasBothRounds && (
        $hasCompareData
            ? ($cmpScopeMatchesRound2 || $pendingCmpReady)
            : $rawRoundCountsMatch
    );
    $statusTone = 'empty';
    $statusIcon = '☒';
    $statusText = 'ไม่มีข้อมูลทั้งสองรอบ';
    $isSelectable = false;

    if (!empty($preview['error'])) {
        $statusTone = 'danger';
        $statusIcon = '✖';
        $statusText = (string)$preview['error'];
    } elseif (!$hasAnyRound) {
        $statusTone = 'empty';
        $statusIcon = '☒';
        $statusText = 'ไม่มีข้อมูลทั้งสองรอบ';
    } elseif (!$hasCompareData && !$rawRoundCountsMatch) {
        $statusTone = 'slash';
        $statusIcon = '/';
        $statusText = 'ข้อมูลทั้งสองรอบ ยังไม่เท่ากัน';
    } elseif ($compareStatus === 'complete') {
        $statusTone = 'ok';
        $statusIcon = '✓';
        $statusText = 'Compare แล้ว';
        $isSelectable = true;
    } elseif ($hasCompareData && $comparePendingCount > 0) {
        $statusTone = 'danger';
        $statusIcon = '✖';
        $statusText = 'ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน';
        $isSelectable = $hasCompleteRoundPair;
    } elseif ($pendingCmpReady || ($compareStatus === 'pending' && $hasCompleteRoundPair)) {
        $statusTone = 'warning';
        $statusIcon = '▲';
        $statusText = 'พร้อม compare';
        $isSelectable = true;
    } elseif ($hasCompareData && !$hasCompleteRoundPair) {
        $statusTone = 'danger';
        $statusIcon = '✖';
        $statusText = 'ข้อมูลทั้งสองรอบ ยังไม่ตรงกัน';
    } else {
        $statusTone = 'warning';
        $statusIcon = '▲';
        $statusText = 'ยังไม่ดำเนินการ compare';
        $isSelectable = true;
    }

    $row = array_merge($preview, [
        'tableName' => $tableName,
        'table_name' => $tableName,
        'displayName' => $table['display_name'] ?: $tableName,
        'display_name' => $table['display_name'] ?: $tableName,
        'primaryKeys' => $ctx['primaryKeys'],
        'primary_keys' => $ctx['primaryKeys'],
        'selectable' => $isSelectable,
        'hasAnyRound' => $hasAnyRound,
        'has_any_round' => $hasAnyRound,
        'hasBothRounds' => $hasBothRounds,
        'has_both_rounds' => $hasBothRounds,
        'hasCompleteRoundPair' => $hasCompleteRoundPair,
        'has_complete_round_pair' => $hasCompleteRoundPair,
        'statusTone' => $statusTone,
        'status_tone' => $statusTone,
        'statusIcon' => $statusIcon,
        'status_icon' => $statusIcon,
        'statusText' => $statusText,
        'status_text' => $statusText
    ]);

    foreach ($totals as $key => $value) {
        $totals[$key] += (int)($preview[$key] ?? 0);
    }

    $tablePreviews[] = $row;
}

json_response(true, 'compare scope preview', [
    'preview' => [
        'projectId' => $project['project_id'],
        'project_id' => $project['project_id'],
        'projectCode' => $project['survey_project_code'] ?? '',
        'project_code' => $project['survey_project_code'] ?? '',
        'databaseCode' => $project['database_code'] ?? $project['project_id'],
        'database_code' => $project['database_code'] ?? $project['project_id'],
        'rawDatabase' => $project['raw_database'],
        'cmpDatabase' => $project['cmp_database'],
        'searchColumn' => $scope['config']['search_column'],
        'search_column' => $scope['config']['search_column'],
        'searchId1' => $scope['search_id1'],
        'search_id1' => $scope['search_id1'],
        'searchId2' => $scope['search_id2'],
        'search_id2' => $scope['search_id2'],
        'searchId' => $scope['search_id'],
        'search_id' => $scope['search_id'],
        'searchMode' => $scope['search_mode'],
        'search_mode' => $scope['search_mode'],
        'searchConfig' => $scope['config'],
        'search_config' => $scope['config'],
        'totals' => $totals,
        'tables' => $tablePreviews,
    ],
]);
