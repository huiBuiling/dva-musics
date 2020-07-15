import {get} from '../utils/request';

export function query() {
  return get('/api/users');
}
