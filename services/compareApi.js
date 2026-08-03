import {
  buildCompareRecords,
  buildPreview,
  getMockProjects,
  getMockSampleIds,
  getMockTableCatalog
} from './compareMock'

function normalizeResponse(response) {
  if (response?.success === false) {
    const message = response.message || 'API request failed'
    throw new Error(message)
  }

  return response?.data ?? response
}

export function useCompareApi() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const loginUrl = config.public.loginUrl || 'https://ripedresearch.org/api/spaqnaire2025-api/login_merge.php'
  const sampleIdsLimit = String(config.public.sampleIdsLimit || 'all')

  async function request(path, options = {}) {
    if (!apiBase) {
      throw new Error('API base URL is not configured')
    }

    const token = import.meta.client ? localStorage.getItem('_token_tcls') : ''
    const response = await $fetch(`${apiBase}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    })

    return normalizeResponse(response)
  }

  return {
    usingMock: !apiBase,

    async login(credentials) {
      return $fetch(loginUrl, {
        method: 'POST',
        body: {
          username: credentials.username.trim(),
          password: credentials.password
        }
      })
    },

    async listProjects() {
      if (!apiBase) {
        return getMockProjects()
      }

      const data = await request('/projects.php')
      return (data.projects || []).map(normalizeProject)
    },

    async listTables(projectId) {
      if (!apiBase) {
        return getMockTableCatalog(projectId)
      }

      const data = await request(`/project-tables.php?project_id=${encodeURIComponent(projectId)}`)
      return (data.tables || []).map(normalizeTable)
    },

    async listSampleIds(projectOrId) {
      const project = typeof projectOrId === 'object' && projectOrId !== null ? projectOrId : null
      const projectId = project?.id || projectOrId
      if (!apiBase) {
        return getMockSampleIds(projectId).map((sample) => normalizeSampleId(sample, project))
      }

      const query = new URLSearchParams({ project_id: projectId })
      if (sampleIdsLimit) {
        query.set('limit', sampleIdsLimit)
      }

      const data = await request(`/sample-ids.php?${query.toString()}`)
      if (Array.isArray(data.sample_ids)) {
        return data.sample_ids.map((sample) => normalizeSampleId(sample, project))
      }

      return (data.samples || []).map((sample) => normalizeSampleId(sample, project)).filter((item) => item.id)
    },

    async previewScope(payload) {
      if (!apiBase) {
        const tables = getMockTableCatalog(payload.projectId)
          .filter((table) => table.allowed)
          .map((table) => {
            const preview = buildPreview(payload.project, table, payload.searchMode, payload.searchId, table.primaryKeys)
            const hasBothRounds = Number(preview?.round1Count || 0) > 0 && Number(preview?.round2Count || 0) > 0
            const isSelectable = hasBothRounds && Number(preview?.intersectionCount || 0) > 0
            return {
              ...preview,
              tableName: table.name,
              table_name: table.name,
              displayName: table.displayName,
              display_name: table.displayName,
              primaryKeys: table.primaryKeys,
              primary_keys: table.primaryKeys,
              selectable: isSelectable,
              hasBothRounds,
              has_both_rounds: hasBothRounds
            }
          })

        return {
          searchId1: payload.searchId1,
          search_id1: payload.searchId1,
          searchId2: payload.searchId2,
          search_id2: payload.searchId2,
          searchId: payload.searchId,
          search_id: payload.searchId,
          searchMode: payload.searchMode,
          search_mode: payload.searchMode,
          tables,
          totals: tables.reduce((acc, table) => {
            acc.round1Count += Number(table.round1Count || 0)
            acc.round2Count += Number(table.round2Count || 0)
            acc.intersectionCount += Number(table.intersectionCount || 0)
            acc.onlyRound1Count += Number(table.onlyRound1Count || 0)
            acc.onlyRound2Count += Number(table.onlyRound2Count || 0)
            return acc
          }, { round1Count: 0, round2Count: 0, intersectionCount: 0, onlyRound1Count: 0, onlyRound2Count: 0 })
        }
      }

      const data = await request('/compare-scope-preview.php', {
        method: 'POST',
        body: {
          project_id: payload.projectId,
          search_id1: payload.searchId1,
          search_id2: payload.searchId2,
          search_id: payload.searchId,
          search_mode: payload.searchMode
        }
      })
      return data.preview
    },

    async previewCompare(payload) {
      if (!apiBase) {
        return buildPreview(payload.project, payload.table, payload.searchMode, payload.searchId, payload.primaryKeys)
      }

      const data = await request('/compare-preview.php', {
        method: 'POST',
        body: {
          project_id: payload.projectId,
          table_name: payload.tableName,
          search_mode: payload.searchMode,
          search_id: payload.searchId,
          search_id1: payload.searchId1,
          search_id2: payload.searchId2,
          primary_keys: payload.primaryKeys
        }
      })
      return data.preview
    },

    async prepareCompare(payload) {
      if (!apiBase) {
        return {
          prepared: true,
          created: payload.preview?.willCreateTable,
          copiedRows: payload.preview?.copiedRows || 0,
          targetTable: payload.preview?.targetFullName
        }
      }

      return request('/compare-prepare.php', {
        method: 'POST',
        body: {
          project_id: payload.projectId,
          table_name: payload.tableName,
          primary_keys: payload.primaryKeys,
          search_mode: payload.searchMode,
          search_id: payload.searchId,
          search_id1: payload.searchId1,
          search_id2: payload.searchId2
        }
      })
    },

    async getCompareRecords(payload) {
      if (!apiBase) {
        return buildCompareRecords(payload.project, payload.table, payload.searchMode, payload.searchId, payload.primaryKeys)
      }

      const query = new URLSearchParams({
        project_id: payload.projectId,
        table_name: payload.tableName,
        search_mode: payload.searchMode,
        search_id: payload.searchId,
        search_id1: payload.searchId1 || '',
        search_id2: payload.searchId2 || ''
      })
      const data = await request(`/compare-record.php?${query.toString()}`)
      return data.records || []
    },

    async saveCompare(payload) {
      if (!apiBase) {
        return { saved: true }
      }

      return request('/compare-save.php', {
        method: 'POST',
        body: {
          project_id: payload.projectId,
          table_name: payload.tableName,
          run_id: payload.runId,
          primary_key: payload.primaryKey,
          values: payload.values
        }
      })
    }
  }
}

function normalizeProject(project) {
  const questionnaireName = project.questionnaireName || project.questionnaire_name || ''

  return {
    ...project,
    id: project.id || project.project_id,
    code: project.code || project.project_code,
    displayName: questionnaireName || project.displayName || project.display_name,
    questionnaireName,
    color: project.color || 'blue',
    surveyProjectCode: project.surveyProjectCode || project.survey_project_code || '',
    groupCode: project.groupCode || project.survey_project_code || '',
    databaseCode: project.databaseCode || project.database_code || project.project_id || project.id,
    rawDatabase: project.rawDatabase || project.raw_database,
    cmpDatabase: project.cmpDatabase || project.cmp_database,
    searchColumn: project.searchColumn || project.search_column || '',
    searchId1Start: Number(project.searchId1Start || project.search_id1_start || 1),
    searchId1Length: Number(project.searchId1Length || project.search_id1_length || 12),
    searchId2Start: Number(project.searchId2Start || project.search_id2_start || 13),
    searchId2Length: project.searchId2Length || project.search_id2_length || null,
    searchId2Mode: project.searchId2Mode || project.search_id2_mode || 'exact',
    active: Boolean(project.active),
    tableCount: Number(project.tableCount || project.table_count || 0),
    tables: project.tables || (Number(project.tableCount || project.table_count || 0) > 0 ? [true] : [])
  }
}

function normalizeSampleId(sample, project = null) {
  if (typeof sample === 'string') {
    const id = String(sample)
    const parts = splitSearchIdByProject(project, id)
    return {
      id,
      search_id1: parts.searchId1,
      searchId1: parts.searchId1,
      search_id2: parts.searchId2,
      searchId2: parts.searchId2
    }
  }

  const id = String(sample?.id || sample?.sample_id || '')
  const searchId1 = String(sample?.searchId1 || sample?.search_id1 || id)
  const searchId2 = String(sample?.searchId2 || sample?.search_id2 || '')

  return {
    ...sample,
    id,
    search_id1: searchId1,
    searchId1,
    search_id2: searchId2,
    searchId2
  }
}

function splitSearchIdByProject(project, id) {
  const text = String(id || '')
  const id1Start = Math.max(1, Number(project?.searchId1Start || project?.search_id1_start || 1))
  const id1Length = Math.max(1, Number(project?.searchId1Length || project?.search_id1_length || text.length || 1))
  const id2Start = Math.max(1, Number(project?.searchId2Start || project?.search_id2_start || (id1Start + id1Length)))
  const rawId2Length = project?.searchId2Length || project?.search_id2_length || null
  const id2Length = rawId2Length ? Number(rawId2Length) : null

  return {
    searchId1: text.slice(id1Start - 1, id1Start - 1 + id1Length),
    searchId2: id2Length ? text.slice(id2Start - 1, id2Start - 1 + id2Length) : text.slice(id2Start - 1)
  }
}

function normalizeTable(table) {
  return {
    ...table,
    name: table.name || table.table_name,
    displayName: table.displayName || table.display_name,
    allowed: Boolean(table.allowed),
    primaryKeys: table.primaryKeys || table.primary_keys || [],
    excludedColumns: table.excludedColumns || table.excluded_columns || [],
    icon: table.icon || (table.allowed ? 'ok' : 'error')
  }
}
