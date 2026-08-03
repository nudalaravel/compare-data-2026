export const COMPARE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETE: 'complete'
}

export const FIELD_STATUS = {
  SAME: 'same',
  DIFFERENT: 'different',
  ONLY_ROUND1: 'only_round1',
  ONLY_ROUND2: 'only_round2'
}

export const SEARCH_MODES = [
  { value: 'prefix', label: 'ขึ้นต้นด้วย', hint: "LIKE 'id%'" },
  { value: 'exact', label: 'ตรงรหัส', hint: "id = '...'" }
]
