import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  GitlabAPIResponse,
} from '../infrastructure';

export interface FreezePeriodSchema extends Record<string, unknown> {
  id: number;
  freeze_start: string;
  freeze_end: string;
  cron_timezone: string;
  created_at: string;
  updated_at: string;
}

export class FreezePeriods<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<FreezePeriodSchema[], C, E, P>> {
    return RequestHelper.get<FreezePeriodSchema[]>()(
      this,
      endpoint`projects/${projectId}/freeze_periods`,
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    freezePeriodId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<FreezePeriodSchema, C, E, void>> {
    return RequestHelper.get<FreezePeriodSchema>()(
      this,
      endpoint`projects/${projectId}/freeze_periods/${freezePeriodId}`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    freezeStart: string,
    freezeEnd: string,
    options?: { cronTimezone?: string } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<FreezePeriodSchema, C, E, void>> {
    return RequestHelper.post<FreezePeriodSchema>()(
      this,
      endpoint`projects/${projectId}/freeze_periods`,
      {
        freezeStart,
        freezeEnd,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    freezePeriodId: string | number,
    options?: {
      freezeStart?: string;
      freezeEnd?: string;
      cronTimezone?: string;
    } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<FreezePeriodSchema, C, E, void>> {
    return RequestHelper.put<FreezePeriodSchema>()(
      this,
      endpoint`projects/${projectId}/freeze_periods/${freezePeriodId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    freezePeriodId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/freeze_periods/${freezePeriodId}`,
      options,
    );
  }
}
