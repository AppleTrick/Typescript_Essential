const container = document.getElementById('root');

const ajax = new XMLHttpRequest();

// 뉴스들에 대한 정보 가지고 오는 url
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json'

// content 정보 가지고 오는 url
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

//ajax 데이터 통신함수
function getData(url){
    ajax.open('GET',url,false);  // false => 동기로 처리
    ajax.send();

    return JSON.parse(ajax.response); // json으로 받아온것을 객체로 변환;
}

// 뉴스피드 목록 구성하하는 함수
function newsFeed(){

    const newsFeed = getData(NEWS_URL);

    const newsList = [];

    newsList.push('<ul>');
    for (let i = 0; i < 10; i++) {
        newsList.push(`
        <li>
            <a href = "#${newsFeed[i].id}"> 
                ${newsFeed[i].title} (${newsFeed[i].comments_count}) 
            </a>
        </li>
        `);
    }
    newsList.push('</ul>');

    container.innerHTML = newsList.join('');

}
function newsDetail(){

    // 주소에 관련된 내용 가지고 오는법
    const id = location.hash.substring(1); // id 값을 가지고 옴
    const newsContent = getData(CONTENT_URL.replace('@id',id))

    container.innerHTML = `
        <h1>${newsContent.title}</h1>
        <div>
            <a href="#">목록으로</a>
        </div>
    `;
}

// 주소가 변경될때 작동하는 이벤트
window.addEventListener('hashchange', newsDetail);



