/** =========================
 *  CONFIGURACIÓN BÁSICA
 *  =========================
 *  - Coloca aquí el ID de tu Google Sheet con la base de cumpleaños.
 *  - La hoja debe tener cabeceras al menos: Nombre, FechaNacimiento
 *    Opcional: Curso (o Cargo/Área)
 *  - Formato recomendado de FechaNacimiento: dd-mm-aaaa o dd/mm/aaaa
 */
const SHEET_ID   = 'PON_AQUI_TU_SHEET_ID';   // <-- REEMPLAZA
const SHEET_NAME = 'Cumpleaños';             // <-- REEMPLAZA si aplica

function doGet() {
  return HtmlService
    .createTemplateFromFile('Index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // para embeber en Sites
    .setTitle('Cumpleaños CEIA')
    .setFaviconUrl('https://www.gstatic.com/images/icons/material/system/1x/cake_googblue_24dp.png');
}

/**
 * Lee cumpleaños desde Google Sheet.
 * Estructura esperada: Cabeceras (Fila 1) con:
 *   - Nombre
 *   - FechaNacimiento
 *   - (Opcional) Curso / Cargo / Área
 */
function getBirthdaysFromSheet() {
  if (!SHEET_ID) throw new Error('Configura SHEET_ID en Code.gs');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('No se encontró la hoja "' + SHEET_NAME + '"');

  const range = sh.getDataRange();
  const values = range.getValues();
  if (!values || values.length < 2) return [];

  const headers = values[0].map(String);
  const rows = values.slice(1);
  const idxNombre = headers.findIndex(h => h.toLowerCase().includes('nombre'));
  const idxFecha  = headers.findIndex(h => h.toLowerCase().includes('fecha'));
  const idxCurso  = headers.findIndex(h => h.toLowerCase().includes('curso') || h.toLowerCase().includes('cargo') || h.toLowerCase().includes('área') || h.toLowerCase().includes('area'));

  if (idxNombre === -1 || idxFecha === -1) {
    throw new Error('La hoja debe contener al menos las columnas "Nombre" y "FechaNacimiento".');
  }

  // Convierte cada fila a objeto
  const out = [];
  rows.forEach(r => {
    const nombre = (r[idxNombre] || '').toString().trim();
    const curso  = idxCurso >= 0 ? (r[idxCurso] || '').toString().trim() : '';
    const rawF   = r[idxFecha];

    if (!nombre) return;
    let d;

    if (rawF instanceof Date) {
      d = rawF;
    } else {
      const s = (rawF || '').toString().trim();
      // Intentos de parseo: dd-mm-aaaa | dd/mm/aaaa
      const mm1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
      if (mm1) {
        const dd = parseInt(mm1[1], 10);
        const mm = parseInt(mm1[2], 10) - 1;
        let yy = parseInt(mm1[3], 10);
        if (yy < 100) yy += 2000; // normaliza 2 dígitos
        d = new Date(yy, mm, dd);
      } else {
        // último recurso: Date.parse
        const t = new Date(s);
        if (!isNaN(t.getTime())) d = t;
      }
    }

    if (!d || isNaN(d.getTime())) return;

    out.push({
      nombre,
      curso,
      fechaISO: Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    });
  });

  return out;
}

/**
 * Punto de entrada que puede recibir datos desde el cliente:
 * - Si viene csvData, se procesa este CSV (sin usar Google Sheet).
 * - En caso contrario, se lee desde la hoja (SHEET_ID).
 */
function getBirthdays(opts) {
  opts = opts || {};
  const tz = Session.getScriptTimeZone() || 'America/Santiago';
  let rows = [];

  if (opts.csvData) {
    // Procesar CSV enviado desde el cliente
    const parsed = Utilities.parseCsv(opts.csvData);
    if (!parsed || parsed.length < 2) return [];
    const headers = parsed[0].map(String);
    const idxNombre = headers.findIndex(h => h.toLowerCase().includes('nombre'));
    const idxFecha  = headers.findIndex(h => h.toLowerCase().includes('fecha'));
    const idxCurso  = headers.findIndex(h => h.toLowerCase().includes('curso') || h.toLowerCase().includes('cargo') || h.toLowerCase().includes('área') || h.toLowerCase().includes('area'));
    if (idxNombre === -1 || idxFecha === -1) {
      throw new Error('El CSV debe contener al menos las columnas "Nombre" y "FechaNacimiento".');
    }

    for (let i = 1; i < parsed.length; i++) {
      const r = parsed[i];
      const nombre = (r[idxNombre] || '').toString().trim();
      const curso  = idxCurso >= 0 ? (r[idxCurso] || '').toString().trim() : '';
      const s = (r[idxFecha] || '').toString().trim();
      if (!nombre || !s) continue;

      let d;
      const mm1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
      if (mm1) {
        const dd = parseInt(mm1[1], 10);
        const mm = parseInt(mm1[2], 10) - 1;
        let yy = parseInt(mm1[3], 10);
        if (yy < 100) yy += 2000;
        d = new Date(yy, mm, dd);
      } else {
        const t = new Date(s);
        if (!isNaN(t.getTime())) d = t;
      }
      if (!d || isNaN(d.getTime())) continue;

      rows.push({
        nombre,
        curso,
        fechaISO: Utilities.formatDate(d, tz, 'yyyy-MM-dd'),
      });
    }
  } else {
    rows = getBirthdaysFromSheet();
  }

  // Enriquecer con cálculos útiles
  const now = new Date(); // hoy
  const year = now.getFullYear();
  const todayStr = Utilities.formatDate(now, tz, 'yyyy-MM-dd');

  const rich = rows.map(o => {
    const [yyyy, mm, dd] = o.fechaISO.split('-').map(Number);
    // Próximo cumpleaños (en este año o siguiente si ya pasó)
    let next = new Date(year, mm - 1, dd);
    const today = new Date(todayStr + 'T00:00:00');
    if (next < today) next = new Date(year + 1, mm - 1, dd);

    const age = year - yyyy - (new Date(year, mm - 1, dd) > now ? 1 : 0);
    const msDiff = (next.getTime() - today.getTime());
    const daysUntil = Math.round(msDiff / (1000 * 60 * 60 * 24));

    return {
      ...o,
      anioNacimiento: yyyy,
      dia: dd,
      mes: mm,
      proximoISO: Utilities.formatDate(next, tz, 'yyyy-MM-dd'),
      edadEsteAnio: age,
      diasPara: daysUntil
    };
  });

  return {
    tz,
    today: todayStr,
    total: rich.length,
    data: rich
  };
}

// Incluir archivos HTML (para use en createTemplateFromFile)
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
