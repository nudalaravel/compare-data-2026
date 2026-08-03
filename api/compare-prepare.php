<?php
declare(strict_types=1);

require_once __DIR__ . '/common/auth.php';
require_once __DIR__ . '/common/db.php';
require_once __DIR__ . '/common/compare.php';

require_method('POST');
$user = require_auth();

$body = input_json();
$projectId = require_string($body, 'project_id');
$tableName = require_string($body, 'table_name');

$mysqli = db();
$ctx = metadata_context($mysqli, $projectId, $tableName);
$scope = resolve_search_scope($ctx['project'], $body);
$searchMode = $scope['search_mode'];
$searchId = $scope['search_id'];
$preview = compare_preview($mysqli, $ctx, $searchMode, $searchId);
$round1Count = (int)($preview['round1Count'] ?? 0);
$round2Count = (int)($preview['round2Count'] ?? 0);
$comparePendingCount = (int)($preview['comparePendingCount'] ?? $preview['compare_pending_count'] ?? 0);
$compareScopeCount = (int)($preview['compareScopeCount'] ?? $preview['compare_scope_count'] ?? 0);
$intersectionCmpCount = (int)($preview['intersectionCmpCount'] ?? $preview['intersection_cmp_count'] ?? 0);
$hasCompareData = $compareScopeCount > 0;
$rawRoundCountsMatch = $round1Count === $round2Count;
$cmpScopeMatchesRound2 = $intersectionCmpCount === $round2Count || $compareScopeCount === $round2Count;
$pendingCmpReady = $comparePendingCount > 0 && ($cmpScopeMatchesRound2 || $rawRoundCountsMatch);
$canPrepare = $round1Count > 0
    && $round2Count > 0
    && (
        $hasCompareData
            ? ($cmpScopeMatchesRound2 || $pendingCmpReady)
            : $rawRoundCountsMatch
    );

if (!$canPrepare) {
    json_response(false, 'ยังเลือก compare ไม่ได้ เพราะข้อมูลยังไม่ครบหรือยังไม่ตรงกันทั้ง 2 round', [], ['ROUND_PAIR_REQUIRED'], 422);
}

if (($preview['compareStatus'] ?? $preview['compare_status'] ?? '') === 'complete') {
    json_response(true, 'ข้อมูลชุดนี้ Compare เสร็จแล้ว', [
        'alreadyComplete' => true,
        'already_complete' => true,
        'copiedRows' => 0,
        'targetTable' => $preview['targetFullName'] ?? '',
    ]);
}

$result = prepare_compare_table($mysqli, $ctx, $searchMode, $searchId, $user['username']);

json_response(true, 'เตรียมข้อมูล Compare สำเร็จ', $result);
