import { http, HttpResponse } from 'msw';
import { mockStories } from './fixtures/stories';
import { mockItem } from './fixtures/item';
import { mockUser } from './fixtures/user';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export const handlers = [
  http.get(`${BASE_URL}/news`, () => {
    return HttpResponse.json(mockStories);
  }),

  http.get(`${BASE_URL}/newest`, () => {
    return HttpResponse.json(mockStories);
  }),

  http.get(`${BASE_URL}/show`, () => {
    return HttpResponse.json(mockStories);
  }),

  http.get(`${BASE_URL}/ask`, () => {
    return HttpResponse.json(mockStories);
  }),

  http.get(`${BASE_URL}/jobs`, () => {
    return HttpResponse.json(mockStories);
  }),

  http.get(`${BASE_URL}/item/:id`, () => {
    return HttpResponse.json(mockItem);
  }),

  http.get(`${BASE_URL}/user/:id`, () => {
    return HttpResponse.json(mockUser);
  }),
];
