import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import type { UserSchema } from './Users';
import type { GroupSchema } from './Groups';
import type { ProtectedBranchSchema } from './ProtectedBranches';

export interface ProjectLevelMergeRequestApprovalSchema extends Record<string, unknown> {
  approvals_before_merge: number;
  reset_approvals_on_push: boolean;
  disable_overriding_approvers_per_merge_request: boolean;
  merge_requests_author_approval: boolean;
  merge_requests_disable_committers_approval: boolean;
  require_password_to_approve: boolean;
}

export interface ApprovedByEntity {
  user: Omit<UserSchema, 'created_at'>;
}

export interface MergeRequestLevelMergeRequestApprovalSchema extends Record<string, unknown> {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  merge_status: string;
  approvals_required: number;
  approvals_left: number;
  approved_by?: ApprovedByEntity[];
}

export type ApprovalRulesRequestOptions = {
  userIds?: number[];
  groupIds?: number[];
  protectedBranchIds?: number[];
};

export interface ApprovalRuleSchema extends Record<string, unknown> {
  id: number;
  name: string;
  rule_type: string;
  eligible_approvers?: Omit<UserSchema, 'created_at'>[];
  approvals_required: number;
  users?: Omit<UserSchema, 'created_at'>[];
  groups?: GroupSchema[];
  contains_hidden_groups: boolean;
  overridden: boolean;
}

export interface ProjectLevelApprovalRuleSchema extends ApprovalRuleSchema {
  protected_branches?: ProtectedBranchSchema[];
}

export interface MergeRequestLevelApprovalRuleSchema extends ApprovalRuleSchema {
  source_rule?: string;
}

export interface ApprovalStateSchema extends Record<string, unknown> {
  approval_rules_overwritten: boolean;
  rules: ({ approved: boolean } & MergeRequestLevelApprovalRuleSchema)[];
}

