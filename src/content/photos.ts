/**
 * Fotografias editoriais da interface pública (landing page).
 * Fonte: Unsplash (licença Unsplash — uso livre, atribuição recomendada).
 * São imagens ilustrativas de identidade visual, NÃO são registros de observação.
 * Fotografias de observações reais vêm do Supabase Storage.
 */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const photos = {
  hero: u('photo-1441974231531-c6227db76b6e', 2400),
  fieldwork: u('photo-1470071459604-3b5ec3a7fe05', 1600),
  community: u('photo-1500530855697-b586d89ba3ee', 1600),
  closing: u('photo-1501785888041-af3ef285b470', 2000),
  birds: u('photo-1444464666168-49d633b86797', 900),
  mammals: u('photo-1474511320723-9a56873867b5', 900),
  reptiles: u('photo-1504450874802-0ba2bcd9b5ae', 900),
  amphibians: u('photo-1559253664-ca249d4608c6', 900),
  insects: u('photo-1452570053594-1b985d6ea890', 900),
  plants: u('photo-1490750967868-88aa4486c946', 900),
  others: u('photo-1500964757637-c85e8a162699', 900),
}
