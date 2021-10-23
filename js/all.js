const typeBtnList = document.querySelectorAll('.js-typeBtnArea button');
const search = document.querySelector('.js-search');
const searchBtn = document.querySelector('.js-searchBtn');
const keyWordTxt = document.querySelector('.js-keyWordTxt');
const resultArea = document.querySelector('.js-resultArea');
const sortBtn = document.querySelector('.js-filterSortBtn');
const sortList = document.querySelector('.js-filterSortList');
const filterSortTxt = document.querySelectorAll('.js-filterSortTxt');
const listThead = document.querySelector('.js-listThead');

//變數初始值
let url = 'https://hexschool.github.io/js-filter-data/data.json';
let typeCode = 'N04';
let keyWord = '';
let data = [];
let resultArr = [];
let sortListOpen = false;

function init() {
  getData();
}
init();
//種類按鈕切換
typeBtnList.forEach((item) => {
  item.addEventListener('click', (e) => {
    typeBtnList.forEach((item) => {
      // item.setAttribute('class', '');
      item.classList.remove('active');
    })
    typeCode = item.getAttribute('data-typeCode');
    // item.setAttribute('class', 'active');
      item.classList.add('active');
  })
})
//取得價格資料
function getData() {
  axios.get(url)
  .then((res) => {
    data = res.data;
    })
}
//篩選需要的資料
function filterData() {
  resultArr = data.filter((item) => item['種類代碼'] === typeCode && item['作物名稱'].indexOf(keyWord) !== -1);
    switch (resultArr.length) {
      case 0:
        sortBtn.disabled = true;
        break;
      default:
        sortBtn.disabled = false;
        break;
    }
  renderResult();
}
//搜尋關鍵字功能
searchBtn.addEventListener('click', searchList);
search.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 13:
      searchList();
      break;
  }
});
function searchList() {
  keyWord = search.value.trim();
  switch (keyWord) {
    case '':
      alert('作物名稱不得空白！');
      break;
    default:
      filterData();
      break;
  }
}

//渲染搜尋結果
function renderResult() {
  let str = '';
  switch (resultArr.length) {
    case 0:
      str = `<tr>
      <td class="notSearch" colspan="7">查詢不到當日的交易資訊QQ</td>
    </tr>`;
      break;
    default:
      resultArr.forEach((item) => {
        str += `<tr>
            <td class="fw-bold" width="15%">${item['作物名稱']}</td>
            <td class="fw-bold" width="15%">${item['市場名稱']}</td>
            <td width="14%">${item['上價']}</td>
            <td width="14%">${item['中價']}</td>
            <td width="14%">${item['下價']}</td>
            <td width="14%">${item['平均價']}</td>
            <td width="14%">${item['交易量']}</td>
          </tr>`
      })
      break;
  }
  keyWordTxt.innerHTML = `查看「${keyWord}」的比價結果`;
  resultArea.innerHTML = str;
}
//排序篩選下拉選單開關
sortBtn.addEventListener('click', (e) => {
  switch (sortListOpen) {
    case true:
      // sortList.setAttribute('class', 'js-filterSortList d-none');
      sortList.classList.add('d-none');
      window.removeEventListener('click', closeSortList);
      break;
      case false:
        // sortList.setAttribute('class', 'js-filterSortList');
        sortList.classList.remove('d-none');
        window.addEventListener('click', closeSortList);
        sortList.addEventListener('click', changeSort);
        break;
      }
      sortListOpen = !sortListOpen;
    })
window.addEventListener('click', closeSortList);
function closeSortList(e) {
  switch (e.target.closest('.js-filterSortBtn') === null) {
    case true:
      switch (sortListOpen) {
        case true:
          // sortList.setAttribute('class', 'js-filterSortList d-none');
          sortList.classList.add('d-none');
          sortListOpen = false;
      }
      window.removeEventListener('click', closeSortList);
      break;
  }
}
function changeSort(e) {
  let sortStatus = e.target.closest('li').dataset.sort;
  let sortStatusTxt = e.target.closest('a').textContent;
  renderSelectTxt(sortStatus, sortStatusTxt);
}
function renderSelectTxt(sortStatus, txt) {
  filterSortTxt.forEach((item) => {
    item.textContent = txt;
  })
  sort(sortStatus);
  renderResult();
}
//排序功能
function sort(status) {
  switch (status) {
    //依交易量排序為降幕
    case '交易量':
      resultArr.sort((a, b) => {
        numA = a[status];
        numB = b[status];
        return numB - numA;
      })
      break;
    default:
      //依交易量排序以外的排序為升幕
      resultArr.sort((a, b) => {
        numA = a[status];
        numB = b[status];
        return numA - numB;
      })
      break;
  }
}

//按表頭來切換排序
listThead.addEventListener('click', theadChangeSort);
function theadChangeSort(e) {
  switch (resultArr.length) {
    case 0:
      break;
    default:
      let sortStatus = e.target.closest('th').dataset.sort;
      let sortStatusTxt = e.target.closest('th').dataset.statusTxt;
      switch (sortStatus) {
        case undefined:
          break;
        default:
          renderSelectTxt(sortStatus, sortStatusTxt);
          break;
      }
      break;
  }
}