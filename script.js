// 최소 스크립트: 푸터의 연도를 자동으로 표시합니다.
(function () {
  var y = document.getElementById('year');
  if (y) { y.textContent = new Date().getFullYear(); }
})();