export class MergeRequestApprovals<C extends boolean = false> extends BaseResource<C> {
  allApprovalRules<E extends boolean = false>(
    projectId: string | number,
    options: { mergerequestIId: number } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MergeRequestLevelApprovalRuleSchema[], C, E, void>>;

  allApprovalRules<E extends boolean = false>(
    projectId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectLevelApprovalRuleSchema[], C, E, void>>;

  allApprovalRules<E extends boolean = false>(
    projectId: string | number,
    { mergerequestIId, ...options }: { mergerequestIId?: number } & BaseRequestOptions<E> = {},
  ): Promise<
    GitlabAPIResponse<
      (ProjectLevelApprovalRuleSchema | MergeRequestLevelApprovalRuleSchema)[],
      C,
      E,
      void
    >
  > {
    let url: string;

    if (mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approval_rules`;
    } else {
      url = endpoint`projects/${projectId}/approval_rules`;
    }

    return RequestHelper.get<
      (ProjectLevelApprovalRuleSchema | MergeRequestLevelApprovalRuleSchema)[]
    >()(this, url, options);
  }

  approve<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    options?: { sha?: string; approval_password?: string } & Sudo & ShowExpanded<E>,
  ) {
    return RequestHelper.post<MergeRequestLevelMergeRequestApprovalSchema>()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approve`,
      options,
    );
  }

  createApprovalRule<E extends boolean = false>(
    projectId: string | number,
    name: string,
    approvalsRequired: number,
    options: { mergerequestIId: number } & ApprovalRulesRequestOptions & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MergeRequestLevelApprovalRuleSchema, C, E, void>>;

  createApprovalRule<E extends boolean = false>(
    projectId: string | number,
    name: string,
    approvalsRequired: number,
    options?: ApprovalRulesRequestOptions & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectLevelApprovalRuleSchema, C, E, void>>;

  createApprovalRule<E extends boolean = false>(
    projectId: string | number,
    name: string,
    approvalsRequired: number,
    {
      mergerequestIId,
      ...options
    }: { mergerequestIId?: number } & ApprovalRulesRequestOptions & BaseRequestOptions<E> = {},
  ): Promise<
    GitlabAPIResponse<
      ProjectLevelApprovalRuleSchema | MergeRequestLevelApprovalRuleSchema,
      C,
      E,
      void
    >
  > {
    let url: string;

    if (mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approval_rules`;
    } else {
      url = endpoint`projects/${projectId}/approval_rules`;
    }

    return RequestHelper.post<
      ProjectLevelApprovalRuleSchema | MergeRequestLevelApprovalRuleSchema
    >()(this, url, { name, approvalsRequired, ...options });
  }

  editApprovalRule<E extends boolean = false>(
    projectId: string | number,
    approvalRuleId: number,
    name: string,
    approvalsRequired: number,
    options: { mergerequestIId: number } & ApprovalRulesRequestOptions & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MergeRequestLevelApprovalRuleSchema, C, E, void>>;

  editApprovalRule<E extends boolean = false>(
    projectId: string | number,
    approvalRuleId: number,
    name: string,
    approvalsRequired: number,
    options?: ApprovalRulesRequestOptions & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectLevelApprovalRuleSchema, C, E, void>>;

  editApprovalRule<E extends boolean = false>(
    projectId: string | number,
    approvalRuleId: number,
    name: string,
    approvalsRequired: number,
    {
      mergerequestIId,
      ...options
    }: { mergerequestIId?: number } & ApprovalRulesRequestOptions & BaseRequestOptions<E> = {},
  ): Promise<
    GitlabAPIResponse<
      ProjectLevelApprovalRuleSchema | MergeRequestLevelApprovalRuleSchema,
      C,
      E,
      void
    >
  > {
    let url: string;

    if (mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approval_rules/${approvalRuleId}`;
    } else {
      url = endpoint`projects/${projectId}/approval_rules/${approvalRuleId}`;
    }

    return RequestHelper.put<
      ProjectLevelApprovalRuleSchema | MergeRequestLevelApprovalRuleSchema
    >()(this, url, { name, approvalsRequired, ...options });
  }

  editConfiguration<E extends boolean = false>(
    projectId: string | number,
    options: { mergerequestIId: number } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MergeRequestLevelMergeRequestApprovalSchema, C, E, void>>;

  editConfiguration<E extends boolean = false>(
    projectId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectLevelMergeRequestApprovalSchema, C, E, void>>;

  editConfiguration<E extends boolean = false>(
    projectId: string | number,
    { mergerequestIId, ...options }: { mergerequestIId?: number } & BaseRequestOptions<E> = {},
  ): Promise<
    GitlabAPIResponse<
      MergeRequestLevelMergeRequestApprovalSchema | ProjectLevelMergeRequestApprovalSchema,
      C,
      E,
      void
    >
  > {
    let url: string;

    if (mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approvals`;
    } else {
      url = endpoint`projects/${projectId}/approvals`;
    }

    return RequestHelper.post<
      MergeRequestLevelMergeRequestApprovalSchema | ProjectLevelMergeRequestApprovalSchema
    >()(this, url, options);
  }

  removeApprovalRule<E extends boolean = false>(
    projectId: string | number,
    approvalRuleId: number,
    { mergerequestIId }: { mergerequestIId?: number } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    let url: string;

    if (mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approval_rules/${approvalRuleId}`;
    } else {
      url = endpoint`projects/${projectId}/approval_rules/${approvalRuleId}`;
    }

    return RequestHelper.del()(this, url);
  }

  showApprovalRule<E extends boolean = false>(
    projectId: string | number,
    approvalRuleId: number,
    options: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectLevelApprovalRuleSchema, C, E, void>> {
    return RequestHelper.get<ProjectLevelApprovalRuleSchema>()(
      this,
      endpoint`projects/${projectId}/approval_rules/${approvalRuleId}`,
      options,
    );
  }

  showApprovalState<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ApprovalStateSchema, C, E, void>> {
    return RequestHelper.get<ApprovalStateSchema>()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approval_state`,
      options,
    );
  }

  showConfiguration<E extends boolean = false>(
    projectId: string | number,
    options: { mergerequestIId: number } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MergeRequestLevelMergeRequestApprovalSchema, C, E, void>>;

  showConfiguration<E extends boolean = false>(
    projectId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectLevelMergeRequestApprovalSchema, C, E, void>>;

  showConfiguration<E extends boolean = false>(
    projectId: string | number,
    { mergerequestIId, ...options }: { mergerequestIId?: number } & BaseRequestOptions<E> = {},
  ): Promise<
    GitlabAPIResponse<
      MergeRequestLevelMergeRequestApprovalSchema | ProjectLevelMergeRequestApprovalSchema,
      C,
      E,
      void
    >
  > {
    let url: string;

    if (mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/approvals`;
    } else {
      url = endpoint`projects/${projectId}/approvals`;
    }

    return RequestHelper.get<
      MergeRequestLevelMergeRequestApprovalSchema | ProjectLevelMergeRequestApprovalSchema
    >()(this, url, options);
  }

  unapprove<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    return RequestHelper.post<unknown>()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/unapprove`,
      options,
    );
  }
}
