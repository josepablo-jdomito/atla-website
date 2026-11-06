// Applies the Google Fonts stylesheet without blocking the first paint. index.html loads it as
// media="print" (fetched at low cost, applied to nothing); this flips it to all once it has arrived.
// An external file, not an onload attribute: the CSP in vercel.json allows no inline script.
(function () {
  var link = document.getElementById("atla-fonts-stylesheet");
  if (!link) return;
  var apply = function () {
    link.media = "all";
  };
  if (link.sheet) apply();
  else link.addEventListener("load", apply);
})();
