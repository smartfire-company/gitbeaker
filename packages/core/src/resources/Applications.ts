import { BaseResource } from '@gitbeaker/requester-utils';
import {
  RequestHelper,
  PaginatedRequestOptions,
  BaseRequestOptions,
  GitlabAPIResponse,
} from '../infrastructure';

export interface ApplicationSchema extends Record<string, unknown> {
  id: number;
  application_id: string;
  application_name: string;
  secret: string;
  callback_url: string;
  confidential: boolean;
}

export class Applications<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<ApplicationSchema[], C, E, P>> {
    return RequestHelper.get<ApplicationSchema[]>()(this, 'applications', options);
  }

  create<E extends boolean = false>(
    name: string,
    redirectUri: string,
    scopes: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ApplicationSchema, C, E, never>> {
    return RequestHelper.post<ApplicationSchema>()(this, 'applications', {
      name,
      redirectUri,
      scopes,
      ...options,
    });
  }

  remove<E extends boolean = false>(
    applicationId: number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, never>> {
    return RequestHelper.del()(this, `applications/${applicationId}`, options);
  }
}