function toResponsive(tableId, headers=[], headerStyle='', summaryHeaders={show: [],hide: []}) {
  if (!tableId)
    return;

  let css = `@media only screen and (max-width: 600px) {`;

  // applies to all headers
  if( headerStyle ) {
    css += `table#${tableId} tbody tr td:before {
      ${headerStyle}
    }\n` 
  }

  // applies to each individual header
  for (let h = 0; h < headers.length; h++) {
    let header = headers[h];
    let label = header.label ? header.label : header;
    let customCss = header.css ? header.css : '';
    css += `table#${tableId} tbody tr td:nth-of-type(${h+1}):before { content: "${label}"; ${customCss} }\n`;
  }

  let summaryCss = '';
  if (summaryHeaders && summaryHeaders.show && summaryHeaders.show.length > 0) {
    summaryCss =
      `
    table#${tableId} thead tr:not(:last-child) {
      display: none;
    }
    table#${tableId} thead, table#${tableId} thead tr:last-child {
      display: block;
    }`;

    summaryHeaders.hide.forEach(position => {
      summaryCss += `\ntable#${tableId} thead tr:last-child th:nth-of-type(${position}) { display: none }`;
    })
    summaryHeaders.show.forEach(position => {
      let header = headers[position-1];
      let label = header.label ? header.label : header;
      let customCss = header.css ? header.css : '';
      summaryCss += `\ntable#${tableId} thead tr:last-child th:nth-of-type(${position}) { display: block; }`;
      summaryCss += `\ntable#${tableId} thead tr:last-child th:nth-of-type(${position}):before { content: "${label}"; ${customCss} }`;
    })

    css += summaryCss;
  }

  css += "}";

  // create dom element
  var style = document.createElement('style');
  style.type = 'text/css';

  // add CSS to the DOM
  if (style.styleSheet) style.styleSheet.cssText = css;
  else style.appendChild(document.createTextNode(css));

  //plain javascript: document.getElementById(tableId).appendChild( style );
  $('#' + tableId).parent().append(style);
}
