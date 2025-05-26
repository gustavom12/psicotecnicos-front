import apiConnection from "./api";

export const getForm = (id: string) =>
  apiConnection.get(`/forms/${id}`).then((r) => r.data);
export const createForm = (body: any) =>
  apiConnection.post("/forms", body).then((r) => r.data);
export const updateForm = (id: string, body: any) =>
  apiConnection.patch(`/forms/${id}`, body).then((r) => r.data);
