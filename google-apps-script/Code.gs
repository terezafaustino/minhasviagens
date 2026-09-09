const SPREADSHEET_ID = 'COLE_AQUI_O_ID_DA_SUA_PLANILHA';

function doGet() { return respond({ state: loadState() }); }
function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  if (payload.action === 'save') saveState(payload.state);
  return respond({ ok: true });
}
function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
function getSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let ws = ss.getSheetByName(name);
  if (!ws) { ws = ss.insertSheet(name); ws.getRange(1,1,1,headers.length).setValues([headers]); ws.setFrozenRows(1); }
  return ws;
}
function replaceRows(name, headers, rows) {
  const ws = getSheet(name, headers);
  ws.clearContents();
  ws.getRange(1,1,1,headers.length).setValues([headers]);
  if (rows.length) ws.getRange(2,1,rows.length,headers.length).setValues(rows);
}
function saveState(state) {
  replaceRows('Viagens',['id','nome','rota','ida','volta','orçamento','status','cashback','pontos'],state.trips.map(t=>[t.id,t.name,t.route,t.start,t.end,t.budget,t.status,t.cashback,t.points]));
  replaceRows('Destinos',['viagem_id','bandeira','cidade','país','dias'],state.trips.flatMap(t=>t.destinations.map(x=>[t.id,...x])));
  replaceRows('Passagens',['viagem_id','trecho','data','companhia','custo','status','pagamento','milhas'],state.trips.flatMap(t=>t.flights.map(x=>[t.id,...x])));
  replaceRows('Hospedagens',['viagem_id','nome','destino','período','custo','status'],state.trips.flatMap(t=>t.stays.map(x=>[t.id,...x])));
  replaceRows('Passeios',['viagem_id','nome','data','destino','custo','status'],state.trips.flatMap(t=>t.activities.map(x=>[t.id,...x])));
  replaceRows('Gastos',['viagem_id','descrição','data','pagamento','custo'],state.trips.flatMap(t=>t.expenses.map(x=>[t.id,...x])));
  replaceRows('Programas de milhas',['programa','valor_milheiro'],state.miles);
  replaceRows('Câmbio',['bandeira','moeda','código','valor_em_reais'],state.currencies);
}
function loadState() {
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID), rows=n=>{const w=ss.getSheetByName(n);return w?w.getDataRange().getValues().slice(1):[]};
  const trips=rows('Viagens').map(r=>({id:r[0],name:r[1],route:r[2],start:r[3],end:r[4],budget:r[5],status:r[6],cashback:r[7],points:r[8],destinations:[],flights:[],stays:[],activities:[],expenses:[]}));
  const byId=Object.fromEntries(trips.map(t=>[t.id,t]));
  rows('Destinos').forEach(r=>byId[r[0]]?.destinations.push(r.slice(1)));
  rows('Passagens').forEach(r=>byId[r[0]]?.flights.push(r.slice(1)));
  rows('Hospedagens').forEach(r=>byId[r[0]]?.stays.push(r.slice(1)));
  rows('Passeios').forEach(r=>byId[r[0]]?.activities.push(r.slice(1)));
  rows('Gastos').forEach(r=>byId[r[0]]?.expenses.push(r.slice(1)));
  return {_version:'blank-v1',page:'trips',current:trips[0]?.id||null,trips,miles:rows('Programas de milhas'),currencies:rows('Câmbio')};
}
